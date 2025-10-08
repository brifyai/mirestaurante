

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Bot, MessageSquare, Mail, Clock, Users, Brain, Smartphone, Trash2, UserCheck, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

interface ConfiguracionLocal {
  // Configuraciones básicas
  mensajeErrorPersonas: string;
  
  // Configuraciones de IA
  activarIA: boolean;
  horariosIA: {
    lunes: { inicio: string; fin: string; activo: boolean };
    martes: { inicio: string; fin: string; activo: boolean };
    miercoles: { inicio: string; fin: string; activo: boolean };
    jueves: { inicio: string; fin: string; activo: boolean };
    viernes: { inicio: string; fin: string; activo: boolean };
    sabado: { inicio: string; fin: string; activo: boolean };
    domingo: { inicio: string; fin: string; activo: boolean };
  };
  personalidadIA: string;
  idiomaRespuestasIA: string;
  tiempoMaximoRespuestaIA: number;
  
  // Configuraciones de WhatsApp
  activarWhatsapp: boolean;
  numeroWhatsapp: string;
  whatsappBusiness: boolean;
  respuestasAutomaticasWhatsapp: boolean;
  mensajeBienvenidaWhatsapp: string;
  activarCatalogoWhatsapp: boolean;
  
  // Recordatorios WhatsApp para reservas
  activarRecordatoriosWhatsapp: boolean;
  recordatoriosWhatsapp: Array<{
    id: string;
    tiempoAntes: number; // minutos antes de la reserva
    mensaje: string;
    activo: boolean;
  }>;
  
  // Configuraciones de Instagram
  activarInstagram: boolean;
  usuarioInstagram: string;
  respuestasAutomaticasInstagram: boolean;
  mensajeBienvenidaInstagram: string;
  
  // Configuraciones de Email
  emailConfirmacion: string;
  emailRecordatorio: string;
  activarEmailAutomatico: boolean;
  tiempoRecordatorio: number;
  emailsNotificacion: string[];
  notificarNuevasReservas: boolean;
  
  // Configuraciones de escalamiento
  escalarAAgenteHumano: boolean;
  palabrasClaveEscalamiento: string[];
  tiempoMaximoSinRespuesta: number;
  emailAgenteHumano: string[];
  
  // Configuraciones de reservas
  confirmarAutomaticamente: boolean;
  motivosHabilitados: {
    ocasional: boolean;
    aniversario: boolean;
    cumpleanos: boolean;
    negocios: boolean;
    cita: boolean;
    menuDelDia: boolean;
    otro: boolean;
    babyShower: boolean;
  };
  
  // Configuraciones de bandeja de entrada
  notificacionesSonido: boolean;
  marcarComoLeido: boolean;
  archivarConversacionesAntiguas: boolean;
  diasArchivarConversaciones: number;
  
  // NUEVAS FUNCIONALIDADES PARA FLUJO COMPLETO
  // Sistema de evaluación post-visita
  activarEvaluacionPostVisita: boolean;
  tiempoEvaluacionMinutos: number; // 90 minutos por defecto
  mensajeEvaluacion: string;
  
  // Integración con Google Calendar
  sincronizarGoogleCalendar: boolean;
  calendarId: string;
  
  // Sistema de matching de clientes
  activarMatchingClientes: boolean;
  
  // Sistema de reseñas automáticas de Google
  activarResenasGoogle: boolean;
  umbralCalificacionParaResena: number; // Solo pedir reseña si califica 4 o más
  mensajeSolicitudResena: string;
}

export default function ConfiguracionLocalContent() {
  const [configuracion, setConfiguracion] = useState<ConfiguracionLocal>({
    // Configuraciones básicas
    mensajeErrorPersonas: 'Lo sentimos, para esta cantidad de personas contáctanos por interno y te acomodamos según',
    
    // Configuraciones de IA
    activarIA: true,
    horariosIA: {
      lunes: { inicio: '08:00', fin: '22:00', activo: true },
      martes: { inicio: '08:00', fin: '22:00', activo: true },
      miercoles: { inicio: '08:00', fin: '22:00', activo: true },
      jueves: { inicio: '08:00', fin: '22:00', activo: true },
      viernes: { inicio: '08:00', fin: '23:00', activo: true },
      sabado: { inicio: '09:00', fin: '23:00', activo: true },
      domingo: { inicio: '09:00', fin: '21:00', activo: true },
    },
    personalidadIA: 'Eres un asistente amigable y profesional del restaurante Jaraquemada. Responde de manera cálida, usa emojis moderadamente y siempre mantén un tono hospitalario. Conoces bien el menú y puedes ayudar con reservas.',
    idiomaRespuestasIA: 'es',
    tiempoMaximoRespuestaIA: 30,
    
    // Configuraciones de WhatsApp
    activarWhatsapp: true,
    numeroWhatsapp: '+56 94104058',
    whatsappBusiness: true,
    respuestasAutomaticasWhatsapp: true,
    mensajeBienvenidaWhatsapp: '¡Hola! 👋 Bienvenido a Jaraquemada Drink Garden. Soy tu asistente virtual y estoy aquí para ayudarte con reservas, menú y cualquier consulta. ¿En qué puedo asistirte hoy?',
    activarCatalogoWhatsapp: true,
    
    // Recordatorios WhatsApp para reservas
    activarRecordatoriosWhatsapp: true,
    recordatoriosWhatsapp: [
      {
        id: '1',
        tiempoAntes: 1440, // 24 horas antes
        mensaje: '¡Hola *Nombre*! 👋 Te recordamos que tienes una reserva mañana en Jaraquemada a las *Hora* para *Personas* personas. ¡Te esperamos! 🍽️',
        activo: true
      },
      {
        id: '2', 
        tiempoAntes: 120, // 2 horas antes
        mensaje: '🕐 ¡Hola *Nombre*! Tu reserva en Jaraquemada es en 2 horas (*Hora*). ¡Nos vemos pronto! Si necesitas cancelar o cambiar algo, contáctanos.',
        activo: true
      },
      {
        id: '3',
        tiempoAntes: 30, // 30 minutos antes
        mensaje: '⚡ *Nombre*, tu mesa te está esperando. Reserva en 30 minutos (*Hora*) para *Personas* personas. ¡Nos vemos en Jaraquemada! 🚀',
        activo: true
      }
    ],
    
    // Configuraciones de Instagram
    activarInstagram: true,
    usuarioInstagram: '@jaraquemada.cl',
    respuestasAutomaticasInstagram: true,
    mensajeBienvenidaInstagram: '¡Hola! 👋 Gracias por contactarnos por Instagram. Soy tu asistente virtual de Jaraquemada. ¿Cómo puedo ayudarte hoy?',
    
    // Configuraciones de Email
    emailConfirmacion: '¡Hola *Nombre del Cliente*! 👋\n\n¡Buenas noticias! 🎉 Estamos encantados de informarte que hemos confirmado tu solicitud de reserva en Jaraquemada Drink Garden. Aquí tienes los detalles:\n\nFecha: *Día de Reserva*\nHora: *Horario de Reserva*\nPersonas: *Cantidad de Personas*\n\n¡Te esperamos!',
    emailRecordatorio: '¡Hola *Nombre del Cliente*! 👋\n\nEste es un recordatorio amigable de tu reserva en Jaraquemada Drink Garden:\n\nFecha: *Día de Reserva*\nHora: *Horario de Reserva*\nPersonas: *Cantidad de Personas*\n\n¡Nos vemos pronto!',
    activarEmailAutomatico: true,
    tiempoRecordatorio: 24,
    emailsNotificacion: [
      'hola@jaraquemada.cl',
      'reservas@jaraquemada.cl', 
      'manager@jaraquemada.cl'
    ],
    notificarNuevasReservas: true,
    
    // Configuraciones de escalamiento
    escalarAAgenteHumano: true,
    palabrasClaveEscalamiento: ['hablar con humano', 'agente humano', 'persona real', 'manager', 'queja', 'problema grave', 'urgente'],
    tiempoMaximoSinRespuesta: 300,
    emailAgenteHumano: ['manager@jaraquemada.cl', 'support@jaraquemada.cl'],
    
    // Configuraciones de reservas
    confirmarAutomaticamente: true,
    motivosHabilitados: {
      ocasional: true,
      aniversario: true,
      cumpleanos: true,
      negocios: true,
      cita: true,
      menuDelDia: false,
      otro: false,
      babyShower: false,
    },
    
    // Configuraciones de bandeja de entrada
    notificacionesSonido: true,
    marcarComoLeido: false,
    archivarConversacionesAntiguas: true,
    diasArchivarConversaciones: 30,
    
    // NUEVAS FUNCIONALIDADES PARA FLUJO COMPLETO
    // Sistema de evaluación post-visita
    activarEvaluacionPostVisita: true,
    tiempoEvaluacionMinutos: 90, // 90 minutos por defecto (como muestra tu captura)
    mensajeEvaluacion: `¡Nos vemos en {restaurante}! 

Estamos felices de haberte recibido en {restaurante}. Queremos saber tu opinión:

1. Tuve una buena experiencia
2. Tuve una mala experiencia

Selecciona una opción del 1 al 2`,
    
    // Integración con Google Calendar
    sincronizarGoogleCalendar: true,
    calendarId: 'primary',
    
    // Sistema de matching de clientes
    activarMatchingClientes: true,
    
    // Sistema de reseñas automáticas de Google
    activarResenasGoogle: true,
    umbralCalificacionParaResena: 4, // Solo pedir reseña si califica 4 (buena experiencia) o más
    mensajeSolicitudResena: '🌟 ¡Nos alegra que hayas tenido una buena experiencia! \n\n¿Nos ayudarías a crecer dejando una reseña en Google? Te tomará menos de 1 minuto y nos ayuda muchísimo.\n\n👉 {link_resena_google}\n\n¡Como agradecimiento, tendrás 15% de descuento en tu próxima visita! Código: RESENA15',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof ConfiguracionLocal, value: any) => {
    setConfiguracion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecordatorioWhatsappChange = (id: string, campo: 'tiempoAntes' | 'mensaje' | 'activo', valor: any) => {
    setConfiguracion(prev => ({
      ...prev,
      recordatoriosWhatsapp: prev.recordatoriosWhatsapp.map(recordatorio =>
        recordatorio.id === id ? { ...recordatorio, [campo]: valor } : recordatorio
      )
    }));
  };

  const agregarRecordatorioWhatsapp = () => {
    const nuevoRecordatorio = {
      id: Date.now().toString(),
      tiempoAntes: 60, // 1 hora por defecto
      mensaje: '¡Hola *Nombre*! Te recordamos tu reserva en Jaraquemada a las *Hora* para *Personas* personas. ¡Te esperamos! 🍽️',
      activo: true
    };
    setConfiguracion(prev => ({
      ...prev,
      recordatoriosWhatsapp: [...prev.recordatoriosWhatsapp, nuevoRecordatorio]
    }));
  };

  const eliminarRecordatorioWhatsapp = (id: string) => {
    Swal.fire({
      title: '¿Eliminar recordatorio?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result: any) => {
      if (result.isConfirmed) {
        setConfiguracion(prev => ({
          ...prev,
          recordatoriosWhatsapp: prev.recordatoriosWhatsapp.filter(recordatorio => recordatorio.id !== id)
        }));
        Swal.fire({
          title: 'Eliminado',
          text: 'El recordatorio ha sido eliminado',
          icon: 'success',
          timer: 1500
        });
      }
    });
  };

  const handleHorarioIAChange = (dia: keyof ConfiguracionLocal['horariosIA'], campo: 'inicio' | 'fin' | 'activo', value: any) => {
    setConfiguracion(prev => ({
      ...prev,
      horariosIA: {
        ...prev.horariosIA,
        [dia]: {
          ...prev.horariosIA[dia],
          [campo]: value
        }
      }
    }));
  };

  const handleMotivoChange = (motivo: keyof ConfiguracionLocal['motivosHabilitados'], checked: boolean) => {
    setConfiguracion(prev => ({
      ...prev,
      motivosHabilitados: {
        ...prev.motivosHabilitados,
        [motivo]: checked
      }
    }));
  };

  const agregarTexto = (texto: string, campo: 'emailConfirmacion' | 'emailRecordatorio' | 'mensajeEvaluacion' | 'mensajeSolicitudResena' = 'emailConfirmacion') => {
    const textarea = document.getElementById(campo) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = configuracion[campo];
      const newValue = value.substring(0, start) + texto + value.substring(end);
      handleInputChange(campo, newValue);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + texto.length, start + texto.length);
      }, 0);
    }
  };

  const agregarPalabraEscalamiento = () => {
    const input = document.getElementById('nuevaPalabraEscalamiento') as HTMLInputElement;
    if (input && input.value.trim()) {
      const nuevasPalabras = [...configuracion.palabrasClaveEscalamiento, input.value.trim().toLowerCase()];
      handleInputChange('palabrasClaveEscalamiento', nuevasPalabras);
      input.value = '';
    }
  };

  const eliminarPalabraEscalamiento = (index: number) => {
    const nuevasPalabras = configuracion.palabrasClaveEscalamiento.filter((_, i) => i !== index);
    handleInputChange('palabrasClaveEscalamiento', nuevasPalabras);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Configuración guardada:', configuracion);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuraciones Generales</h1>
          <p className="text-gray-600 mt-1">Configura tu sistema de IA, comunicaciones y reservas</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/reservas/mapa-mesas"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ir al Diseñador de Mapa de Mesas
          </Link>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CONFIGURACIÓN DE INTELIGENCIA ARTIFICIAL */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-600" />
              <span>CONFIGURACIÓN DE INTELIGENCIA ARTIFICIAL</span>
              <Badge variant={configuracion.activarIA ? "default" : "secondary"}>
                {configuracion.activarIA ? "Activa" : "Inactiva"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Activar Asistente de IA</Label>
                <p className="text-sm text-gray-600">La IA manejará automáticamente consultas de clientes</p>
              </div>
              <Switch
                checked={configuracion.activarIA}
                onCheckedChange={(checked) => handleInputChange('activarIA', checked)}
              />
            </div>

            {configuracion.activarIA && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Personalidad de la IA</Label>
                    <Textarea
                      value={configuracion.personalidadIA}
                      onChange={(e) => handleInputChange('personalidadIA', e.target.value)}
                      placeholder="Define cómo debe comportarse la IA..."
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Idioma de respuestas</Label>
                      <Select value={configuracion.idiomaRespuestasIA} onValueChange={(value) => handleInputChange('idiomaRespuestasIA', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">Inglés</SelectItem>
                          <SelectItem value="pt">Portugués</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tiempo máximo de respuesta (segundos)</Label>
                      <Input
                        type="number"
                        value={configuracion.tiempoMaximoRespuestaIA}
                        onChange={(e) => handleInputChange('tiempoMaximoRespuestaIA', parseInt(e.target.value))}
                        className="mt-2"
                        min="5"
                        max="120"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Horarios de IA por día</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(configuracion.horariosIA).map(([dia, horario]) => (
                      <div key={dia} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={horario.activo}
                          onCheckedChange={(checked) => handleHorarioIAChange(dia as keyof ConfiguracionLocal['horariosIA'], 'activo', checked)}
                        />
                        <div className="capitalize min-w-[80px] text-sm font-medium">
                          {dia}
                        </div>
                        {horario.activo && (
                          <>
                            <Input
                              type="time"
                              value={horario.inicio}
                              onChange={(e) => handleHorarioIAChange(dia as keyof ConfiguracionLocal['horariosIA'], 'inicio', e.target.value)}
                              className="w-20 text-xs"
                            />
                            <span className="text-xs">a</span>
                            <Input
                              type="time"
                              value={horario.fin}
                              onChange={(e) => handleHorarioIAChange(dia as keyof ConfiguracionLocal['horariosIA'], 'fin', e.target.value)}
                              className="w-20 text-xs"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* CONFIGURACIÓN DE WHATSAPP */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span>WHATSAPP BUSINESS</span>
              <Badge variant={configuracion.activarWhatsapp ? "default" : "secondary"}>
                {configuracion.activarWhatsapp ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Activar WhatsApp</Label>
                <p className="text-xs text-gray-600">Comunicación vía WhatsApp Business</p>
              </div>
              <Switch
                checked={configuracion.activarWhatsapp}
                onCheckedChange={(checked) => handleInputChange('activarWhatsapp', checked)}
              />
            </div>

            {configuracion.activarWhatsapp && (
              <>
                <div>
                  <Label>Número de WhatsApp Business</Label>
                  <Input
                    value={configuracion.numeroWhatsapp}
                    onChange={(e) => handleInputChange('numeroWhatsapp', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">WhatsApp Business API</Label>
                    <p className="text-xs text-gray-600">Funciones avanzadas de negocio</p>
                  </div>
                  <Switch
                    checked={configuracion.whatsappBusiness}
                    onCheckedChange={(checked) => handleInputChange('whatsappBusiness', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Respuestas automáticas con IA</Label>
                    <p className="text-xs text-gray-600">IA responde automáticamente</p>
                  </div>
                  <Switch
                    checked={configuracion.respuestasAutomaticasWhatsapp}
                    onCheckedChange={(checked) => handleInputChange('respuestasAutomaticasWhatsapp', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Catálogo WhatsApp</Label>
                    <p className="text-xs text-gray-600">Mostrar menú en WhatsApp</p>
                  </div>
                  <Switch
                    checked={configuracion.activarCatalogoWhatsapp}
                    onCheckedChange={(checked) => handleInputChange('activarCatalogoWhatsapp', checked)}
                  />
                </div>

                <div>
                  <Label>Mensaje de bienvenida</Label>
                  <Textarea
                    value={configuracion.mensajeBienvenidaWhatsapp}
                    onChange={(e) => handleInputChange('mensajeBienvenidaWhatsapp', e.target.value)}
                    className="mt-2 min-h-[80px]"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* RECORDATORIOS WHATSAPP PARA RESERVAS */}
        {configuracion.activarWhatsapp && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span>Recordatorios WhatsApp para Reservas</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Configura mensajes automáticos que se envían antes de cada reserva para recordar a los clientes su cita.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Activar recordatorios automáticos</Label>
                  <p className="text-xs text-gray-600">Los clientes recibirán recordatorios por WhatsApp</p>
                </div>
                <Switch
                  checked={configuracion.activarRecordatoriosWhatsapp}
                  onCheckedChange={(checked) => handleInputChange('activarRecordatoriosWhatsapp', checked)}
                />
              </div>

              {configuracion.activarRecordatoriosWhatsapp && (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Recordatorios configurados:</h4>
                      <Button 
                        onClick={agregarRecordatorioWhatsapp} 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        + Agregar recordatorio
                      </Button>
                    </div>

                    {configuracion.recordatoriosWhatsapp.map((recordatorio, index) => (
                      <div key={recordatorio.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-gray-800">Recordatorio {index + 1}</h5>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={recordatorio.activo}
                              onCheckedChange={(checked) => handleRecordatorioWhatsappChange(recordatorio.id, 'activo', checked)}
                            />
                            <Button
                              onClick={() => eliminarRecordatorioWhatsapp(recordatorio.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Tiempo antes (minutos)</Label>
                            <Input
                              type="number"
                              value={recordatorio.tiempoAntes}
                              onChange={(e) => handleRecordatorioWhatsappChange(recordatorio.id, 'tiempoAntes', parseInt(e.target.value))}
                              className="mt-1"
                              min="5"
                              placeholder="60"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {recordatorio.tiempoAntes >= 1440 ? `${Math.floor(recordatorio.tiempoAntes / 1440)} día${recordatorio.tiempoAntes >= 2880 ? 's' : ''}` :
                               recordatorio.tiempoAntes >= 60 ? `${Math.floor(recordatorio.tiempoAntes / 60)} hora${recordatorio.tiempoAntes >= 120 ? 's' : ''}` :
                               `${recordatorio.tiempoAntes} minutos`} antes de la reserva
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <Label>Mensaje</Label>
                            <Textarea
                              value={recordatorio.mensaje}
                              onChange={(e) => handleRecordatorioWhatsappChange(recordatorio.id, 'mensaje', e.target.value)}
                              className="mt-1 min-h-[80px]"
                              placeholder="¡Hola *Nombre*! Te recordamos..."
                            />
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">*Nombre*</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">*Hora*</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">*Personas*</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">*Fecha*</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Ejemplo de funcionamiento:</p>
                          <ul className="text-sm text-blue-700 mt-2 space-y-1">
                            <li>• Cliente reserva para las 20:00 horas</li>
                            <li>• El sistema enviará automáticamente los recordatorios configurados</li>
                            <li>• Primer recordatorio: 24 horas antes (19:00 del día anterior)</li>
                            <li>• Segundo recordatorio: 2 horas antes (18:00 del mismo día)</li>
                            <li>• Tercer recordatorio: 30 minutos antes (19:30 del mismo día)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* CONFIGURACIÓN DE INSTAGRAM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-pink-600" />
              <span>INSTAGRAM BUSINESS</span>
              <Badge variant={configuracion.activarInstagram ? "default" : "secondary"}>
                {configuracion.activarInstagram ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Activar Instagram</Label>
                <p className="text-xs text-gray-600">Comunicación vía Instagram Direct</p>
              </div>
              <Switch
                checked={configuracion.activarInstagram}
                onCheckedChange={(checked) => handleInputChange('activarInstagram', checked)}
              />
            </div>

            {configuracion.activarInstagram && (
              <>
                <div>
                  <Label>Usuario de Instagram</Label>
                  <Input
                    value={configuracion.usuarioInstagram}
                    onChange={(e) => handleInputChange('usuarioInstagram', e.target.value)}
                    placeholder="@turestaurante"
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Respuestas automáticas con IA</Label>
                    <p className="text-xs text-gray-600">IA responde automáticamente</p>
                  </div>
                  <Switch
                    checked={configuracion.respuestasAutomaticasInstagram}
                    onCheckedChange={(checked) => handleInputChange('respuestasAutomaticasInstagram', checked)}
                  />
                </div>

                <div>
                  <Label>Mensaje de bienvenida</Label>
                  <Textarea
                    value={configuracion.mensajeBienvenidaInstagram}
                    onChange={(e) => handleInputChange('mensajeBienvenidaInstagram', e.target.value)}
                    className="mt-2 min-h-[80px]"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* CONFIGURACIÓN DE EMAIL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>CONFIGURACIÓN DE EMAIL</span>
              <Badge variant={configuracion.activarEmailAutomatico ? "default" : "secondary"}>
                {configuracion.activarEmailAutomatico ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Emails automáticos</Label>
                <p className="text-xs text-gray-600">Confirmación y recordatorios</p>
              </div>
              <Switch
                checked={configuracion.activarEmailAutomatico}
                onCheckedChange={(checked) => handleInputChange('activarEmailAutomatico', checked)}
              />
            </div>

            {configuracion.activarEmailAutomatico && (
              <>
                <div>
                  <Label>Email de confirmación</Label>
                  <Textarea
                    id="emailConfirmacion"
                    value={configuracion.emailConfirmacion}
                    onChange={(e) => handleInputChange('emailConfirmacion', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('*Nombre del Cliente*', 'emailConfirmacion')}>
                      Nombre
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('*Día de Reserva*', 'emailConfirmacion')}>
                      Fecha
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('*Horario de Reserva*', 'emailConfirmacion')}>
                      Hora
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('*Cantidad de Personas*', 'emailConfirmacion')}>
                      Personas
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Email de recordatorio</Label>
                  <Textarea
                    id="emailRecordatorio"
                    value={configuracion.emailRecordatorio}
                    onChange={(e) => handleInputChange('emailRecordatorio', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('*Nombre del Cliente*', 'emailRecordatorio')}>
                      Nombre
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('*Día de Reserva*', 'emailRecordatorio')}>
                      Fecha
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('*Horario de Reserva*', 'emailRecordatorio')}>
                      Hora
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Tiempo de recordatorio (horas antes)</Label>
                  <Input
                    type="number"
                    value={configuracion.tiempoRecordatorio}
                    onChange={(e) => handleInputChange('tiempoRecordatorio', parseInt(e.target.value))}
                    className="mt-2"
                    min="1"
                    max="168"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* CONFIGURACIÓN DE ESCALAMIENTO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <span>ESCALAMIENTO A HUMANO</span>
              <Badge variant={configuracion.escalarAAgenteHumano ? "default" : "secondary"}>
                {configuracion.escalarAAgenteHumano ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Escalar a agente humano</Label>
                <p className="text-xs text-gray-600">Cuando la IA no puede resolver</p>
              </div>
              <Switch
                checked={configuracion.escalarAAgenteHumano}
                onCheckedChange={(checked) => handleInputChange('escalarAAgenteHumano', checked)}
              />
            </div>

            {configuracion.escalarAAgenteHumano && (
              <>
                <div>
                  <Label>Palabras clave para escalamiento</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {configuracion.palabrasClaveEscalamiento.map((palabra, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{palabra}</span>
                        <button
                          onClick={() => eliminarPalabraEscalamiento(index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <Input
                      id="nuevaPalabraEscalamiento"
                      placeholder="Agregar palabra clave..."
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && agregarPalabraEscalamiento()}
                    />
                    <Button onClick={agregarPalabraEscalamiento} variant="outline" size="sm">
                      Agregar
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Tiempo sin respuesta para escalar (segundos)</Label>
                  <Input
                    type="number"
                    value={configuracion.tiempoMaximoSinRespuesta}
                    onChange={(e) => handleInputChange('tiempoMaximoSinRespuesta', parseInt(e.target.value))}
                    className="mt-2"
                    min="60"
                    max="3600"
                  />
                </div>

                <div>
                  <Label>Emails de agentes humanos</Label>
                  <div className="mt-2 space-y-2">
                    {configuracion.emailAgenteHumano.map((email, index) => (
                      <Input key={index} value={email} readOnly className="text-sm" />
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* EVALUACIÓN POST-VISITA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span>EVALUACIÓN POST-VISITA</span>
              <Badge variant={configuracion.activarEvaluacionPostVisita ? "default" : "secondary"}>
                {configuracion.activarEvaluacionPostVisita ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Sistema automático que envía mensaje de evaluación después de que el cliente termine su visita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Activar evaluación automática</Label>
                <p className="text-xs text-gray-600">Mensaje de evaluación después de la visita</p>
              </div>
              <Switch
                checked={configuracion.activarEvaluacionPostVisita}
                onCheckedChange={(checked) => handleInputChange('activarEvaluacionPostVisita', checked)}
              />
            </div>

            {configuracion.activarEvaluacionPostVisita && (
              <>
                <div>
                  <Label>Tiempo después de la reserva (minutos)</Label>
                  <Input
                    type="number"
                    value={configuracion.tiempoEvaluacionMinutos}
                    onChange={(e) => handleInputChange('tiempoEvaluacionMinutos', parseInt(e.target.value))}
                    className="mt-2"
                    min="30"
                    max="360"
                    placeholder="90"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Tiempo en minutos después de la reserva para enviar evaluación (por defecto 90 minutos)
                  </p>
                </div>

                <div>
                  <Label>Mensaje de evaluación</Label>
                  <Textarea
                    id="mensajeEvaluacion"
                    value={configuracion.mensajeEvaluacion}
                    onChange={(e) => handleInputChange('mensajeEvaluacion', e.target.value)}
                    className="mt-2 min-h-[120px]"
                    placeholder="Mensaje que se enviará para pedir evaluación..."
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('{restaurante}', 'mensajeEvaluacion')}>
                      Restaurante
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('{nombre_cliente}', 'mensajeEvaluacion')}>
                      Nombre Cliente
                    </Button>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Funcionalidad:</strong><br />
                      • El sistema detecta automáticamente cuando un cliente termina su visita<br />
                      • Después del tiempo configurado, envía el mensaje de evaluación<br />
                      • Captura la respuesta del cliente (1 = buena, 2 = mala experiencia)<br />
                      • Si es buena experiencia, automáticamente solicita reseña en Google
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* SISTEMA DE MATCHING DE CLIENTES */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <span>MATCHING DE CLIENTES</span>
              <Badge variant={configuracion.activarMatchingClientes ? "default" : "secondary"}>
                {configuracion.activarMatchingClientes ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Sistema para hacer match del cliente que llega con su reserva por nombre
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Activar matching automático</Label>
                <p className="text-xs text-gray-600">Identifica clientes al llegar por nombre</p>
              </div>
              <Switch
                checked={configuracion.activarMatchingClientes}
                onCheckedChange={(checked) => handleInputChange('activarMatchingClientes', checked)}
              />
            </div>

            {configuracion.activarMatchingClientes && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">🎯 ¿Cómo funciona el Matching?</h4>
                <ul className="text-sm text-green-800 space-y-2">
                  <li>1. Cliente llega al restaurante y dice su nombre</li>
                  <li>2. Sistema busca reservas activas con ese nombre</li>
                  <li>3. Muestra información de la reserva (hora, mesa, personas)</li>
                  <li>4. Confirma la llegada y actualiza estado a "Cliente presente"</li>
                  <li>5. Inicia el contador para evaluación post-visita automática</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* INTEGRACIÓN GOOGLE CALENDAR */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>INTEGRACIÓN GOOGLE CALENDAR</span>
              <Badge variant={configuracion.sincronizarGoogleCalendar ? "default" : "secondary"}>
                {configuracion.sincronizarGoogleCalendar ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Las reservas por WhatsApp se crean automáticamente en Google Calendar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Sincronización automática</Label>
                <p className="text-xs text-gray-600">Reservas WhatsApp → Google Calendar</p>
              </div>
              <Switch
                checked={configuracion.sincronizarGoogleCalendar}
                onCheckedChange={(checked) => handleInputChange('sincronizarGoogleCalendar', checked)}
              />
            </div>

            {configuracion.sincronizarGoogleCalendar && (
              <>
                <div>
                  <Label>ID del Calendario</Label>
                  <Input
                    value={configuracion.calendarId}
                    onChange={(e) => handleInputChange('calendarId', e.target.value)}
                    className="mt-2"
                    placeholder="primary o tu-calendario@gmail.com"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    ID del calendario de Google donde se crearán los eventos
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">📅 Funcionalidad de Sincronización</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Cliente reserva por WhatsApp → Evento automático en Google Calendar</li>
                    <li>• Título: "Reserva - [Nombre Cliente] - [X personas]"</li>
                    <li>• Incluye: Número de teléfono, observaciones, estado de reserva</li>
                    <li>• Si cliente cancela → Evento se actualiza o elimina automáticamente</li>
                    <li>• Sincronización bidireccional: cambios en Calendar → sistema</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* RESEÑAS AUTOMÁTICAS DE GOOGLE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span>RESEÑAS AUTOMÁTICAS DE GOOGLE</span>
              <Badge variant={configuracion.activarResenasGoogle ? "default" : "secondary"}>
                {configuracion.activarResenasGoogle ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Solicitud automática de reseñas en Google después de evaluaciones positivas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Solicitar reseñas automáticamente</Label>
                <p className="text-xs text-gray-600">Después de evaluaciones positivas</p>
              </div>
              <Switch
                checked={configuracion.activarResenasGoogle}
                onCheckedChange={(checked) => handleInputChange('activarResenasGoogle', checked)}
              />
            </div>

            {configuracion.activarResenasGoogle && (
              <>
                <div>
                  <Label>Umbral de calificación para solicitar reseña</Label>
                  <Select value={configuracion.umbralCalificacionParaResena.toString()} onValueChange={(value) => handleInputChange('umbralCalificacionParaResena', parseInt(value))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 - Regular o mejor</SelectItem>
                      <SelectItem value="4">4 - Buena experiencia o mejor (recomendado)</SelectItem>
                      <SelectItem value="5">5 - Solo experiencias excelentes</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">
                    Solo se pedirán reseñas si la evaluación es igual o mayor a este valor
                  </p>
                </div>

                <div>
                  <Label>Mensaje de solicitud de reseña</Label>
                  <Textarea
                    id="mensajeSolicitudResena"
                    value={configuracion.mensajeSolicitudResena}
                    onChange={(e) => handleInputChange('mensajeSolicitudResena', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('{nombre_cliente}', 'mensajeSolicitudResena')}>
                      Nombre Cliente
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('{restaurante}', 'mensajeSolicitudResena')}>
                      Restaurante
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => agregarTexto('{link_resena_google}', 'mensajeSolicitudResena')}>
                      Link Google
                    </Button>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-3">
                    <h4 className="font-semibold text-yellow-900 mb-3">⭐ Flujo de Reseñas Automáticas</h4>
                    <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                      <li>Cliente termina su visita (90min después de reserva)</li>
                      <li>Sistema envía mensaje de evaluación por WhatsApp</li>
                      <li>Cliente responde "1" (buena experiencia)</li>
                      <li>Sistema automáticamente envía mensaje solicitando reseña Google</li>
                      <li>Incluye link directo y código de descuento como incentivo</li>
                      <li>Se registra en el sistema si cliente deja reseña</li>
                    </ol>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* CONFIGURACIONES DE RESERVAS Y NOTIFICACIONES */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>CONFIGURACIONES DE RESERVAS Y NOTIFICACIONES</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Mensaje de error por capacidad máxima</Label>
                  <Textarea
                    value={configuracion.mensajeErrorPersonas}
                    onChange={(e) => handleInputChange('mensajeErrorPersonas', e.target.value)}
                    className="mt-2 min-h-[80px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Confirmar reservas automáticamente</Label>
                    <p className="text-xs text-gray-600">IA confirma sin intervención humana</p>
                  </div>
                  <Switch
                    checked={configuracion.confirmarAutomaticamente}
                    onCheckedChange={(checked) => handleInputChange('confirmarAutomaticamente', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Notificar nuevas reservas</Label>
                    <p className="text-xs text-gray-600">Recibir notificación por email</p>
                  </div>
                  <Switch
                    checked={configuracion.notificarNuevasReservas}
                    onCheckedChange={(checked) => handleInputChange('notificarNuevasReservas', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Emails de notificación</Label>
                  <div className="space-y-2">
                    {configuracion.emailsNotificacion.map((email, index) => (
                      <Input key={index} value={email} readOnly className="text-sm" />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Bandeja de entrada</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Notificaciones con sonido</Label>
                      <Switch
                        checked={configuracion.notificacionesSonido}
                        onCheckedChange={(checked) => handleInputChange('notificacionesSonido', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Marcar como leído automáticamente</Label>
                      <Switch
                        checked={configuracion.marcarComoLeido}
                        onCheckedChange={(checked) => handleInputChange('marcarComoLeido', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Archivar conversaciones antiguas</Label>
                      <Switch
                        checked={configuracion.archivarConversacionesAntiguas}
                        onCheckedChange={(checked) => handleInputChange('archivarConversacionesAntiguas', checked)}
                      />
                    </div>
                    {configuracion.archivarConversacionesAntiguas && (
                      <div>
                        <Label className="text-xs">Días para archivar</Label>
                        <Input
                          type="number"
                          value={configuracion.diasArchivarConversaciones}
                          onChange={(e) => handleInputChange('diasArchivarConversaciones', parseInt(e.target.value))}
                          className="mt-1 text-sm"
                          min="7"
                          max="365"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-3 block">
                MOTIVOS DE RESERVAS HABILITADOS PARA CLIENTES
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(configuracion.motivosHabilitados).map(([motivo, habilitado]) => (
                  <div key={motivo} className="flex items-center space-x-2">
                    <Checkbox
                      checked={habilitado}
                      onCheckedChange={(checked) => handleMotivoChange(motivo as keyof ConfiguracionLocal['motivosHabilitados'], checked as boolean)}
                    />
                    <Label className="text-sm capitalize">
                      {motivo === 'menuDelDia' ? 'Menú del Día' : 
                       motivo === 'babyShower' ? 'Baby Shower' :
                       motivo === 'cumpleanos' ? 'Cumpleaños' : motivo}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Sistema Integrado de IA
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Tu restaurante ahora cuenta con inteligencia artificial avanzada que maneja automáticamente:</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Consultas sobre el menú y disponibilidad</li>
                <li>Reservas y modificaciones automáticas</li>
                <li>Atención al cliente 24/7 en WhatsApp e Instagram</li>
                <li>Escalamiento inteligente a agentes humanos</li>
                <li>Análisis de sentimientos y detección de quejas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
