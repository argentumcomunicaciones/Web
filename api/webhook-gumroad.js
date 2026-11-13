/**
 * ElectroLab Educativa - Webhook Oficial Gumroad (Ping)
 * Recibe eventos POST de compras internacionales en tiempo real:
 * 1. Identifica el curso o asesoría según permalink o product_name.
 * 2. Previene duplicados verificando el sale_id.
 * 3. Habilita el curso al instante en Firebase Firestore para el email del comprador.
 * 4. Asienta la venta en dólares en la planilla de Google Sheets.
 */

import {
  upsertFirestoreStudent,
  isPaymentProcessed,
  markPaymentProcessed,
  appendGoogleSheetsSale
} from './_firestore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let data = req.body || {};

    // Si viene como string URL-encoded o texto plano
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        const params = new URLSearchParams(data);
        data = Object.fromEntries(params.entries());
      }
    }

    const email = (data.email || data.buyer_email || data.purchaser_email || '').toLowerCase().trim();
    const saleId = data.sale_id || data.order_number || data.id || '';
    const permalink = (data.permalink || data.short_product_id || '').toLowerCase();
    const productName = data.product_name || '';
    const fullName = data.full_name || data.name || (email ? email.split('@')[0] : 'Alumno Internacional');

    // Monto formateado
    let priceFormatted = (permalink.includes('soknil') || productName.toLowerCase().includes('asesor')) ? 'US$ 20' : 'US$ 50';
    if (data.price) {
      const num = Number(data.price);
      if (!isNaN(num)) {
        // Gumroad envía centavos (5000 = 50.00)
        const dollars = num > 500 ? (num / 100).toFixed(0) : num.toFixed(0);
        priceFormatted = `US$ ${dollars}`;
      }
    }

    // Prevención de duplicados
    const paymentKey = `gumroad_${saleId || (email + '_' + permalink)}`;
    const alreadyProcessed = await isPaymentProcessed(paymentKey);
    if (alreadyProcessed) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: 'Venta de Gumroad ya procesada previamente',
        saleId
      });
    }

    // Mapeo del producto según permalink o nombre
    let courses = [];
    let cursoLabel = '';

    if (permalink.includes('hkrqipz') || productName.toLowerCase().includes('curso 1')) {
      courses = ['curso-1'];
      cursoLabel = 'Curso 1: Introducción a la Electrónica, Análisis de Circuitos';
    } else if (permalink.includes('ewrowc') || productName.toLowerCase().includes('curso 2')) {
      courses = ['curso-2'];
      cursoLabel = 'Curso 2: Diodos, Fuentes Lineales Reguladas y Fuentes Conmutadas';
    } else if (permalink.includes('soknil') || productName.toLowerCase().includes('asesor')) {
      courses = [];
      cursoLabel = 'Asesoría Técnica 1 a 1 | ElectroLab';
    } else {
      // Intento por palabras clave
      const pLower = productName.toLowerCase();
      if (pLower.includes('diodo') || pLower.includes('fuente')) {
        courses = ['curso-2'];
        cursoLabel = 'Curso 2: Diodos, Fuentes Lineales Reguladas y Fuentes Conmutadas';
      } else {
        courses = ['curso-1'];
        cursoLabel = productName || 'Curso Oficial ElectroLab';
      }
    }

    // 1. Habilitar curso en Firestore (si es un curso)
    if (email && courses.length > 0) {
      await upsertFirestoreStudent(email, courses, fullName, {
        lastPaymentGateway: 'Gumroad',
        lastPaymentId: String(saleId)
      });
    }

    // 2. Registrar en la planilla de Google Sheets
    await appendGoogleSheetsSale(
      email || `Gumroad #${saleId}`,
      cursoLabel,
      priceFormatted
    );

    // 3. Marcar como procesado en Firestore
    await markPaymentProcessed(paymentKey, {
      gateway: 'gumroad',
      email,
      saleId,
      permalink,
      productName,
      courses,
      amount: priceFormatted
    });

    return res.status(200).json({
      success: true,
      saleId,
      email,
      courses,
      cursoLabel,
      amount: priceFormatted
    });
  } catch (err) {
    console.error('Excepción en webhook-gumroad:', err);
    return res.status(500).json({ error: 'Error interno en webhook Gumroad', details: err.message });
  }
}
