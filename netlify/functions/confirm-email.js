const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Solo permitir POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, token } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Verificar si el usuario existe en la tabla User
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Usuario no encontrado' })
      };
    }

    // Intentar confirmar el email usando el admin client
    const { data, error } = await supabase.auth.admin.updateUserById(userData.id, {
      email_confirm: true
    });

    if (error) {
      console.error('Error confirming email:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al confirmar el email' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email confirmado exitosamente',
        user: data.user
      })
    };

  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};