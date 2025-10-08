
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2, MessageCircle, QrCode, Smartphone, Zap } from 'lucide-react';
import Swal from 'sweetalert2';

type WhatsAppProvider = 'business-api' | 'evolution-api' | 'wapisimo-api';

interface WhatsAppConfig {
  provider: WhatsAppProvider;
  businessApi: {
    accessToken: string;
    phoneNumberId: string;
    verifyToken: string;
  };
  evolutionApi: {
    baseUrl: string;
    instanceName: string;
    apiKey: string;
  };
  wapisimoApi: {
    baseUrl: string;
    instanceId: string;
    apiKey: string;
  };
}

export default function WhatsAppConfigContent() {
  const [config, setConfig] = useState<WhatsAppConfig>({
    provider: 'business-api',
    businessApi: {
      accessToken: '',
      phoneNumberId: '',
      verifyToken: ''
    },
    evolutionApi: {
      baseUrl: '',
      instanceName: '',
      apiKey: ''
    },
    wapisimoApi: {
      baseUrl: '',
      instanceId: '',
      apiKey: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    businessApi: 'disconnected' | 'connected' | 'error';
    evolutionApi: 'disconnected' | 'connected' | 'error';
    wapisimoApi: 'disconnected' | 'connected' | 'error';
  }>({
    businessApi: 'disconnected',
    evolutionApi: 'disconnected',
    wapisimoApi: 'disconnected'
  });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  // Cargar configuración actual
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const response = await fetch('/api/configuration/whatsapp');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        checkConnectionStatus();
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp/status');
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus(data);
      }
    } catch (error) {
      console.error('Error verificando estado:', error);
    }
  };

  const handleSaveConfiguration = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/configuration/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: '¡Configuración Guardada!',
          text: 'La configuración de WhatsApp se ha guardado correctamente.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#10B981'
        });
        
        await checkConnectionStatus();
      } else {
        throw new Error('Error guardando configuración');
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la configuración. Verifica los datos e intenta nuevamente.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: config.provider }),
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: '¡Conexión Exitosa!',
          text: 'La conexión con WhatsApp se realizó correctamente.',
          confirmButtonText: 'Genial',
          confirmButtonColor: '#10B981'
        });
        
        await checkConnectionStatus();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error en la conexión');
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'No se pudo conectar con WhatsApp. Verifica la configuración.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetQRCode = async () => {
    if (config.provider !== 'evolution-api') return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/whatsapp/qr-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
        setShowQRCode(true);
      } else {
        throw new Error('Error obteniendo QR');
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar el código QR. Verifica la configuración de Evolution API.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Proveedor */}
      <Card>
        <CardHeader>
          <CardTitle>Proveedor de WhatsApp</CardTitle>
          <CardDescription>
            Selecciona qué sistema de WhatsApp quieres usar para tu restaurante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp Business API */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                config.provider === 'business-api' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setConfig(prev => ({ ...prev, provider: 'business-api' }))}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  config.provider === 'business-api' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">WhatsApp Business API</h3>
                  <p className="text-sm text-gray-600">Oficial de Facebook/Meta</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Más estable y confiable
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Soporte oficial
                </div>
                <div className="flex items-center text-yellow-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Requiere verificación empresarial
                </div>
              </div>
              <Badge 
                className={`mt-2 ${getStatusColor(connectionStatus.businessApi)}`}
              >
                {getStatusIcon(connectionStatus.businessApi)}
                <span className="ml-1">
                  {connectionStatus.businessApi === 'connected' ? 'Conectado' : 
                   connectionStatus.businessApi === 'error' ? 'Error' : 'Desconectado'}
                </span>
              </Badge>
            </div>

            {/* Evolution API */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                config.provider === 'evolution-api' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setConfig(prev => ({ ...prev, provider: 'evolution-api' }))}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  config.provider === 'evolution-api' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Evolution API</h3>
                  <p className="text-sm text-gray-600">Open-source y flexible</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Más funcionalidades avanzadas
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  No requiere verificación
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Botones y listas interactivas
                </div>
              </div>
              <Badge 
                className={`mt-2 ${getStatusColor(connectionStatus.evolutionApi)}`}
              >
                {getStatusIcon(connectionStatus.evolutionApi)}
                <span className="ml-1">
                  {connectionStatus.evolutionApi === 'connected' ? 'Conectado' : 
                   connectionStatus.evolutionApi === 'error' ? 'Error' : 'Desconectado'}
                </span>
              </Badge>
            </div>

            {/* Wapisimo API */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                config.provider === 'wapisimo-api' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setConfig(prev => ({ ...prev, provider: 'wapisimo-api' }))}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  config.provider === 'wapisimo-api' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Wapisimo API</h3>
                  <p className="text-sm text-gray-600">Profesional y completo</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Botones interactivos
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Setup rápido y fácil
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Muy estable y confiable
                </div>
              </div>
              <Badge 
                className={`mt-2 ${getStatusColor(connectionStatus.wapisimoApi)}`}
              >
                {getStatusIcon(connectionStatus.wapisimoApi)}
                <span className="ml-1">
                  {connectionStatus.wapisimoApi === 'connected' ? 'Conectado' : 
                   connectionStatus.wapisimoApi === 'error' ? 'Error' : 'Desconectado'}
                </span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración específica */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de {
            config.provider === 'business-api' ? 'WhatsApp Business API' : 
            config.provider === 'evolution-api' ? 'Evolution API' : 
            'Wapisimo API'
          }</CardTitle>
          <CardDescription>
            Configura las credenciales y parámetros necesarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {config.provider === 'business-api' ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={config.businessApi.accessToken}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    businessApi: { ...prev.businessApi, accessToken: e.target.value }
                  }))}
                  placeholder="Token de acceso de Facebook Developer"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  value={config.businessApi.phoneNumberId}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    businessApi: { ...prev.businessApi, phoneNumberId: e.target.value }
                  }))}
                  placeholder="ID del número de teléfono"
                />
              </div>
              <div>
                <Label htmlFor="verifyToken">Verify Token</Label>
                <Input
                  id="verifyToken"
                  value={config.businessApi.verifyToken}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    businessApi: { ...prev.businessApi, verifyToken: e.target.value }
                  }))}
                  placeholder="Token para verificar webhook"
                />
              </div>
            </div>
          ) : config.provider === 'evolution-api' ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="baseUrl">URL Base de Evolution API</Label>
                <Input
                  id="baseUrl"
                  value={config.evolutionApi.baseUrl}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    evolutionApi: { ...prev.evolutionApi, baseUrl: e.target.value }
                  }))}
                  placeholder="https://evolution-api.tu-servidor.com"
                />
              </div>
              <div>
                <Label htmlFor="instanceName">Nombre de Instancia</Label>
                <Input
                  id="instanceName"
                  value={config.evolutionApi.instanceName}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    evolutionApi: { ...prev.evolutionApi, instanceName: e.target.value }
                  }))}
                  placeholder="jaraquemada-whatsapp"
                />
              </div>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={config.evolutionApi.apiKey}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    evolutionApi: { ...prev.evolutionApi, apiKey: e.target.value }
                  }))}
                  placeholder="Tu clave de API de Evolution"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="wapisimoBaseUrl">URL Base de Wapisimo</Label>
                <Input
                  id="wapisimoBaseUrl"
                  value={config.wapisimoApi.baseUrl}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    wapisimoApi: { ...prev.wapisimoApi, baseUrl: e.target.value }
                  }))}
                  placeholder="https://app.wapisimo.dev"
                />
              </div>
              <div>
                <Label htmlFor="instanceId">Instance ID</Label>
                <Input
                  id="instanceId"
                  value={config.wapisimoApi.instanceId}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    wapisimoApi: { ...prev.wapisimoApi, instanceId: e.target.value }
                  }))}
                  placeholder="jaraquemada_instance"
                />
              </div>
              <div>
                <Label htmlFor="wapisimoApiKey">API Key</Label>
                <Input
                  id="wapisimoApiKey"
                  type="password"
                  value={config.wapisimoApi.apiKey}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    wapisimoApi: { ...prev.wapisimoApi, apiKey: e.target.value }
                  }))}
                  placeholder="Tu clave de API de Wapisimo"
                />
              </div>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <Button 
              onClick={handleSaveConfiguration} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              {isLoading ? 'Probando...' : 'Probar Conexión'}
            </Button>
            {(config.provider === 'evolution-api' || config.provider === 'wapisimo-api') && (
              <Button 
                variant="outline"
                onClick={handleGetQRCode}
                disabled={isLoading}
              >
                <QrCode className="h-4 w-4 mr-2" />
                {isLoading ? 'Generando...' : 'Generar QR'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR Code para Evolution API y Wapisimo API */}
      {showQRCode && qrCode && (config.provider === 'evolution-api' || config.provider === 'wapisimo-api') && (
        <Card>
          <CardHeader>
            <CardTitle>Conectar WhatsApp</CardTitle>
            <CardDescription>
              Escanea este código QR con WhatsApp para conectar tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
              <img src={qrCode} alt="QR Code WhatsApp" className="max-w-xs" />
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              1. Abre WhatsApp en tu teléfono<br />
              2. Ve a Configuración → Dispositivos vinculados<br />
              3. Toca "Vincular un dispositivo"<br />
              4. Escanea este código QR
            </p>
            <Button 
              variant="outline" 
              onClick={() => setShowQRCode(false)}
              className="mt-4"
            >
              Cerrar QR
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Información de Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>URLs de Webhook</CardTitle>
          <CardDescription>
            Configura estas URLs en tu proveedor de WhatsApp para recibir mensajes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>WhatsApp Business API Webhook</Label>
            <div className="flex">
              <Input
                value={`${window.location.origin}/api/webhooks/whatsapp`}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          <div>
            <Label>Evolution API Webhook</Label>
            <div className="flex">
              <Input
                value={`${window.location.origin}/api/webhooks/evolution`}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          <div>
            <Label>Wapisimo API Webhook</Label>
            <div className="flex">
              <Input
                value={`${window.location.origin}/api/webhooks/wapisimo`}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            💡 Estas URLs se configuran automáticamente cuando guardas la configuración.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
