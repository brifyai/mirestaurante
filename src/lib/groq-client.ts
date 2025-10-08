
// Cliente para Groq AI
export class GroqClient {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createChatCompletion(messages: Array<{ role: string; content: string }>, options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options?.model || 'llama3-8b-8192',
          messages,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error API Groq: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en Groq API:', error);
      throw error;
    }
  }

  async generateRestaurantResponse(userMessage: string, context: {
    restaurantName: string;
    location: string;
    hours: string;
    phone: string;
    email: string;
  }): Promise<string> {
    const systemPrompt = `Eres el asistente virtual de ${context.restaurantName}, un restaurante en ${context.location}.

INFORMACIÓN DEL RESTAURANTE:
- Nombre: ${context.restaurantName}
- Ubicación: ${context.location}
- Horarios: ${context.hours}
- Teléfono: ${context.phone}
- Email: ${context.email}

ESPECIALIDADES:
- Salmón a la plancha con risotto de hongos
- Filete de res con papas gratinadas
- Pasta con mariscos frescos
- Ceviche de la casa
- Tiramisú artesanal

CAPACIDADES:
✅ Puedes ayudar con:
- Información de carta y especialidades
- Crear, modificar y cancelar reservas
- Horarios de atención y disponibilidad
- Ubicación y contacto
- Promociones y eventos especiales
- Consultas generales sobre el restaurante

🚨 ESCALAR A HUMANO si detectas:
- Palabras: "alergia", "severa", "urgente", "manager", "compleja", "intolerancia"
- Situaciones médicas o de salud
- Quejas graves que requieren atención especial
- Consultas sobre contaminación cruzada

INSTRUCCIONES:
- Responde de manera amigable, profesional y concisa
- Usa emojis apropiadamente
- Si no sabes algo específico, ofrece alternativas
- Para reservas, pregunta: fecha, hora, cantidad de personas
- Si detectas escalación necesaria, responde: "He detectado que tu consulta requiere atención especializada. Un agente humano se comunicará contigo en breve para darte la mejor asistencia posible."

Responde al siguiente mensaje del cliente:`;

    try {
      const response = await this.createChatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]);

      return response.choices[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje. ¿Podrías reformularlo?';
    } catch (error) {
      console.error('Error generando respuesta:', error);
      return 'Disculpa, tengo problemas técnicos temporales. Un agente humano te atenderá pronto.';
    }
  }

  async detectIntention(message: string): Promise<{
    intention: string;
    confidence: number;
    needsHuman: boolean;
    category: 'reservation' | 'menu' | 'hours' | 'location' | 'complaint' | 'allergy' | 'promotion' | 'general';
  }> {
    const prompt = `Analiza el siguiente mensaje de cliente de restaurante y determina:

1. Intención principal
2. Confianza (0-1)
3. Si necesita escalación humana
4. Categoría

Mensaje: "${message}"

Responde SOLO en formato JSON:
{
  "intention": "descripción breve de la intención",
  "confidence": 0.85,
  "needsHuman": false,
  "category": "reservation"
}

Categorías posibles: reservation, menu, hours, location, complaint, allergy, promotion, general
Escalar a humano si hay: alergias, quejas graves, consultas médicas complejas.`;

    try {
      const response = await this.createChatCompletion([
        { role: 'user', content: prompt }
      ], { temperature: 0.3, maxTokens: 200 });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      
      return {
        intention: result.intention || 'Consulta general',
        confidence: result.confidence || 0.5,
        needsHuman: result.needsHuman || false,
        category: result.category || 'general'
      };
    } catch (error) {
      console.error('Error detectando intención:', error);
      return {
        intention: 'Error procesando consulta',
        confidence: 0.1,
        needsHuman: true,
        category: 'general'
      };
    }
  }
}
