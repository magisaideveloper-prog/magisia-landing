import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { firstName, email, interest, whatsapp, data_auth } = request.body;

  if (!firstName || !email || !interest || !whatsapp) {
    return response.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return response.status(400).json({ 
        error: 'Faltan variables SUPABASE_URL o SUPABASE_ANON_KEY' 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('leads')
      .insert([
        { 
          name: firstName, 
          email: email, 
          whatsapp: whatsapp, 
          interest: interest, 
          data_auth: data_auth === 'on' || data_auth === true
        }
      ]);

    if (error) {
      console.error('Error de Supabase:', error);
      return response.status(500).json({ error: error.message });
    }

    return response.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error del servidor:', error);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
}
