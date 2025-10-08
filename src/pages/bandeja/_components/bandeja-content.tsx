
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Send, CheckCircle, AlertTriangle, Users, Phone, Mail as MailIcon, Calendar, MapPin, Clock } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'customer' | 'ai' | 'human';
  type: 'text' | 'reservation' | 'complaint' | 'menu_request';
}

interface Contact {
  id: string;
  name: string;
  channel: 'whatsapp' | 'instagram' | 'messenger';
  phone: string;
  email: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: 'online' | 'offline';
  messages: Message[];
  aiIntention?: string;
  needsHuman?: boolean;
  reservationData?: {
    date: string;
    time: string;
    people: number;
    status: 'pending' | 'confirmed' | 'modified';
  };
}

export default function BandejaContent() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Datos de ejemplo basados en las capturas
  const [isTyping, setIsTyping] = useState(false);
  const [typingContact, setTypingContact] = useState<string | null>(null);

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sofía Rodríguez',
      channel: 'instagram',
      phone: '+56 9 5566 7788',
      email: 'sofia.r@example.com',
      avatar: 'SR',
      lastMessage: 'Perfecto, estaremos esperando al especialista entonces',
      timestamp: 'hace 2 horas',
      unread: true,
      status: 'online',
      aiIntention: 'Consulta Compleja (Alergia)',
      needsHuman: true,
      messages: [
        {
          id: '1',
          text: 'Hola! Quería hacer una consulta. Estamos pensando en ir a cenar esta noche con mi esposo y nuestra mascota. ¿Su terraza es pet-friendly?',
          timestamp: new Date(Date.now() - 7200000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '2',
          text: '¡Hola Sofía! Sí, nuestra terraza es completamente pet-friendly. Tenemos un área especial para mascotas con agua fresca disponible. ¿Para qué hora les gustaría reservar?',
          timestamp: new Date(Date.now() - 7140000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '3',
          text: 'Qué bueno! Pero tengo una consulta importante. Mi esposo tiene una alergia SEVERA a los frutos secos. Necesito estar 100% segura de que no habrá contaminación cruzada en la cocina. ¿Pueden garantizar eso?',
          timestamp: new Date(Date.now() - 7080000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '4',
          text: 'Entiendo perfectamente la importancia de este tema. He detectado una consulta compleja sobre alergias que requiere atención especial. Notificando a un agente humano para que te asista personalmente.',
          timestamp: new Date(Date.now() - 7020000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '5',
          text: 'Hola Sofía, soy María, jefa de cocina de Jaraquemada. Absolutamente podemos manejar alergias severas. Tenemos protocolos estrictos de contaminación cruzada y utensilios dedicados.',
          timestamp: new Date(Date.now() - 6960000),
          sender: 'human',
          type: 'text'
        },
        {
          id: '6',
          text: 'Nuestro chef puede preparar los platos de su esposo en una estación separada con utensilios limpios. También revisamos cada ingrediente. ¿Podrían venir 30 minutos antes para hablar personalmente?',
          timestamp: new Date(Date.now() - 6900000),
          sender: 'human',
          type: 'text'
        },
        {
          id: '7',
          text: 'Perfecto, estaremos esperando al especialista entonces. Muchas gracias por la atención personalizada. Reservamos para las 8pm para 2 personas.',
          timestamp: new Date(Date.now() - 6840000),
          sender: 'customer',
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      name: 'Miguel Fernandez',
      channel: 'messenger',
      phone: '+56 9 2233 4455',
      email: 'miguel.f@example.com',
      avatar: 'MF',
      lastMessage: 'Perfecto, acepto el descuento. Gracias por resolverlo tan rápido',
      timestamp: 'hace 5 min',
      unread: true,
      status: 'online',
      aiIntention: 'Queja Grave de Cliente',
      needsHuman: false,
      messages: [
        {
          id: '1',
          text: 'Hola, buenas tardes. Quería hacer una queja sobre mi visita de anoche.',
          timestamp: new Date(Date.now() - 900000),
          sender: 'customer',
          type: 'complaint'
        },
        {
          id: '2',
          text: '¡Hola Miguel! Lamento escuchar que tuviste una mala experiencia. Cuéntame qué ocurrió para poder ayudarte.',
          timestamp: new Date(Date.now() - 840000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '3',
          text: 'La verdad es que la experiencia fue bastante decepcionante. Reservé para las 8pm, llegué puntual, pero me hicieron esperar 25 minutos para sentar.',
          timestamp: new Date(Date.now() - 780000),
          sender: 'customer',
          type: 'complaint'
        },
        {
          id: '4',
          text: 'Luego pedí el salmón a la plancha y tardaron casi una hora en traerlo. Cuando finalmente llegó, estaba completamente frío y el puré se veía como si llevara tiempo ahí.',
          timestamp: new Date(Date.now() - 720000),
          sender: 'customer',
          type: 'complaint'
        },
        {
          id: '5',
          text: 'Miguel, esto es completamente inaceptable. Entiendo perfectamente tu frustración. Ese tipo de servicio no representa para nada los estándares de Jaraquemada.',
          timestamp: new Date(Date.now() - 660000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '6',
          text: 'Como disculpa inmediata, he generado un cupón de descuento del 15% para tu próxima visita. Código: **DISCULPA15**. Además, voy a escalar este caso para que un manager revise qué pasó esa noche.',
          timestamp: new Date(Date.now() - 600000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '7',
          text: 'También quiero invitarte personalmente a que vuelvas. El próximo fin de semana tenemos un menú especial de mariscos que estoy seguro te va a encantar.',
          timestamp: new Date(Date.now() - 540000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '8',
          text: 'Wow, no esperaba una respuesta tan rápida y completa. Se nota que se toman en serio las quejas de los clientes.',
          timestamp: new Date(Date.now() - 480000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '9',
          text: 'Perfecto, acepto el descuento. Gracias por resolverlo tan rápido. Me gusta que tomen acción inmediata.',
          timestamp: new Date(Date.now() - 420000),
          sender: 'customer',
          type: 'text'
        }
      ]
    },
    {
      id: '3',
      name: 'Martín Rojas',
      channel: 'whatsapp',
      phone: '+56 9 1234 5678',
      email: 'martin.r@example.com',
      avatar: 'MR',
      lastMessage: 'Genial! Nos vemos a las 9 entonces. Gracias por la flexibilidad',
      timestamp: 'hace 10 min',
      unread: false,
      status: 'offline',
      aiIntention: 'Modificar Reserva',
      needsHuman: false,
      reservationData: {
        date: 'Viernes, 29 de Agosto 2025',
        time: '21:00',
        people: 4,
        status: 'modified'
      },
      messages: [
        {
          id: '1',
          text: 'Hola! Soy Martín, tengo una reserva para esta noche.',
          timestamp: new Date(Date.now() - 1200000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '2',
          text: '¡Hola Martín! Te ayudo con tu reserva. Déjame revisar... Veo que tienes reserva para esta noche a las 20:00 para 4 personas. ¿En qué puedo ayudarte?',
          timestamp: new Date(Date.now() - 1140000),
          sender: 'ai',
          type: 'reservation'
        },
        {
          id: '3',
          text: 'Perfecto! El tema es que tuvimos un inconveniente y nos vamos a retrasar. ¿Sería posible cambiar la reserva de 8pm a 9pm?',
          timestamp: new Date(Date.now() - 1080000),
          sender: 'customer',
          type: 'reservation'
        },
        {
          id: '4',
          text: 'Un momento por favor, estoy verificando disponibilidad para las 21:00...',
          timestamp: new Date(Date.now() - 1020000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '5',
          text: '¡Excelentes noticias! Tengo disponibilidad a las 21:00. He modificado tu reserva automáticamente:',
          timestamp: new Date(Date.now() - 960000),
          sender: 'ai',
          type: 'reservation'
        },
        {
          id: '6',
          text: '✅ **Reserva Actualizada** \n📅 Fecha: Viernes, 29 de Agosto 2025\n🕘 Hora: 21:00\n👥 Personas: 4\n\n¿Necesitas modificar algo más?',
          timestamp: new Date(Date.now() - 900000),
          sender: 'ai',
          type: 'reservation'
        },
        {
          id: '7',
          text: 'Wow qué rápido! Me encanta el servicio. No necesito nada más, la reserva está perfecta.',
          timestamp: new Date(Date.now() - 840000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '8',
          text: 'Genial! Nos vemos a las 9 entonces. Gracias por la flexibilidad 👍',
          timestamp: new Date(Date.now() - 780000),
          sender: 'customer',
          type: 'text'
        }
      ]
    },
    {
      id: '4',
      name: 'Javiera Meneses',
      channel: 'whatsapp',
      phone: '+56 9 8877 6655',
      email: 'javiera.m@example.com',
      avatar: 'JM',
      lastMessage: 'Perfecto! Los esperamos el sábado a las 7:30pm',
      timestamp: '11:15',
      unread: false,
      status: 'online',
      aiIntention: 'Nueva Reserva',
      messages: [
        {
          id: '1',
          text: 'Hola! Quisiera hacer una reserva para este sábado',
          timestamp: new Date(Date.now() - 18000000),
          sender: 'customer',
          type: 'reservation'
        },
        {
          id: '2',
          text: '¡Hola Javiera! Con gusto te ayudo. ¿Para qué hora y cuántas personas sería la reserva?',
          timestamp: new Date(Date.now() - 17940000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '3',
          text: 'Sería para las 7:30pm y somos 6 personas. ¿Hay disponibilidad?',
          timestamp: new Date(Date.now() - 17880000),
          sender: 'customer',
          type: 'reservation'
        },
        {
          id: '4',
          text: 'Un momento mientras verifico la disponibilidad para 6 personas...',
          timestamp: new Date(Date.now() - 17820000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '5',
          text: '¡Excelente! Tu reserva ha sido confirmada para el sábado 30 de agosto a las 19:30 para 6 personas. ¿Alguna preferencia especial de mesa?',
          timestamp: new Date(Date.now() - 17760000),
          sender: 'ai',
          type: 'reservation'
        },
        {
          id: '6',
          text: 'Si es posible, nos gustaría una mesa en la terraza. Vamos a celebrar un cumpleaños.',
          timestamp: new Date(Date.now() - 17700000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '7',
          text: '¡Qué bueno! He anotado que es una celebración de cumpleaños y he reservado una mesa especial en la terraza. ¿El cumpleañero tiene algún postre favorito?',
          timestamp: new Date(Date.now() - 17640000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '8',
          text: 'Le encanta el tiramisú! Y qué detalle tan lindo preguntar eso 😊',
          timestamp: new Date(Date.now() - 17580000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '9',
          text: 'Perfecto! Los esperamos el sábado a las 7:30pm. Tendremos una sorpresa especial con el tiramisú 🎂',
          timestamp: new Date(Date.now() - 17520000),
          sender: 'ai',
          type: 'text'
        }
      ]
    },
    {
      id: '5',
      name: 'Carlos Sánchez',
      channel: 'whatsapp',
      phone: '+56 9 4433 2211',
      email: 'carlos.s@example.com',
      avatar: 'CS',
      lastMessage: 'Perfecto, gracias por la info. ¡Que tengas un buen día!',
      timestamp: '10:58',
      unread: false,
      status: 'online',
      aiIntention: 'Consulta General',
      messages: [
        {
          id: '1',
          text: 'Hola, buenos días. ¿Podrían decirme cuáles son sus horarios de atención?',
          timestamp: new Date(Date.now() - 28800000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '2',
          text: '¡Buenos días Carlos! Nuestros horarios son: Lunes a Jueves 12:00-23:00, Viernes y Sábados 12:00-01:00, Domingos 12:00-22:00.',
          timestamp: new Date(Date.now() - 28740000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '3',
          text: 'Genial. ¿Y necesito reserva para ir esta noche o puedo llegar directo?',
          timestamp: new Date(Date.now() - 28680000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '4',
          text: 'Te recomiendo hacer reserva, especialmente si son más de 2 personas. Los viernes tenemos mucha demanda. ¿Te gustaría que te ayude a reservar?',
          timestamp: new Date(Date.now() - 28620000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '5',
          text: 'No, por ahora solo quería consultar. Si decido ir, haré la reserva más tarde.',
          timestamp: new Date(Date.now() - 28560000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '6',
          text: 'Perfecto, gracias por la info. ¡Que tengas un buen día!',
          timestamp: new Date(Date.now() - 28500000),
          sender: 'customer',
          type: 'text'
        }
      ]
    },
    {
      id: '6',
      name: 'Ana García',
      channel: 'instagram',
      phone: '+56 9 7766 5544',
      email: 'ana.g@example.com',
      avatar: 'AG',
      lastMessage: 'Muchas gracias! Fue una experiencia increíble 😊',
      timestamp: 'Ayer',
      unread: false,
      status: 'offline',
      aiIntention: 'Felicitación',
      messages: [
        {
          id: '1',
          text: '¡Hola! Quería felicitarlos por la cena de anoche. Todo estuvo perfecto 👌',
          timestamp: new Date(Date.now() - 86400000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '2',
          text: '¡Qué alegría saber eso Ana! Nos encanta recibir comentarios tan positivos. ¿Cuál fue tu plato favorito?',
          timestamp: new Date(Date.now() - 86340000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '3',
          text: 'El salmón con risotto estaba increíble, y el postre de chocolate... ¡sin palabras! 🍫',
          timestamp: new Date(Date.now() - 86280000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '4',
          text: '¡El chef va a estar feliz de escuchar eso! Ese es uno de sus platos favoritos para preparar. ¡Esperamos verte de nuevo pronto!',
          timestamp: new Date(Date.now() - 86220000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '5',
          text: 'Muchas gracias! Fue una experiencia increíble 😊',
          timestamp: new Date(Date.now() - 86160000),
          sender: 'customer',
          type: 'text'
        }
      ]
    },
    {
      id: '7',
      name: 'Luis Martínez',
      channel: 'whatsapp',
      phone: '+56 9 9988 7766',
      email: 'luis.m@example.com',
      avatar: 'LM',
      lastMessage: 'Perfecto! Muchas gracias por toda la información',
      timestamp: 'Ayer',
      unread: false,
      status: 'offline',
      aiIntention: 'Consulta Carta',
      messages: [
        {
          id: '1',
          text: '¡Hola! ¿Podrían enviarme la carta actualizada? Queremos ver las opciones para una cena de negocios.',
          timestamp: new Date(Date.now() - 90000000),
          sender: 'customer',
          type: 'menu_request'
        },
        {
          id: '2',
          text: '¡Hola Luis! Por supuesto, aquí tienes nuestra carta completa actualizada: 📋\n\n**ENTRADAS**\n- Ceviche de la casa\n- Carpaccio de res\n- Tabla de quesos\n\n**PLATOS PRINCIPALES**\n- Salmón a la plancha con risotto\n- Filete de res con papas gratinadas\n- Pasta con mariscos\n\n¿Te interesa alguna sección en particular?',
          timestamp: new Date(Date.now() - 89940000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '3',
          text: 'Excelente! ¿Y tienen opciones vegetarianas? Uno de mis invitados no come carne.',
          timestamp: new Date(Date.now() - 89880000),
          sender: 'customer',
          type: 'text'
        },
        {
          id: '4',
          text: 'Absolutamente! Tenemos varias opciones:\n- Risotto de hongos\n- Pasta primavera con vegetales\n- Ensalada gourmet con quinoa\n- Pizza vegetariana artesanal\n\n¿Necesitas que reserve una mesa también?',
          timestamp: new Date(Date.now() - 89820000),
          sender: 'ai',
          type: 'text'
        },
        {
          id: '5',
          text: 'Perfecto! Muchas gracias por toda la información. Te contacto más tarde para la reserva.',
          timestamp: new Date(Date.now() - 89760000),
          sender: 'customer',
          type: 'text'
        }
      ]
    },
    {
      id: '8',
      name: 'Carmen Morales',
      channel: 'whatsapp',
      phone: '+56 9 3344 5566',
      email: 'carmen.m@example.com',
      avatar: 'CM',
      lastMessage: '¿Tienen mesas disponibles para esta noche?',
      timestamp: 'hace 1 min',
      unread: true,
      status: 'online',
      aiIntention: 'Nueva Reserva',
      messages: [
        {
          id: '1',
          text: 'Buenas tardes! ¿Tienen mesas disponibles para esta noche?',
          timestamp: new Date(Date.now() - 60000),
          sender: 'customer',
          type: 'reservation'
        },
        {
          id: '2',
          text: '¡Buenas tardes Carmen! Sí, tengo disponibilidad. ¿Para qué hora y cuántas personas sería?',
          timestamp: new Date(Date.now() - 30000),
          sender: 'ai',
          type: 'text'
        }
      ]
    }
  ]);

  const currentContact = selectedContact ? contacts.find(c => c.id === selectedContact) : null;
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'instagram':
        return <div className="w-2 h-2 bg-pink-500 rounded-full"></div>;
      case 'messenger':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const getChannelText = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return 'vía WhatsApp';
      case 'instagram': return 'vía Instagram';
      case 'messenger': return 'vía Messenger';
      default: return '';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentContact) return;
    
    // Simular envío de mensaje
    console.log('Enviando mensaje:', newMessage);
    setNewMessage('');
    
    // Aquí se integraría con la API de envío
  };

  const handleTakeControl = () => {
    if (currentContact) {
      alert('Tomando control del chat. Notificando al equipo humano...');
    }
  };

  const generateAIResponse = (message: string, contactId: string) => {
    // Simulación de respuesta de IA basada en el contenido
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('carta') || lowerMessage.includes('menu')) {
      return 'Aquí tienes nuestra carta actualizada: [Link al menú]. ¿Te interesa algún plato en particular?';
    }
    
    if (lowerMessage.includes('reserva')) {
      return '¡Por supuesto! ¿Para qué fecha y hora te gustaría reservar? ¿Cuántas personas serán?';
    }
    
    if (lowerMessage.includes('horario')) {
      return 'Nuestros horarios son: Lunes a Jueves 12:00-23:00, Viernes y Sábados 12:00-01:00, Domingos 12:00-22:00.';
    }
    
    if (lowerMessage.includes('ubicacion') || lowerMessage.includes('direccion')) {
      return 'Estamos ubicados en [Dirección Jaraquemada]. ¿Te envío la ubicación exacta?';
    }
    
    return null; // Necesita intervención humana
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentContact?.messages]);

  // Simular typing cuando se selecciona Carmen (conversación activa)
  useEffect(() => {
    if (selectedContact === '8' && currentContact?.name === 'Carmen Morales') {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTypingContact('8');
        
        // Ocultar typing después de 3 segundos
        setTimeout(() => {
          setIsTyping(false);
          setTypingContact(null);
        }, 3000);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedContact, currentContact]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Lista de Contactos */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedContact === contact.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                      {contact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    {getChannelIcon(contact.channel)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage}</p>
                  
                  {contact.aiIntention && (
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        IA
                      </Badge>
                      <span className="text-xs text-blue-600 font-medium">
                        {contact.aiIntention}
                      </span>
                    </div>
                  )}
                  
                  {contact.needsHuman && (
                    <div className="flex items-center mt-1">
                      <AlertTriangle className="w-3 h-3 text-red-500 mr-1" />
                      <span className="text-xs text-red-600">Intervención Humana Requerida</span>
                    </div>
                  )}
                </div>
                
                {contact.unread && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {currentContact ? (
          <>
            {/* Header del Chat */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                      {currentContact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-gray-900">{currentContact.name}</h2>
                    <p className="text-sm text-gray-500">{getChannelText(currentContact.channel)}</p>
                  </div>
                </div>
                
                {currentContact.needsHuman && (
                  <Button onClick={handleTakeControl} variant="outline" className="text-red-600 border-red-600">
                    <Users className="w-4 h-4 mr-2" />
                    Tomar Control del Chat
                  </Button>
                )}
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentContact.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'customer'
                        ? 'bg-gray-200 text-gray-900'
                        : message.sender === 'ai'
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex items-center mb-1">
                        <Badge variant="secondary" className="text-xs bg-white text-blue-600">
                          IA Jaraquemada
                        </Badge>
                      </div>
                    )}
                    {message.sender === 'human' && (
                      <div className="flex items-center mb-1">
                        <Badge variant="secondary" className="text-xs bg-white text-green-600">
                          Agente Humano
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-xs ${
                        message.sender === 'customer' ? 'text-gray-500' : 'text-gray-200'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.type === 'reservation' && (
                        <Calendar className="w-3 h-3 ml-2" />
                      )}
                      {message.type === 'complaint' && (
                        <AlertTriangle className="w-3 h-3 ml-2" />
                      )}
                      {message.type === 'menu_request' && (
                        <MailIcon className="w-3 h-3 ml-2" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && currentContact?.id === typingContact && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">IA escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensaje */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MailIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Selecciona una conversación</p>
              <p className="text-sm">Elige un contacto para ver sus mensajes</p>
            </div>
          </div>
        )}
      </div>

      {/* Panel de Detalles */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        {currentContact ? (
          <div className="p-6">
            <div className="text-center mb-6">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-xl">
                  {currentContact.avatar}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{currentContact.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{getChannelText(currentContact.channel)}</p>
            </div>

            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">DETALLES DEL CONTACTO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Nombre: {currentContact.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Teléfono: {currentContact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MailIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Email: {currentContact.email}</span>
                </div>
              </CardContent>
            </Card>

            {currentContact.aiIntention && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Badge className="mr-2">IA</Badge>
                    INTENCIÓN DETECTADA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600 font-medium">{currentContact.aiIntention}</p>
                </CardContent>
              </Card>
            )}

            {currentContact.reservationData && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">RESERVA ACTUALIZADA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Fecha</span>
                    <span className="font-medium">{currentContact.reservationData.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Hora</span>
                    <span className="font-medium">{currentContact.reservationData.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Personas</span>
                    <span className="font-medium">{currentContact.reservationData.people}</span>
                  </div>
                  <div className="bg-green-100 p-2 rounded text-center">
                    <span className="text-sm text-green-700 font-medium">
                      Reserva modificada en el sistema.
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentContact.needsHuman && (
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-red-700">Intervención Humana Requerida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    La IA no pudo resolver esta consulta. Por favor, revísala.
                  </p>
                  <Button onClick={handleTakeControl} className="w-full bg-red-600 hover:bg-red-700">
                    Tomar Control del Chat
                  </Button>
                </CardContent>
              </Card>
            )}

            {!currentContact.needsHuman && currentContact.aiIntention && (
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-700">
                    {currentContact.aiIntention.includes('Reserva') ? 'ACCIÓN AUTOMÁTICA' : 
                     currentContact.aiIntention.includes('Queja') ? 'ACCIÓN AUTOMÁTICA' : 'SIGUIENTE PASO'}
                  </CardTitle>
                  <Badge className="ml-2">IA</Badge>
                </CardHeader>
                <CardContent>
                  {currentContact.aiIntention.includes('Reserva') && currentContact.reservationData ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        La IA ha ofrecido un cupón del 15% por la mala experiencia. Se recomienda seguimiento humano.
                      </p>
                    </div>
                  ) : currentContact.aiIntention.includes('Modificar') ? (
                    <p className="text-sm text-gray-600">
                      Reserva modificada exitosamente. Cliente satisfecho.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Esperando la respuesta del cliente.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">Selecciona un contacto para ver sus detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}
