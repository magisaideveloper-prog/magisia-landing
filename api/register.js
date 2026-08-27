export default async function handler(req, res) {
  // Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    // Datos recibidos desde el formulario
    const body = req.body || {};

    // El formulario puede enviar firstName o firstname
    const name =
      body.firstName ||
      body.firstname ||
      body.name ||
      '';

    const email = body.email || '';

    const whatsapp = body.whatsapp || null;

    const interest =
      body.interest ||
      body.interes ||
      null;

    // Checkbox de autorización
    const data_auth =
      body.data_auth === 'on' ||
      body.data_auth === true;

    // Verificación
    console.log('DATOS RECIBIDOS:', {
      name,
      email,
      whatsapp,
      interest,
      data_auth
    });

    // Validar campos obligatorios
    if (!name || !email) {
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
          name: name,
          email: email,
          whatsapp: whatsapp,
          interest: interest,
          data_auth: data_auth
        })
      }
    );

    // Leer respuesta de Supabase
    const result = await response.json();

    // Si Supabase devuelve error
    if (!response.ok) {
      console.error('ERROR SUPABASE:', result);

      return res.status(response.status).json({
        error:
          result.message ||
          result.error ||
          'Error al guardar el registro'
      });
    }

    // Éxito
    return res.status(200).json({
      success: true,
      message: 'Registro guardado correctamente',
      data: result
    });

  } catch (error) {
    console.error('ERROR DEL SERVIDOR:', error);

    return res.status(500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
}
