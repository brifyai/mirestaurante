
import { WhatsAppClient } from './whatsapp-client';
import { EvolutionAPIClient } from './evolution-api';
import { WapisimoAPIClient } from './wapisimo-api';

// Tipos para la configuración
export type WhatsAppProvider = 'business-api' | 'evolution-api' | 'wapisimo-api';

export interface WhatsAppConfig {
  provider: WhatsAppProvider;
  businessApi?: {
    accessToken: string;
    phoneNumberId: string;
    verifyToken: string;
  };
  evolutionApi?: {
    baseUrl: string;
    instanceName: string;
    apiKey: string;
  };
  wapisimoApi?: {
    baseUrl: string;
    instanceId: string;
    apiKey: string;
  };
}

// Manager unificado para WhatsApp
export class WhatsAppManager {
  private config: WhatsAppConfig;
  private businessApiClient?: WhatsAppClient;
  private evolutionApiClient?: EvolutionAPIClient;
  private wapisimoApiClient?: WapisimoAPIClient;

  constructor(config: WhatsAppConfig) {
    this.config = config;
    this.initializeClients();
  }

  private initializeClients() {
    if (this.config.provider === 'business-api' && this.config.businessApi) {
      this.businessApiClient = new WhatsAppClient(
        this.config.businessApi.accessToken,
        this.config.businessApi.phoneNumberId
      );
    } else if (this.config.provider === 'evolution-api' && this.config.evolutionApi) {
      this.evolutionApiClient = new EvolutionAPIClient(
        this.config.evolutionApi.baseUrl,
        this.config.evolutionApi.instanceName,
        this.config.evolutionApi.apiKey
      );
    } else if (this.config.provider === 'wapisimo-api' && this.config.wapisimoApi) {
      this.wapisimoApiClient = new WapisimoAPIClient({
        baseUrl: this.config.wapisimoApi.baseUrl,
        instanceId: this.config.wapisimoApi.instanceId,
        apiKey: this.config.wapisimoApi.apiKey
      });
    }
  }

  // Métodos unificados que funcionan con cualquier proveedor
  async sendTextMessage(to: string, message: string) {
    try {
      if (this.config.provider === 'business-api' && this.businessApiClient) {
        return await this.businessApiClient.sendTextMessage(to, message);
      } else if (this.config.provider === 'evolution-api' && this.evolutionApiClient) {
        return await this.evolutionApiClient.sendTextMessage(to, message);
      } else if (this.config.provider === 'wapisimo-api' && this.wapisimoApiClient) {
        return await this.wapisimoApiClient.sendTextMessage(to, message);
      } else {
        throw new Error('No hay cliente de WhatsApp configurado');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      throw error;
    }
  }

  async sendMenuMessage(to: string) {
    try {
      if (this.config.provider === 'business-api' && this.businessApiClient) {
        return await this.businessApiClient.sendMenuMessage(to);
      } else if (this.config.provider === 'evolution-api' && this.evolutionApiClient) {
        return await this.evolutionApiClient.sendMenuMessage(to);
      } else if (this.config.provider === 'wapisimo-api' && this.wapisimoApiClient) {
        return await this.wapisimoApiClient.sendMenuMessage(to);
      } else {
        throw new Error('No hay cliente de WhatsApp configurado');
      }
    } catch (error) {
      console.error('Error enviando menú:', error);
      throw error;
    }
  }

  async sendReservationConfirmation(to: string, reservationData: {
    date: string;
    time: string;
    partySize: number;
    customerName: string;
  }) {
    try {
      if (this.config.provider === 'business-api' && this.businessApiClient) {
        return await this.businessApiClient.sendReservationConfirmation(to, reservationData);
      } else if (this.config.provider === 'evolution-api' && this.evolutionApiClient) {
        return await this.evolutionApiClient.sendReservationConfirmation(to, reservationData);
      } else if (this.config.provider === 'wapisimo-api' && this.wapisimoApiClient) {
        return await this.wapisimoApiClient.sendReservationConfirmation(to, reservationData);
      } else {
        throw new Error('No hay cliente de WhatsApp configurado');
      }
    } catch (error) {
      console.error('Error enviando confirmación de reserva:', error);
      throw error;
    }
  }

  // Métodos para botones (Evolution API y Wapisimo API)
  async sendButtonMessage(to: string, text: string, buttons: Array<{ buttonId: string; buttonText: string }>) {
    if (this.config.provider === 'evolution-api' && this.evolutionApiClient) {
      return await this.evolutionApiClient.sendButtonMessage(to, text, buttons);
    } else if (this.config.provider === 'wapisimo-api' && this.wapisimoApiClient) {
      // Convertir formato de botones para Wapisimo
      const wapisimoButtons = buttons.map(btn => ({
        id: btn.buttonId,
        text: btn.buttonText
      }));
      return await this.wapisimoApiClient.sendButtonMessage(to, text, wapisimoButtons);
    } else {
      // Para Business API, enviamos texto plano con opciones numeradas
      const buttonsText = buttons.map((btn, index) => 
        `${index + 1}. ${btn.buttonText}`
      ).join('\n');
      
      const fullMessage = `${text}\n\n${buttonsText}\n\nResponde con el número de tu elección.`;
      return await this.sendTextMessage(to, fullMessage);
    }
  }

  async sendListMessage(to: string, title: string, description: string, sections: Array<{
    title: string;
    rows: Array<{ title: string; description: string; rowId: string }>;
  }>) {
    if (this.config.provider === 'evolution-api' && this.evolutionApiClient) {
      return await this.evolutionApiClient.sendListMessage(to, title, description, sections);
    } else {
      // Para Business API, convertimos a texto plano
      let message = `${title}\n\n${description}\n\n`;
      
      sections.forEach((section, sectionIndex) => {
        message += `**${section.title}**\n`;
        section.rows.forEach((row, rowIndex) => {
          message += `${sectionIndex + 1}.${rowIndex + 1} ${row.title} - ${row.description}\n`;
        });
        message += '\n';
      });

      return await this.sendTextMessage(to, message);
    }
  }

  // Métodos específicos de cada proveedor
  getBusinessApiClient(): WhatsAppClient | undefined {
    return this.businessApiClient;
  }

  getEvolutionApiClient(): EvolutionAPIClient | undefined {
    return this.evolutionApiClient;
  }

  getWapisimoApiClient(): WapisimoAPIClient | undefined {
    return this.wapisimoApiClient;
  }

  // Estado y configuración
  getProvider(): WhatsAppProvider {
    return this.config.provider;
  }

  getConfig(): WhatsAppConfig {
    return this.config;
  }

  // Verificar si el proveedor actual soporta funcionalidades avanzadas
  supportsButtons(): boolean {
    return this.config.provider === 'evolution-api' || this.config.provider === 'wapisimo-api';
  }

  supportsLists(): boolean {
    return this.config.provider === 'evolution-api';
  }

  supportsMedia(): boolean {
    return true; // Todos los proveedores soportan media de diferentes maneras
  }

  // QR Code y conexión (Evolution API y Wapisimo API)
  async getQRCode() {
    if (this.config.provider === 'evolution-api' && this.evolutionApiClient) {
      return await this.evolutionApiClient.getQRCode();
    } else if (this.config.provider === 'wapisimo-api' && this.wapisimoApiClient) {
      return await this.wapisimoApiClient.getQRCode();
    } else {
      throw new Error('QR Code solo disponible con Evolution API y Wapisimo API');
    }
  }

  async getConnectionStatus() {
    if (this.config.provider === 'evolution-api' && this.evolutionApiClient) {
      return await this.evolutionApiClient.getConnectionStatus();
    } else if (this.config.provider === 'wapisimo-api' && this.wapisimoApiClient) {
      return await this.wapisimoApiClient.getConnectionStatus();
    } else {
      // Para Business API, siempre consideramos conectado si está configurado
      return { state: 'connected' };
    }
  }

  async createInstance() {
    if (this.config.provider === 'evolution-api' && this.evolutionApiClient) {
      return await this.evolutionApiClient.createInstance();
    } else if (this.config.provider === 'wapisimo-api' && this.wapisimoApiClient) {
      return await this.wapisimoApiClient.createInstance();
    } else {
      throw new Error('Crear instancia solo disponible con Evolution API y Wapisimo API');
    }
  }
}

// Factory function para crear el manager desde variables de entorno
export function createWhatsAppManagerFromEnv(): WhatsAppManager {
  const provider = (process.env.WHATSAPP_PROVIDER as WhatsAppProvider) || 'business-api';

  const config: WhatsAppConfig = {
    provider,
    businessApi: {
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
    },
    evolutionApi: {
      baseUrl: process.env.EVOLUTION_API_BASE_URL || '',
      instanceName: process.env.EVOLUTION_INSTANCE_NAME || '',
      apiKey: process.env.EVOLUTION_API_KEY || '',
    },
    wapisimoApi: {
      baseUrl: process.env.WAPISIMO_BASE_URL || '',
      instanceId: process.env.WAPISIMO_INSTANCE_ID || '',
      apiKey: process.env.WAPISIMO_API_KEY || '',
    }
  };

  return new WhatsAppManager(config);
}
