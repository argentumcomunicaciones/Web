export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { title, price, redirectType } = body;
  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "APP_USR-8187149980772984-110913-289b1d7b68c5796732c14b56687a80e5-26195356";

  // Enrutamiento post-pago individual
  let successUrl = "https://electrolabeducativa.com.ar";
  if (redirectType === 'asesoria' || redirectType === 'consultoria') {
    successUrl = "https://electrolabeducativa.com.ar/gracias-consultoria.html";
  } else if (redirectType === 'guias') {
    successUrl = "https://electrolabeducativa.com.ar/gracias-guias.html";
  } else if (redirectType && redirectType.startsWith('guia-')) {
    const itemKey = redirectType.replace('guia-', '');
    successUrl = `https://electrolabeducativa.com.ar/gracias-guias.html?item=${itemKey}`;
  } else if (redirectType && (redirectType.startsWith('curso') || redirectType === 'c1' || redirectType === 'c2')) {
    if (redirectType === 'curso-1' || redirectType === 'curso-c1' || redirectType === 'c1') {
      successUrl = "https://electrolabeducativa.com.ar/gracias-curso.html?curso=c1";
    } else if (redirectType === 'curso-2' || redirectType === 'curso-c2' || redirectType === 'c2') {
      successUrl = "https://electrolabeducativa.com.ar/gracias-curso.html?curso=c2";
    } else if (redirectType.startsWith('curso-')) {
      const cursoKey = redirectType.replace('curso-', '');
      successUrl = `https://electrolabeducativa.com.ar/gracias-curso.html?curso=${cursoKey}`;
    } else {
      successUrl = "https://electrolabeducativa.com.ar/gracias-curso.html";
    }
  }

  const preferenceData = {
    items: [
      {
        title: title || "Servicio Educativo ElectroLab",
        unit_price: Number(price),
        quantity: 1,
        currency_id: "ARS"
      }
    ],
    back_urls: {
      success: successUrl,
      pending: "https://electrolabeducativa.com.ar",
      failure: "https://electrolabeducativa.com.ar"
    },
    auto_return: "approved"
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    });

    const data = await response.json();
    if (data.init_point) {
      return res.status(200).json({ init_point: data.init_point });
    } else {
      console.error("Error MP API:", data);
      return res.status(500).json({ error: "Error creando preferencia", details: data });
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
