
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Leaf, 
  Flame,
  Award,
  ChefHat,
  Wine,
  MessageCircle,
  Calendar,
  Share2
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isSpecialty?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  image?: string;
  allergens?: string[];
}

export default function MenuContent() {
  const [activeCategory, setActiveCategory] = useState('entradas');

  const restaurantInfo = {
    name: 'Jaraquemada',
    tagline: 'Experiencia Gastronómica Única',
    location: 'Santiago, Chile',
    phone: '+56 9 1234 5678',
    email: 'reservas@jaraquemada.com',
    hours: {
      weekdays: 'Lun - Jue: 12:00 - 23:00',
      weekend: 'Vie - Sáb: 12:00 - 01:00',
      sunday: 'Dom: 12:00 - 22:00'
    },
    rating: 4.8,
    reviews: 247
  };

  const menuItems: MenuItem[] = [
    // Entradas
    {
      id: '1',
      name: 'Ceviche de la Casa',
      description: 'Pescado fresco del día marinado en leche de tigre, acompañado de camote y choclo.',
      price: 8900,
      category: 'entradas',
      isSpecialty: true
    },
    {
      id: '2',
      name: 'Carpaccio de Res',
      description: 'Láminas de res con rúcula, parmesano, aceite de oliva extra virgen y limón.',
      price: 12500,
      category: 'entradas'
    },
    {
      id: '3',
      name: 'Tabla de Quesos Artesanales',
      description: 'Selección de quesos locales con mermeladas, frutos secos y pan de campo.',
      price: 15200,
      category: 'entradas',
      isVegetarian: true
    },

    // Platos Principales
    {
      id: '4',
      name: 'Salmón a la Plancha',
      description: 'Con risotto de hongos del bosque, espárragos y salsa de eneldo.',
      price: 18900,
      category: 'principales',
      isSpecialty: true
    },
    {
      id: '5',
      name: 'Filete de Res Premium',
      description: 'Con papas gratinadas, verduras salteadas y reducción de vino tinto.',
      price: 22500,
      category: 'principales'
    },
    {
      id: '6',
      name: 'Pasta con Mariscos',
      description: 'Linguini con camarones, calamares, mejillones en salsa de vino blanco.',
      price: 16700,
      category: 'principales'
    },
    {
      id: '7',
      name: 'Risotto de Hongos',
      description: 'Arroz arborio con hongos variados, parmesano y trufa negra.',
      price: 14500,
      category: 'principales',
      isVegetarian: true
    },
    {
      id: '8',
      name: 'Parrillada Mixta',
      description: 'Para 2 personas. Carnes selectas, chorizo, morcilla con acompañamientos.',
      price: 35000,
      category: 'principales'
    },

    // Postres
    {
      id: '9',
      name: 'Tiramisú Artesanal',
      description: 'Clásico italiano con café, mascarpone y cacao belga.',
      price: 7500,
      category: 'postres',
      isSpecialty: true
    },
    {
      id: '10',
      name: 'Brownie con Helado',
      description: 'Brownie de chocolate tibio con helado de vainilla y salsa de caramelo.',
      price: 6800,
      category: 'postres'
    },
    {
      id: '11',
      name: 'Cheesecake de Frutos Rojos',
      description: 'Con coulis de berries y base de galleta.',
      price: 7200,
      category: 'postres'
    },

    // Bebidas
    {
      id: '12',
      name: 'Copa de Vino de la Casa',
      description: 'Selección del sommelier, tinto o blanco.',
      price: 4500,
      category: 'bebidas'
    },
    {
      id: '13',
      name: 'Cerveza Artesanal',
      description: 'IPA local o Lager, 330ml.',
      price: 3200,
      category: 'bebidas'
    },
    {
      id: '14',
      name: 'Jugos Naturales',
      description: 'Naranja, manzana, piña o mix tropical.',
      price: 2800,
      category: 'bebidas'
    }
  ];

  const categories = [
    { id: 'entradas', name: 'Entradas', icon: '🥗' },
    { id: 'principales', name: 'Principales', icon: '🍽️' },
    { id: 'postres', name: 'Postres', icon: '🍰' },
    { id: 'bebidas', name: 'Bebidas', icon: '🍷' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Hola! Me gustaría hacer una consulta sobre el menú de ${restaurantInfo.name}.`);
    window.open(`https://wa.me/56912345678?text=${message}`, '_blank');
  };

  const handleReservation = () => {
    const message = encodeURIComponent(`Hola! Me gustaría hacer una reserva en ${restaurantInfo.name}. ¿Tienen disponibilidad?`);
    window.open(`https://wa.me/56912345678?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Restaurante */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{restaurantInfo.name}</h1>
            <p className="text-xl text-gray-300 mb-6">{restaurantInfo.tagline}</p>
            
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(restaurantInfo.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-400'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-300">
                {restaurantInfo.rating} ({restaurantInfo.reviews} reseñas)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>{restaurantInfo.location}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5 text-purple-400" />
                <span>{restaurantInfo.phone}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>{restaurantInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información de Horarios */}
      <div className="bg-purple-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <div className="text-center">
                <div className="font-semibold">Horarios</div>
                <div className="text-sm opacity-90">{restaurantInfo.hours.weekdays}</div>
                <div className="text-sm opacity-90">{restaurantInfo.hours.weekend}</div>
                <div className="text-sm opacity-90">{restaurantInfo.hours.sunday}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción Rápida */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-center space-x-4">
            <Button onClick={handleReservation} className="bg-green-600 hover:bg-green-700">
              <Calendar className="w-4 h-4 mr-2" />
              Reservar Mesa
            </Button>
            <Button onClick={handleWhatsAppContact} variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Consultar por WhatsApp
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Menú Principal */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navegación de Categorías */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-full p-1 shadow-md">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items del Menú */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    {item.isSpecialty && (
                      <Badge className="bg-orange-500">
                        <Award className="w-3 h-3 mr-1" />
                        Especialidad
                      </Badge>
                    )}
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {formatPrice(item.price)}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                
                <div className="flex items-center space-x-2">
                  {item.isVegetarian && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Leaf className="w-3 h-3 mr-1" />
                      Vegetariano
                    </Badge>
                  )}
                  {item.isSpicy && (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      <Flame className="w-3 h-3 mr-1" />
                      Picante
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <ChefHat className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chef Especialista</h3>
              <p className="text-gray-300">
                Nuestro chef trae años de experiencia internacional
              </p>
            </div>
            
            <div>
              <Wine className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Carta de Vinos</h3>
              <p className="text-gray-300">
                Selección cuidadosa de vinos nacionales e importados
              </p>
            </div>
            
            <div>
              <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ingredientes Premium</h3>
              <p className="text-gray-300">
                Solo trabajamos con los mejores productos locales
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con Información de Contacto */}
      <div className="bg-black text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-xl font-semibold mb-4">¿Preguntas o Reservas?</h3>
          <p className="text-gray-300 mb-6">
            Nuestro equipo está listo para atenderte
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={handleReservation} className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Llamar
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400 text-sm">
            <p>&copy; 2025 {restaurantInfo.name}. Todos los derechos reservados.</p>
            <p>Powered by AI Restaurante</p>
          </div>
        </div>
      </div>
    </div>
  );
}
