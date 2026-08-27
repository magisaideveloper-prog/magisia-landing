export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    const {
      firstname,
      email,
      whatsapp,
      interest,
      data_auth
    } = req.body;

    console.log('Datos recibidos:', req.body);

    if (!firstname || !email) {
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
          nombre: firstname,
          email: email,
          whatsapp: whatsapp || null,
          interes: interest || null,
          data_auth: data_auth || false
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Supabase:', data);

      return res.status(response.status).json({
        error: data.message || data.error || 'Error al guardar'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro guardado correctamente',
      data
    });

  } catch (error) {
    console.error('Error:', error);

    return res.status(500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
}
