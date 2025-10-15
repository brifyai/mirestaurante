// Mock para la función test-connection - usado solo en desarrollo local
// Simula las pruebas de conexión para diferentes APIs

export interface TestConnectionResult {
  success: boolean;
  message: string;
  error?: string;
  details?: any;
}

// Mock para probar conexión con Groq
export async function testGroqConnectionMock(config: {
  apiKey: string;
  model: string;
}): Promise<TestConnectionResult> {
  console.log("🔍 Mock: Probando conexión con Groq");
  console.log("🔍 Mock: Config:", { hasApiKey: !!config.apiKey, model: config.model });

  // Simular un pequeño retraso de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validar API key
  if (!config.apiKey) {
    return {
      success: false,
      error: "API Key es requerida",
      details: "La API Key de Groq no puede estar vacía"
    };
  }

  // Validar formato de API key
  if (!config.apiKey.startsWith('gsk_') || config.apiKey.length < 20) {
    return {
      success: false,
      error: "Formato de API Key inválido",
      details: "La API Key debe comenzar con 'gsk_' y tener al menos 20 caracteres"
    };
  }

  // Validar modelo
  if (!config.model) {
    return {
      success: false,
      error: "Modelo es requerido",
      details: "Debes seleccionar un modelo de Groq"
    };
  }

  // Simular llamada real a Groq API
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: "Error de autenticación con Groq",
        details: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    const models = data.data || [];

    // Verificar que el modelo seleccionado existe
    const modelExists = models.some((model: any) => model.id === config.model);

    if (!modelExists) {
      return {
        success: false,
        error: "Modelo no encontrado",
        details: `El modelo "${config.model}" no está disponible en tu cuenta de Groq. Modelos disponibles: ${models.map((m: any) => m.id).join(', ')}`
      };
    }

    return {
      success: true,
      message: "Conexión con Groq establecida exitosamente",
      details: {
        modelsAvailable: models.length,
        selectedModel: config.model,
        apiStatus: "active",
        timestamp: new Date().toISOString(),
        sampleResponse: {
          context_window: models.find((m: any) => m.id === config.model)?.context_window || "N/A"
        }
      }
    };

  } catch (error) {
    console.error("Mock: Error real en llamada a Groq:", error);
    return {
      success: false,
      error: "Error de conexión con Groq",
      details: error instanceof Error ? error.message : "Error desconocido"
    };
  }
}

// Mock para probar conexión con Google Analytics
export async function testGoogleAnalyticsConnectionMock(config: {
  propertyId: string;
}): Promise<TestConnectionResult> {
  console.log("🔍 Mock: Probando conexión con Google Analytics");

  await new Promise(resolve => setTimeout(resolve, 800));

  if (!config.propertyId) {
    return {
      success: false,
      error: "Property ID es requerido",
      details: "Debes proporcionar un Property ID de Google Analytics"
    };
  }

  // Validar formato de Property ID (ej: GA4-XXXXXXXXXX)
  if (!config.propertyId.match(/^(GA-|G-)[A-Z0-9]+$/)) {
    return {
      success: false,
      error: "Formato de Property ID inválido",
      details: "El Property ID debe tener el formato GA-XXXXXXXXXX o G-XXXXXXXXXX"
    };
  }

  return {
    success: true,
    message: "Conexión con Google Analytics simulada exitosamente",
    details: {
      propertyId: config.propertyId,
      status: "connected",
      timestamp: new Date().toISOString()
    }
  };
}

// Mock para probar conexión con Google Calendar
export async function testGoogleCalendarConnectionMock(config: {
  apiKey: string;
  calendarId: string;
}): Promise<TestConnectionResult> {
  console.log("🔍 Mock: Probando conexión con Google Calendar");

  await new Promise(resolve => setTimeout(resolve, 800));

  if (!config.apiKey) {
    return {
      success: false,
      error: "API Key es requerida",
      details: "Debes proporcionar una API Key de Google Calendar"
    };
  }

  if (!config.calendarId) {
    return {
      success: false,
      error: "Calendar ID es requerido",
      details: "Debes proporcionar un Calendar ID"
    };
  }

  return {
    success: true,
    message: "Conexión con Google Calendar simulada exitosamente",
    details: {
      calendarId: config.calendarId,
      status: "connected",
      timestamp: new Date().toISOString()
    }
  };
}

// Mock para probar conexión con WhatsApp
export async function testWhatsAppConnectionMock(config: {
  apiKey: string;
  phoneNumberId: string;
}): Promise<TestConnectionResult> {
  console.log("🔍 Mock: Probando conexión con WhatsApp");

  await new Promise(resolve => setTimeout(resolve, 800));

  if (!config.apiKey) {
    return {
      success: false,
      error: "Access Token es requerido",
      details: "Debes proporcionar un Access Token de WhatsApp"
    };
  }

  if (!config.phoneNumberId) {
    return {
      success: false,
      error: "Phone Number ID es requerido",
      details: "Debes proporcionar un Phone Number ID"
    };
  }

  return {
    success: true,
    message: "Conexión con WhatsApp simulada exitosamente",
    details: {
      phoneNumberId: config.phoneNumberId,
      status: "connected",
      timestamp: new Date().toISOString()
    }
  };
}

// Mock general para otras APIs
export async function testGenericConnectionMock(apiType: string, config: any): Promise<TestConnectionResult> {
  console.log(`🔍 Mock: Probando conexión con ${apiType}`);

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: `Conexión con ${apiType} simulada exitosamente`,
    details: {
      apiType,
      status: "connected",
      timestamp: new Date().toISOString(),
      configKeys: Object.keys(config)
    }
  };
}

// Función principal de mock para test-connection
export async function testConnectionMock(apiType: string, config: any): Promise<TestConnectionResult> {
  console.log(`🧪 Mock: Iniciando prueba de conexión para ${apiType}`);

  try {
    switch (apiType) {
      case 'groq':
        return await testGroqConnectionMock(config);

      case 'googleAnalytics':
        return await testGoogleAnalyticsConnectionMock({ propertyId: config?.apiKey });

      case 'googleCalendar':
        return await testGoogleCalendarConnectionMock({
          apiKey: config?.apiKey,
          calendarId: config?.calendarId
        });

      case 'whatsapp':
        return await testWhatsAppConnectionMock({
          apiKey: config?.apiKey,
          phoneNumberId: config?.phoneNumberId
        });

      default:
        return await testGenericConnectionMock(apiType, config);
    }
  } catch (error) {
    console.error(`❌ Mock: Error en prueba de conexión para ${apiType}:`, error);
    return {
      success: false,
      error: "Error en la prueba de conexión",
      details: error instanceof Error ? error.message : "Error desconocido"
    };
  }
}
