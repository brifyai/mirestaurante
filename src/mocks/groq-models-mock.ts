// Mock dinámico que simula la respuesta real de la API de Groq
// Basado en la estructura真实 de la API de Groq: https://api.groq.com/openai/v1/models

// Modelos actuales disponibles en Groq (actualizado según documentación)
interface GroqModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// Lista completa basada en la API real de Groq
const getRealGroqModels = (): GroqModel[] => [
  // Llama 3.3 Models
  {
    id: "llama-3.3-70b-versatile",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "llama-3.3-70b-specdec",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },

  // Llama 3.1 Models
  {
    id: "llama-3.1-70b-versatile",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "llama-3.1-8b-instant",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "llama-3.1-8b-versatile",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "llama-3.1-70b-specdec",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },

  // Llama 3 Models
  {
    id: "llama-3-70b-versatile",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "llama-3-8b-instant",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "llama-3-8b-versatile",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },

  // Llama 3 Tool Use Preview Models
  {
    id: "llama3-groq-70b-8192-tool-use-preview",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "llama3-groq-8b-8192-tool-use-preview",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },

  // Mixtral Models
  {
    id: "mixtral-8x7b-32768",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "mixtral-8x7b-instruct-v0",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },

  // Gemma Models
  {
    id: "gemma2-9b-it",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "gemma-7b-it",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },

  // Whisper Models (Audio transcription)
  {
    id: "distil-whisper-large-v3-en",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "whisper-large-v3",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "whisper-large-v3-turbo",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "whisper-medium",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "whisper-base",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
  {
    id: "whisper-tiny",
    object: "model",
    created: 1708608000,
    owned_by: "groq",
  },
];

export async function fetchGroqModelsMock(apiKey: string) {
  // Simular un pequeño retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validar que la API key tenga el formato correcto
  if (!apiKey.startsWith("gsk_") || apiKey.length < 20) {
    throw new Error("Invalid Groq API key format");
  }

  // Obtener los modelos dinámicamente
  const models = getRealGroqModels();

  // Ordenar los modelos por nombre y priorizar los más comunes (igual que en producción)
  const sortedModels = models.sort((a, b) => {
    // Priorizar modelos más nuevos y populares
    const priorityOrder = [
      "llama-3.3-70b",
      "llama-3.1-70b",
      "llama-3.1-8b",
      "llama-3-70b",
      "llama-3-8b",
      "llama3-groq-70b",
      "llama3-groq-8b",
      "mixtral-8x7b",
      "gemma2-9b",
      "gemma-7b",
      "distil-whisper",
      "whisper-large-v3",
      "whisper-large-v3-turbo",
      "whisper-medium",
      "whisper-base",
      "whisper-tiny",
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

  // Retornar la misma estructura que la API real de Groq
  return {
    object: "list",
    data: sortedModels,
    models: sortedModels, // Para compatibilidad con el código existente
    total: sortedModels.length,
    success: true,
  };
}

// Exportar también la actualización real para cuando se necesite
export async function fetchRealGroqModels(apiKey: string) {
  const response = await fetch("https://api.groq.com/openai/v1/models", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || "Failed to fetch models from Groq API",
    );
  }

  const data = await response.json();

  return {
    object: data.object,
    data: data.data,
    models: data.data,
    total: data.data.length,
    success: true,
  };
}
