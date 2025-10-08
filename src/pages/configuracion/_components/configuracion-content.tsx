
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  MessageSquare, 
  Calendar,
  Brain,
  BarChart3,
  Shield,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  Copy,
  RefreshCw,
  Zap,
  Globe,
  Smartphone,
  Bot,
  Database,
  Heart,
  Home
} from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAuth } from '@/hooks/useAuth';
import SentimentConfig from './sentiment-config';

interface APIConfig {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  apiKey?: string;
  webhook?: string;
  measurementId?: string; // Para Google Analytics
}

export default function ConfiguracionContent() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('apis');
  const [loading, setLoading] = useState<string | null>(null);
  const [groqModels, setGroqModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  const [apiConfigs, setApiConfigs] = useState<Record<string, APIConfig>>({
    meta: {
      name: 'Meta Business API',
      status: 'disconnected',
      apiKey: '',
      webhook: ''
    },
    whatsapp: {
      name: 'WhatsApp Business API',
      status: 'disconnected',
      apiKey: '',
      webhook: ''
    },
    instagram: {
      name: 'Instagram Messaging API',
      status: 'disconnected',
      apiKey: '',
      webhook: ''
    },
    facebook: {
      name: 'Facebook Messenger API',
      status: 'disconnected',
      apiKey: '',
      webhook: ''
    },
    googleCalendar: {
      name: 'Google Calendar API',
      status: 'disconnected',
      apiKey: '',
      webhook: ''
    },
    groq: {
      name: 'Groq AI (Llama 3 8B)',
      status: 'disconnected',
      apiKey: '',
    },
    googleAnalytics: {
      name: 'Google Analytics API',
      status: 'disconnected',
      apiKey: '',
      measurementId: '',
    },
    googlePlaces: {
      name: 'Google Places API',
      status: 'disconnected',
      apiKey: '',
      webhook: ''
    },
    googleReviews: {
      name: 'Google Reviews System',
      status: 'disconnected',
      apiKey: '',
      webhook: ''
    }
  });

  const [aiSettings, setAiSettings] = useState({
    model: 'llama3-8b-8192',
    temperature: 0.7,
    maxTokens: 1000,
    autoResponse: true,
    humanEscalation: true,
    escalationKeywords: ['alergia', 'severa', 'urgente', 'manager', 'compleja'],
    businessInfo: {
      name: 'Jaraquemada',
      location: 'Santiago, Chile',
      hours: 'Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00',
      phone: '+56 9 1234 5678',
      email: 'reservas@jaraquemada.com',
      website: 'https://jaraquemada.com'
    }
  });

  const [whatsappFeatures] = useState([
    { id: 'menu', name: 'Solicitud de Carta/Menú', enabled: true },
    { id: 'reservations', name: 'Gestión de Reservas', enabled: true },
    { id: 'allergies', name: 'Consultas de Alergias', enabled: true },
    { id: 'promotions', name: 'Promociones y Ofertas', enabled: true },
    { id: 'hours', name: 'Horarios de Atención', enabled: true },
    { id: 'location', name: 'Ubicación y Contacto', enabled: true },
    { id: 'events', name: 'Eventos Especiales', enabled: true },
    { id: 'feedback', name: 'Quejas y Sugerencias', enabled: true }
  ]);

  const [whatsappMessages, setWhatsappMessages] = useState({
    welcomeMessage: {
      enabled: true,
      message: `¡Hola! 👋 Bienvenido/a a *Jaraquemada*

🍽️ Para ver nuestra carta completa, simplemente haz clic en *"Ver Carta"* y te enviaremos nuestro menú digital con todos los detalles de nuestros platos.

¿En qué puedo ayudarte hoy?`,
      includeMenuButton: true,
      buttonText: "Ver Carta",
      sendMenuAfterButton: true
    },
    returnIncentive: {
      enabled: true,
      delayHours: 2,
      message: `🎉 ¡Gracias por tu visita a *Jaraquemada*!

Como agradecimiento, tienes un *15% de descuento* en tu próxima visita durante los próximos *30 días*.

🏷️ Código: *VUELVE15*
📅 Válido hasta: {fecha_expiracion}

¡Esperamos verte pronto! 🍽️✨`,
      discountPercentage: 15,
      validityDays: 30,
      generateUniqueCode: true,
      trackUsage: true
    },
    menuDelivery: {
      enabled: true,
      format: 'pdf', // 'pdf', 'image', 'text'
      includeImages: true,
      includePrices: true,
      includeDescriptions: true,
      includeAllergens: true,
      customMessage: `📋 Aquí tienes nuestra carta completa:

🍽️ *Menú Jaraquemada*

¿Te gustaría hacer una reserva? ¡Escríbeme!`
    },
    followUpMessages: {
      enabled: true,
      messages: [
        {
          delay: 90, // minutos
          message: `¡Esperamos que estés disfrutando tu experiencia en *Jaraquemada*! 😊

Si necesitas algo más o tienes alguna pregunta, no dudes en escribirme.

¡Que tengas una excelente comida! 🍽️`
        },
        {
          delay: 24 * 60, // 24 horas después
          message: `¡Hola! 👋

Esperamos que hayas disfrutado mucho tu visita a *Jaraquemada* ayer.

¿Te gustaría dejarnos una reseña en Google? Nos ayuda mucho: 
⭐ {link_google_review}

¡Gracias! 🙏`
        }
      ]
    }
  });

  // Función para cargar configuración desde la API
  const loadConfiguration = async () => {
    try {
      setLoading('load');
      const userId = user?.id;
      if (!userId) {
        console.log('No hay usuario autenticado');
        setLoading(null);
        return;
      }

      const response = await fetch(`/.netlify/functions/config?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Actualizar estados con los datos cargados, haciendo merge con valores existentes
        if (data.apis) {
          console.log('🔍 Datos APIs recibidos del backend:', data.apis);
          console.log('🔍 Google Analytics API Key:', data.apis.googleAnalytics?.apiKey);
          console.log('🔍 Google Analytics Measurement ID:', data.apis.googleAnalytics?.measurementId);
          console.log('🔍 Google Analytics status:', data.apis.googleAnalytics?.status);
          
          setApiConfigs(prev => ({
            ...prev,
            ...data.apis
          }));
          
          // Si hay una API key de Groq válida, cargar los modelos automáticamente
          if (data.apis.groq?.apiKey && data.apis.groq.apiKey.length >= 20) {
            fetchGroqModels(data.apis.groq.apiKey, data.aiSettings?.model);
          }
        }
        
        if (data.aiSettings) {
          setAiSettings(prev => ({
            ...prev,
            ...data.aiSettings,
            businessInfo: data.businessInfo || prev.businessInfo
          }));
        }
        
        if (data.whatsappFeatures) {
          // Actualizar whatsappFeatures si es necesario en el futuro
        }
      } else {
        console.log('ℹ️ No hay configuración guardada, usando valores por defecto');
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(null);
    }
  };

  // Cargar configuración al montar el componente
  useEffect(() => {
    loadConfiguration();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" />Conectado</Badge>;
      case 'error':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />Desconectado</Badge>;
    }
  };

  const testConnection = async (apiType: string) => {
    setLoading(apiType);
    
    try {
      // Mapear configuraciones específicas según el tipo de API
      let config;
      
      if (apiType === 'groq') {
        config = { ...apiConfigs[apiType], model: aiSettings.model };
      } else if (apiType === 'googleAnalytics') {
        config = { propertyId: apiConfigs[apiType].apiKey };
      } else {
        config = apiConfigs[apiType];
      }
        
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiType,
          config
        }),
      });

      const result = await response.json();
      
      setApiConfigs(prev => ({
        ...prev,
        [apiType]: {
          ...prev[apiType],
          status: result.success ? 'connected' : 'error',
          lastSync: new Date(),
          lastError: result.success ? undefined : result.error
        }
      }));

      if (result.success) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ Error: ${result.error}\n${result.details || ''}`);
      }
    } catch (error) {
      console.error('Error probando conexión:', error);
      setApiConfigs(prev => ({
        ...prev,
        [apiType]: {
          ...prev[apiType],
          status: 'error',
          lastError: 'Error de red'
        }
      }));
      alert('❌ Error de conexión. Verifica tu configuración.');
    } finally {
      setLoading(null);
    }
  };

  const handleApiKeyChange = (apiType: string, value: string) => {
    setApiConfigs(prev => ({
      ...prev,
      [apiType]: {
        ...prev[apiType],
        apiKey: value
      }
    }));
    
    // Si es Groq y la API key tiene al menos 20 caracteres, obtener modelos
    if (apiType === 'groq' && value.length >= 20) {
      fetchGroqModels(value);
    }
  };

  const handleMeasurementIdChange = (apiType: string, value: string) => {
    setApiConfigs(prev => ({
      ...prev,
      [apiType]: {
        ...prev[apiType],
        measurementId: value
      }
    }));
  };

  const fetchGroqModels = async (apiKey: string, currentModel?: string) => {
    setLoadingModels(true);
    try {
      const response = await fetch('/api/groq/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        const data = await response.json();
        setGroqModels(data.models || []);
        
        // Si hay modelos disponibles, seleccionar automáticamente el mejor modelo disponible
        if (data.models && data.models.length > 0) {
          // Verificar si el modelo actual está en la lista de modelos disponibles
          const modelToCheck = currentModel || aiSettings.model;
          const currentModelExists = data.models.some((m: any) => m.id === modelToCheck);
          
          if (!currentModelExists) {
            // Seleccionar el primer modelo de la lista (ya están ordenados por prioridad)
            const recommendedModel = data.models[0];
            setAiSettings(prev => ({ ...prev, model: recommendedModel.id }));
          }
        }
        
        // Actualizar el estado de conexión de Groq
        setApiConfigs(prev => ({
          ...prev,
          groq: {
            ...prev.groq,
            status: 'connected'
          }
        }));
      } else {
        const errorData = await response.json();
        console.error('Error obteniendo modelos de Groq:', errorData.error);
        setGroqModels([]);
        
        // Actualizar el estado de conexión de Groq
        setApiConfigs(prev => ({
          ...prev,
          groq: {
            ...prev.groq,
            status: 'error'
          }
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setGroqModels([]);
      
      // Actualizar el estado de conexión de Groq
      setApiConfigs(prev => ({
        ...prev,
        groq: {
          ...prev.groq,
          status: 'error'
        }
      }));
    } finally {
      setLoadingModels(false);
    }
  };

  const copyWebhookURL = (apiType: string) => {
    const webhookUrl = `https://airestaurante.com/api/webhooks/${apiType}`;
    navigator.clipboard.writeText(webhookUrl);
    alert('URL copiada al portapapeles');
  };

  const saveConfiguration = async () => {
    setLoading('save');

    try {
      const userId = user?.id;
      if (!userId) {
        alert('❌ No hay usuario autenticado');
        return;
      }

      console.log('💾 Enviando configuración a guardar:');
      console.log('User ID:', userId);
      console.log('APIs:', apiConfigs);
      console.log('Google Analytics:', apiConfigs.googleAnalytics);
      console.log('Google Analytics apiKey:', apiConfigs.googleAnalytics?.apiKey);
      console.log('Google Analytics measurementId:', apiConfigs.googleAnalytics?.measurementId);
      console.log('AI Settings:', aiSettings);
      console.log('Business Info:', aiSettings.businessInfo);

      const response = await fetch('/.netlify/functions/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          apis: apiConfigs,
          aiSettings,
          businessInfo: aiSettings.businessInfo,
          lastUpdated: new Date().toISOString()
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Configuración guardada exitosamente');
        // Recargar la configuración para asegurar sincronización
        await loadConfiguration();
      } else {
        alert('❌ Error guardando configuración: ' + result.error);
      }
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('❌ Error de red guardando configuración');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Configuración Avanzada</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigation.navigateTo('/')}
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </Button>
        </div>
        <p className="text-gray-600">Sistema completo de integraciones API para AI Restaurante</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 rounded-lg p-1">
          <TabsTrigger 
            value="apis" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
            onClick={() => {
              setActiveTab('apis');
            }}
          >
            <Settings className="w-4 h-4" />
            <span>APIs Externas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ai" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Brain className="w-4 h-4" />
            <span>Configuración IA</span>
          </TabsTrigger>
          <TabsTrigger 
            value="mensajes" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mensajes WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger 
            value="whatsapp" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Smartphone className="w-4 h-4" />
            <span>WhatsApp Features</span>
          </TabsTrigger>
          <TabsTrigger 
            value="advanced" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Shield className="w-4 h-4" />
            <span>Avanzado</span>
          </TabsTrigger>
          <TabsTrigger 
            value="sentiment" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Heart className="w-4 h-4" />
            <span>Análisis IA</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB: APIs Externas */}
        <TabsContent value="apis" className="space-y-6">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>Estado del Sistema</AlertTitle>
            <AlertDescription>
              Configure las APIs necesarias para que AI Restaurante funcione completamente.
              Todas las integraciones son necesarias para el funcionamiento óptimo.
            </AlertDescription>
          </Alert>

          {/* Meta Business APIs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>Meta Business Platform</span>
                  </CardTitle>
                  <CardDescription>
                    Integración con WhatsApp, Instagram y Facebook Messenger
                  </CardDescription>
                </div>
                {getStatusBadge(apiConfigs.meta.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* WhatsApp Business API */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-semibold">WhatsApp Business API</h4>
                      <p className="text-sm text-gray-600">Canal principal de comunicación</p>
                    </div>
                  </div>
                  {getStatusBadge(apiConfigs.whatsapp.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Access Token</Label>
                    <Input
                      type="password"
                      placeholder="EAAxxxxxxxxxxxxx..."
                      value={apiConfigs.whatsapp.apiKey}
                      onChange={(e) => handleApiKeyChange('whatsapp', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone Number ID</Label>
                    <Input
                      placeholder="123456789012345"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="flex items-center space-x-2">
                    <span>Webhook URL</span>
                    <Button size="sm" variant="outline" onClick={() => copyWebhookURL('whatsapp')}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </Label>
                  <Input
                    readOnly
                    value="https://airestaurante.com/api/webhooks/whatsapp"
                    className="bg-gray-50"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => testConnection('whatsapp')}
                    disabled={loading === 'whatsapp'}
                  >
                    {loading === 'whatsapp' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                    Probar Conexión
                  </Button>
                  <Button variant="outline" onClick={() => window.open('https://developers.facebook.com/docs/whatsapp/cloud-api', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Documentación
                  </Button>
                </div>
              </div>

              {/* Instagram */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                    <div>
                      <h4 className="font-semibold">Instagram Messaging API</h4>
                      <p className="text-sm text-gray-600">Mensajes directos de Instagram</p>
                    </div>
                  </div>
                  {getStatusBadge(apiConfigs.instagram.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Instagram Business Account ID</Label>
                    <Input
                      placeholder="17841405309211844"
                      value={apiConfigs.instagram.apiKey}
                      onChange={(e) => handleApiKeyChange('instagram', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Page Access Token</Label>
                    <Input
                      type="password"
                      placeholder="EAAxxxxxxxxxxxxx..."
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => testConnection('instagram')}
                    disabled={loading === 'instagram'}
                  >
                    {loading === 'instagram' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                    Probar Conexión
                  </Button>
                </div>
              </div>

              {/* Facebook Messenger */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-600 rounded"></div>
                    <div>
                      <h4 className="font-semibold">Facebook Messenger API</h4>
                      <p className="text-sm text-gray-600">Mensajes desde Facebook</p>
                    </div>
                  </div>
                  {getStatusBadge(apiConfigs.facebook.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Page Access Token</Label>
                    <Input
                      type="password"
                      placeholder="EAAxxxxxxxxxxxxx..."
                      value={apiConfigs.facebook.apiKey}
                      onChange={(e) => handleApiKeyChange('facebook', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Verify Token</Label>
                    <Input
                      placeholder="your_verify_token"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => testConnection('facebook')}
                    disabled={loading === 'facebook'}
                  >
                    {loading === 'facebook' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                    Probar Conexión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google APIs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-green-500 rounded"></div>
                <span>Google Cloud Platform</span>
              </CardTitle>
              <CardDescription>
                Integración con Google Calendar y Analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Calendar */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">Google Calendar API</h4>
                      <p className="text-sm text-gray-600">Gestión automática de reservas</p>
                    </div>
                  </div>
                  {getStatusBadge(apiConfigs.googleCalendar.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Service Account Key (JSON)</Label>
                    <Input
                      type="password"
                      placeholder="Pegar JSON del Service Account..."
                      value={apiConfigs.googleCalendar.apiKey}
                      onChange={(e) => handleApiKeyChange('googleCalendar', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Calendar ID</Label>
                    <Input
                      placeholder="primary"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => testConnection('googleCalendar')}
                    disabled={loading === 'googleCalendar'}
                  >
                    {loading === 'googleCalendar' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                    Probar Conexión
                  </Button>
                  <Button variant="outline" onClick={() => window.open('https://developers.google.com/calendar/api/quickstart/js', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Guía de Configuración
                  </Button>
                </div>
              </div>

              {/* Google Analytics */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    <div>
                      <h4 className="font-semibold">Google Analytics 4</h4>
                      <p className="text-sm text-gray-600">Métricas y análisis de conversaciones</p>
                    </div>
                  </div>
                  {getStatusBadge(apiConfigs.googleAnalytics.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Property ID</Label>
                    <Input
                      placeholder="123456789"
                      value={apiConfigs.googleAnalytics.apiKey}
                      onChange={(e) => handleApiKeyChange('googleAnalytics', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Measurement ID</Label>
                    <Input
                      placeholder="G-XXXXXXXXXX"
                      value={apiConfigs.googleAnalytics.measurementId}
                      onChange={(e) => handleMeasurementIdChange('googleAnalytics', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => testConnection('googleAnalytics')}
                    disabled={loading === 'googleAnalytics'}
                  >
                    {loading === 'googleAnalytics' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                    Probar Conexión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Places API */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>Google Places API</span>
                  </CardTitle>
                  <CardDescription>
                    Información del negocio y datos de ubicación
                  </CardDescription>
                </div>
                {getStatusBadge(apiConfigs.googlePlaces.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertTitle>Configuración de Negocio</AlertTitle>
                <AlertDescription>
                  Conecta tu restaurante con Google Places para obtener información actualizada 
                  y habilitar funciones de reseñas automáticas.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Google Places API Key</Label>
                  <Input
                    type="password"
                    placeholder="AIzaSyXxxxxxxxxxxxxxxxxxx..."
                    value={apiConfigs.googlePlaces.apiKey}
                    onChange={(e) => handleApiKeyChange('googlePlaces', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Place ID del Restaurante</Label>
                  <Input
                    placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                    value={apiConfigs.googlePlaces.webhook || ''}
                    onChange={(e) => setApiConfigs(prev => ({
                      ...prev,
                      googlePlaces: { ...prev.googlePlaces, webhook: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🔍 ¿Cómo encontrar tu Place ID?</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Ve a <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" className="underline">Google Place ID Finder</a></li>
                  <li>2. Busca tu restaurante por nombre y dirección</li>
                  <li>3. Copia el Place ID que aparece</li>
                  <li>4. Pégalo en el campo de arriba</li>
                </ol>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => testConnection('googlePlaces')}
                  disabled={loading === 'googlePlaces'}
                >
                  {loading === 'googlePlaces' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                  Verificar Place ID
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (apiConfigs.googlePlaces.webhook) {
                      window.open(`https://www.google.com/maps/place/?q=place_id:${apiConfigs.googlePlaces.webhook}`, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver en Maps
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Google Reviews System */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-yellow-600" />
                    <span>Sistema de Reseñas Automáticas</span>
                  </CardTitle>
                  <CardDescription>
                    Solicitudes automáticas de reseñas en Google después de cada reserva
                  </CardDescription>
                </div>
                {getStatusBadge(apiConfigs.googleReviews.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertTitle>🌟 Reseñas Automáticas Inteligentes</AlertTitle>
                <AlertDescription>
                  Sistema completo que envía solicitudes de reseñas automáticamente 2 horas después 
                  de cada reserva, con incentivos personalizados y seguimiento de conversión.
                </AlertDescription>
              </Alert>

              {/* Configuración API - ESTO FALTABA */}
              <div className="border rounded-lg p-4 space-y-4 bg-red-50 border-red-200">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>🔑 APIs Requeridas (IMPORTANTE)</span>
                </h4>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Configuración de API Requerida</AlertTitle>
                  <AlertDescription>
                    Para que funcionen las reseñas automáticas, necesitas configurar estas APIs de Google.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Google My Business API Key</Label>
                    <Input
                      type="password"
                      placeholder="AIzaSyC-dxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={apiConfigs.googleReviews.apiKey}
                      onChange={(e) => handleApiKeyChange('googleReviews', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Necesaria para monitorear y gestionar reseñas
                    </p>
                  </div>
                  
                  <div>
                    <Label>Account ID de Google My Business</Label>
                    <Input
                      placeholder="123456789012345678"
                      value={apiConfigs.googleReviews.webhook || ''}
                      onChange={(e) => setApiConfigs(prev => ({
                        ...prev,
                        googleReviews: { ...prev.googleReviews, webhook: e.target.value }
                      }))}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      ID de tu cuenta de Google My Business
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">📋 Pasos para obtener las APIs:</h4>
                  <ol className="text-sm text-yellow-800 space-y-1">
                    <li>1. <a href="https://console.cloud.google.com/apis/library/mybusiness.googleapis.com" target="_blank" className="underline">Habilita Google My Business API</a></li>
                    <li>2. <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="underline">Crea credenciales API Key</a></li>
                    <li>3. <a href="https://www.google.com/business/" target="_blank" className="underline">Ve a Google My Business</a> y obtén tu Account ID</li>
                    <li>4. Pega las credenciales en los campos de arriba</li>
                  </ol>
                </div>
              </div>

              {/* Configuración básica */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Configuración del Sistema</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Delay de Envío (horas)</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      min="0.5"
                      max="72"
                      step="0.5"
                      defaultValue="2"
                    />
                    <p className="text-xs text-gray-600 mt-1">Tiempo después de la reserva</p>
                  </div>
                  <div>
                    <Label>Canal Preferido</Label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="whatsapp">WhatsApp (principal)</option>
                      <option value="email">Email (respaldo)</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch defaultChecked />
                    <Label className="text-sm">Sistema activo</Label>
                  </div>
                </div>
              </div>

              {/* Configuración de incentivos */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Incentivos Automáticos</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <div>
                      <Label className="text-sm font-medium">Incluir incentivos</Label>
                      <p className="text-xs text-gray-600">Códigos de descuento por reseñar</p>
                    </div>
                  </div>
                  <div>
                    <Label>Descuento (%)</Label>
                    <Input
                      type="number"
                      placeholder="15"
                      min="5"
                      max="50"
                      defaultValue="15"
                    />
                  </div>
                  <div>
                    <Label>Validez del código (días)</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      min="7"
                      max="365"
                      defaultValue="30"
                    />
                  </div>
                  <div>
                    <Label>Texto del incentivo</Label>
                    <Input
                      placeholder="15% descuento en tu próxima visita"
                      defaultValue="15% descuento en tu próxima visita"
                    />
                  </div>
                </div>
              </div>

              {/* Configuración de mensajes */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Personalización de Mensajes</span>
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <Label>Mensaje para clientes VIP</Label>
                    <Input
                      placeholder="Estimado {nombre}, como cliente VIP valoramos tu opinión..."
                      defaultValue="🥇 Estimado/a {nombre}, como cliente VIP de {restaurante}, tu opinión es muy valiosa..."
                    />
                  </div>
                  <div>
                    <Label>Mensaje para primera visita</Label>
                    <Input
                      placeholder="¡Hola {nombre}! Fue un placer recibirte por primera vez..."
                      defaultValue="👋 ¡Hola {nombre}! ¡Fue un placer recibirte por primera vez en {restaurante}!"
                    />
                  </div>
                  <div>
                    <Label>Mensaje estándar</Label>
                    <Input
                      placeholder="Hola {nombre}, esperamos que hayas disfrutado..."
                      defaultValue="🌟 ¡Hola {nombre}! Esperamos que hayas disfrutado tu experiencia en {restaurante}."
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Variables disponibles:</strong> {'{nombre}'}, {'{restaurante}'}, {'{codigo_descuento}'}, {'{link_resena}'}
                  </p>
                </div>
              </div>

              {/* Configuración ML y Segmentación */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>IA y Segmentación Avanzada</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <div>
                      <Label className="text-sm font-medium">Timing inteligente</Label>
                      <p className="text-xs text-gray-600">IA optimiza horario de envío</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <div>
                      <Label className="text-sm font-medium">Segmentación automática</Label>
                      <p className="text-xs text-gray-600">Mensajes personalizados por tipo de cliente</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <div>
                      <Label className="text-sm font-medium">A/B Testing</Label>
                      <p className="text-xs text-gray-600">Probar diferentes mensajes automáticamente</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <div>
                      <Label className="text-sm font-medium">Predicción de satisfacción</Label>
                      <p className="text-xs text-gray-600">Solo enviar a clientes probablemente satisfechos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas y resultados */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">📊 Resultados Esperados</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">95%</div>
                    <div className="text-xs text-purple-800">Tasa de envío</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">75%</div>
                    <div className="text-xs text-blue-800">Tasa de apertura</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">30%</div>
                    <div className="text-xs text-green-800">Tasa de click</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">20%</div>
                    <div className="text-xs text-yellow-800">Tasa de reseñas</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => testConnection('googleReviews')}
                  disabled={loading === 'googleReviews'}
                >
                  {loading === 'googleReviews' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                  Probar Sistema
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/reportes?tab=reviews';
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Métricas
                </Button>
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => {
                    alert('🚀 Sistema de reseñas automáticas activado!\n\n✅ Se enviarán solicitudes 2h después de cada reserva\n✅ Incentivos automáticos incluidos\n✅ IA optimizando timing y mensajes\n✅ Dashboard de métricas disponible');
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Activar Sistema
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Groq AI */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span>Groq AI Platform</span>
                  </CardTitle>
                  <CardDescription>
                    {aiSettings.model ? `${aiSettings.model} - ` : ''}Motor de inteligencia artificial principal
                  </CardDescription>
                </div>
                {getStatusBadge(apiConfigs.groq.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Bot className="h-4 w-4" />
                <AlertTitle>Motor Principal de IA</AlertTitle>
                <AlertDescription>
                  Esta es la IA que procesará todas las conversaciones y tomará decisiones automáticas.
                  {groqModels.length > 0 && aiSettings.model 
                    ? `Modelo actual: ${aiSettings.model}`
                    : 'Configura tu API Key de Groq para ver los modelos disponibles.'
                  }
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center h-5">Groq API Key</Label>
                  <Input
                    type="password"
                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxx..."
                    value={apiConfigs.groq.apiKey}
                    onChange={(e) => handleApiKeyChange('groq', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 h-5">
                    Modelo
                    {loadingModels && (
                      <RefreshCw className="w-3 h-3 animate-spin text-gray-500" />
                    )}
                  </Label>
                  {loadingModels ? (
                    <div className="flex items-center justify-center h-10 border rounded-md bg-gray-50">
                      <span className="text-sm text-gray-500">Cargando modelos...</span>
                    </div>
                  ) : groqModels.length > 0 ? (
                    <Select
                      value={aiSettings.model}
                      onValueChange={(value) => setAiSettings(prev => ({ ...prev, model: value }))}
                    >
                      <SelectTrigger className="!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !px-3 !py-2 !text-sm !ring-offset-background !items-center !justify-between">
                        <SelectValue placeholder="Seleccionar modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {groqModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{model.id}</span>
                              <div className="flex gap-2 text-xs text-gray-500">
                                {model.context_window && (
                                  <span>Context: {(model.context_window / 1000).toFixed(0)}K tokens</span>
                                )}
                                {model.max_completion_tokens && (
                                  <span>Max: {(model.max_completion_tokens / 1000).toFixed(0)}K tokens</span>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="relative">
                      <Input
                        value={aiSettings.model || ""}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, model: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ingrese el modelo Groq"
                      />
                    </div>
                  )}
                  {groqModels.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      ✅ {groqModels.length} modelos disponibles cargados
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => testConnection('groq')}
                  disabled={loading === 'groq'}
                >
                  {loading === 'groq' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                  Probar IA
                </Button>
                <Button variant="outline" onClick={() => window.open('https://console.groq.com/', '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Groq Console
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Configuración IA */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Motor de IA</CardTitle>
              <CardDescription>
                Ajustes específicos para el comportamiento de Llama 3 8B
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Temperatura (Creatividad)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={aiSettings.temperature}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">0.1 = Conservador, 1.0 = Creativo</p>
                </div>
                
                <div>
                  <Label>Tokens Máximos</Label>
                  <Input
                    type="number"
                    min="100"
                    max="8192"
                    value={aiSettings.maxTokens}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Longitud máxima de respuestas</p>
                </div>
                
                <div>
                  <Label>Modelo</Label>
                  <Input
                    readOnly
                    value={aiSettings.model}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Respuesta Automática</h4>
                    <p className="text-sm text-gray-600">La IA responde automáticamente a consultas simples</p>
                  </div>
                  <Switch
                    checked={aiSettings.autoResponse}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, autoResponse: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Escalación Humana</h4>
                    <p className="text-sm text-gray-600">Derivar consultas complejas a agentes humanos</p>
                  </div>
                  <Switch
                    checked={aiSettings.humanEscalation}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, humanEscalation: checked }))}
                  />
                </div>
              </div>

              <div>
                <Label>Palabras Clave para Escalación</Label>
                <Input
                  value={aiSettings.escalationKeywords.join(', ')}
                  onChange={(e) => setAiSettings(prev => ({ 
                    ...prev, 
                    escalationKeywords: e.target.value.split(', ').filter(k => k.length > 0)
                  }))}
                  placeholder="alergia, severa, urgente, manager..."
                />
                <p className="text-xs text-gray-500 mt-1">Separar con comas</p>
              </div>
            </CardContent>
          </Card>

          {/* Información del Negocio */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Restaurante</CardTitle>
              <CardDescription>
                Datos que la IA usará para responder consultas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre del Restaurante</Label>
                  <Input
                    value={aiSettings.businessInfo.name}
                    onChange={(e) => setAiSettings(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, name: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <Label>Ubicación</Label>
                  <Input
                    value={aiSettings.businessInfo.location}
                    onChange={(e) => setAiSettings(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, location: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Horarios de Atención</Label>
                <Input
                  value={aiSettings.businessInfo.hours}
                  onChange={(e) => setAiSettings(prev => ({
                    ...prev,
                    businessInfo: { ...prev.businessInfo, hours: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={aiSettings.businessInfo.phone}
                    onChange={(e) => setAiSettings(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, phone: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <Label>Email</Label>
                  <Input
                    value={aiSettings.businessInfo.email}
                    onChange={(e) => setAiSettings(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, email: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <Label>Website</Label>
                  <Input
                    value={aiSettings.businessInfo.website}
                    onChange={(e) => setAiSettings(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, website: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Mensajes WhatsApp */}
        <TabsContent value="mensajes" className="space-y-6">
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertTitle>Configuración de Mensajes Automáticos</AlertTitle>
            <AlertDescription>
              Configure los mensajes que se envían automáticamente a los clientes cuando escanean QR, 
              después de su visita, y para incentivar su retorno.
            </AlertDescription>
          </Alert>

          {/* Mensaje de Bienvenida y Carta */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <span>Mensaje de Bienvenida con Carta</span>
                  </CardTitle>
                  <CardDescription>
                    Mensaje que se envía automáticamente cuando el cliente escanea el QR
                  </CardDescription>
                </div>
                <Switch
                  checked={whatsappMessages.welcomeMessage.enabled}
                  onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                    ...prev,
                    welcomeMessage: { ...prev.welcomeMessage, enabled: checked }
                  }))}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Mensaje de Bienvenida</Label>
                <textarea
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none"
                  value={whatsappMessages.welcomeMessage.message}
                  onChange={(e) => setWhatsappMessages(prev => ({
                    ...prev,
                    welcomeMessage: { ...prev.welcomeMessage, message: e.target.value }
                  }))}
                  placeholder="Mensaje que verá el cliente al escanear el QR..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables disponibles: {'{nombre_restaurante}'}, {'{cliente_nombre}'}
                </p>
              </div>

              <div className="border rounded-lg p-4 space-y-4 bg-green-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Botón "Ver Carta"</h4>
                    <p className="text-sm text-gray-600">Agregar botón interactivo para enviar la carta</p>
                  </div>
                  <Switch
                    checked={whatsappMessages.welcomeMessage.includeMenuButton}
                    onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                      ...prev,
                      welcomeMessage: { ...prev.welcomeMessage, includeMenuButton: checked }
                    }))}
                  />
                </div>
                
                {whatsappMessages.welcomeMessage.includeMenuButton && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Texto del Botón</Label>
                      <Input
                        value={whatsappMessages.welcomeMessage.buttonText}
                        onChange={(e) => setWhatsappMessages(prev => ({
                          ...prev,
                          welcomeMessage: { ...prev.welcomeMessage, buttonText: e.target.value }
                        }))}
                        placeholder="Ver Carta"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={whatsappMessages.welcomeMessage.sendMenuAfterButton}
                        onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                          ...prev,
                          welcomeMessage: { ...prev.welcomeMessage, sendMenuAfterButton: checked }
                        }))}
                      />
                      <Label className="text-sm">Enviar carta automáticamente al hacer clic</Label>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📱 Vista Previa del Mensaje</h4>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm whitespace-pre-line">
                    {whatsappMessages.welcomeMessage.message}
                  </div>
                  {whatsappMessages.welcomeMessage.includeMenuButton && (
                    <div className="mt-3">
                      <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm">
                        {whatsappMessages.welcomeMessage.buttonText}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Entrega de Carta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-500" />
                <span>Configuración de Entrega de Carta</span>
              </CardTitle>
              <CardDescription>
                Personaliza cómo se entrega la carta digital a los clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Formato de Carta</Label>
                  <Select 
                    value={whatsappMessages.menuDelivery.format}
                    onValueChange={(value) => setWhatsappMessages(prev => ({
                      ...prev,
                      menuDelivery: { ...prev.menuDelivery, format: value as 'pdf' | 'image' | 'text' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Interactivo</SelectItem>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="text">Texto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={whatsappMessages.menuDelivery.includePrices}
                    onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                      ...prev,
                      menuDelivery: { ...prev.menuDelivery, includePrices: checked }
                    }))}
                  />
                  <Label className="text-sm">Incluir precios</Label>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={whatsappMessages.menuDelivery.includeImages}
                    onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                      ...prev,
                      menuDelivery: { ...prev.menuDelivery, includeImages: checked }
                    }))}
                  />
                  <Label className="text-sm">Incluir imágenes</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={whatsappMessages.menuDelivery.includeDescriptions}
                    onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                      ...prev,
                      menuDelivery: { ...prev.menuDelivery, includeDescriptions: checked }
                    }))}
                  />
                  <Label className="text-sm">Incluir descripciones de platos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={whatsappMessages.menuDelivery.includeAllergens}
                    onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                      ...prev,
                      menuDelivery: { ...prev.menuDelivery, includeAllergens: checked }
                    }))}
                  />
                  <Label className="text-sm">Incluir información de alergenos</Label>
                </div>
              </div>

              <div>
                <Label>Mensaje que acompaña la carta</Label>
                <textarea
                  className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md resize-none"
                  value={whatsappMessages.menuDelivery.customMessage}
                  onChange={(e) => setWhatsappMessages(prev => ({
                    ...prev,
                    menuDelivery: { ...prev.menuDelivery, customMessage: e.target.value }
                  }))}
                  placeholder="Mensaje que acompaña el envío de la carta..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Mensaje de Incentivo para Volver */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Mensaje de Incentivo para Volver (30 días)</span>
                  </CardTitle>
                  <CardDescription>
                    Mensaje con descuento que se envía automáticamente después de la visita
                  </CardDescription>
                </div>
                <Switch
                  checked={whatsappMessages.returnIncentive.enabled}
                  onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                    ...prev,
                    returnIncentive: { ...prev.returnIncentive, enabled: checked }
                  }))}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Delay de envío (horas)</Label>
                  <Input
                    type="number"
                    min="0.5"
                    max="72"
                    step="0.5"
                    value={whatsappMessages.returnIncentive.delayHours}
                    onChange={(e) => setWhatsappMessages(prev => ({
                      ...prev,
                      returnIncentive: { ...prev.returnIncentive, delayHours: parseFloat(e.target.value) }
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Tiempo después de la visita</p>
                </div>
                <div>
                  <Label>Descuento (%)</Label>
                  <Input
                    type="number"
                    min="5"
                    max="50"
                    value={whatsappMessages.returnIncentive.discountPercentage}
                    onChange={(e) => setWhatsappMessages(prev => ({
                      ...prev,
                      returnIncentive: { ...prev.returnIncentive, discountPercentage: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Validez (días)</Label>
                  <Input
                    type="number"
                    min="7"
                    max="365"
                    value={whatsappMessages.returnIncentive.validityDays}
                    onChange={(e) => setWhatsappMessages(prev => ({
                      ...prev,
                      returnIncentive: { ...prev.returnIncentive, validityDays: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Mensaje del Incentivo</Label>
                <textarea
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none"
                  value={whatsappMessages.returnIncentive.message}
                  onChange={(e) => setWhatsappMessages(prev => ({
                    ...prev,
                    returnIncentive: { ...prev.returnIncentive, message: e.target.value }
                  }))}
                  placeholder="Mensaje con el incentivo para volver..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables: {'{fecha_expiracion}'}, {'{codigo_descuento}'}, {'{porcentaje_descuento}'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={whatsappMessages.returnIncentive.generateUniqueCode}
                    onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                      ...prev,
                      returnIncentive: { ...prev.returnIncentive, generateUniqueCode: checked }
                    }))}
                  />
                  <div>
                    <Label className="text-sm font-medium">Generar código único</Label>
                    <p className="text-xs text-gray-600">Crear código único por cliente</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={whatsappMessages.returnIncentive.trackUsage}
                    onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                      ...prev,
                      returnIncentive: { ...prev.returnIncentive, trackUsage: checked }
                    }))}
                  />
                  <div>
                    <Label className="text-sm font-medium">Seguimiento de uso</Label>
                    <p className="text-xs text-gray-600">Rastrear si se usó el descuento</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">🎯 Vista Previa del Mensaje</h4>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm whitespace-pre-line">
                    {whatsappMessages.returnIncentive.message
                      .replace('{fecha_expiracion}', new Date(Date.now() + whatsappMessages.returnIncentive.validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'))
                      .replace('{codigo_descuento}', 'VUELVE15')
                      .replace('{porcentaje_descuento}', whatsappMessages.returnIncentive.discountPercentage.toString())}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensajes de Seguimiento */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCw className="w-5 h-5 text-purple-500" />
                    <span>Mensajes de Seguimiento Automático</span>
                  </CardTitle>
                  <CardDescription>
                    Mensajes adicionales que se envían en momentos específicos
                  </CardDescription>
                </div>
                <Switch
                  checked={whatsappMessages.followUpMessages.enabled}
                  onCheckedChange={(checked) => setWhatsappMessages(prev => ({
                    ...prev,
                    followUpMessages: { ...prev.followUpMessages, enabled: checked }
                  }))}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {whatsappMessages.followUpMessages.messages.map((msg, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Mensaje #{index + 1} - {msg.delay >= 60 ? `${(msg.delay / 60).toFixed(0)} horas` : `${msg.delay} minutos`} después
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newMessages = whatsappMessages.followUpMessages.messages.filter((_, i) => i !== index);
                        setWhatsappMessages(prev => ({
                          ...prev,
                          followUpMessages: { ...prev.followUpMessages, messages: newMessages }
                        }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Delay (minutos)</Label>
                      <Input
                        type="number"
                        min="5"
                        max="10080" // 7 días
                        value={msg.delay}
                        onChange={(e) => {
                          const newMessages = [...whatsappMessages.followUpMessages.messages];
                          newMessages[index] = { ...newMessages[index], delay: parseInt(e.target.value) };
                          setWhatsappMessages(prev => ({
                            ...prev,
                            followUpMessages: { ...prev.followUpMessages, messages: newMessages }
                          }));
                        }}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label>Mensaje</Label>
                      <textarea
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md resize-none"
                        value={msg.message}
                        onChange={(e) => {
                          const newMessages = [...whatsappMessages.followUpMessages.messages];
                          newMessages[index] = { ...newMessages[index], message: e.target.value };
                          setWhatsappMessages(prev => ({
                            ...prev,
                            followUpMessages: { ...prev.followUpMessages, messages: newMessages }
                          }));
                        }}
                        placeholder="Mensaje de seguimiento..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => {
                  setWhatsappMessages(prev => ({
                    ...prev,
                    followUpMessages: {
                      ...prev.followUpMessages,
                      messages: [
                        ...prev.followUpMessages.messages,
                        {
                          delay: 60, // 1 hora por defecto
                          message: "Mensaje de seguimiento personalizado..."
                        }
                      ]
                    }
                  }));
                }}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Agregar Mensaje de Seguimiento
              </Button>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex space-x-4">
            <Button
              onClick={() => {
                // Probar mensaje de bienvenida
                const testMessage = whatsappMessages.welcomeMessage.message;
                window.open(`https://wa.me/?text=${encodeURIComponent(testMessage)}`, '_blank');
              }}
              variant="outline"
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Probar Mensaje de Bienvenida
            </Button>
            <Button
              onClick={() => {
                // Probar mensaje de incentivo
                const testMessage = whatsappMessages.returnIncentive.message
                  .replace('{fecha_expiracion}', new Date(Date.now() + whatsappMessages.returnIncentive.validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'))
                  .replace('{codigo_descuento}', 'VUELVE15')
                  .replace('{porcentaje_descuento}', whatsappMessages.returnIncentive.discountPercentage.toString());
                window.open(`https://wa.me/?text=${encodeURIComponent(testMessage)}`, '_blank');
              }}
              variant="outline"
              className="flex-1"
            >
              <Zap className="w-4 h-4 mr-2" />
              Probar Mensaje de Incentivo
            </Button>
            <Button
              onClick={async () => {
                setLoading('save');
                try {
                  // Simular guardado
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  
                  // Mostrar SweetAlert2 con éxito
                  const { default: Swal } = await import('sweetalert2');
                  await Swal.fire({
                    title: '¡Configuración Guardada!',
                    text: 'Los mensajes automáticos de WhatsApp han sido configurados correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#10B981'
                  });
                } catch (error) {
                  const { default: Swal } = await import('sweetalert2');
                  await Swal.fire({
                    title: 'Error',
                    text: 'No se pudo guardar la configuración. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#EF4444'
                  });
                } finally {
                  setLoading(null);
                }
              }}
              disabled={loading === 'save'}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading === 'save' ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Guardar Configuración
            </Button>
          </div>
        </TabsContent>

        {/* TAB: WhatsApp Features */}
        <TabsContent value="whatsapp" className="space-y-6">
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertTitle>Canal Principal de Comunicación</AlertTitle>
            <AlertDescription>
              WhatsApp será el canal principal donde los clientes podrán realizar todas las gestiones.
              Configure qué funcionalidades estarán disponibles.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades de WhatsApp</CardTitle>
              <CardDescription>
                Seleccione las funciones que la IA podrá manejar automáticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whatsappFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-gray-600">
                        {feature.id === 'menu' && 'Envío automático de carta y especialidades'}
                        {feature.id === 'reservations' && 'Crear, modificar y cancelar reservas'}
                        {feature.id === 'allergies' && 'Consultas sobre ingredientes y alergias'}
                        {feature.id === 'promotions' && 'Información sobre ofertas activas'}
                        {feature.id === 'hours' && 'Horarios de atención y disponibilidad'}
                        {feature.id === 'location' && 'Dirección, mapa y contacto'}
                        {feature.id === 'events' && 'Eventos especiales y celebraciones'}
                        {feature.id === 'feedback' && 'Gestión de quejas y sugerencias'}
                      </p>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => {
                        // Actualizar estado
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plantillas de Respuesta */}
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Respuesta Automática</CardTitle>
              <CardDescription>
                Mensajes predefinidos que la IA usará en situaciones específicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Mensaje de Bienvenida</Label>
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows={3}
                  defaultValue="¡Hola! Bienvenido a Jaraquemada 🍽️ Soy tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo ayudarte con reservas, nuestra carta, horarios y más."
                />
              </div>

              <div>
                <Label>Mensaje de Escalación</Label>
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows={3}
                  defaultValue="He detectado que tu consulta requiere atención especializada. Un agente humano se comunicará contigo en breve para darte la mejor asistencia posible."
                />
              </div>

              <div>
                <Label>Mensaje Fuera de Horario</Label>
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows={3}
                  defaultValue="Gracias por contactarnos. Actualmente estamos fuera del horario de atención. Te responderemos cuando abramos: {hours}. ¡Que tengas un buen día!"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Configuración Avanzada */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Configuración Avanzada</span>
              </CardTitle>
              <CardDescription>
                Configuraciones técnicas y de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>¡Atención!</AlertTitle>
                <AlertDescription>
                  Estas configuraciones afectan el funcionamiento del sistema. 
                  Modificar sin conocimiento puede causar errores.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Webhook Secret</Label>
                  <Input
                    type="password"
                    placeholder="webhook_secret_key_here"
                  />
                  <p className="text-xs text-gray-500 mt-1">Clave secreta para validar webhooks</p>
                </div>

                <div>
                  <Label>Rate Limit (requests/minute)</Label>
                  <Input
                    type="number"
                    defaultValue="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">Límite de solicitudes por minuto</p>
                </div>

                <div>
                  <Label>Timeout (seconds)</Label>
                  <Input
                    type="number"
                    defaultValue="30"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tiempo máximo de espera para respuestas API</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Logs Detallados</h4>
                    <p className="text-sm text-gray-600">Guardar logs completos de conversaciones</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Modo Debug</h4>
                    <p className="text-sm text-gray-600">Mostrar información adicional de depuración</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Base de Datos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Base de Datos</span>
              </CardTitle>
              <CardDescription>
                Estado y mantenimiento de la base de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.3GB</div>
                  <div className="text-sm text-gray-600">Tamaño DB</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1,247</div>
                  <div className="text-sm text-gray-600">Conversaciones</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Optimizar DB
                </Button>
                <Button variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Backup Manual
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Análisis de Sentimiento con IA */}
        <TabsContent value="sentiment" className="space-y-6">
          <SentimentConfig />
        </TabsContent>
      </Tabs>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button variant="outline" onClick={() => {
          if (window.confirm('¿Estás seguro de que deseas restaurar todos los valores por defecto? Esta acción no se puede deshacer.')) {
            // Restaurar configuraciones por defecto
            setApiConfigs({
              meta: { name: 'Meta Business API', status: 'disconnected', apiKey: '', webhook: '' },
              whatsapp: { name: 'WhatsApp Business API', status: 'disconnected', apiKey: '', webhook: '' },
              instagram: { name: 'Instagram Messaging API', status: 'disconnected', apiKey: '', webhook: '' },
              facebook: { name: 'Facebook Messenger API', status: 'disconnected', apiKey: '', webhook: '' },
              googleCalendar: { name: 'Google Calendar API', status: 'disconnected', apiKey: '', webhook: '' },
              groq: { name: 'Groq AI (Llama 3 8B)', status: 'disconnected', apiKey: '' },
              googleAnalytics: { name: 'Google Analytics API', status: 'disconnected', apiKey: '' },
              googlePlaces: { name: 'Google Places API', status: 'disconnected', apiKey: '', webhook: '' },
              googleReviews: { name: 'Google Reviews System', status: 'disconnected', apiKey: '', webhook: '' }
            });
            
            setAiSettings({
              model: 'llama3-8b-8192',
              temperature: 0.7,
              maxTokens: 1000,
              autoResponse: true,
              humanEscalation: true,
              escalationKeywords: ['alergia', 'severa', 'urgente', 'manager', 'compleja'],
              businessInfo: {
                name: 'Jaraquemada',
                location: 'Santiago, Chile',
                hours: 'Lun-Jue: 12:00-23:00, Vie-Sáb: 12:00-01:00, Dom: 12:00-22:00',
                phone: '+56 9 1234 5678',
                email: 'reservas@jaraquemada.com',
                website: 'https://jaraquemada.com'
              }
            });
            
            alert('✅ Configuración restaurada a valores por defecto');
          }
        }}>
          Restaurar Valores por Defecto
        </Button>
        <Button onClick={saveConfiguration} disabled={loading === 'save'}>
          {loading === 'save' ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
