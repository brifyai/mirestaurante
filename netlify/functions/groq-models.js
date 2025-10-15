exports.handler = async (event, context) => {
  // Solo permitir POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Manejar preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    const { apiKey } = JSON.parse(event.body);

    if (!apiKey) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "API key is required" }),
      };
    }

    // Validar que la API key tenga el formato correcto de Groq
    if (!apiKey.startsWith("gsk_") || apiKey.length < 20) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Invalid Groq API key format" }),
      };
    }

    // Hacer la llamada a la API de Groq para obtener los modelos disponibles
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Si no se puede parsear el JSON de error, usar mensaje genérico
      }

      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error:
            errorData.error?.message || "Failed to fetch models from Groq API",
          details: errorData,
        }),
      };
    }

    const data = await response.json();

    // Procesar todos los modelos de Groq sin filtrar
    const models = data.data || [];

    // Ordenar los modelos por nombre y priorizar los más comunes
    const sortedModels = models.sort((a, b) => {
      // Priorizar modelos más nuevos y populares
      const priorityOrder = [
        "llama-3.3-70b",
        "llama-3.1-70b",
        "llama-3.1-8b",
        "llama-3-70b",
        "llama-3-8b",
        "llama3-70b",
        "llama3-8b",
        "mixtral-8x7b",
        "gemma2-9b",
        "gemma-7b",
        "distil-whisper",
        "whisper",
      ];

      const aPriority = priorityOrder.findIndex((prefix) =>
        a.id.includes(prefix),
      );
      const bPriority = priorityOrder.findIndex((prefix) =>
        b.id.includes(prefix),
      );

      if (aPriority === -1 && bPriority === -1) return a.id.localeCompare(b.id);
      if (aPriority === -1) return 1;
      if (bPriority === -1) return -1;
      return aPriority - bPriority;
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        models: sortedModels,
        total: sortedModels.length,
        success: true,
      }),
    };
  } catch (error) {
    console.error("Error fetching Groq models:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
