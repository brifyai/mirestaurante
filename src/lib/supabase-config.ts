import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase para el frontend
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://pmpbwtxcwlmjprfmnpny.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcGJ3dHhjd2xtanByZm1ucG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTgyMTAsImV4cCI6MjA3NTY5NDIxMH0.W3hMgNerh_4rW-eDJIgs38O-yLCRMf3GS7MzLiQjHrk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la tabla configurations
export interface Configuration {
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
  created_at: string | null;
  updated_at: string | null;
}

// Interface para el formato del frontend
export interface FrontendConfiguration {
  apis: {
    meta: { status: string; apiKey: string; webhook: string };
    whatsapp: {
      status: string;
      apiKey: string;
      webhook: string;
      phoneNumberId: string;
    };
    instagram: { status: string; apiKey: string; webhook: string };
    facebook: { status: string; apiKey: string; webhook: string };
    googleCalendar: {
      status: string;
      apiKey: string;
      webhook: string;
      calendarId: string;
    };
    groq: { status: string; apiKey: string };
    googleAnalytics: { status: string; apiKey: string; measurementId: string };
    googlePlaces: { status: string; apiKey: string; webhook: string };
    googleReviews: { status: string; apiKey: string; webhook: string };
  };
  aiSettings: {
    model: string;
    temperature: number;
    maxTokens: number;
    autoResponse: boolean;
    humanEscalation: boolean;
    escalationKeywords: string[];
  };
  businessInfo: {
    name: string;
    location: string;
    hours: string;
    phone: string;
    email: string;
    website: string;
  };
  whatsappFeatures: {
    autoReply: boolean;
    businessHours: boolean;
    reservations: boolean;
    menu: boolean;
    promotions: boolean;
  };
}

// Función para convertir la configuración de DB a formato frontend
export function formatConfigForFrontend(
  config: Configuration | null,
): FrontendConfiguration {
  console.log("🔧 formatConfigForFrontend: config recibido:", config);

  if (!config) {
    console.log(
      "ℹ️ formatConfigForFrontend: No hay configuración, usando valores por defecto",
    );
    return {
      apis: {
        meta: { status: "disconnected", apiKey: "", webhook: "" },
        whatsapp: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
          phoneNumberId: "",
        },
        instagram: { status: "disconnected", apiKey: "", webhook: "" },
        facebook: { status: "disconnected", apiKey: "", webhook: "" },
        googleCalendar: {
          status: "disconnected",
          apiKey: "",
          webhook: "",
          calendarId: "",
        },
        groq: { status: "disconnected", apiKey: "" },
        googleAnalytics: {
          status: "disconnected",
          apiKey: "",
          measurementId: "",
        },
        googlePlaces: { status: "disconnected", apiKey: "", webhook: "" },
        googleReviews: { status: "disconnected", apiKey: "", webhook: "" },
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

  console.log("🔧 formatConfigForFrontend: Procesando configuración existente");

  return {
    apis: {
      meta: { status: "disconnected", apiKey: "", webhook: "" },
      whatsapp: {
        status: config.whatsapp_access_token ? "connected" : "disconnected",
        apiKey: config.whatsapp_access_token || "",
        webhook: "",
        phoneNumberId: config.whatsapp_phone_number_id || "",
      },
      instagram: { status: "disconnected", apiKey: "", webhook: "" },
      facebook: { status: "disconnected", apiKey: "", webhook: "" },
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
      googlePlaces: { status: "disconnected", apiKey: "", webhook: "" },
      googleReviews: { status: "disconnected", apiKey: "", webhook: "" },
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

// Función para obtener configuración desde Supabase
export async function getConfiguration(
  userId: string,
): Promise<FrontendConfiguration> {
  console.log("🔍 Supabase: Iniciando getConfiguration para user_id:", userId);
  console.log("🔍 Supabase: Verificando que user_id sea válido:", {
    userId,
    typeof: typeof userId,
    length: userId?.length,
  });

  try {
    console.log("🔍 Supabase: Ejecutando consulta SQL:");
    console.log(
      "   SELECT * FROM configurations WHERE user_id = '",
      userId,
      "'",
    );

    const { data: config, error } = await supabase
      .from("configurations")
      .select("*")
      .eq("user_id", userId)
      .single();

    console.log("🔍 Supabase: Resultado de la consulta:", { config, error });
    console.log("🔍 Supabase: Datos específicos de configuración:", {
      groq_api_key: config?.groq_api_key ? "Sí" : "No",
      groq_model: config?.groq_model,
      business_name: config?.business_name,
      updated_at: config?.updated_at,
    });

    if (error && error.code !== "PGRST116") {
      console.error("❌ Supabase: Error obteniendo configuración:", error);
      console.error("❌ Supabase: Error code:", error.code);
      console.error("❌ Supabase: Error details:", error.details);
      throw new Error(`Error obteniendo configuración: ${error.message}`);
    }

    if (error && error.code === "PGRST116") {
      console.log(
        "ℹ️ Supabase: No existe configuración para este usuario (PGRST116)",
      );
    }

    console.log("✅ Supabase: Configuración obtenida exitosamente:", !!config);
    return formatConfigForFrontend(config);
  } catch (err) {
    console.error("❌ Supabase: Error en getConfiguration:", err);
    throw err;
  }
}

// Función para guardar configuración en Supabase
export async function saveConfiguration(
  userId: string,
  apis: any,
  aiSettings: any,
  businessInfo: any,
): Promise<{ success: boolean; message: string; data: FrontendConfiguration }> {
  console.log("💾 Supabase: Guardando configuración para user_id:", userId);

  // Convertir datos del frontend al formato de la base de datos
  const configData = {
    user_id: userId,
    groq_api_key: apis?.groq?.apiKey || null,
    groq_model: aiSettings?.model || "llama3-8b-8192",
    whatsapp_access_token: apis?.whatsapp?.apiKey || null,
    whatsapp_phone_number_id: apis?.whatsapp?.phoneNumberId || null,
    google_calendar_service_key: apis?.googleCalendar?.apiKey || null,
    google_calendar_id: apis?.googleCalendar?.calendarId || null,
    google_analytics_property_id: apis?.googleAnalytics?.apiKey || null,
    ai_temperature: aiSettings?.temperature || 0.7,
    ai_max_tokens: aiSettings?.maxTokens || 1000,
    ai_auto_response: aiSettings?.autoResponse !== false,
    ai_human_escalation: aiSettings?.humanEscalation !== false,
    ai_escalation_keywords: aiSettings?.escalationKeywords || [
      "alergia",
      "severa",
      "urgente",
      "manager",
      "compleja",
    ],
    business_name: businessInfo?.name || "Jaraquemada",
    business_location: businessInfo?.location || "Santiago, Chile",
    business_hours:
      businessInfo?.hours ||
      "Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00",
    business_phone: businessInfo?.phone || "+56 9 1234 5678",
    business_email: businessInfo?.email || "reservas@jaraquemada.com",
    business_website: businessInfo?.website || "https://jaraquemada.com",
    whatsapp_auto_reply: businessInfo?.autoReply !== false,
    whatsapp_business_hours: businessInfo?.businessHours !== false,
    whatsapp_reservations: businessInfo?.reservations !== false,
    whatsapp_menu: businessInfo?.menu !== false,
    whatsapp_promotions: businessInfo?.promotions || false,
  };

  console.log("💾 Supabase: Datos a guardar:", configData);

  try {
    // Verificar si existe configuración para el usuario
    const { data: existingConfig, error: checkError } = await supabase
      .from("configurations")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error(
        "❌ Supabase: Error verificando configuración existente:",
        checkError,
      );
      throw new Error(`Error verificando configuración: ${checkError.message}`);
    }

    let result;
    if (existingConfig) {
      console.log("🔄 Supabase: Actualizando configuración existente...");
      result = await supabase
        .from("configurations")
        .update(configData)
        .eq("user_id", userId)
        .select()
        .single();
    } else {
      console.log("➕ Supabase: Creando nueva configuración...");
      result = await supabase
        .from("configurations")
        .insert(configData)
        .select()
        .single();
    }

    if (result.error) {
      console.error(
        "❌ Supabase: Error guardando configuración:",
        result.error,
      );
      throw new Error(`Error guardando configuración: ${result.error.message}`);
    }

    console.log("✅ Supabase: Configuración guardada exitosamente");
    const formattedConfig = formatConfigForFrontend(result.data);

    return {
      success: true,
      message: "Configuración guardada exitosamente en Supabase",
      data: formattedConfig,
    };
  } catch (error) {
    console.error("❌ Supabase: Error en operación de guardado:", error);
    throw error;
  }
}
