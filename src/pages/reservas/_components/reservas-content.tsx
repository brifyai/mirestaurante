
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Settings,
  BarChart3,
  Filter,
  CalendarDays,
  TrendingUp,
  Cake,
  AlertTriangle,
  Cloud,
  Brain,
  Layout,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CalendarView from './calendar-view';
import Swal from 'sweetalert2';
import { ArrivalsManager } from '@/lib/arrivals-manager';

interface Reservation {
  id: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  tableNumber?: string;
  covers: number;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'ARRIVED';
  createdAt: string;
  arrivedAt?: string; // Timestamp de llegada
}

const statusColors = {
  CONFIRMED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800', 
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  ARRIVED: 'bg-purple-100 text-purple-800',
};

const statusLabels = {
  CONFIRMED: 'Confirmada',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
  ARRIVED: 'Cliente Llegó',
};

export default function ReservasContent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [reservationsEnabled, setReservationsEnabled] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState('¡Gracias por reservar con nosotros!');
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [llegadasHoy, setLlegadasHoy] = useState<Array<{
    guestName: string;
    tableNumber: string;
    arrivedAt: string;
    type: 'manual' | 'automatic';
  }>>([]);

  const analyticsData = [
    { name: 'Lun', reservas: reservations.filter(r => new Date(r.date).getDay() === 1).length },
    { name: 'Mar', reservas: reservations.filter(r => new Date(r.date).getDay() === 2).length },
    { name: 'Mié', reservas: reservations.filter(r => new Date(r.date).getDay() === 3).length },
    { name: 'Jue', reservas: reservations.filter(r => new Date(r.date).getDay() === 4).length },
    { name: 'Vie', reservas: reservations.filter(r => new Date(r.date).getDay() === 5).length },
    { name: 'Sáb', reservas: reservations.filter(r => new Date(r.date).getDay() === 6).length },
    { name: 'Dom', reservas: reservations.filter(r => new Date(r.date).getDay() === 0).length },
  ];

  useEffect(() => {
    loadReservations();
    
    // Cargar llegadas existentes
    setLlegadasHoy(ArrivalsManager.getTodayArrivals());
    
    // Suscribirse a cambios en llegadas
    const unsubscribe = ArrivalsManager.subscribe((arrivals) => {
      setLlegadasHoy(ArrivalsManager.getTodayArrivals());
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const loadReservations = async () => {
    // Usar datos de ejemplo directamente para demostración
    const exampleReservations = generateExampleReservations();
    console.log('Loaded reservations for main view:', exampleReservations.length);
    setReservations(exampleReservations);
    setIsLoading(false);
  };

  const generateExampleReservations = (): Reservation[] => {
    const reservations: Reservation[] = [];
    
    // Nombres de ejemplo
    const nombres = [
      'María González', 'Carlos Rodríguez', 'Ana Martín', 'Luis Fernández', 'Carmen López',
      'José García', 'Patricia Ruiz', 'Miguel Sánchez', 'Laura Torres', 'David Jiménez',
      'Elena Castro', 'Roberto Silva', 'Sandra Morales', 'Francisco Herrera', 'Isabel Vega',
      'Alberto Ramos', 'Mónica Delgado', 'Juan Carlos Peña', 'Rosa María Ortiz', 'Pedro Mendoza'
    ];
    
    const emails = [
      'maria.gonzalez@email.com', 'carlos.rodriguez@email.com', 'ana.martin@email.com',
      'luis.fernandez@email.com', 'carmen.lopez@email.com', 'jose.garcia@email.com',
      'patricia.ruiz@email.com', 'miguel.sanchez@email.com', 'laura.torres@email.com',
      'david.jimenez@email.com', 'elena.castro@email.com', 'roberto.silva@email.com',
      'sandra.morales@email.com', 'francisco.herrera@email.com', 'isabel.vega@email.com',
      'alberto.ramos@email.com', 'monica.delgado@email.com', 'juancarlos.pena@email.com',
      'rosamaria.ortiz@email.com', 'pedro.mendoza@email.com'
    ];
    
    const horarios = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
    const mesas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Terraza 1', 'Terraza 2', 'Privado'];
    
    // GENERAR RESERVAS ESPECÍFICAMENTE PARA SEPTIEMBRE 2025
    const diasSeptiembre = 30;
    let reservaId = 1;
    
    // Generar reservas distribuidas a lo largo de septiembre 2025
    for (let dia = 1; dia <= diasSeptiembre; dia++) {
      const fechaDelDia = new Date(2025, 8, dia); // Año 2025, mes Septiembre
      const diaSemana = fechaDelDia.getDay();
      
      let reservasPorDia = 0;
      if (diaSemana === 0) { // Domingo
        reservasPorDia = Math.floor(Math.random() * 3) + 1; // 1-3 reservas
      } else if (diaSemana >= 1 && diaSemana <= 4) { // Lun-Jue
        reservasPorDia = Math.floor(Math.random() * 3) + 2; // 2-4 reservas
      } else { // Vie-Sáb
        reservasPorDia = Math.floor(Math.random() * 4) + 3; // 3-6 reservas
      }
      
      for (let reservaDelDia = 0; reservaDelDia < reservasPorDia; reservaDelDia++) {
        const nombreIndex = Math.floor(Math.random() * nombres.length);
        const hoy = new Date(2025, 8, 3);
        
        let estado: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
        if (fechaDelDia < hoy) {
          estado = Math.random() < 0.85 ? 'COMPLETED' : 'CANCELLED';
        } else if (fechaDelDia.getTime() === hoy.getTime()) {
          estado = Math.random() < 0.8 ? 'CONFIRMED' : 'PENDING';
        } else {
          const rand = Math.random();
          if (rand < 0.75) estado = 'CONFIRMED';
          else if (rand < 0.95) estado = 'PENDING';
          else estado = 'CANCELLED';
        }
        
        reservations.push({
          id: `sep2025-${reservaId}`,
          guestName: nombres[nombreIndex],
          guestEmail: emails[nombreIndex],
          guestPhone: `+56 9 ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
          tableNumber: mesas[Math.floor(Math.random() * mesas.length)],
          covers: Math.floor(Math.random() * 6) + 2, // 2-7 personas
          date: fechaDelDia.toISOString(),
          time: horarios[Math.floor(Math.random() * horarios.length)],
          status: estado,
          createdAt: new Date().toISOString()
        });
        
        reservaId++;
      }
    }
    
    console.log(`📅 Generadas ${reservations.length} reservas para septiembre 2025 (vista principal)`);
    return reservations;
  };

  const getFilteredReservations = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (activeFilter) {
      case 'today':
        return reservations.filter(r => 
          new Date(r.date).toDateString() === today.toDateString()
        );
      case 'tomorrow':
        return reservations.filter(r =>
          new Date(r.date).toDateString() === tomorrow.toDateString()
        );
      case 'future':
        return reservations.filter(r => new Date(r.date) > tomorrow);
      default:
        return reservations;
    }
  };

  const filteredReservations = getFilteredReservations();

  const [showAddReservationDialog, setShowAddReservationDialog] = useState(false);
  const [newReservation, setNewReservation] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    tableNumber: '',
    covers: 2,
    date: '',
    time: '',
    notes: ''
  });

  const handleAddReservation = () => {
    setShowAddReservationDialog(true);
  };

  const handleSaveReservation = () => {
    if (!newReservation.guestName || !newReservation.date || !newReservation.time) {
      alert('Por favor complete los campos obligatorios: Nombre, Fecha y Hora');
      return;
    }

    const newReservationData: Reservation = {
      id: `new-${Date.now()}`,
      guestName: newReservation.guestName,
      guestEmail: newReservation.guestEmail || undefined,
      guestPhone: newReservation.guestPhone || undefined,
      tableNumber: newReservation.tableNumber || undefined,
      covers: newReservation.covers,
      date: newReservation.date,
      time: newReservation.time,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    const updatedReservations = [...reservations, newReservationData];
    setReservations(updatedReservations);
    
    // Reset form
    setNewReservation({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      tableNumber: '',
      covers: 2,
      date: '',
      time: '',
      notes: ''
    });
    
    setShowAddReservationDialog(false);
    alert('✅ Reserva agregada exitosamente');
  };

  // Función para marcar llegada manual
  const handleMarcarLlegada = async () => {
    const today = new Date().toISOString().split('T')[0];
    const reservacionesHoy = reservations.filter(r => 
      r.date.startsWith(today) && 
      (r.status === 'CONFIRMED' || r.status === 'PENDING') &&
      !r.arrivedAt
    );

    if (reservacionesHoy.length === 0) {
      await Swal.fire({
        title: 'Sin reservas',
        text: 'No hay reservas confirmadas para hoy que no hayan llegado',
        icon: 'info',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Crear opciones para el dropdown
    const opcionesClientes = reservacionesHoy.map(r => 
      `<option value="${r.id}">${r.guestName} - Mesa ${r.tableNumber || 'Sin asignar'} - ${r.time}</option>`
    ).join('');

    const { value: reservaId } = await Swal.fire({
      title: '👥 Marcar Llegada de Cliente',
      html: `
        <div class="text-left space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-blue-800">
              <strong>Instrucciones:</strong><br>
              • Selecciona el cliente de la lista de reservas de hoy<br>
              • Se marcará automáticamente como "Cliente Llegó"<br>
              • Esta acción se puede hacer manualmente o automáticamente al escanear QR
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Cliente que llegó:</label>
            <select id="clienteSelect" class="swal2-select" style="width: 100%;">
              <option value="">-- Seleccionar cliente --</option>
              ${opcionesClientes}
            </select>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p class="text-xs text-gray-600">
              <strong>Reservas encontradas:</strong> ${reservacionesHoy.length} cliente(s) esperando
            </p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Marcar Llegada',
      cancelButtonText: 'Cancelar',
      width: '500px',
      preConfirm: () => {
        const clienteId = (document.getElementById('clienteSelect') as HTMLSelectElement)?.value;
        if (!clienteId) {
          Swal.showValidationMessage('Por favor selecciona un cliente');
          return false;
        }
        return clienteId;
      }
    });

    if (reservaId) {
      // Encontrar la reserva y marcarla como llegada
      const reservaSeleccionada = reservacionesHoy.find(r => r.id === reservaId);
      if (reservaSeleccionada) {
        const ahora = new Date().toISOString();
        const reservasActualizadas = reservations.map(r =>
          r.id === reservaId
            ? { ...r, status: 'ARRIVED' as const, arrivedAt: ahora }
            : r
        );
        
        setReservations(reservasActualizadas);
        
        // Registrar llegada en el sistema global
        ArrivalsManager.addArrival({
          guestName: reservaSeleccionada.guestName,
          tableNumber: reservaSeleccionada.tableNumber || 'Sin asignar',
          type: 'manual',
          reservationId: reservaSeleccionada.id
        });
        
        await Swal.fire({
          title: '✅ ¡Cliente Registrado!',
          html: `
            <div class="text-center">
              <div class="mb-4">
                <p class="text-lg font-semibold">${reservaSeleccionada.guestName}</p>
                <p class="text-gray-600">ha sido marcado como llegado</p>
              </div>
              <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                <p class="text-sm text-green-800">
                  <strong>Detalles:</strong><br>
                  • Mesa: ${reservaSeleccionada.tableNumber || 'Sin asignar'}<br>
                  • Hora reserva: ${reservaSeleccionada.time}<br>
                  • Llegó a: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}<br>
                  • Personas: ${reservaSeleccionada.covers}
                </p>
              </div>
            </div>
          `,
          icon: 'success',
          timer: 4000,
          showConfirmButton: false
        });
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando reservas...</div>;
  }

  // Mostrar vista de calendario si está activada
  if (showCalendarView) {
    return <CalendarView onBack={() => setShowCalendarView(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
          <p className="text-gray-600 mt-1">Administra las reservas de tu restaurante</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-right">
            <span className="text-gray-600">Tu Link de Reservas: </span>
            <a 
              href="https://airestaurante.com/reservas_portal/jaraquemada" 
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://airestaurante.com/reservas_portal...
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowCalendarView(true)}
              className="flex items-center space-x-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Vista Calendario</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleMarcarLlegada}
              className="flex items-center space-x-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <UserCheck className="h-4 w-4" />
              <span>Marcar Llegada</span>
            </Button>
            <Button onClick={handleAddReservation} className="bg-black hover:bg-gray-800 text-white">
              Agregar Reserva
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="locales" className="space-y-4" onValueChange={(value) => console.log('Reservas Tab changed:', value)}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
          <TabsTrigger 
            value="locales" 
            onClick={() => console.log('Locales tab clicked')}
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            Listado de Locales
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            onClick={() => console.log('Analytics tab clicked')}
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            Datos Analíticos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="locales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Restaurante Jaraquemada */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">JARAQUEMADA</h2>
                    
                    <div className="grid grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {reservations.filter(r => {
                            const reservationDate = new Date(r.date);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return reservationDate >= weekAgo;
                          }).length}
                        </div>
                        <div className="text-sm text-gray-600">Últ. 7 días</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {reservations.filter(r => 
                            new Date(r.date).toDateString() === new Date().toDateString()
                          ).length}
                        </div>
                        <div className="text-sm text-gray-600">Reservas Hoy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {reservations.filter(r => new Date(r.date) > new Date()).length}
                        </div>
                        <div className="text-sm text-gray-600">Reservas Futuras</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => console.log('Acceder al Local')}
                      >
                        Acceder al Local
                      </Button>
                      
                      <Link href="/reservas/configuracion">
                        <Button 
                          variant="outline" 
                          className="w-full"
                        >
                          Configuración del Local
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => console.log('Agregar Reserva')}
                      >
                        Agregar Reserva
                      </Button>
                      
                      <Button 
                        variant="link" 
                        className="w-full text-blue-600 hover:text-blue-700"
                        onClick={() => console.log('Local Activo para Reservas')}
                      >
                        Local Activo para Reservas
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Llegadas en Tiempo Real */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span>Llegadas Hoy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {llegadasHoy.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="text-gray-400 mb-2">
                          <Clock className="h-8 w-8 mx-auto" />
                        </div>
                        <p className="text-sm text-gray-500">Sin llegadas aún</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Los clientes aparecerán aquí cuando:
                        </p>
                        <ul className="text-xs text-gray-400 mt-2 space-y-1">
                          <li>• Marquen llegada manual</li>
                          <li>• Escaneen QR de mesa</li>
                        </ul>
                      </div>
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-green-600">{llegadasHoy.length}</div>
                          <div className="text-sm text-gray-600">Cliente(s) llegaron</div>
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {llegadasHoy.slice().reverse().map((llegada, index) => (
                            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-green-800">{llegada.guestName}</p>
                                  <p className="text-sm text-green-700">Mesa {llegada.tableNumber}</p>
                                </div>
                                <div className="text-right">
                                  <div className={`px-2 py-1 rounded-full text-xs ${
                                    llegada.type === 'automatic' 
                                      ? 'bg-purple-100 text-purple-700' 
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {llegada.type === 'automatic' ? '📱 QR Auto' : '👤 Manual'}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(llegada.arrivedAt).toLocaleTimeString('es-ES', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <div className="pt-3 border-t border-gray-200">
                      <Button 
                        variant="outline"
                        onClick={() => ArrivalsManager.clearArrivals()}
                        className="w-full text-xs text-gray-600 hover:text-gray-800"
                        disabled={llegadasHoy.length === 0}
                      >
                        Limpiar Lista
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agregar Local */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Agregar Local</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="localName">Nombre del Local</Label>
                      <Input 
                        id="localName" 
                        placeholder="Nombre del nuevo local"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="localAddress">Dirección</Label>
                      <Input 
                        id="localAddress" 
                        placeholder="Dirección completa"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="localPhone">Teléfono</Label>
                      <Input 
                        id="localPhone" 
                        placeholder="+34 XXX XXX XXX"
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
                      onClick={() => console.log('Agregar nuevo local')}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Local
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Dashboard Visual Principal */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Análisis Histórico</h2>
              <p className="text-gray-600">Datos en tiempo real de tu restaurante</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Métricas de Reservas */}
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600 mb-1">{reservations.length}</div>
                <div className="text-sm font-medium text-gray-700">Reservas Total</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-green-500">
                <div className="text-3xl font-bold text-green-600 mb-1">{Math.round(reservations.length / 30)}</div>
                <div className="text-sm font-medium text-gray-700">Prom. Diario</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-orange-500">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {reservations.filter(r => 
                    new Date(r.date).toDateString() === new Date(2025, 8, 3).toDateString()
                  ).length}
                </div>
                <div className="text-sm font-medium text-gray-700">Hoy</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-purple-500">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {reservations.filter(r => 
                    new Date(r.date).toDateString() === new Date(2025, 8, 2).toDateString()
                  ).length}
                </div>
                <div className="text-sm font-medium text-gray-700">Ayer</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-indigo-500">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {reservations.filter(r => {
                    const reservationDate = new Date(r.date);
                    const weekAgo = new Date(2025, 8, 3);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return reservationDate >= weekAgo;
                  }).length}
                </div>
                <div className="text-sm font-medium text-gray-700">Últ. 7 días</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-pink-500">
                <div className="text-3xl font-bold text-pink-600 mb-1">
                  {reservations.filter(r => 
                    new Date(r.date).getMonth() === 8 && new Date(r.date).getFullYear() === 2025
                  ).length}
                </div>
                <div className="text-sm font-medium text-gray-700">Este Mes</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-teal-500">
                <div className="text-3xl font-bold text-teal-600 mb-1">
                  {new Set(reservations.map(r => r.guestName)).size}
                </div>
                <div className="text-sm font-medium text-gray-700">Clientes Únicos</div>
              </div>
            </div>
          </div>

          {/* Dashboard de Clientes */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">👥 Análisis de Clientes</h2>
              <p className="text-gray-600">Comportamiento y engagement</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-emerald-500">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {new Set(reservations.map(r => r.guestName)).size}
                </div>
                <div className="text-sm font-medium text-gray-700">Total Clientes</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-cyan-500">
                <div className="text-3xl font-bold text-cyan-600 mb-1">
                  {Math.round(new Set(reservations.map(r => r.guestName)).size / 30)}
                </div>
                <div className="text-sm font-medium text-gray-700">Prom. Diario</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-lime-500">
                <div className="text-3xl font-bold text-lime-600 mb-1">
                  {new Set(reservations.filter(r => 
                    new Date(r.date).toDateString() === new Date(2025, 8, 3).toDateString()
                  ).map(r => r.guestName)).size}
                </div>
                <div className="text-sm font-medium text-gray-700">Clientes Hoy</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-yellow-500">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {new Set(reservations.filter(r => 
                    new Date(r.date).toDateString() === new Date(2025, 8, 2).toDateString()
                  ).map(r => r.guestName)).size}
                </div>
                <div className="text-sm font-medium text-gray-700">Ayer</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-red-500">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {new Set(reservations.filter(r => {
                    const reservationDate = new Date(r.date);
                    const weekAgo = new Date(2025, 8, 3);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return reservationDate >= weekAgo;
                  }).map(r => r.guestName)).size}
                </div>
                <div className="text-sm font-medium text-gray-700">Últ. 7 días</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-violet-500">
                <div className="text-3xl font-bold text-violet-600 mb-1">
                  {new Set(reservations.filter(r => 
                    new Date(r.date).getMonth() === 8 && new Date(r.date).getFullYear() === 2025
                  ).map(r => r.guestName)).size}
                </div>
                <div className="text-sm font-medium text-gray-700">Este Mes</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border-l-4 border-rose-500">
                <div className="text-3xl font-bold text-rose-600 mb-1">
                  {Math.round(new Set(reservations.map(r => r.guestName)).size * 0.15)}
                </div>
                <div className="text-sm font-medium text-gray-700">1ra vez este mes</div>
              </div>
            </div>
          </div>

          {/* Gráfico de Reservas Últimos 15 días */}
          <Card>
            <CardHeader>
              <CardTitle>Reservas Últimos 15 días</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { dia: '1', reservas: 12 }, { dia: '2', reservas: 15 }, { dia: '3', reservas: 18 },
                  { dia: '4', reservas: 14 }, { dia: '5', reservas: 20 }, { dia: '6', reservas: 25 },
                  { dia: '7', reservas: 23 }, { dia: '8', reservas: 16 }, { dia: '9', reservas: 19 },
                  { dia: '10', reservas: 22 }, { dia: '11', reservas: 24 }, { dia: '12', reservas: 27 },
                  { dia: '13', reservas: 29 }, { dia: '14', reservas: 31 }, { dia: '15', reservas: 26 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="reservas" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dos columnas: Comprobantes y Top 10 Clientes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comprobantes Últimos 15 días */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comprobantes Últimos 15 días</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reservations.slice(0, 6).map((reserva) => (
                    <div key={reserva.id} className="flex items-center space-x-3 py-2 border-b">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Plus className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{reserva.guestName}</div>
                        <div className="text-sm text-gray-600">
                          Reserva para {reserva.covers} a las {reserva.time}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(reserva.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top 10 de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top 10 de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Blanca Marantino', 'Franco Martinelli', 'Joaquín Lara', 
                    'María Esperanza', 'Ricardo Saletta', 'Pedro Pascal',
                    'Fabiola Pascual', 'Arturo Prat', 'Gabriela Mistral', 'Pablo Neruda'
                  ].map((cliente, index) => (
                    <div key={cliente} className="flex items-center space-x-3 py-2 border-b">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Plus className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{cliente}</div>
                        <div className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 5) + 3} reservas, ult. {Math.floor(Math.random() * 10) + 15} de ago
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Proyecciones con IA */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center space-x-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <span>🤖 Proyecciones con IA</span>
              </h2>
              <p className="text-gray-600">Inteligencia artificial predictiva para tu negocio</p>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span>Proyección de Demanda Semanal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { mes: 'Ene', proyectadas: 25, actuales: 20 },
                    { mes: 'Feb', proyectadas: 28, actuales: 26 },
                    { mes: 'Mar', proyectadas: 32, actuales: 35 },
                    { mes: 'Abr', proyectadas: 30, actuales: 32 },
                    { mes: 'May', proyectadas: 35, actuales: 28 },
                    { mes: 'Jun', proyectadas: 38, actuales: 25 },
                    { mes: 'Jul', proyectadas: 40, actuales: 30 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="proyectadas" fill="#8B5CF6" name="Reservas Proyectadas" />
                    <Bar dataKey="actuales" fill="#10B981" name="Reservas Actuales" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Predicción de No-Show y Optimización */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Predicción de No-Show */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-orange-800 flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Predicción de "No-Show" (Prox. Fin de Semana)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600 mb-1">12%</div>
                        <div className="text-sm text-orange-700">Probabilidad de no asistencia</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-orange-800 font-medium mb-2">Factores clave:</div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-orange-700">
                            <Cloud className="h-4 w-4" />
                            <span>Clima Lluvioso</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-orange-700">
                            <Calendar className="h-4 w-4" />
                            <span>Eventos Locales</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sugerencia de Optimización */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-purple-800 flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>Sugerencia de Optimización IA</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-800 font-medium mb-2">
                        💡 Recomendación para Hora Punta:
                      </div>
                      <div className="text-sm text-purple-700 mb-3">
                        Para <strong>maximizar ocupación</strong>, la IA sugiere unir las mesas <strong>#5, #7 y #9</strong> para acomodar grupos grandes durante las horas pico (19:00-21:00).
                      </div>
                      <div className="text-xs text-purple-600 bg-purple-100 p-2 rounded">
                        <strong>Impacto estimado:</strong> +15% capacidad en horario punta
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => {
                        // Mostrar notificación de que está navegando
                        alert('🎯 Navegando al Diseñador de Mesas...');
                        // Navegar después de un breve delay
                        setTimeout(() => {
                          window.location.href = '/reservas/mapa-mesas';
                        }, 500);
                      }}
                    >
                      <Layout className="h-4 w-4 mr-2" />
                      Ir al Diseñador de Mesas
                    </Button>
                  </CardContent>
                </Card>
            </div>

            {/* Próximos Eventos de Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-lg">
                    <Cake className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Cumpleaños de Ana García</div>
                    <div className="text-blue-100">21 de Agosto • ¡Prepara sorpresa!</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-lg">
                    <Users className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Aniversario de Carlos S.</div>
                    <div className="text-pink-100">2 de Septiembre • Mesa romántica</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros de Análisis Histórico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span>Filtros de Análisis Histórico</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fechaDesde" className="text-base font-medium">📅 Fecha Desde</Label>
                    <Input 
                      id="fechaDesde"
                      type="date" 
                      defaultValue="2025-08-01"
                      className="mt-2 text-lg"
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fechaHasta" className="text-base font-medium">📅 Fecha Hasta</Label>
                    <Input 
                      id="fechaHasta"
                      type="date" 
                      defaultValue="2025-09-03"
                      className="mt-2 text-lg"
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Actualizar Análisis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Análisis Visual Mejorado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Horas Punta de Reservas - Diseño Visual Mejorado */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-green-800 flex items-center justify-center space-x-2">
                  <Clock className="h-6 w-6" />
                  <span>🕐 Horas Punta</span>
                </CardTitle>
                <p className="text-green-700">Pico de actividad diaria</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">🌅 Almuerzo (12-15h)</span>
                      <span className="text-2xl font-bold text-green-600">35</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div className="bg-green-500 h-3 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border-l-4 border-red-500">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">🌆 Cena (19-22h)</span>
                      <span className="text-2xl font-bold text-red-600">135</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div className="bg-red-500 h-3 rounded-full" style={{width: '100%'}}></div>
                    </div>
                    <div className="text-xs text-red-600 mt-1">⭐ Horario más popular</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edades de Clientes - Visual Mejorado */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-blue-800 flex items-center justify-center space-x-2">
                  <Users className="h-6 w-6" />
                  <span>👶 Edades</span>
                </CardTitle>
                <p className="text-blue-700">Distribución por grupos etarios</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">🧒 20-25 años</span>
                    <span className="text-2xl font-bold text-blue-600">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{width: '28%'}}></div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">👨 26-35 años</span>
                    <span className="text-2xl font-bold text-purple-600">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full" style={{width: '22%'}}></div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">👩 36+ años</span>
                    <span className="text-2xl font-bold text-green-600">50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '50%'}}></div>
                  </div>
                  <div className="text-xs text-green-600 mt-1">⭐ Grupo predominante</div>
                </div>
              </CardContent>
            </Card>

            {/* Eventos de Clientes - Visual Mejorado */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-purple-800 flex items-center justify-center space-x-2">
                  <Cake className="h-6 w-6" />
                  <span>🎉 Eventos</span>
                </CardTitle>
                <p className="text-purple-700">Celebraciones importantes</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl text-center">
                  <div className="text-4xl font-bold mb-1">16</div>
                  <div className="text-purple-100 font-medium">Han celebrado cumpleaños</div>
                  <Button 
                    size="sm" 
                    className="bg-white text-purple-600 hover:bg-purple-50 mt-2"
                    onClick={() => {
                      alert('🎂 Lista de Clientes que Celebraron:\n\n' +
                        '• Ana García (21 ago) - Mesa 5\n' +
                        '• Carlos Mendez (18 ago) - Mesa 12\n' +
                        '• María López (15 ago) - Mesa 8\n' +
                        '• Roberto Silva (12 ago) - Mesa 15\n' +
                        '• Laura Ruiz (10 ago) - Mesa 3\n' +
                        '• Pedro Martín (8 ago) - Mesa 20\n' +
                        '• Sofia Castro (5 ago) - Mesa 7\n' +
                        '• Diego Morales (3 ago) - Mesa 11\n' +
                        '• Carmen Vega (1 ago) - Mesa 18\n' +
                        '• Miguel Torres (29 jul) - Mesa 6\n\n' +
                        '¡Excelente historial de celebraciones! 🎉');
                    }}
                  >
                    Ver Lista Completa
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl text-center">
                  <div className="text-4xl font-bold mb-1">8</div>
                  <div className="text-orange-100 font-medium">Próximos cumpleaños (15 días)</div>
                  <Button 
                    size="sm" 
                    className="bg-white text-orange-600 hover:bg-orange-50 mt-2"
                    onClick={() => {
                      alert('🎯 Plan de Sorpresas para Próximos Cumpleaños:\n\n' +
                        '📅 SEPTIEMBRE 2025:\n\n' +
                        '🎂 Carlos S. (2 sep)\n' +
                        '   • Mesa romántica preferida\n' +
                        '   • Postre especial gratis\n' +
                        '   • Decoración discreta\n\n' +
                        '🎂 Valentina R. (7 sep)\n' +
                        '   • Grupo grande (12 personas)\n' +
                        '   • Reservar área privada\n' +
                        '   • Torta personalizada\n\n' +
                        '🎂 Fernando P. (12 sep)\n' +
                        '   • Cliente VIP - atención especial\n' +
                        '   • Mesa ventana vista\n' +
                        '   • Botella cortesía\n\n' +
                        '¿Quieres configurar recordatorios automáticos? 🔔');
                    }}
                  >
                    Planificar Sorpresas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comportamientos y Tendencias - Visual Completamente Nuevo */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-6 rounded-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📈 Comportamientos y Tendencias</h2>
              <p className="text-gray-600">Análisis predictivo del comportamiento</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Asistencia - Círculo Visual Grande */}
              <Card className="text-center bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-800">✅ Asistencia de Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center border-8 border-green-500">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-700">95%</div>
                        <div className="text-xs text-green-600">Excelente</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                      <span className="text-green-800 font-medium">✅ Asistieron</span>
                      <span className="text-green-700 font-bold">95%</span>
                    </div>
                    <div className="flex justify-between items-center bg-red-50 p-2 rounded">
                      <span className="text-red-800 font-medium">❌ No llegaron</span>
                      <span className="text-red-700 font-bold">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Motivos - Iconos Grandes */}
              <Card className="bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-bold text-gray-800">🎯 Motivos de Reservas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-blue-800">🍽️ Ocasional</span>
                      <span className="text-2xl font-bold text-blue-600">38%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '38%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-purple-800">🎂 Cumpleaños</span>
                      <span className="text-2xl font-bold text-purple-600">22%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '22%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-pink-800">💕 Cita</span>
                      <span className="text-xl font-bold text-pink-600">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-600 h-2 rounded-full" style={{width: '18%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>🎊 Aniversario</span>
                      <span className="font-bold text-green-600">14%</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>💼 Negocios</span>
                      <span className="font-bold text-gray-600">8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Origen - Círculo Visual */}
              <Card className="text-center bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-800">🔗 Origen de Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center border-8 border-blue-500">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-700">84%</div>
                        <div className="text-xs text-blue-600">Online</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-blue-800">🔗 Link de Clientes</span>
                      </div>
                      <span className="text-xl font-bold text-blue-700">84%</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">✍️ Carga Manual</span>
                      </div>
                      <span className="text-xl font-bold text-gray-600">16%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuración de Reservas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Activar Reservas</Label>
                  <p className="text-sm text-gray-600">
                    Permitir que los clientes hagan reservas en línea
                  </p>
                </div>
                <Switch
                  checked={reservationsEnabled}
                  onCheckedChange={setReservationsEnabled}
                />
              </div>

              <div>
                <Label htmlFor="welcomeMessage" className="text-base font-medium">
                  Mensaje de Bienvenida
                </Label>
                <Textarea
                  id="welcomeMessage"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="mt-2"
                  rows={3}
                  placeholder="Mensaje que verán los clientes al hacer una reserva"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Horario de Apertura</Label>
                  <Input type="time" defaultValue="08:00" className="mt-2" />
                </div>
                <div>
                  <Label className="text-base font-medium">Horario de Cierre</Label>
                  <Input type="time" defaultValue="22:00" className="mt-2" />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Capacidad Máxima</Label>
                <Input
                  type="number"
                  defaultValue={50}
                  className="mt-2"
                  placeholder="Número máximo de comensales"
                />
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200">
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para Agregar Nueva Reserva */}
      <Dialog open={showAddReservationDialog} onOpenChange={setShowAddReservationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Agregar Nueva Reserva</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guestName">Nombre del Cliente *</Label>
              <Input
                id="guestName"
                value={newReservation.guestName}
                onChange={(e) => setNewReservation(prev => ({...prev, guestName: e.target.value}))}
                placeholder="Ej: María González"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="guestEmail">Email</Label>
              <Input
                id="guestEmail"
                type="email"
                value={newReservation.guestEmail}
                onChange={(e) => setNewReservation(prev => ({...prev, guestEmail: e.target.value}))}
                placeholder="cliente@email.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="guestPhone">Teléfono</Label>
              <Input
                id="guestPhone"
                value={newReservation.guestPhone}
                onChange={(e) => setNewReservation(prev => ({...prev, guestPhone: e.target.value}))}
                placeholder="+56 9 1234 5678"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="tableNumber">Mesa</Label>
              <Input
                id="tableNumber"
                value={newReservation.tableNumber}
                onChange={(e) => setNewReservation(prev => ({...prev, tableNumber: e.target.value}))}
                placeholder="Ej: 5 o Terraza 1"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="covers">Número de Personas *</Label>
              <Input
                id="covers"
                type="number"
                min="1"
                max="20"
                value={newReservation.covers}
                onChange={(e) => setNewReservation(prev => ({...prev, covers: parseInt(e.target.value) || 2}))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={newReservation.date}
                onChange={(e) => setNewReservation(prev => ({...prev, date: e.target.value}))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="time">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={newReservation.time}
                onChange={(e) => setNewReservation(prev => ({...prev, time: e.target.value}))}
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notas Especiales</Label>
              <Textarea
                id="notes"
                value={newReservation.notes}
                onChange={(e) => setNewReservation(prev => ({...prev, notes: e.target.value}))}
                placeholder="Ej: Cliente vegetariano, cumpleaños, mesa cerca de ventana..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddReservationDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveReservation}
              className="bg-green-600 hover:bg-green-700"
            >
              Guardar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
