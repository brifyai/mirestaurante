const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase - Usar credenciales directamente ya que las variables de entorno no están disponibles en las funciones
const supabaseUrl = 'https://zumuzfusdjxciehieabx.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bXV6ZnVzZGp4Y2llaGllYWJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU3NjYzNywiZXhwIjoyMDc0MTUyNjM3fQ.MyIED7Z6AUxlOfaOuqeLXbi3hAaMjvNGxL1HhTMqv2E';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Función config.js inicializada con Supabase');

// Función para convertir la configuración de DB a formato frontend
function formatConfigForFrontend(config) {
  console.log('🔍 formatConfigForFrontend - config recibido:', config);
  console.log('🔍 formatConfigForFrontend - groq_model:', config?.groq_model);
  console.log('🔍 formatConfigForFrontend - groq_api_key:', config?.groq_api_key);
  
  if (!config) {
    console.log('⚠️ No hay configuración, usando valores por defecto');
    return {
      apis: {
        meta: {
          status: 'disconnected',
          apiKey: '',
          webhook: ''
        },
        whatsapp: {
          status: 'disconnected',
          apiKey: '',
          webhook: '',
          phoneNumberId: ''
        },
        instagram: {
          status: 'disconnected',
          apiKey: '',
          webhook: ''
        },
        facebook: {
          status: 'disconnected',
          apiKey: '',
          webhook: ''
        },
        googleCalendar: {
          status: 'disconnected',
          apiKey: '',
          webhook: '',
          calendarId: ''
        },
        groq: {
          status: 'disconnected',
          apiKey: ''
        },
        googleAnalytics: {
          status: 'disconnected',
          apiKey: '',
          measurementId: ''
        },
        googlePlaces: {
          status: 'disconnected',
          apiKey: '',
          webhook: ''
        },
        googleReviews: {
          status: 'disconnected',
          apiKey: '',
          webhook: ''
        }
      },
      aiSettings: {
        model: 'llama3-8b-8192',
        temperature: 0.7,
        maxTokens: 1000,
        autoResponse: true,
        humanEscalation: true,
        escalationKeywords: [
          'alergia',
          'severa',
          'urgente',
          'manager',
          'compleja'
        ]
      },
      businessInfo: {
        name: 'Jaraquemada',
        location: 'Santiago, Chile',
        hours: 'Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00',
        phone: '+56 9 1234 5678',
        email: 'reservas@jaraquemada.com',
        website: 'https://jaraquemada.com'
      },
      whatsappFeatures: {
        autoReply: true,
        businessHours: true,
        reservations: true,
        menu: true,
        promotions: false
      }
    };
  }

  const result = {
    apis: {
      meta: {
        status: 'disconnected',
        apiKey: '',
        webhook: ''
      },
      whatsapp: {
        status: config.whatsapp_access_token ? 'connected' : 'disconnected',
        apiKey: config.whatsapp_access_token || '',
        webhook: '',
        phoneNumberId: config.whatsapp_phone_number_id || ''
      },
      instagram: {
        status: 'disconnected',
        apiKey: '',
        webhook: ''
      },
      facebook: {
        status: 'disconnected',
        apiKey: '',
        webhook: ''
      },
      googleCalendar: {
        status: config.google_calendar_service_key ? 'connected' : 'disconnected',
        apiKey: config.google_calendar_service_key || '',
        webhook: '',
        calendarId: config.google_calendar_id || ''
      },
      groq: {
        status: config.groq_api_key ? 'connected' : 'disconnected',
        apiKey: config.groq_api_key || ''
      },
      googleAnalytics: {
        status: config.google_analytics_property_id ? 'connected' : 'disconnected',
        apiKey: config.google_analytics_property_id || '',
        measurementId: config.analytics_measurement || ''
      },
      googlePlaces: {
        status: 'disconnected',
        apiKey: '',
        webhook: ''
      },
      googleReviews: {
        status: 'disconnected',
        apiKey: '',
        webhook: ''
      }
    },
    aiSettings: {
      model: config.groq_model || 'llama3-8b-8192',
      temperature: config.ai_temperature ?? 0.7,
      maxTokens: config.ai_max_tokens ?? 1000,
      autoResponse: config.ai_auto_response ?? true,
      humanEscalation: config.ai_human_escalation ?? true,
      escalationKeywords: config.ai_escalation_keywords || [
        'alergia',
        'severa',
        'urgente',
        'manager',
        'compleja'
      ]
    },
    businessInfo: {
      name: config.business_name || 'Jaraquemada',
      location: config.business_location || 'Santiago, Chile',
      hours: config.business_hours || 'Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00',
      phone: config.business_phone || '+56 9 1234 5678',
      email: config.business_email || 'reservas@jaraquemada.com',
      website: 'https://jaraquemada.com'
    },
    whatsappFeatures: {
      autoReply: config.whatsapp_auto_reply !== false,
      businessHours: config.whatsapp_business_hours !== false,
      reservations: config.whatsapp_reservations !== false,
      menu: config.whatsapp_menu !== false,
      promotions: config.whatsapp_promotions || false
    }
  };

  console.log('🔍 formatConfigForFrontend - result.apis.groq:', result.apis.groq);
  console.log('🔍 formatConfigForFrontend - result.aiSettings.model:', result.aiSettings.model);
  
  return result;
}

// Handler principal
exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { httpMethod } = event;

    if (httpMethod === 'GET') {
      // Obtener user_id del query parameter
      const userId = event.queryStringParameters?.userId;
      console.log('🔍 GET - User ID recibido:', userId);

      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'User ID es requerido' })
        };
      }

      console.log('🔍 Intentando conectar a Supabase...');

      // Obtener configuración desde Supabase para el usuario específico
      console.log('🔍 Buscando configuración para user_id:', userId);
      const { data: config, error } = await supabase
        .from('configurations')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('🔍 Resultado de la consulta:', { config, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error al obtener configuración:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error al obtener configuración' })
        };
      }

      // Formatear configuración para el frontend
      const formattedConfig = formatConfigForFrontend(config);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(formattedConfig)
      };
    }

    if (httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const userId = body.userId;

      console.log('📥 POST - Datos recibidos:', body);
      console.log('📥 POST - User ID:', userId);
      console.log('📥 POST - groq.apiKey:', body.apis?.groq?.apiKey);
      console.log('📥 POST - aiSettings.model:', body.aiSettings?.model);

      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'User ID es requerido' })
        };
      }

      // Convertir datos del frontend al formato de la base de datos
      const configData = {
        user_id: userId,
        groq_api_key: body.apis?.groq?.apiKey || null,
        groq_model: body.aiSettings?.model || 'llama3-8b-8192',
        whatsapp_access_token: body.apis?.whatsapp?.apiKey || null,
        whatsapp_phone_number_id: body.apis?.whatsapp?.phoneNumberId || null,
        google_calendar_service_key: body.apis?.googleCalendar?.apiKey || null,
        google_calendar_id: body.apis?.googleCalendar?.calendarId || null,
        google_analytics_property_id: body.apis?.googleAnalytics?.apiKey || null,
        analytics_measurement: body.apis?.googleAnalytics?.measurementId || null,
        ai_temperature: body.aiSettings?.temperature || 0.7,
        ai_max_tokens: body.aiSettings?.maxTokens || 1000,
        ai_auto_response: body.aiSettings?.autoResponse !== false,
        ai_human_escalation: body.aiSettings?.humanEscalation !== false,
        ai_escalation_keywords: body.aiSettings?.escalationKeywords || [
          'alergia',
          'severa',
          'urgente',
          'manager',
          'compleja'
        ],
        business_name: body.businessInfo?.name || 'Jaraquemada',
        business_location: body.businessInfo?.location || 'Santiago, Chile',
        business_hours: body.businessInfo?.hours || 'Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00',
        business_phone: body.businessInfo?.phone || '+56 9 1234 5678',
        business_email: body.businessInfo?.email || 'reservas@jaraquemada.com',
        business_website: body.businessInfo?.website || 'https://jaraquemada.com',
        whatsapp_auto_reply: body.whatsappFeatures?.autoReply !== false,
        whatsapp_business_hours: body.whatsappFeatures?.businessHours !== false,
        whatsapp_reservations: body.whatsappFeatures?.reservations !== false,
        whatsapp_menu: body.whatsappFeatures?.menu !== false,
        whatsapp_promotions: body.whatsappFeatures?.promotions || false
      };

      console.log('💾 Guardando configData:', configData);

      // Intentar actualizar primero, si no existe, crear
      const { data: existingConfig } = await supabase
        .from('configurations')
        .select('id')
        .eq('user_id', userId)
        .single();

      let result;
      if (existingConfig) {
        // Actualizar configuración existente
        result = await supabase
          .from('configurations')
          .update(configData)
          .eq('user_id', userId)
          .select()
          .single();
      } else {
        // Crear nueva configuración
        result = await supabase
          .from('configurations')
          .insert(configData)
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error al guardar configuración:', result.error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error al guardar configuración' })
        };
      }

      // Formatear configuración para el frontend
      const formattedConfig = formatConfigForFrontend(result.data);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Configuración guardada exitosamente',
          data: formattedConfig
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };

  } catch (error) {
    console.error('Error en el handler:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};