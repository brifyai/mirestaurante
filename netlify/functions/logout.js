const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Permitir tanto POST como GET para mayor flexibilidad
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    let userId;
    
    // Para POST, obtener el userId del body
    if (event.httpMethod === 'POST') {
      const { userId: uid } = JSON.parse(event.body || '{}');
      userId = uid;
    } else {
      // Para GET, obtener el userId de los query params
      const params = new URLSearchParams(event.queryStringParameters || '');
      userId = params.get('userId');
    }

    console.log('Logout attempt for user:', userId);

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Se requiere el ID de usuario',
          message: 'No se proporcionó el ID de usuario para cerrar sesión'
        })
      };
    }

    // Opcional: Registrar el logout en la base de datos
    // Esto podría ser útil para auditoría
    try {
      await supabase
        .from('User')
        .update({ 
          lastLogoutAt: new Date().toISOString(),
          // Podríamos agregar un campo para marcar como offline
          isOnline: false 
        })
        .eq('id', userId);
      
      console.log('Logout recorded for user:', userId);
    } catch (updateError) {
      console.log('Warning: Could not update logout timestamp:', updateError.message);
      // No fallamos el logout si no podemos actualizar el timestamp
    }

    // En un sistema con tokens JWT o sesiones de Supabase, 
    // aquí invalidaríamos el token o sesión
    // Como este sistema usa localStorage, el logout principal se hace del lado del cliente
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Sesión cerrada exitosamente',
        loggedOutAt: new Date().toISOString(),
        userId: userId
      })
    };

  } catch (error) {
    console.error('Logout error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error interno del servidor al cerrar sesión',
        details: error.message
      })
    };
  }
};