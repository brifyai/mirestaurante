exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const envVars = {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'Configurado' : 'NO CONFIGURADO',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurado (oculto)' : 'NO CONFIGURADO',
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'Configurado' : 'NO CONFIGURADO',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'Configurado (oculto)' : 'NO CONFIGURADO',
      NODE_ENV: process.env.NODE_ENV || 'No definido'
    };

    // Verificar si podemos importar el cliente de Supabase
    let supabaseStatus = 'No disponible';
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseStatus = 'Disponible';
    } catch (e) {
      supabaseStatus = 'Error al importar: ' + e.message;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Verificación de variables de entorno',
        environment: envVars,
        supabase: supabaseStatus,
        timestamp: new Date().toISOString()
      }, null, 2)
    };

  } catch (error) {
    console.error('Error checking environment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};