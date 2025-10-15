// Mock para la función de configuración - usado solo en desarrollo local
// Simula el comportamiento de la tabla configurations de Supabase

interface Configuration {
  id: string;
  user_id: string;
  groq_api_key: string | null;
  groq_model: string | null;
  whatsapp_access_token: string | null;
  whatsapp_phone_number_id: string | null;
  google_calendar_service_key: string | null;
  google_calendar_id: string | null;
  google_analytics_property_id: string | null;
  ai_temperature: number | null;
  ai_max_tokens: number | null;
  ai_auto_response: boolean | null;
  ai_human_escalation: boolean | null;
  ai_escalation_keywords: string[] | null;
  business_name: string | null;
  business_location: string | null;
  business_hours: string | null;
  business_phone: string | null;
  business_email: string | null;
  business_website: string | null;
  whatsapp_auto_reply: boolean | null;
  whatsapp_business_hours: boolean | null;
  whatsapp_reservations: boolean | null;
  whatsapp_menu: boolean | null;
  whatsapp_promotions: boolean | null;
  created_at: string;
  updated_at: string;
}

// Almacenamiento local en memoria para simular la base de datos
const localConfigStore = new Map<string, Configuration>();

// Función para convertir la configuración de DB a formato frontend (igual que en la función real)
function formatConfigForFrontend(config: Configuration | null) {
  if (!config) {
    return {
      apis: {
        meta: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
        },
        whatsapp: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
          phoneNumberId: "",
        },
        instagram: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
        },
        facebook: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
        },
        googleCalendar: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
          calendarId: "",
        },
        groq: {
          status: "disconnected",
          apiKey: "",
        },
        googleAnalytics: {
          status: "disconnected",
          apiKey: "",
          measurementId: "",
        },
        googlePlaces: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
        },
        googleReviews: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
        },
      },
      aiSettings: {
        model: "llama3-8b-8192",
        temperature: 0.7,
        maxTokens: 1000,
        autoResponse: true,
        humanEscalation: true,
        escalationKeywords: [
          "alergia",
          "severa",
          "urgente",
          "manager",
          "compleja",
        ],
      },
      businessInfo: {
        name: "Jaraquemada",
        location: "Santiago, Chile",
        hours: "Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00",
        phone: "+56 9 1234 5678",
        email: "reservas@jaraquemada.com",
        website: "https://jaraquemada.com",
      },
      whatsappFeatures: {
        autoReply: true,
        businessHours: true,
        reservations: true,
        menu: true,
        promotions: false,
      },
    };
  }

  return {
    apis: {
      meta: {
        status: "disconnected",
        apiKey: "",
        webhook: "",
      },
      whatsapp: {
        status: config.whatsapp_access_token ? "connected" : "disconnected",
        apiKey: config.whatsapp_access_token || "",
        webhook: "",
        phoneNumberId: config.whatsapp_phone_number_id || "",
      },
      instagram: {
        status: "disconnected",
        apiKey: "",
        webhook: "",
      },
      facebook: {
        status: "disconnected",
        apiKey: "",
        webhook: "",
      },
      googleCalendar: {
        status: config.google_calendar_service_key
          ? "connected"
          : "disconnected",
        apiKey: config.google_calendar_service_key || "",
        webhook: "",
        calendarId: config.google_calendar_id || "",
      },
      groq: {
        status: config.groq_api_key ? "connected" : "disconnected",
        apiKey: config.groq_api_key || "",
      },
      googleAnalytics: {
        status: config.google_analytics_property_id
          ? "connected"
          : "disconnected",
        apiKey: config.google_analytics_property_id || "",
        measurementId: config.google_analytics_property_id || "",
      },
      googlePlaces: {
        status: "disconnected",
        apiKey: "",
        webhook: "",
      },
      googleReviews: {
        status: "disconnected",
        apiKey: "",
        webhook: "",
      },
    },
    aiSettings: {
      model: config.groq_model || "llama3-8b-8192",
      temperature: config.ai_temperature ?? 0.7,
      maxTokens: config.ai_max_tokens ?? 1000,
      autoResponse: config.ai_auto_response ?? true,
      humanEscalation: config.ai_human_escalation ?? true,
      escalationKeywords: config.ai_escalation_keywords || [
        "alergia",
        "severa",
        "urgente",
        "manager",
        "compleja",
      ],
    },
    businessInfo: {
      name: config.business_name || "Jaraquemada",
      location: config.business_location || "Santiago, Chile",
      hours:
        config.business_hours ||
        "Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00",
      phone: config.business_phone || "+56 9 1234 5678",
      email: config.business_email || "reservas@jaraquemada.com",
      website: config.business_website || "https://jaraquemada.com",
    },
    whatsappFeatures: {
      autoReply: config.whatsapp_auto_reply !== false,
      businessHours: config.whatsapp_business_hours !== false,
      reservations: config.whatsapp_reservations !== false,
      menu: config.whatsapp_menu !== false,
      promotions: config.whatsapp_promotions || false,
    },
  };
}

// Mock para obtener configuración (GET)
export async function fetchConfigMock(userId: string) {
  console.log("🔍 Mock GET - User ID recibido:", userId);

  // Simular un pequeño retraso de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!userId) {
    throw new Error("User ID es requerido");
  }

  const config = localConfigStore.get(userId);

  console.log("🔍 Mock GET - Configuración encontrada:", !!config);
  const formattedConfig = formatConfigForFrontend(config);

  return formattedConfig;
}

// Mock para guardar configuración (POST)
export async function saveConfigMock(body: {
  userId: string;
  apis: any;
  aiSettings: any;
  businessInfo: any;
  lastUpdated: string;
}) {
  console.log("📥 Mock POST - Datos recibidos:", body);
  console.log("📥 Mock POST - User ID:", body.userId);

  const userId = body.userId;

  if (!userId) {
    throw new Error("User ID es requerido");
  }

  // Simular un pequeño retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Convertir datos del frontend al formato de la base de datos
  const configData: Configuration = {
    id: localConfigStore.get(userId)?.id || `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    groq_api_key: body.apis?.groq?.apiKey || null,
    groq_model: body.aiSettings?.model || "llama3-8b-8192",
    whatsapp_access_token: body.apis?.whatsapp?.apiKey || null,
    whatsapp_phone_number_id: body.apis?.whatsapp?.phoneNumberId || null,
    google_calendar_service_key: body.apis?.googleCalendar?.apiKey || null,
    google_calendar_id: body.apis?.googleCalendar?.calendarId || null,
    google_analytics_property_id: body.apis?.googleAnalytics?.apiKey || null,
    ai_temperature: body.aiSettings?.temperature || 0.7,
    ai_max_tokens: body.aiSettings?.maxTokens || 1000,
    ai_auto_response: body.aiSettings?.autoResponse !== false,
    ai_human_escalation: body.aiSettings?.humanEscalation !== false,
    ai_escalation_keywords: body.aiSettings?.escalationKeywords || [
      "alergia",
      "severa",
      "urgente",
      "manager",
      "compleja",
    ],
    business_name: body.businessInfo?.name || "Jaraquemada",
    business_location: body.businessInfo?.location || "Santiago, Chile",
    business_hours:
      body.businessInfo?.hours ||
      "Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00",
    business_phone: body.businessInfo?.phone || "+56 9 1234 5678",
    business_email: body.businessInfo?.email || "reservas@jaraquemada.com",
    business_website: body.businessInfo?.website || "https://jaraquemada.com",
    whatsapp_auto_reply: body.businessInfo?.autoReply !== false,
    whatsapp_business_hours: body.businessInfo?.businessHours !== false,
    whatsapp_reservations: body.businessInfo?.reservations !== false,
    whatsapp_menu: body.businessInfo?.menu !== false,
    whatsapp_promotions: body.businessInfo?.promotions || false,
    created_at: localConfigStore.get(userId)?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Guardar en el store local
  localConfigStore.set(userId, configData);

  console.log("💾 Mock POST - Configuración guardada exitosamente");
  console.log("💾 Mock POST - Total configuraciones:", localConfigStore.size);

  // Formatear configuración para el frontend
  const formattedConfig = formatConfigForFrontend(configData);

  return {
    success: true,
    message: "Configuración guardada exitosamente (Mock local)",
    data: formattedConfig,
  };
}

// Función de conveniencia para limpiar el store (útil para testing)
export function clearConfigStore() {
  localConfigStore.clear();
  console.log("🧹 Config store local limpiado");
}

// Función para ver el estado actual del store (útil para debugging)
export function getConfigStoreInfo() {
  const configs = Array.from(localConfigStore.values());
  return {
    totalConfigs: configs.length,
    userIds: Array.from(localConfigStore.keys()),
    configs: configs.map(c => ({
      id: c.id,
      user_id: c.user_id,
      groq_model: c.groq_model,
      business_name: c.business_name,
      updated_at: c.updated_at,
    })),
  };
}

// Exportar el store para acceso directo (solo para debugging)
export { localConfigStore };
