export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    console.log('Datos recibidos:', req.body);

    // Aceptar diferentes nombres posibles enviados por el formulario
    const nombre =
  req.body.firstName ||
  req.body.name ||
  req.body.nombre ||
  req.body.full_name ||
  req.body.fullName;

const email =
  req.body.email ||
  req.body.correo ||
  req.body.correo_electronico;

    const whatsapp =
      req.body.whatsapp ||
      req.body.WhatsApp ||
      req.body.telefono ||
      null;

    const interes =
      req.body.interes ||
      req.body['Área de Interés'] ||
      req.body.areaInteres ||
      null;

    const autorizacion =
      req.body.autorizacion ||
      req.body.data_auth ||
      false;

    // Validar
    if (!nombre || !email) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios',
        recibido: req.body
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
          whatsapp: whatsapp,
          interes: interes,
          data_auth: autorizacion
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Supabase:', data);

      return res.status(response.status).json({
        error:
          data.message ||
          data.error ||
          'Error al guardar el registro'
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
