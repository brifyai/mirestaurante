
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
// @ts-ignore
import * as RBC from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Phone, 
  Mail,
  MapPin,
  ArrowLeft,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';

// Configurar moment en español
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_')
});

const localizer = momentLocalizer(moment);

interface Reservation {
  id: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  tableNumber?: string;
  covers: number;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  notes?: string | null;
  createdAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Reservation;
}

interface CalendarViewProps {
  onBack: () => void;
}

const statusColors = {
  CONFIRMED: '#10B981',
  PENDING: '#F59E0B', 
  CANCELLED: '#EF4444',
  COMPLETED: '#6366F1',
};

const statusLabels = {
  CONFIRMED: 'Confirmada',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
};

export default function CalendarView({ onBack }: CalendarViewProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 3)); // 3 de septiembre 2025
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

  useEffect(() => {
    loadReservations();
  }, []);

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
    
    const telefonos = [
      '+56 9 8765 4321', '+56 9 1234 5678', '+56 9 9876 5432', '+56 9 5555 1234',
      '+56 9 7777 8888', '+56 9 3333 4444', '+56 9 6666 7777', '+56 9 2222 3333',
      '+56 9 4444 5555', '+56 9 8888 9999', '+56 9 1111 2222', '+56 9 9999 0000',
      '+56 9 5678 1234', '+56 9 8765 4321', '+56 9 3456 7890', '+56 9 6543 2109',
      '+56 9 2468 1357', '+56 9 1357 2468', '+56 9 9753 1864', '+56 9 8642 9753'
    ];
    
    const horarios = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
    const estados: ('CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED')[] = ['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'];
    const mesas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Terraza 1', 'Terraza 2', 'Privado'];
    
    const notas = [
      'Cliente vegetariano',
      'Cumpleaños - traer postre especial',
      'Alérgico a mariscos',
      'Mesa cerca de la ventana',
      'Cliente VIP',
      'Primera visita',
      'Cena romántica - mesa privada',
      'Celebración aniversario',
      'Cliente regular',
      'Mesa para silla de ruedas',
      'Grupo empresarial',
      'Mesa exterior preferida',
      'Sin cebolla en platos',
      'Cliente habitual - mesa 7',
      'Reserva de último momento',
      null, null, null // Algunas reservas sin notas
    ];
    
    // GENERAR RESERVAS ESPECÍFICAMENTE PARA SEPTIEMBRE 2025
    const septiembre2025 = new Date(2025, 8); // Mes 8 = Septiembre (0-indexado)
    const diasSeptiembre = 30; // Septiembre tiene 30 días
    
    let reservaId = 1;
    
    // Generar reservas distribuidas a lo largo de septiembre 2025
    for (let dia = 1; dia <= diasSeptiembre; dia++) {
      const fechaDelDia = new Date(2025, 8, dia); // Año 2025, mes Septiembre, día específico
      const diaSemana = fechaDelDia.getDay(); // 0=Domingo, 6=Sábado
      
      // Determinar cuántas reservas por día
      let reservasPorDia = 0;
      
      if (diaSemana === 0) { // Domingo
        reservasPorDia = Math.floor(Math.random() * 4) + 1; // 1-4 reservas
      } else if (diaSemana === 1 || diaSemana === 2 || diaSemana === 3 || diaSemana === 4) { // Lun-Jue
        reservasPorDia = Math.floor(Math.random() * 4) + 2; // 2-5 reservas
      } else if (diaSemana === 5 || diaSemana === 6) { // Vie-Sáb
        reservasPorDia = Math.floor(Math.random() * 6) + 4; // 4-9 reservas (más actividad)
      }
      
      // Generar reservas para este día específico
      for (let reservaDelDia = 0; reservaDelDia < reservasPorDia; reservaDelDia++) {
        const nombreIndex = Math.floor(Math.random() * nombres.length);
        
        // Distribución realista de estados
        let estado: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
        const hoy = new Date(2025, 8, 3); // 3 de septiembre de 2025
        
        if (fechaDelDia < hoy) {
          // Fechas pasadas: principalmente completadas
          estado = Math.random() < 0.85 ? 'COMPLETED' : 'CANCELLED';
        } else if (fechaDelDia.getTime() === hoy.getTime()) {
          // Hoy: mix de confirmadas y pendientes
          estado = Math.random() < 0.8 ? 'CONFIRMED' : 'PENDING';
        } else {
          // Fechas futuras: principalmente confirmadas, algunas pendientes
          const rand = Math.random();
          if (rand < 0.75) estado = 'CONFIRMED';
          else if (rand < 0.95) estado = 'PENDING';
          else estado = 'CANCELLED';
        }
        
        reservations.push({
          id: `sep2025-${reservaId}`,
          guestName: nombres[nombreIndex],
          guestEmail: emails[nombreIndex],
          guestPhone: telefonos[nombreIndex],
          tableNumber: mesas[Math.floor(Math.random() * mesas.length)],
          covers: Math.floor(Math.random() * 8) + 1, // 1-8 personas
          date: fechaDelDia.toISOString(),
          time: horarios[Math.floor(Math.random() * horarios.length)],
          status: estado,
          notes: notas[Math.floor(Math.random() * notas.length)],
          createdAt: new Date(fechaDelDia.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        reservaId++;
      }
    }
    
    // Agregar algunas reservas adicionales para fechas clave de septiembre
    const fechasEspeciales = [
      { dia: 6, reservasExtra: 8, motivo: 'Viernes especial' },
      { dia: 7, reservasExtra: 12, motivo: 'Sábado popular' },
      { dia: 13, reservasExtra: 6, motivo: 'Viernes 13' },
      { dia: 14, reservasExtra: 10, motivo: 'Sábado noche' },
      { dia: 15, reservasExtra: 5, motivo: 'Domingo familiar' },
      { dia: 21, reservasExtra: 7, motivo: 'Equinoccio de primavera' },
      { dia: 28, reservasExtra: 9, motivo: 'Fin de semana activo' }
    ];
    
    fechasEspeciales.forEach(fecha => {
      for (let i = 0; i < fecha.reservasExtra; i++) {
        const fechaEspecial = new Date(2025, 8, fecha.dia);
        const nombreIndex = Math.floor(Math.random() * nombres.length);
        
        reservations.push({
          id: `especial-${fecha.dia}-${i}`,
          guestName: nombres[nombreIndex],
          guestEmail: emails[nombreIndex],
          guestPhone: telefonos[nombreIndex],
          tableNumber: mesas[Math.floor(Math.random() * mesas.length)],
          covers: Math.floor(Math.random() * 6) + 2, // 2-7 personas
          date: fechaEspecial.toISOString(),
          time: horarios[Math.floor(Math.random() * horarios.length)],
          status: fechaEspecial > new Date(2025, 8, 3) ? 'CONFIRMED' : 'COMPLETED',
          notes: `${fecha.motivo} - ${notas[Math.floor(Math.random() * (notas.length - 3))]}`,
          createdAt: new Date(fechaEspecial.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    });
    
    // Ordenar por fecha
    reservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log(`📅 Generadas ${reservations.length} reservas para septiembre 2025`);
    
    return reservations;
  };

  const loadReservations = async () => {
    // Usar datos de ejemplo directamente para demostración
    const exampleReservations = generateExampleReservations();
    console.log('Loaded reservations:', exampleReservations.length);
    setReservations(exampleReservations);
    convertToEvents(exampleReservations);
    setIsLoading(false);
  };

  const convertToEvents = (reservations: Reservation[]) => {
    console.log('Converting reservations to events:', reservations.length);
    
    const calendarEvents: CalendarEvent[] = reservations.map(reservation => {
      const [hours, minutes] = reservation.time.split(':');
      const eventDate = new Date(reservation.date);
      eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const endDate = new Date(eventDate);
      endDate.setHours(eventDate.getHours() + 2); // Asumimos 2 horas por reserva

      const event = {
        id: reservation.id,
        title: `${reservation.guestName} (${reservation.covers} pers.)`,
        start: eventDate,
        end: endDate,
        resource: reservation
      };
      
      console.log('Created event:', event.title, 'for date:', eventDate.toDateString());
      return event;
    });

    console.log('Total calendar events created:', calendarEvents.length);
    setEvents(calendarEvents);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

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
      notes: newReservation.notes || null,
      createdAt: new Date().toISOString()
    };

    const updatedReservations = [...reservations, newReservationData];
    setReservations(updatedReservations);
    convertToEvents(updatedReservations);
    
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

  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource.status;
    const backgroundColor = statusColors[status];
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: status === 'CANCELLED' ? 0.6 : 1,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  const customMessages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Reserva',
    noEventsInRange: 'No hay reservas en este rango de fechas.',
    showMore: (total: number) => `+ Ver ${total} más`
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">Cargando calendario de reservas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Listado</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vista de Calendario - Septiembre 2025</h1>
            <p className="text-gray-600 mt-1">Visualiza todas las {reservations.length} reservas como en Google Calendar</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleAddReservation}
            className="bg-black hover:bg-gray-800 text-white flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Reserva</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date(2025, 8, 3))}
            className="flex items-center space-x-1"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Ir a Septiembre 2025</span>
          </Button>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Confirmadas
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
            Pendientes
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            Canceladas
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
            Completadas
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div style={{ height: '600px' }}>
            {React.createElement(Calendar as any, {
              localizer: localizer,
              events: events,
              startAccessor: "start",
              endAccessor: "end",
              onSelectEvent: handleSelectEvent,
              eventPropGetter: eventStyleGetter,
              messages: customMessages,
              views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA],
              defaultView: Views.MONTH,
              view: currentView,
              onView: setCurrentView,
              date: currentDate,
              onNavigate: setCurrentDate,
              popup: true,
              style: { height: '100%' },
              formats: {
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
                  `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                dayFormat: 'DD',
                dateFormat: 'DD',
                monthHeaderFormat: 'MMMM YYYY',
                weekdayFormat: 'dddd'
              },
              min: new Date(2025, 0, 1, 8, 0), // 8:00 AM
              max: new Date(2025, 0, 1, 23, 30) // 11:30 PM
            })}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalles de reserva */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Detalles de la Reserva</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedEvent.resource.guestName}</h3>
                  <Badge 
                    variant="secondary" 
                    className={
                      selectedEvent.resource.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      selectedEvent.resource.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      selectedEvent.resource.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }
                  >
                    {statusLabels[selectedEvent.resource.status]}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>{moment(selectedEvent.start).format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{moment(selectedEvent.start).format('HH:mm')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{selectedEvent.resource.covers} personas</span>
                  </div>
                  {selectedEvent.resource.tableNumber && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>Mesa {selectedEvent.resource.tableNumber}</span>
                    </div>
                  )}
                </div>

                {(selectedEvent.resource.guestEmail || selectedEvent.resource.guestPhone) && (
                  <div className="border-t pt-4 space-y-2">
                    {selectedEvent.resource.guestEmail && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedEvent.resource.guestEmail}</span>
                      </div>
                    )}
                    {selectedEvent.resource.guestPhone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedEvent.resource.guestPhone}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedEvent.resource.notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 font-medium mb-1">Notas:</p>
                    <p className="text-sm text-gray-800">{selectedEvent.resource.notes}</p>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEventDialog(false)}
                  >
                    Cerrar
                  </Button>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Implementar editar reserva
                        console.log('Editar reserva:', selectedEvent.resource.id);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Implementar llamar cliente
                        if (selectedEvent.resource.guestPhone) {
                          window.open(`tel:${selectedEvent.resource.guestPhone}`);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Llamar
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
