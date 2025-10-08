

import { prisma } from '@/lib/prisma';

// Interfaces para el sistema de análisis de sentimiento
export interface CustomerFeedback {
  id: string;
  clientName: string;
  clientPhone: string;
  reservationId?: string;
  tableNumber?: string;
  
  // Respuesta original completa
  originalMessage: string;
  messageLength: number;
  
  // Análisis de IA
  sentimentScore: number; // 1-5
  sentimentLabel: 'VERY_NEGATIVE' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'VERY_POSITIVE';
  confidence: number; // 0-100%
  
  // Categorización automática
  categories: {
    food: number;      // 1-5
    service: number;   // 1-5
    ambiance: number;  // 1-5
    price: number;     // 1-5
    cleanliness: number; // 1-5
  };
  
  // Extracción de entidades
  keyPhrases: string[];
  emotions: string[];
  mentions: string[];
  
  // Decisión automática
  googleReviewRequest: boolean;
  actionTaken: 'GOOGLE_REVIEW' | 'MANAGER_ESCALATION' | 'FOLLOW_UP' | 'NONE';
  
  timestamp: Date;
  processed: boolean;
}

export interface SentimentAnalysisResult {
  sentimentScore: number;
  sentimentLabel: 'VERY_NEGATIVE' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'VERY_POSITIVE';
  confidence: number;
  categories: {
    food: number;
    service: number;
    ambiance: number;
    price: number;
    cleanliness: number;
  };
  keyPhrases: string[];
  emotions: string[];
  mentions: string[];
  recommendation: {
    requestGoogleReview: boolean;
    reason: string;
  };
}

export interface ScoreConfiguration {
  // Umbrales para Google Reviews
  googleReviewThreshold: number; // Puntuación mínima para solicitar Google Review
  googleReviewMinConfidence: number; // Confianza mínima requerida
  
  // Umbrales por categorías
  categoryWeights: {
    food: number;      // Peso de la categoría comida
    service: number;   // Peso de la categoría servicio
    ambiance: number;  // Peso de la categoría ambiente
    price: number;     // Peso de la categoría precio
    cleanliness: number; // Peso de la categoría limpieza
  };
  
  // Palabras clave positivas que fuerzan Google Review
  positiveKeywords: string[];
  
  // Palabras clave negativas que evitan Google Review
  negativeKeywords: string[];
  
  // Umbrales para escalamiento
  managerEscalationThreshold: number; // Puntuación bajo la cual se escala
  urgentEscalationThreshold: number;  // Puntuación para escalamiento urgente
  
  // Configuración de respuestas automáticas
  enableAutoResponse: boolean;
  responseDelay: number; // Minutos de delay antes de responder
}

// Configuración por defecto
export const DEFAULT_SCORE_CONFIG: ScoreConfiguration = {
  googleReviewThreshold: 4.0,
  googleReviewMinConfidence: 70,
  
  categoryWeights: {
    food: 0.3,
    service: 0.25,
    ambiance: 0.2,
    price: 0.15,
    cleanliness: 0.1
  },
  
  positiveKeywords: [
    'excelente', 'increíble', 'espectacular', 'perfecto', 'maravilloso',
    'recomiendo', 'volveré', 'fantástico', 'delicioso', 'extraordinario',
    'excepcional', 'impecable', 'sublime', 'genial', 'magnífico'
  ],
  
  negativeKeywords: [
    'terrible', 'pésimo', 'horrible', 'asqueroso', 'desagradable',
    'mal servicio', 'nunca más', 'no recomiendo', 'decepcionante',
    'falta de higiene', 'muy caro', 'estafa', 'lento', 'frío'
  ],
  
  managerEscalationThreshold: 3.0,
  urgentEscalationThreshold: 2.0,
  
  enableAutoResponse: true,
  responseDelay: 2
};

// Motor de análisis de sentimiento usando Groq
export class SentimentAnalysisEngine {
  private groqApiKey: string;
  private config: ScoreConfiguration;

  constructor(groqApiKey: string, config: ScoreConfiguration = DEFAULT_SCORE_CONFIG) {
    this.groqApiKey = groqApiKey;
    this.config = config;
  }

  async analyzeMessage(customerMessage: string): Promise<SentimentAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(customerMessage);
      const groqResponse = await this.callGroqAPI(prompt);
      
      // Parsear respuesta JSON de Groq
      const analysis = JSON.parse(groqResponse);
      
      // Aplicar lógica de decisión personalizada
      const recommendation = this.makeRecommendation(analysis);
      
      return {
        sentimentScore: analysis.sentimentScore,
        sentimentLabel: analysis.sentimentLabel,
        confidence: analysis.confidence,
        categories: analysis.categories,
        keyPhrases: analysis.keyPhrases || [],
        emotions: analysis.emotions || [],
        mentions: analysis.mentions || [],
        recommendation
      };

    } catch (error) {
      console.error('Error en análisis de sentimiento:', error);
      
      // Fallback: análisis básico
      return this.basicSentimentAnalysis(customerMessage);
    }
  }

  private buildAnalysisPrompt(customerMessage: string): string {
    return `
Eres un experto en análisis de sentimientos para restaurantes. Analiza este comentario de un cliente y proporciona un análisis detallado.

COMENTARIO DEL CLIENTE:
"${customerMessage}"

INSTRUCCIONES:
1. Analiza el sentimiento general y asigna una puntuación del 1 al 5 (donde 5 = excelente, 1 = terrible)
2. Determina el nivel de sentimiento: VERY_POSITIVE, POSITIVE, NEUTRAL, NEGATIVE, VERY_NEGATIVE
3. Calcula tu nivel de confianza en el análisis (0-100%)
4. Evalúa cada categoría del 1 al 5:
   - food: Calidad de comida y bebidas
   - service: Atención del personal y servicio
   - ambiance: Ambiente, decoración, música, comodidad
   - price: Percepción de valor y precios
   - cleanliness: Limpieza e higiene del lugar
5. Extrae las 3-5 frases más importantes del comentario
6. Identifica emociones presentes (alegría, frustración, satisfacción, etc.)
7. Menciona elementos específicos del restaurante mencionados

RESPONDE ÚNICAMENTE EN FORMATO JSON VÁLIDO:
{
  "sentimentScore": number,
  "sentimentLabel": string,
  "confidence": number,
  "categories": {
    "food": number,
    "service": number,
    "ambiance": number,
    "price": number,
    "cleanliness": number
  },
  "keyPhrases": ["frase1", "frase2", "frase3"],
  "emotions": ["emoción1", "emoción2"],
  "mentions": ["elemento1", "elemento2"]
}
`;
  }

  private async callGroqAPI(prompt: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en análisis de sentimientos para restaurantes. Siempre respondes en JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        top_p: 1,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en Groq API: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private makeRecommendation(analysis: any): { requestGoogleReview: boolean; reason: string } {
    const score = analysis.sentimentScore || 3;
    const confidence = analysis.confidence || 50;
    const categories = analysis.categories || {};
    const keyPhrases = (analysis.keyPhrases || []).join(' ').toLowerCase();
    
    // Verificar palabras clave negativas
    const hasNegativeKeywords = this.config.negativeKeywords.some(keyword => 
      keyPhrases.includes(keyword.toLowerCase())
    );
    
    if (hasNegativeKeywords) {
      return {
        requestGoogleReview: false,
        reason: 'Contiene palabras clave negativas'
      };
    }
    
    // Verificar palabras clave positivas
    const hasPositiveKeywords = this.config.positiveKeywords.some(keyword => 
      keyPhrases.includes(keyword.toLowerCase())
    );
    
    if (hasPositiveKeywords && score >= 3.5) {
      return {
        requestGoogleReview: true,
        reason: 'Contiene palabras clave muy positivas'
      };
    }
    
    // Puntuación general alta
    if (score >= this.config.googleReviewThreshold && confidence >= this.config.googleReviewMinConfidence) {
      return {
        requestGoogleReview: true,
        reason: `Puntuación alta: ${score}/5 con ${confidence}% confianza`
      };
    }
    
    // Análisis por categorías ponderadas
    const weightedScore = (
      (categories.food || 3) * this.config.categoryWeights.food +
      (categories.service || 3) * this.config.categoryWeights.service +
      (categories.ambiance || 3) * this.config.categoryWeights.ambiance +
      (categories.price || 3) * this.config.categoryWeights.price +
      (categories.cleanliness || 3) * this.config.categoryWeights.cleanliness
    );
    
    if (weightedScore >= this.config.googleReviewThreshold && 
        categories.food >= 4 && categories.service >= 3.5) {
      return {
        requestGoogleReview: true,
        reason: `Puntuación ponderada alta: ${weightedScore.toFixed(1)}/5`
      };
    }
    
    // Por defecto, no solicitar si no cumple criterios
    return {
      requestGoogleReview: false,
      reason: score < 3.5 ? 'Puntuación insuficiente' : 'No cumple criterios mínimos'
    };
  }

  private basicSentimentAnalysis(customerMessage: string): SentimentAnalysisResult {
    // Análisis básico como fallback
    const message = customerMessage.toLowerCase();
    const positiveWords = ['bueno', 'excelente', 'rico', 'delicioso', 'recomiendo'];
    const negativeWords = ['malo', 'terrible', 'feo', 'lento', 'caro'];
    
    const positiveCount = positiveWords.reduce((count, word) => 
      count + (message.includes(word) ? 1 : 0), 0);
    const negativeCount = negativeWords.reduce((count, word) => 
      count + (message.includes(word) ? 1 : 0), 0);
    
    let sentimentScore = 3; // Neutral por defecto
    let sentimentLabel: 'VERY_NEGATIVE' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'VERY_POSITIVE' = 'NEUTRAL';
    
    if (positiveCount > negativeCount) {
      sentimentScore = 4;
      sentimentLabel = 'POSITIVE';
    } else if (negativeCount > positiveCount) {
      sentimentScore = 2;
      sentimentLabel = 'NEGATIVE';
    }
    
    return {
      sentimentScore,
      sentimentLabel,
      confidence: 60, // Baja confianza para análisis básico
      categories: {
        food: 3,
        service: 3,
        ambiance: 3,
        price: 3,
        cleanliness: 3
      },
      keyPhrases: [customerMessage.substring(0, 50) + '...'],
      emotions: [],
      mentions: [],
      recommendation: {
        requestGoogleReview: sentimentScore >= 4,
        reason: 'Análisis básico (fallback)'
      }
    };
  }

  // Actualizar configuración
  updateConfiguration(newConfig: Partial<ScoreConfiguration>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Obtener configuración actual
  getConfiguration(): ScoreConfiguration {
    return { ...this.config };
  }
}

// Función auxiliar para guardar feedback en base de datos
export async function saveFeedbackAnalysis(
  clientName: string,
  clientPhone: string,
  originalMessage: string,
  analysis: SentimentAnalysisResult,
  reservationId?: string,
  tableNumber?: string
): Promise<CustomerFeedback> {
  
  const feedback: CustomerFeedback = {
    id: `feedback_${Date.now()}`,
    clientName,
    clientPhone,
    reservationId,
    tableNumber,
    originalMessage,
    messageLength: originalMessage.length,
    sentimentScore: analysis.sentimentScore,
    sentimentLabel: analysis.sentimentLabel,
    confidence: analysis.confidence,
    categories: analysis.categories,
    keyPhrases: analysis.keyPhrases,
    emotions: analysis.emotions,
    mentions: analysis.mentions,
    googleReviewRequest: analysis.recommendation.requestGoogleReview,
    actionTaken: analysis.recommendation.requestGoogleReview ? 'GOOGLE_REVIEW' : 
                 analysis.sentimentScore <= 3 ? 'MANAGER_ESCALATION' : 'FOLLOW_UP',
    timestamp: new Date(),
    processed: true
  };
  
  // En una implementación real, guardar en base de datos
  console.log('Guardando análisis de feedback:', feedback);
  
  // TODO: Implementar guardado en Prisma
  // await prisma.customerFeedback.create({ data: feedback });
  
  return feedback;
}

