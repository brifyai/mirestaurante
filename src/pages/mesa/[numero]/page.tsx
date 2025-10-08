
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  QrCode,
  MessageSquare,
  Users,
  MapPin,
  Clock,
  ChefHat,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { useParams } from 'react-router-dom';

interface Mesa {
  id: string;
  numero: string;
  capacidad: number;
  zona: string;
  estado: 'libre' | 'ocupada' | 'reservada' | 'limpieza' | 'mantenimiento';
}

export default function MesaQRPage() {
  const params = useParams();
  const numeroMesa = params?.numero as string;
  const [mesa, setMesa] = useState<Mesa | null>(null);
  const [loading, setLoading] = useState(true);

  // URL para WhatsApp con mensaje preescrito
  const whatsappUrl = `https://wa.me/56941040581?text=${encodeURIComponent(
    `Hola estoy en La Fuente Maestra mesa ${numeroMesa} sector ${mesa?.zona || 'Pasto-verde'} y quiero ver la carta.`
  )}`;

  // URL de la carta
  const cartaUrl = "https://link.cheetrack.com/carta_la_fuente_maestra-ebfc63456";

  useEffect(() => {
    // Simular carga de datos de mesa
    const cargarDatosMesa = async () => {
      try {
        // Aquí normalmente harías una llamada a la API
        // Por ahora simulamos los datos
        const mesaData: Mesa = {
          id: `mesa-${numeroMesa}`,
          numero: numeroMesa || '01',
          capacidad: 4,
          zona: 'Pasto-verde',
          estado: 'libre'
        };
        
        setMesa(mesaData);
      } catch (error) {
        console.error('Error cargando datos de mesa:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosMesa();
  }, [numeroMesa]);

  const handleWhatsAppRedirect = () => {
    // Abrir WhatsApp con mensaje preescrito
    window.open(whatsappUrl, '_blank');
  };

  const handleCartaRedirect = () => {
    // Abrir carta directamente
    window.open(cartaUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de la mesa...</p>
        </div>
      </div>
    );
  }

  if (!mesa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <QrCode className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Mesa no encontrada</h2>
            <p className="text-gray-600">No se pudo encontrar información para esta mesa.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header de bienvenida */}
        <Card className="border-green-200 bg-white shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ChefHat className="w-8 h-8" />
              <CardTitle className="text-2xl font-bold">La Fuente Maestra</CardTitle>
            </div>
            <p className="text-green-100">¡Bienvenido a nuestra experiencia digital!</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-4 text-gray-700">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Mesa {mesa.numero}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Sector {mesa.zona}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>{mesa.capacidad} personas</span>
                </div>
              </div>
              
              <Badge className="bg-green-100 text-green-800">
                Mesa disponible
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Acción principal - WhatsApp */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <MessageSquare className="w-6 h-6" />
              <span>Solicitar Carta por WhatsApp</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-3">
                <strong>💬 Método recomendado:</strong> Al hacer clic, se abrirá WhatsApp con un mensaje 
                preescrito. Solo tienes que presionar "Enviar" y te responderemos inmediatamente con:
              </p>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>Link directo a nuestra carta completa</li>
                <li>Información sobre nuestro programa de beneficios</li>
                <li>Atención personalizada con nuestro asistente virtual</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                <strong>Mensaje que se enviará:</strong><br/>
                "Hola estoy en La Fuente Maestra mesa {mesa.numero} sector {mesa.zona} y quiero ver la carta."
              </p>
            </div>

            <Button 
              onClick={handleWhatsAppRedirect}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
              size="lg"
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Abrir WhatsApp
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Alternativa - Carta directa */}
        <Card className="border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <QrCode className="w-6 h-6" />
              <span>Ver Carta Directamente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>📖 Acceso directo:</strong> También puedes ver nuestra carta completa 
                directamente, pero te recomendamos usar WhatsApp para obtener:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Beneficios exclusivos por visita</li>
                <li>Información sobre promociones actuales</li>
                <li>Posibilidad de hacer pedidos personalizados</li>
              </ul>
            </div>

            <Button 
              onClick={handleCartaRedirect}
              variant="outline"
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 text-lg py-6"
              size="lg"
            >
              <ExternalLink className="w-6 h-6 mr-3" />
              Ver Carta
            </Button>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="border-gray-200 shadow-md">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm">Experiencia optimizada para móvil</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Atención inmediata 24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2025 La Fuente Maestra - Powered by AI Restaurante</p>
        </div>
      </div>
    </div>
  );
}
