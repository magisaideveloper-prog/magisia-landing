export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    const body = req.body || {};

    // Datos exactos del formulario
    const nombre = body.firstName || body.firstname || body.nombre || '';
    const email = body.email || '';
    const whatsapp = body.whatsapp || '';
    const interes = body.interest || body.interes || '';
    const dataAuth =
      body.data_auth === 'on' ||
      body.data_auth === true;

    console.log({
      nombre,
      email,
      whatsapp,
      interes,
      dataAuth
    });

    if (!nombre || !email) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios'
      });
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/leads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SECRET_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          whatsapp: whatsapp || null,
          interest: interes || null,
          data_auth: dataAuth
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('SUPABASE ERROR:', result);

      return res.status(response.status).json({
        error: result.message || result.error || 'Error al guardar'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro guardado correctamente'
    });

  } catch (error) {
    console.error('SERVER ERROR:', error);

    return res.status(500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
}
