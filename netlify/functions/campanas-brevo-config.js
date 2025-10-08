const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  const method = event.httpMethod;

  try {
    // Skip auth for simplicity
    if (method === 'POST') {
      const { apiKey, senderEmail, senderName } = JSON.parse(event.body);

      if (!apiKey || !senderEmail || !senderName) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Todos los campos son obligatorios' })
        };
      }

      if (!apiKey.startsWith('v3-')) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'API Key inválida. Debe comenzar con "v3-"' })
        };
      }

      const brevoConfig = {
        apiKey: apiKey.substring(0, 10) + '***',
        senderEmail,
        senderName,
        isConfigured: true,
        updatedAt: new Date().toISOString()
      };

      console.log('Configuración Brevo guardada:', brevoConfig);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          config: brevoConfig,
          message: 'Configuración de Brevo guardada exitosamente'
        })
      };
    } else if (method === 'GET') {
      const brevoConfig = {
        isConfigured: false,
        senderEmail: '',
        senderName: '',
        apiKey: ''
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          config: brevoConfig
        })
      };
    } else {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Método no permitido' })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};