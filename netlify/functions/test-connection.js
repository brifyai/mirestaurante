exports.handler = async (event, context) => {
  // Añadir headers CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Solo permitir POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { apiType, config } = JSON.parse(event.body);

    // Prueba específica para Groq
    if (apiType === 'groq') {
      return await testGroqConnection(config, headers);
    }

    // Para otros tipos de API, respuesta simulada
    const result = {
      success: true,
      message: `Conexión a ${apiType} simulada exitosamente`,
      details: {
        status: 'connected',
        timestamp: new Date().toISOString()
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error probando conexión:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    };
  }
};

// Función para probar la conexión con Groq
async function testGroqConnection(config, headers) {
  try {
    const { apiKey, model } = config;

    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'API key de Groq es requerida',
        })
      };
    }

    if (!model) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Modelo de Groq es requerido',
        })
      };
    }

    // Probar la conexión con una consulta simple
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{
          role: 'user',
          content: 'Hola, responde con "Conexión exitosa" si puedes leerme.'
        }],
        max_tokens: 50,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Si no se puede parsear el JSON de error
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: errorData.error?.message || `Error HTTP ${response.status}`,
          details: `Verifica tu API key y que el modelo ${model} esté disponible en tu cuenta de Groq`,
        })
      };
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `✅ Conexión exitosa con Groq usando ${model}`,
        details: {
          model: model,
          response: responseText.trim(),
          timestamp: new Date().toISOString(),
          usage: data.usage || {}
        }
      })
    };

  } catch (error) {
    console.error('Error en prueba de Groq:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Error al conectar con Groq',
        details: error.message || 'Error de red o configuración'
      })
    };
  }
}
