// /lib/wapisimo-api.ts
export interface WapisimoConfig {
  baseUrl: string;
  apiKey: string;
  instanceId: string;
}

export interface WapisimoMessage {
  to: string;
  message: string;
  type?: 'text' | 'button' | 'list';
  buttons?: Array<{
    id: string;
    text: string;
  }>;
}

export class WapisimoAPIClient {
  private config: WapisimoConfig;

  constructor(config: WapisimoConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };
  }

  private getBaseUrl() {
    return `${this.config.baseUrl}/api/v1`;
  }

  async sendTextMessage(to: string, message: string): Promise<boolean> {
    try {
      console.log('🔄 Enviando mensaje via Wapisimo API...');
      
      const response = await fetch(`${this.getBaseUrl()}/instances/${this.config.instanceId}/messages/text`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          phone: to,
          message: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error Wapisimo API:', response.status, errorData);
        return false;
      }

      const result = await response.json();
      console.log('✅ Mensaje enviado via Wapisimo:', result);
      return true;
    } catch (error) {
      console.error('❌ Error enviando mensaje via Wapisimo:', error);
      return false;
    }
  }

  async sendButtonMessage(to: string, text: string, buttons: Array<{id: string, text: string}>): Promise<boolean> {
    try {
      console.log('🔄 Enviando mensaje con botones via Wapisimo...');
      
      const response = await fetch(`${this.getBaseUrl()}/instances/${this.config.instanceId}/messages/buttons`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          phone: to,
          message: text,
          buttons: buttons.map((btn, index) => ({
            id: btn.id || `btn_${index}`,
            text: btn.text,
            type: 'reply'
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error Wapisimo botones:', response.status, errorData);
        return false;
      }

      const result = await response.json();
      console.log('✅ Mensaje con botones enviado via Wapisimo:', result);
      return true;
    } catch (error) {
      console.error('❌ Error enviando botones via Wapisimo:', error);
      return false;
    }
  }

  async sendMenuMessage(to: string): Promise<boolean> {
    const menuButtons = [
      { id: 'menu_digital', text: '📱 Ver Menú Digital' },
      { id: 'hacer_reserva', text: '📅 Hacer Reserva' },
      { id: 'contactar', text: '💬 Contactar' },
    ];

    return this.sendButtonMessage(
      to,
      '¡Hola! Bienvenido a nuestro restaurante. ¿En qué te podemos ayudar?',
      menuButtons
    );
  }

  async sendReservationConfirmation(to: string, reservationData: any): Promise<boolean> {
    const message = `🎉 ¡Reserva Confirmada!

📅 Fecha: ${new Date(reservationData.date).toLocaleDateString('es-ES')}
⏰ Hora: ${new Date(reservationData.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
👥 Personas: ${reservationData.partySize}
📋 Nombre: ${reservationData.customerName}

¡Te esperamos! Si necesitas modificar tu reserva, contáctanos.`;

    return this.sendTextMessage(to, message);
  }

  async getConnectionStatus(): Promise<{ connected: boolean; status: string }> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/instances/${this.config.instanceId}/status`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return { connected: false, status: 'Error de conexión' };
      }

      const result = await response.json();
      
      // Adaptamos la respuesta según diferentes formatos posibles
      const isConnected = result.status === 'connected' || 
                         result.state === 'CONNECTED' ||
                         result.connected === true ||
                         result.status === 'open';

      return {
        connected: isConnected,
        status: isConnected ? 'Conectado' : result.status || 'Desconectado'
      };
    } catch (error) {
      console.error('❌ Error verificando estado Wapisimo:', error);
      return { connected: false, status: 'Error de verificación' };
    }
  }

  async getQRCode(): Promise<string | null> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/instances/${this.config.instanceId}/qr`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.error('❌ Error obteniendo QR de Wapisimo');
        return null;
      }

      const result = await response.json();
      
      // Diferentes formatos posibles de respuesta
      return result.qr || result.qrcode || result.code || result.data || null;
    } catch (error) {
      console.error('❌ Error generando QR Wapisimo:', error);
      return null;
    }
  }

  async restartInstance(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/instances/${this.config.instanceId}/restart`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error reiniciando instancia Wapisimo:', error);
      return false;
    }
  }

  // Método para crear instancia si no existe
  async createInstance(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/instances`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          instanceId: this.config.instanceId,
          instanceName: this.config.instanceId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error creando instancia Wapisimo:', error);
      return false;
    }
  }
}