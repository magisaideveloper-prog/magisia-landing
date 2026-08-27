export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    console.log('DATOS RECIBIDOS:', JSON.stringify(req.body));

    // Aceptar exactamente las variantes posibles
    const nombre =
      req.body.firstName ||
      req.body.firstname ||
      req.body.nombre;

    const email =
      req.body.email;

    const whatsapp =
      req.body.whatsapp || null;

    const interes =
      req.body.interest ||
      req.body.interes ||
      null;

    const data_auth =
      req.body.data_auth === 'on' ||
      req.body.data_auth === true;

    // VALIDACIÓN
    if (!nombre || !email) {
      console.log('FALTAN:', {
        nombre,
        email,
        body: req.body
      });

      return res.status(400).json({
        error: 'Faltan campos obligatorios',
        recibido: req.body
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
          whatsapp: whatsapp,
          interest: interes,
          data_auth: data_auth
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('ERROR SUPABASE:', result);

      return res.status(response.status).json({
        error: result.message || JSON.stringify(result)
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro guardado correctamente'
    });

  } catch (error) {
    console.error('ERROR:', error);

    return res.status(500).json({
      error: error.message
    });
  }
}
