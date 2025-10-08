
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  Calendar, 
  MessageCircle,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

interface QRConfiguration {
  qrBehavior: 'menu' | 'whatsapp';
  whatsappNumber: string;
  whatsappMessage: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  primaryButtonColor: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  secondaryButtonColor: string;
  tertiaryButtonText: string;
  tertiaryButtonUrl: string;
  tertiaryButtonColor: string;
  captureLeadsEnabled: boolean;
  welcomeMessage: string;
}

export default function PortalPage() {
  const [config, setConfig] = useState<QRConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const response = await fetch('/api/qr-config');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
          
          // Si está configurado para ir directamente a WhatsApp, redirigir
          if (data.qrBehavior === 'whatsapp') {
            const whatsappUrl = `https://wa.me/${data.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(data.whatsappMessage)}`;
            window.location.href = whatsappUrl;
            return;
          }
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
        // Continuar con configuración por defecto si hay error
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  const handleWhatsAppReserva = () => {
    if (config) {
      window.open(config.secondaryButtonUrl, '_blank');
    }
  };

  const handleWhatsAppContacto = () => {
    if (config) {
      window.open(config.tertiaryButtonUrl, '_blank');
    }
  };

  const handleVerMenu = () => {
    if (config) {
      window.location.href = config.primaryButtonUrl;
    }
  };

  // Mostrar loading mientras carga la configuración
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay configuración, mostrar valores por defecto
  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error de Configuración</h1>
          <p className="text-gray-600 mb-6">No se pudo cargar la configuración del portal QR.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jaraquemada</h1>
          <p className="text-gray-600 text-lg">
            {config.welcomeMessage}
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 mb-8">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Ubicación</p>
                  <p className="text-sm text-gray-600">Santiago, Chile</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Horarios</p>
                  <p className="text-sm text-gray-600">Lun-Dom: 12:00 - 23:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-gray-900">Calificación</p>
                  <p className="text-sm text-gray-600">⭐⭐⭐⭐⭐ (4.8/5)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleVerMenu}
            className="w-full h-14 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: config.primaryButtonColor, borderColor: config.primaryButtonColor }}
          >
            <Calendar className="mr-3 h-5 w-5" />
            {config.primaryButtonText}
          </Button>

          <Button 
            onClick={handleWhatsAppReserva}
            className="w-full h-14 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: config.secondaryButtonColor, borderColor: config.secondaryButtonColor }}
          >
            <MessageCircle className="mr-3 h-5 w-5" />
            {config.secondaryButtonText}
          </Button>

          <Button 
            onClick={handleWhatsAppContacto}
            className="w-full h-14 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: config.tertiaryButtonColor, borderColor: config.tertiaryButtonColor }}
          >
            <Phone className="mr-3 h-5 w-5" />
            {config.tertiaryButtonText}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Powered by AI Restaurante
          </p>
        </div>
      </div>
    </div>
  );
}
