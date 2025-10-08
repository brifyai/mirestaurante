// /app/configuracion/whatsapp/_components/wapisimo-setup-guide.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageCircle, Settings, QrCode, CheckCircle2 } from 'lucide-react';

export default function WapisimoSetupGuide() {
  const openWapisimoApp = () => {
    window.open('https://app.wapisimo.dev', '_blank');
  };

  const openDocumentation = () => {
    window.open('https://app.wapisimo.dev/docs', '_blank');
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          <span>Guía de Configuración - Wapisimo API</span>
        </CardTitle>
        <CardDescription>
          Sigue estos pasos para configurar Wapisimo API en tu restaurante.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Paso 1 */}
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="font-semibold text-green-700 flex items-center">
            <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            Crear cuenta en Wapisimo
          </h3>
          <p className="text-sm text-gray-600 mt-1 mb-3">
            Primero necesitas registrarte en Wapisimo y crear una instancia de WhatsApp.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openWapisimoApp}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ir a Wapisimo App
          </Button>
        </div>

        {/* Paso 2 */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="font-semibold text-blue-700 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
            Crear una instancia
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            En tu dashboard de Wapisimo:
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Haz clic en "Crear Instancia"
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Asigna un nombre (ej: "jaraquemada_instance")
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Copia el ID de la instancia creada
            </li>
          </ul>
        </div>

        {/* Paso 3 */}
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="font-semibold text-purple-700 flex items-center">
            <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
            Obtener API Key
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            En la sección de configuración de tu instancia:
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Ve a "Configuración" → "API"
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Genera o copia tu API Key
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Guarda la API Key de forma segura
            </li>
          </ul>
        </div>

        {/* Paso 4 */}
        <div className="border-l-4 border-orange-500 pl-4">
          <h3 className="font-semibold text-orange-700 flex items-center">
            <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
            Configurar en el sistema
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Completa los campos arriba con:
          </p>
          <div className="mt-2 space-y-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <strong>URL Base:</strong> https://app.wapisimo.dev
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>Instance ID:</strong> El ID de tu instancia creada
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>API Key:</strong> Tu clave de API obtenida
            </div>
          </div>
        </div>

        {/* Paso 5 */}
        <div className="border-l-4 border-cyan-500 pl-4">
          <h3 className="font-semibold text-cyan-700 flex items-center">
            <span className="bg-cyan-100 text-cyan-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">5</span>
            Conectar WhatsApp
          </h3>
          <p className="text-sm text-gray-600 mt-1 mb-3">
            Una vez guardada la configuración, genera el código QR para conectar tu WhatsApp.
          </p>
          <div className="flex items-center space-x-2">
            <QrCode className="h-4 w-4 text-cyan-600" />
            <span className="text-sm text-gray-600">
              Usa el botón "Generar QR" para obtener el código
            </span>
          </div>
        </div>

        {/* Ventajas */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">✨ Ventajas de Wapisimo API</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Botones interactivos y menús avanzados</li>
            <li>• Muy estable y confiable</li>
            <li>• Setup rápido y fácil</li>
            <li>• Soporte técnico profesional</li>
            <li>• Compatible con webhooks</li>
          </ul>
        </div>

        {/* Webhooks */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🔗 Configurar Webhook (Opcional)</h4>
          <p className="text-sm text-blue-700 mb-2">
            Para recibir mensajes automáticamente, configura este webhook en Wapisimo:
          </p>
          <div className="bg-white border rounded p-2 font-mono text-sm">
            {typeof window !== 'undefined' && window.location.origin}/api/webhooks/wapisimo
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Esto permitirá que los mensajes lleguen automáticamente a tu bandeja de entrada.
          </p>
        </div>

        {/* Documentación */}
        <div className="text-center pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={openDocumentation}
            className="text-gray-600"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Documentación Oficial
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}