const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Solo permitir GET requests para debugging
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verificar conexión a Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from('User')
      .select('count')
      .limit(1);

    if (connectionError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error de conexión a Supabase',
          details: connectionError.message,
          env: {
            SUPABASE_URL: supabaseUrl ? 'Configurado' : 'No configurado',
            SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? 'Configurado' : 'No configurado'
          }
        })
      };
    }

    // Obtener lista de usuarios (sin contraseñas)
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select('id, name, email, role, isActive, lastLoginAt, createdAt')
      .order('createdAt', { ascending: false });

    if (usersError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error al obtener usuarios',
          details: usersError.message
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        connection: 'OK',
        totalUsers: users.length,
        users: users,
        env: {
          SUPABASE_URL: supabaseUrl ? 'Configurado' : 'No configurado',
          SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? 'Configurado (oculto)' : 'No configurado'
        }
      }, null, 2)
    };

  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};