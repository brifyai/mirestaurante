

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  MessageSquare, 
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Clock,
  User,
  Award,
  Target,
  Zap,
  Heart,
  Smile,
  Frown,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Reply,
  Share2,
  Download,
  Crown
} from 'lucide-react';
import Swal from 'sweetalert2';

// Datos de ejemplo para las reseñas
const ressenasData = [
  {
    id: 1,
    cliente: 'Juan Pérez',
    calificacion: 5,
    fecha: '2024-09-10',
    hora: '20:30',
    comentario: 'Excelente experiencia! La comida estuvo deliciosa y el servicio muy atento. Definitivamente volveremos.',
    plataforma: 'Google',
    respondida: true,
    respuesta: 'Muchas gracias por sus comentarios Juan! Nos alegra saber que tuvo una experiencia maravillosa.',
    avatar: '/api/placeholder/40/40',
    verificada: true,
    util: 12,
    mesa: '05',
    mesero: 'Carlos González'
  },
  {
    id: 2,
    cliente: 'María García',
    calificacion: 4,
    fecha: '2024-09-09',
    hora: '19:15',
    comentario: 'Muy buen ambiente y comida sabrosa. Solo el tiempo de espera fue un poco largo, pero valió la pena.',
    plataforma: 'TripAdvisor',
    respondida: false,
    respuesta: null,
    avatar: '/api/placeholder/40/40',
    verificada: true,
    util: 8,
    mesa: '12',
    mesero: 'Ana López'
  },
  {
    id: 3,
    cliente: 'Carlos López',
    calificacion: 5,
    fecha: '2024-09-08',
    hora: '21:00',
    comentario: 'Increíble atención al detalle. El chef realmente sabe lo que hace. Los postres son espectaculares.',
    plataforma: 'Yelp',
    respondida: true,
    respuesta: 'Gracias Carlos! Compartiremos sus comentarios con nuestro chef. ¡Lo esperamos pronto!',
    avatar: '/api/placeholder/40/40',
    verificada: true,
    util: 15,
    mesa: '08',
    mesero: 'Roberto Silva'
  },
  {
    id: 4,
    cliente: 'Ana Martín',
    calificacion: 3,
    fecha: '2024-09-07',
    hora: '18:45',
    comentario: 'La comida estuvo bien, pero el servicio podría mejorar. Tuvimos que esperar mucho para que nos atendieran.',
    plataforma: 'Google',
    respondida: true,
    respuesta: 'Lamentamos que no haya tenido la mejor experiencia Ana. Hemos tomado nota de sus comentarios para mejorar.',
    avatar: '/api/placeholder/40/40',
    verificada: true,
    util: 3,
    mesa: '03',
    mesero: 'Luis Torres'
  },
  {
    id: 5,
    cliente: 'Roberto Silva',
    calificacion: 2,
    fecha: '2024-09-06',
    hora: '20:00',
    comentario: 'Desafortunadamente no fue una buena experiencia. La comida llegó fría y el servicio fue muy lento.',
    plataforma: 'Google',
    respondida: false,
    respuesta: null,
    avatar: '/api/placeholder/40/40',
    verificada: false,
    util: 1,
    mesa: '15',
    mesero: 'María Rodríguez'
  }
];

const estadisticasGenerales = {
  calificacionPromedio: 4.2,
  totalResenas: 147,
  resenasPendientes: 8,
  crecimientoMensual: 15,
  tasaRespuesta: 78,
  distribucion: {
    5: 68,
    4: 42,
    3: 23,
    2: 10,
    1: 4
  },
  porPlataforma: {
    'Google': 89,
    'TripAdvisor': 32,
    'Yelp': 26
  }
};

const temas = [
  { nombre: 'Servicio', positivas: 45, negativas: 8, color: 'bg-blue-500' },
  { nombre: 'Comida', positivas: 52, negativas: 5, color: 'bg-green-500' },
  { nombre: 'Ambiente', positivas: 38, negativas: 3, color: 'bg-purple-500' },
  { nombre: 'Precio', positivas: 28, negativas: 12, color: 'bg-orange-500' },
  { nombre: 'Limpieza', positivas: 41, negativas: 2, color: 'bg-teal-500' }
];

export default function CalificacionesContent() {
  const [filtroCalificacion, setFiltroCalificacion] = useState('todas');
  const [filtroPlataforma, setFiltroPlataforma] = useState('todas');
  const [filtroRespuesta, setFiltroRespuesta] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActiva, setVistaActiva] = useState('resenas');

  const getCalificacionColor = (calificacion: number) => {
    if (calificacion >= 4) return 'text-green-600';
    if (calificacion === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPlataformaColor = (plataforma: string) => {
    switch (plataforma) {
      case 'Google': return 'bg-blue-100 text-blue-800';
      case 'TripAdvisor': return 'bg-green-100 text-green-800';
      case 'Yelp': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resenasFiltradas = ressenasData.filter(resena => {
    const cumpleBusqueda = resena.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                          resena.comentario.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleCalificacion = filtroCalificacion === 'todas' || resena.calificacion.toString() === filtroCalificacion;
    const cumplePlataforma = filtroPlataforma === 'todas' || resena.plataforma === filtroPlataforma;
    const cumpleRespuesta = filtroRespuesta === 'todas' || 
                           (filtroRespuesta === 'respondidas' && resena.respondida) ||
                           (filtroRespuesta === 'pendientes' && !resena.respondida);
    
    return cumpleBusqueda && cumpleCalificacion && cumplePlataforma && cumpleRespuesta;
  });

  const handleResponder = async (resena: any) => {
    const { value: respuesta } = await Swal.fire({
      title: `Responder a ${resena.cliente}`,
      html: `
        <div class="text-left space-y-4">
          <div class="bg-gray-50 p-4 rounded border">
            <div class="flex items-center gap-2 mb-2">
              <div class="flex">
                ${Array.from({length: 5}, (_, i) => 
                  `<span class="${i < resena.calificacion ? 'text-yellow-400' : 'text-gray-300'}"}>★</span>`
                ).join('')}
              </div>
              <span class="text-sm font-medium">${resena.calificacion}/5</span>
            </div>
            <p class="text-sm">"${resena.comentario}"</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Su respuesta</label>
            <textarea id="respuesta" class="swal2-textarea" placeholder="Escriba su respuesta profesional y cordial..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="btn btn-sm btn-outline" onclick="document.getElementById('respuesta').value = 'Muchas gracias por sus comentarios. Nos alegra saber que tuvo una experiencia positiva.'">Respuesta Positiva</button>
            <button type="button" class="btn btn-sm btn-outline" onclick="document.getElementById('respuesta').value = 'Lamentamos que su experiencia no haya cumplido sus expectativas. Hemos tomado nota de sus comentarios para mejorar.'">Respuesta Constructiva</button>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enviar Respuesta',
      cancelButtonText: 'Cancelar',
      width: 600,
      preConfirm: () => {
        const respuesta = (document.getElementById('respuesta') as HTMLTextAreaElement)?.value;
        if (!respuesta) {
          Swal.showValidationMessage('Por favor escriba una respuesta');
          return false;
        }
        return respuesta;
      }
    });

    if (respuesta) {
      await Swal.fire({
        title: '¡Respuesta Enviada!',
        text: `Respuesta publicada en ${resena.plataforma}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleSolicitarResena = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Solicitar Reseña',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium mb-2">Cliente</label>
            <input id="cliente" class="swal2-input" placeholder="Nombre del cliente" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email/Teléfono</label>
            <input id="contacto" class="swal2-input" placeholder="Email o número de teléfono" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Plataforma</label>
            <select id="plataforma" class="swal2-select">
              <option value="Google">Google</option>
              <option value="TripAdvisor">TripAdvisor</option>
              <option value="Yelp">Yelp</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Mensaje personalizado</label>
            <textarea id="mensaje" class="swal2-textarea" placeholder="Mensaje de solicitud (opcional)"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enviar Solicitud',
      cancelButtonText: 'Cancelar',
      width: 600,
      preConfirm: () => {
        const cliente = (document.getElementById('cliente') as HTMLInputElement)?.value;
        const contacto = (document.getElementById('contacto') as HTMLInputElement)?.value;
        
        if (!cliente || !contacto) {
          Swal.showValidationMessage('Por favor complete los campos obligatorios');
          return false;
        }
        
        return {
          cliente,
          contacto,
          plataforma: (document.getElementById('plataforma') as HTMLSelectElement)?.value,
          mensaje: (document.getElementById('mensaje') as HTMLTextAreaElement)?.value,
        }
      }
    });

    if (formValues) {
      await Swal.fire({
        title: '¡Solicitud Enviada!',
        text: `Solicitud de reseña enviada a ${formValues.cliente}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleExportarReporte = () => {
    const headers = ['Cliente', 'Calificación', 'Fecha', 'Comentario', 'Plataforma', 'Respondida'];
    const csvData = ressenasData.map(resena => [
      resena.cliente,
      resena.calificacion,
      resena.fecha,
      resena.comentario.replace(/"/g, '""'),
      resena.plataforma,
      resena.respondida ? 'Sí' : 'No'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reseñas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    Swal.fire({
      title: '¡Exportado!',
      text: 'Reporte de reseñas exportado exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calificaciones y Reseñas</h1>
          <p className="text-gray-600 mt-2">Gestión completa de feedback y reputación</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportarReporte}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
          <Button 
            onClick={handleSolicitarResena}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Solicitar Reseña
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calificación Promedio</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-yellow-600">{estadisticasGenerales.calificacionPromedio}</p>
                  <div className="flex">
                    {Array.from({length: 5}, (_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(estadisticasGenerales.calificacionPromedio) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reseñas</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticasGenerales.totalResenas}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa de Respuesta</p>
                <p className="text-2xl font-bold text-green-600">{estadisticasGenerales.tasaRespuesta}%</p>
              </div>
              <Reply className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crecimiento</p>
                <p className="text-2xl font-bold text-purple-600">+{estadisticasGenerales.crecimientoMensual}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principal */}
      <Tabs value={vistaActiva} onValueChange={setVistaActiva} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resenas">Reseñas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="temas">Análisis por Temas</TabsTrigger>
          <TabsTrigger value="competencia">Competencia</TabsTrigger>
        </TabsList>

        <TabsContent value="resenas" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por cliente o comentario..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filtroCalificacion} onValueChange={setFiltroCalificacion}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="5">5 estrellas</SelectItem>
                    <SelectItem value="4">4 estrellas</SelectItem>
                    <SelectItem value="3">3 estrellas</SelectItem>
                    <SelectItem value="2">2 estrellas</SelectItem>
                    <SelectItem value="1">1 estrella</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroPlataforma} onValueChange={setFiltroPlataforma}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                    <SelectItem value="Yelp">Yelp</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroRespuesta} onValueChange={setFiltroRespuesta}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="respondidas">Respondidas</SelectItem>
                    <SelectItem value="pendientes">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Reseñas */}
          <div className="space-y-4">
            {resenasFiltradas.map((resena) => (
              <Card key={resena.id} className={`hover:shadow-lg transition-shadow ${!resena.respondida ? 'border-l-4 border-l-orange-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={resena.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {resena.cliente.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{resena.cliente}</h3>
                              {resena.verificada && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                              <Badge variant="outline" className={getPlataformaColor(resena.plataforma)}>
                                {resena.plataforma}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{resena.fecha}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{resena.hora}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>Mesa {resena.mesa}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {Array.from({length: 5}, (_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < resena.calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className={`ml-2 font-semibold ${getCalificacionColor(resena.calificacion)}`}>
                                {resena.calificacion}/5
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {resena.util} útil{resena.util !== 1 ? 'es' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-800 leading-relaxed">"{resena.comentario}"</p>
                        </div>

                        {resena.respuesta && (
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                            <div className="flex items-center gap-2 mb-2">
                              <Reply className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-800">Respuesta del restaurante</span>
                            </div>
                            <p className="text-blue-800">{resena.respuesta}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-sm text-gray-600">
                            Atendido por: <span className="font-medium">{resena.mesero}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            {!resena.respondida && (
                              <Button
                                size="sm"
                                onClick={() => handleResponder(resena)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Reply className="w-3 h-3 mr-1" />
                                Responder
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => console.log('Ver detalles')}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Distribución de Calificaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Calificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(estadisticasGenerales.distribucion)
                  .reverse()
                  .map(([estrellas, cantidad]) => {
                    const porcentaje = Math.round((cantidad / estadisticasGenerales.totalResenas) * 100);
                    return (
                      <div key={estrellas} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-20">
                          <span className="text-sm font-medium">{estrellas}</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-yellow-500 h-3 rounded-full" 
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-sm font-medium">{cantidad}</span>
                          <span className="text-xs text-gray-500 ml-1">({porcentaje}%)</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Métricas por Plataforma */}
          <Card>
            <CardHeader>
              <CardTitle>Reseñas por Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(estadisticasGenerales.porPlataforma).map(([plataforma, cantidad]) => {
                  const porcentaje = Math.round((cantidad / estadisticasGenerales.totalResenas) * 100);
                  return (
                    <div key={plataforma} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold mb-1">{cantidad}</div>
                      <div className="text-sm text-gray-600 mb-2">{plataforma}</div>
                      <div className="text-xs text-gray-500">{porcentaje}% del total</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Temas Mencionados</CardTitle>
              <p className="text-gray-600">Aspectos más comentados en las reseñas</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {temas.map((tema) => {
                  const total = tema.positivas + tema.negativas;
                  const porcentajePositivo = Math.round((tema.positivas / total) * 100);
                  
                  return (
                    <Card key={tema.nombre}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{tema.nombre}</h3>
                            <div className={`w-3 h-3 rounded-full ${tema.color}`}></div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4 text-green-500" />
                                <span>Positivas</span>
                              </div>
                              <span className="font-medium">{tema.positivas}</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <ThumbsDown className="w-4 h-4 text-red-500" />
                                <span>Negativas</span>
                              </div>
                              <span className="font-medium">{tema.negativas}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Satisfacción</span>
                              <span>{porcentajePositivo}%</span>
                            </div>
                            <Progress value={porcentajePositivo} className="w-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competencia" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Competencia</CardTitle>
              <p className="text-gray-600">Comparación con restaurantes similares en la zona</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Comparación de Calificaciones */}
                <div>
                  <h3 className="font-semibold mb-4">Comparación de Calificaciones</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Tu Restaurante</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({length: 5}, (_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(estadisticasGenerales.calificacionPromedio) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="font-bold">{estadisticasGenerales.calificacionPromedio}</span>
                        <span className="text-sm text-gray-600">({estadisticasGenerales.totalResenas} reseñas)</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Restaurante A</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({length: 5}, (_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="font-bold">4.0</span>
                        <span className="text-sm text-gray-600">(89 reseñas)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Restaurante B</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({length: 5}, (_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="font-bold">3.8</span>
                        <span className="text-sm text-gray-600">(124 reseñas)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fortalezas vs Competencia */}
                <div>
                  <h3 className="font-semibold mb-4">Fortalezas Competitivas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Ventajas</span>
                      </div>
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Mejor calificación promedio</li>
                        <li>• Mayor número de reseñas</li>
                        <li>• Mejor tasa de respuesta</li>
                        <li>• Comentarios más positivos sobre servicio</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-800">Áreas de Mejora</span>
                      </div>
                      <ul className="text-sm space-y-1 text-orange-700">
                        <li>• Tiempo de espera (vs Restaurante A)</li>
                        <li>• Variedad del menú</li>
                        <li>• Precio competitivo</li>
                        <li>• Presencia en más plataformas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
