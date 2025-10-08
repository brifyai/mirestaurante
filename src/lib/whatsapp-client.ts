
// Cliente para WhatsApp Business API
export class WhatsAppClient {
  private accessToken: string;
  private phoneNumberId: string;
  private version = 'v18.0';

  constructor(accessToken: string, phoneNumberId: string) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
  }

  async sendTextMessage(to: string, message: string) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${this.version}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: { body: message }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error enviando mensaje: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error enviando mensaje WhatsApp:', error);
      throw error;
    }
  }

  async sendTemplateMessage(to: string, templateName: string, languageCode = 'es', parameters?: string[]) {
    try {
      const templateData: any = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode }
        }
      };

      if (parameters && parameters.length > 0) {
        templateData.template.components = [
          {
            type: 'body',
            parameters: parameters.map(param => ({
              type: 'text',
              text: param
            }))
          }
        ];
      }

      const response = await fetch(
        `https://graph.facebook.com/${this.version}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error enviando template: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enviando template WhatsApp:', error);
      throw error;
    }
  }

  async sendMenuMessage(to: string) {
    const menuMessage = `🍽️ **CARTA JARAQUEMADA** 🍽️

📋 **ENTRADAS**
• Ceviche de la casa - $8.900
• Carpaccio de res - $12.500
• Tabla de quesos artesanales - $15.200

🥘 **PLATOS PRINCIPALES**
• Salmón a la plancha con risotto - $18.900
• Filete de res con papas gratinadas - $22.500
• Pasta con mariscos frescos - $16.700
• Parrillada mixta (2 personas) - $35.000

🍰 **POSTRES**
• Tiramisú artesanal - $7.500
• Brownie con helado - $6.800
• Cheesecake de frutos rojos - $7.200

🍷 **BEBIDAS**
• Vinos de la casa desde $4.500
• Cervezas artesanales - $3.200
• Jugos naturales - $2.800

¿Te gustaría hacer una reserva? 📞`;

    return await this.sendTextMessage(to, menuMessage);
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

  async sendHumanEscalationNotification(staffPhoneNumbers: string[], customerInfo: {
    phone: string;
    name?: string;
    message: string;
    urgencyLevel: 'low' | 'medium' | 'high';
  }) {
    const urgencyEmoji = {
      low: '📝',
      medium: '⚠️', 
      high: '🚨'
    };

    const notificationMessage = `${urgencyEmoji[customerInfo.urgencyLevel]} **ATENCIÓN REQUERIDA**

**Cliente:** ${customerInfo.name || 'No proporcionado'}
**Teléfono:** ${customerInfo.phone}
**Urgencia:** ${customerInfo.urgencyLevel.toUpperCase()}

**Mensaje:**
"${customerInfo.message}"

Por favor, contactar al cliente lo antes posible.

_Notificación automática de AI Restaurante_`;

    // Enviar notificación a todos los números del staff
    const notifications = staffPhoneNumbers.map(phoneNumber =>
      this.sendTextMessage(phoneNumber, notificationMessage)
    );

    return await Promise.all(notifications);
  }
}
