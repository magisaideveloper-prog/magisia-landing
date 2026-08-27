export default async function handler(req, res) {
  // Solo aceptar solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    const {
      nombre,
      email,
      whatsapp,
      interes,
      autorizacion
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !email) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios'
      });
    }

    // Guardar en Supabase
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
          correo_electronico: email,
          whatsapp: whatsapp || null,
          interes: interes || null,
          data_auth: autorizacion || false
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Supabase:', data);

      return res.status(response.status).json({
        error: data.message || data.error || 'Error al guardar el registro'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro guardado correctamente',
      data: data
    });

  } catch (error) {
    console.error('Error:', error);

    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}
