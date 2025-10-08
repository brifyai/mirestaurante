
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, ExternalLink, Smartphone, Zap, MessageCircle } from 'lucide-react';

export default function WhatsAppSetupGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guía de Configuración de WhatsApp</CardTitle>
          <CardDescription>
            Aprende a configurar WhatsApp Business API o Evolution API para tu restaurante.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="business-api" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business-api">
            <Smartphone className="h-4 w-4 mr-2" />
            WhatsApp Business API
          </TabsTrigger>
          <TabsTrigger value="evolution-api">
            <Zap className="h-4 w-4 mr-2" />
            Evolution API
          </TabsTrigger>
          <TabsTrigger value="wapisimo-api">
            <MessageCircle className="h-4 w-4 mr-2" />
            Wapisimo API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business-api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>WhatsApp Business API (Oficial)</span>
                <Badge variant="outline">Recomendado para empresas</Badge>
              </CardTitle>
              <CardDescription>
                La solución oficial de Facebook/Meta para empresas con mayor volumen de mensajes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Ventajas
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Más estable y confiable</li>
                    <li>• Soporte oficial de Meta</li>
                    <li>• Mejor para alto volumen</li>
                    <li>• Integración con herramientas de Meta</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Consideraciones
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Requiere verificación empresarial</li>
                    <li>• Proceso de aprobación más largo</li>
                    <li>• Puede tener costos asociados</li>
                    <li>• Menos flexible en funcionalidades</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Pasos para configurar:</h4>
                <ol className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <div>
                      <strong>Crear App en Facebook Developers:</strong>
                      <p className="text-gray-600">Ve a <a href="https://developers.facebook.com" target="_blank" className="text-blue-600 hover:underline inline-flex items-center">developers.facebook.com <ExternalLink className="h-3 w-3 ml-1" /></a></p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <div>
                      <strong>Configurar WhatsApp Business API:</strong>
                      <p className="text-gray-600">Agrega el producto "WhatsApp" a tu app</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <div>
                      <strong>Obtener credenciales:</strong>
                      <p className="text-gray-600">Access Token, Phone Number ID y Verify Token</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    <div>
                      <strong>Configurar Webhook:</strong>
                      <p className="text-gray-600">URL: <code className="bg-gray-200 px-1 rounded">{typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/whatsapp</code></p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                    <div>
                      <strong>Verificación empresarial:</strong>
                      <p className="text-gray-600">Completa el proceso de Business Verification</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Importante:</h4>
                    <p className="text-amber-700 text-sm">
                      Para usar WhatsApp Business API en producción, necesitas completar la verificación empresarial de Meta. 
                      Durante el desarrollo puedes usar un número de prueba.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution-api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Evolution API (Open Source)</span>
                <Badge variant="outline">Más flexible</Badge>
              </CardTitle>
              <CardDescription>
                Solución open-source que ofrece más funcionalidades y flexibilidad.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Ventajas
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• No requiere verificación empresarial</li>
                    <li>• Botones y listas interactivas</li>
                    <li>• Más funcionalidades avanzadas</li>
                    <li>• Configuración más rápida</li>
                    <li>• Open source y gratuito</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Consideraciones
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Requiere servidor propio</li>
                    <li>• Menos estable que la API oficial</li>
                    <li>• No tiene soporte oficial</li>
                    <li>• Puede requerir conocimientos técnicos</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Pasos para configurar:</h4>
                <ol className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <div>
                      <strong>Instalar Evolution API:</strong>
                      <p className="text-gray-600">
                        En tu servidor usando Docker o instalación manual
                        <a href="https://github.com/EvolutionAPI/evolution-api" target="_blank" className="text-purple-600 hover:underline inline-flex items-center ml-2">
                          Ver GitHub <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <div>
                      <strong>Configurar instancia:</strong>
                      <p className="text-gray-600">Crear una instancia para tu restaurante</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <div>
                      <strong>Obtener credenciales:</strong>
                      <p className="text-gray-600">URL base, nombre de instancia y API key</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    <div>
                      <strong>Generar QR Code:</strong>
                      <p className="text-gray-600">Usar la interfaz para vincular tu WhatsApp</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                    <div>
                      <strong>Configurar Webhook:</strong>
                      <p className="text-gray-600">URL: <code className="bg-gray-200 px-1 rounded">{typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/evolution</code></p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Recomendado para:</h4>
                    <p className="text-green-700 text-sm">
                      Restaurantes que quieren empezar rápido, necesitan funcionalidades avanzadas como botones interactivos, 
                      o no quieren pasar por el proceso de verificación de Meta.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wapisimo-api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span>Wapisimo API</span>
                <Badge variant="outline" className="text-green-600">Profesional</Badge>
              </CardTitle>
              <CardDescription>
                Una solución profesional y completa para WhatsApp con funcionalidades avanzadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Ventajas
                  </h4>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• Botones interactivos y menús avanzados</li>
                    <li>• Setup rápido y fácil</li>
                    <li>• Muy estable y confiable</li>
                    <li>• Soporte técnico profesional</li>
                    <li>• Compatible con webhooks</li>
                    <li>• No requiere verificación empresarial</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Consideraciones
                  </h4>
                  <ul className="text-sm space-y-1 text-orange-700">
                    <li>• Requiere cuenta en Wapisimo</li>
                    <li>• Puede tener costos asociados</li>
                    <li>• Dependes de un servicio externo</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Configuración paso a paso:</h4>
                <ol className="text-sm space-y-1 text-blue-700 list-decimal list-inside">
                  <li>Regístrate en <a href="https://app.wapisimo.dev" className="text-blue-600 hover:underline" target="_blank">app.wapisimo.dev</a></li>
                  <li>Crea una nueva instancia de WhatsApp</li>
                  <li>Copia el Instance ID y API Key</li>
                  <li>Configura la URL base: https://app.wapisimo.dev</li>
                  <li>Guarda la configuración en el sistema</li>
                  <li>Genera el código QR y escanéalo con WhatsApp</li>
                  <li>Configura el webhook (opcional): <code className="bg-white px-1 rounded">tu-dominio.com/api/webhooks/wapisimo</code></li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Recomendado para:</h4>
                    <p className="text-green-700 text-sm">
                      Restaurantes que buscan una solución profesional y estable, con funcionalidades avanzadas 
                      como botones interactivos, sin la complejidad de la verificación empresarial de Meta.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>¿Cuál elegir?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Elige WhatsApp Business API si:</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Tu restaurante ya tiene verificación empresarial</li>
                <li>• Manejas alto volumen de mensajes</li>
                <li>• Prefieres estabilidad y soporte oficial</li>
                <li>• Usas otras herramientas de Meta</li>
              </ul>
            </div>
            <div className="border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Elige Evolution API si:</h4>
              <ul className="text-sm space-y-1 text-purple-700">
                <li>• Quieres empezar rápidamente</li>
                <li>• Necesitas botones y listas interactivas</li>
                <li>• Prefieres una solución más flexible</li>
                <li>• Tienes conocimientos técnicos básicos</li>
              </ul>
            </div>
            <div className="border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Elige Wapisimo API si:</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Buscas una solución profesional</li>
                <li>• Quieres botones interactivos</li>
                <li>• Valoras la estabilidad y soporte</li>
                <li>• Prefieres setup rápido sin verificaciones</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
