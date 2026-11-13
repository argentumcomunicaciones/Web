/**
 * ElectroLab Educativa - Webhook Oficial Mercado Pago
 * Procesa notificaciones de pagos aprobados en tiempo real:
 * 1. Obtiene los detalles del pago de la API de Mercado Pago (email real, monto, cursos).
 * 2. Verifica idempotencia para evitar registros duplicados.
 * 3. Habilita los cursos del alumno en Firebase Firestore (colección 'usuarios').
 * 4. Asienta la venta con el email real del comprador en la planilla de Google Sheets.
 */

import {
  upsertFirestoreStudent,
  isPaymentProcessed,
  markPaymentProcessed,
  appendGoogleSheetsSale
} from './_firestore.js';

export default async function handler(req, res) {
  // Aceptar POST y GET (Mercado Pago puede enviar verificaciones)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const paymentId = req.query?.['data.id'] || req.query?.id || body?.data?.id || body?.id;

    if (!paymentId) {
      return res.status(200).json({ received: true, note: 'Sin ID de pago en notificación' });
    }

    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "APP_USR-8187149980772984-110913-289b1d7b68c5796732c14b56687a80e5-26195356";

    // Consultar el estado y detalle del pago en la API oficial de Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!mpRes.ok) {
      const errText = await mpRes.text();
      console.error(`Error consultando pago MP ${paymentId}:`, mpRes.status, errText);
      // Responder 200 a MP para evitar reintentos continuos en caso de IDs transitorios o de prueba
      return res.status(200).json({ received: true, error: 'No se pudo consultar pago en MP' });
    }

    const payment = await mpRes.json();

    // Solo procesamos pagos aprobados
    if (payment.status !== 'approved') {
      return res.status(200).json({
        received: true,
        paymentId,
        status: payment.status,
        note: 'Pago aún no aprobado'
      });
    }

    // Prevención de duplicados por reintentos de Mercado Pago
    const paymentKey = `mp_${paymentId}`;
    const alreadyProcessed = await isPaymentProcessed(paymentKey);
    if (alreadyProcessed) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: 'Pago ya procesado previamente',
        paymentId
      });
    }

    // Extracción de datos del alumno y compra
    const payerEmail = (payment.payer?.email || payment.additional_info?.payer?.email || '').trim().toLowerCase();
    const payerFirstName = payment.payer?.first_name || payment.additional_info?.payer?.first_name || '';
    const payerLastName = payment.payer?.last_name || payment.additional_info?.payer?.last_name || '';
    const payerName = `${payerFirstName} ${payerLastName}`.trim() || 'Alumno ElectroLab';
    const amount = payment.transaction_amount || payment.total_paid_amount || 75000;

    // Identificar los cursos adquiridos
    let courses = [];
    if (payment.metadata && Array.isArray(payment.metadata.courses) && payment.metadata.courses.length > 0) {
      courses = payment.metadata.courses;
    } else if (payment.external_reference) {
      try {
        const ext = JSON.parse(payment.external_reference);
        if (Array.isArray(ext.courses) && ext.courses.length > 0) {
          courses = ext.courses;
        }
      } catch (e) {}
    }

    // Deducción por título o descripción si no vino en metadata
    if (courses.length === 0) {
      const desc = `${payment.description || ''} ${payment.additional_info?.items?.[0]?.title || ''}`.toLowerCase();
      if (desc.includes('curso 1') || desc.includes('introducción')) courses.push('curso-1');
      if (desc.includes('curso 2') || desc.includes('diodos')) courses.push('curso-2');
      if (courses.length === 0) {
        // Si no se pudo deducir, por defecto asignamos curso-1
        courses.push('curso-1');
      }
    }

    // 1. Habilitar cursos en Firestore (colección 'usuarios')
    if (payerEmail) {
      await upsertFirestoreStudent(payerEmail, courses, payerName, {
        lastPaymentGateway: 'MercadoPago',
        lastPaymentId: String(paymentId)
      });
    }

    // 2. Registrar la venta en Google Sheets con el email real
    const cursoTitulos = {
      'curso-1': 'Curso 1: Introducción a la Electrónica, Análisis de Circuitos',
      'curso-2': 'Curso 2: Diodos, Fuentes Lineales Reguladas y Fuentes Conmutadas',
      'curso-3': 'Curso 3: Amplificación con Transistores',
      'curso-4': 'Curso 4: Amplificadores Operacionales',
      'curso-5': 'Curso 5: Microcontroladores'
    };
    const cursoNombre = courses.map(c => cursoTitulos[c] || c).join(' + ') || payment.description || 'Curso Oficial ElectroLab';

    await appendGoogleSheetsSale(
      payerEmail || `MP#${paymentId}`,
      cursoNombre,
      `${amount} ARS`
    );

    // 3. Marcar como procesado en Firestore
    await markPaymentProcessed(paymentKey, {
      gateway: 'mercadopago',
      email: payerEmail,
      amount,
      courses,
      paymentId: String(paymentId)
    });

    return res.status(200).json({
      success: true,
      paymentId,
      email: payerEmail,
      courses,
      amount
    });
  } catch (err) {
    console.error('Excepción en webhook-mp:', err);
    return res.status(500).json({ error: 'Error interno en webhook MP', details: err.message });
  }
}
