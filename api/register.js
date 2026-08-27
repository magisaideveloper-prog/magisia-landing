export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    console.log('DATOS RECIBIDOS:', req.body);

    // Nombres EXACTOS que envía tu formulario
    const firstname = req.body.firstname;
    const email = req.body.email;
    const whatsapp = req.body.whatsapp;
    const interest = req.body.interest;
    const data_auth = req.body.data_auth;

    // Validar solamente nombre y correo
    if (!firstname || !email) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios',
        recibido: req.body
      });
    }

    // Enviar datos a Supabase
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
          nombre: firstname,
          email: email,
          whatsapp: whatsapp || null,
          interest: interest || null,
          data_auth: data_auth === 'on' || data_auth === true
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('ERROR SUPABASE:', result);

      return res.status(response.status).json({
        error: result.message || result.error || JSON.stringify(result)
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro guardado correctamente'
    });

  } catch (error) {
    console.error('ERROR SERVIDOR:', error);

    return res.status(500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
}
