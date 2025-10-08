
// Cliente para Evolution API
export class EvolutionAPIClient {
  private baseUrl: string;
  private instanceName: string;
  private apiKey: string;

  constructor(baseUrl: string, instanceName: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.instanceName = instanceName;
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
    };
  }

  // Crear instancia de WhatsApp
  async createInstance() {
    try {
      const response = await fetch(`${this.baseUrl}/instance/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          instanceName: this.instanceName,
          token: this.apiKey,
          qrcode: true,
          webhook_by_events: false,
          webhook_base64: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creando instancia: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creando instancia Evolution:', error);
      throw error;
    }
  }

  // Obtener QR Code para conectar WhatsApp
  async getQRCode() {
    try {
      const response = await fetch(`${this.baseUrl}/instance/connect/${this.instanceName}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error obteniendo QR: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo QR Evolution:', error);
      throw error;
    }
  }

  // Verificar estado de conexión
  async getConnectionStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/instance/connectionState/${this.instanceName}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error verificando estado: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verificando estado Evolution:', error);
      throw error;
    }
  }

  // Enviar mensaje de texto
  async sendTextMessage(to: string, message: string) {
    try {
      // Asegurar formato correcto del número
      const phoneNumber = to.includes('@') ? to : `${to}@s.whatsapp.net`;

      const response = await fetch(`${this.baseUrl}/message/sendText/${this.instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          number: phoneNumber,
          text: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error enviando mensaje: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enviando mensaje Evolution:', error);
      throw error;
    }
  }

  // Enviar mensaje con media (imagen, audio, etc.)
  async sendMediaMessage(to: string, mediaUrl: string, caption?: string, mediaType: 'image' | 'audio' | 'video' | 'document' = 'image') {
    try {
      const phoneNumber = to.includes('@') ? to : `${to}@s.whatsapp.net`;

      const response = await fetch(`${this.baseUrl}/message/sendMedia/${this.instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          number: phoneNumber,
          mediatype: mediaType,
          media: mediaUrl,
          caption: caption || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error enviando media: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enviando media Evolution:', error);
      throw error;
    }
  }

  // Enviar mensaje con botones
  async sendButtonMessage(to: string, text: string, buttons: Array<{ buttonId: string; buttonText: string }>) {
    try {
      const phoneNumber = to.includes('@') ? to : `${to}@s.whatsapp.net`;

      const response = await fetch(`${this.baseUrl}/message/sendButtons/${this.instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          number: phoneNumber,
          text: text,
          buttons: buttons.map(btn => ({
            buttonId: btn.buttonId,
            buttonText: {
              displayText: btn.buttonText
            }
          })),
          headerText: 'AI Restaurante',
          footerText: 'Jaraquemada - Santiago, Chile'
        }),
      });

      if (!response.ok) {
        throw new Error(`Error enviando botones: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enviando botones Evolution:', error);
      throw error;
    }
  }

  // Enviar lista de opciones
  async sendListMessage(to: string, title: string, description: string, sections: Array<{
    title: string;
    rows: Array<{ title: string; description: string; rowId: string }>;
  }>) {
    try {
      const phoneNumber = to.includes('@') ? to : `${to}@s.whatsapp.net`;

      const response = await fetch(`${this.baseUrl}/message/sendList/${this.instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          number: phoneNumber,
          title: title,
          description: description,
          buttonText: 'Ver Opciones',
          sections: sections,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error enviando lista: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enviando lista Evolution:', error);
      throw error;
    }
  }

  // Obtener información del perfil
  async getProfileInfo(phoneNumber: string) {
    try {
      const number = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@s.whatsapp.net`;

      const response = await fetch(`${this.baseUrl}/chat/whatsappProfile/${this.instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          number: number,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error obteniendo perfil: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo perfil Evolution:', error);
      throw error;
    }
  }

  // Configurar webhook
  async setWebhook(webhookUrl: string) {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/set/${this.instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          url: webhookUrl,
          enabled: true,
          webhookByEvents: false,
          webhookBase64: false,
          events: [
            'APPLICATION_STARTUP',
            'QRCODE_UPDATED',
            'MESSAGES_UPSERT',
            'MESSAGES_UPDATE',
            'MESSAGES_DELETE',
            'SEND_MESSAGE',
            'CONTACTS_UPDATE',
            'CONTACTS_UPSERT',
            'PRESENCE_UPDATE',
            'CHATS_UPDATE',
            'CHATS_UPSERT',
            'CHATS_DELETE',
            'GROUPS_UPSERT',
            'GROUP_UPDATE',
            'GROUP_PARTICIPANTS_UPDATE',
            'CONNECTION_UPDATE',
            'CALL',
            'NEW_JWT_TOKEN'
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Error configurando webhook: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error configurando webhook Evolution:', error);
      throw error;
    }
  }

  // Métodos específicos para el restaurante
  async sendMenuMessage(to: string) {
    const menuSections = [
      {
        title: '🍽️ Nuestro Menú',
        rows: [
          {
            title: '🥗 Entradas',
            description: 'Ceviche, Carpaccio, Tabla de quesos',
            rowId: 'menu_entradas'
          },
          {
            title: '🥘 Platos Principales', 
            description: 'Salmón, Filete, Pasta, Parrillada',
            rowId: 'menu_principales'
          },
          {
            title: '🍰 Postres',
            description: 'Tiramisú, Brownie, Cheesecake',
            rowId: 'menu_postres'
          },
          {
            title: '🍷 Bebidas',
            description: 'Vinos, Cervezas, Jugos naturales',
            rowId: 'menu_bebidas'
          }
        ]
      }
    ];

    return await this.sendListMessage(
      to,
      'Carta Jaraquemada',
      'Selecciona la sección del menú que te interesa:',
      menuSections
    );
  }

  async sendReservationButtons(to: string) {
    const buttons = [
      { buttonId: 'nueva_reserva', buttonText: '📅 Nueva Reserva' },
      { buttonId: 'consultar_reserva', buttonText: '🔍 Consultar Reserva' },
      { buttonId: 'modificar_reserva', buttonText: '✏️ Modificar Reserva' }
    ];

    return await this.sendButtonMessage(
      to,
      '¿Cómo te podemos ayudar con tu reserva?',
      buttons
    );
  }

  async sendReservationConfirmation(to: string, reservationData: {
    date: string;
    time: string;
    partySize: number;
    customerName: string;
  }) {
    const message = `✅ **RESERVA CONFIRMADA**

👤 **Cliente:** ${reservationData.customerName}
📅 **Fecha:** ${reservationData.date}
🕐 **Hora:** ${reservationData.time}
👥 **Personas:** ${reservationData.partySize}

📍 **Dirección:** Jaraquemada, Santiago, Chile
📞 **Consultas:** +56 9 1234 5678

¡Te esperamos! Si necesitas modificar tu reserva, solo escríbenos.

¡Gracias por elegir Jaraquemada! 🍽️✨`;

    return await this.sendTextMessage(to, message);
  }
}
