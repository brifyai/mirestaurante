
'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Star,
  ChefHat,
  ArrowUp,
  ArrowDown,
  Eye,
  MessageSquare,
  Activity,
  AlertCircle,
  CheckCircle2,
  Timer,
  MapPin,
  Store,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import RestaurantSelector from '@/components/restaurant-selector';

// Datos de ejemplo para gráficos específicos por restaurante
const generateVentasData = (baseVentas: number) => [
  { mes: 'Ene', ventas: Math.round(baseVentas * 0.7), proyeccion: Math.round(baseVentas * 0.65) },
  { mes: 'Feb', ventas: Math.round(baseVentas * 0.8), proyeccion: Math.round(baseVentas * 0.75) },
  { mes: 'Mar', ventas: Math.round(baseVentas * 0.75), proyeccion: Math.round(baseVentas * 0.8) },
  { mes: 'Abr', ventas: Math.round(baseVentas * 0.95), proyeccion: Math.round(baseVentas * 0.9) },
  { mes: 'May', ventas: Math.round(baseVentas * 0.85), proyeccion: Math.round(baseVentas * 0.9) },
  { mes: 'Jun', ventas: Math.round(baseVentas * 1.1), proyeccion: Math.round(baseVentas * 1.0) },
];

const generateOcupacionData = (ocupacionActual: number) => [
  { hora: '12:00', ocupacion: Math.max(0, ocupacionActual - 30) },
  { hora: '13:00', ocupacion: Math.max(0, ocupacionActual - 10) },
  { hora: '14:00', ocupacion: Math.min(100, ocupacionActual + 10) },
  { hora: '15:00', ocupacion: Math.max(0, ocupacionActual - 20) },
  { hora: '19:00', ocupacion: Math.min(100, ocupacionActual + 15) },
  { hora: '20:00', ocupacion: ocupacionActual },
  { hora: '21:00', ocupacion: Math.max(0, ocupacionActual - 15) },
  { hora: '22:00', ocupacion: Math.max(0, ocupacionActual - 25) },
];

const tipoClienteData = [
  { name: 'VIP', value: 15, color: '#8B5CF6' },
  { name: 'Frecuente', value: 35, color: '#06B6D4' },
  { name: 'Regular', value: 30, color: '#10B981' },
  { name: 'Nuevo', value: 20, color: '#F59E0B' },
];

export default function SpecificDashboard() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { selectedRestaurant, setSelectedRestaurant, setViewMode } = useRestaurant();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Si no hay restaurante seleccionado, mostrar mensaje
  if (!selectedRestaurant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Selecciona un Restaurante</h3>
            <p className="text-muted-foreground">
              Elige un restaurante específico para ver sus métricas detalladas
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Actualizar Página
          </Button>
        </div>
      </div>
    );
  }

  const metricas = selectedRestaurant.metrics;
  const ventasData = generateVentasData(metricas.ventasSemana / 6);
  const ocupacionData = generateOcupacionData(metricas.ocupacionActual);

  const crecimientoVentas = ((metricas.ventasHoy - metricas.ventasAyer) / metricas.ventasAyer * 100).toFixed(1);
  const crecimientoClientes = ((metricas.clientesHoy - metricas.clientesAyer) / metricas.clientesAyer * 100).toFixed(1);
  const crecimientoSemanal = ((metricas.ventasSemana - metricas.ventasSemanaPasada) / metricas.ventasSemanaPasada * 100).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-700 border-green-200';
      case 'mantenimiento': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cerrado': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo': return <Activity className="h-3 w-3" />;
      case 'mantenimiento': return <Timer className="h-3 w-3" />;
      case 'cerrado': return <AlertCircle className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Prominente del Restaurante Específico */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-green-500/20 rounded-xl" />
        <div className="relative bg-white/90 backdrop-blur-sm border-2 border-purple-200/50 rounded-xl p-8 shadow-lg">
          {/* Botón Volver en la esquina superior derecha */}
          <div className="absolute top-4 right-4">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                // Cambiar a vista general y navegar al home
                setViewMode('general');
                setSelectedRestaurant(null);
                navigate('/');
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              {/* Indicador de Vista Específica */}
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <Store className="h-4 w-4" />
                <span>VISTA ESPECÍFICA DEL RESTAURANTE</span>
              </div>
              
              {/* Nombre del Restaurante Prominente */}
              <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {selectedRestaurant.name}
                </h1>
                <Badge variant="outline" className={`${getStatusColor(selectedRestaurant.status)} px-4 py-2 text-sm font-medium`}>
                  {getStatusIcon(selectedRestaurant.status)}
                  <span className="ml-2 capitalize">{selectedRestaurant.status}</span>
                </Badge>
              </div>

              {/* Información del Restaurante */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ubicación</p>
                    <p className="font-medium">{selectedRestaurant.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="font-medium capitalize">{selectedRestaurant.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Timer className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Actualización</p>
                    <p className="font-medium">{currentTime.toLocaleTimeString('es-CL')}</p>
                  </div>
                </div>
              </div>
              
              {/* Fecha y Hora */}
              <p className="text-sm text-muted-foreground bg-gray-50 px-4 py-2 rounded-lg">
                📅 {currentTime.toLocaleDateString('es-CL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col space-y-3">
              <div className="space-y-2">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 w-full"
                  onClick={() => {
                    navigation.navigateTo(`/metricas?restaurant=${selectedRestaurant.id}`);
                  }}
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Panel de Métricas Avanzadas
                </Button>
                <p className="text-xs text-muted-foreground text-center px-2">
                  Abre el panel detallado con métricas en tiempo real y análisis predictivo
                </p>
              </div>
              
              {/* Métricas Rápidas en el Header */}
              {selectedRestaurant.status === 'activo' && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-green-50 border border-green-200 rounded px-2 py-1 text-center">
                    <div className="font-bold text-green-700">${metricas.ventasHoy.toLocaleString('es-CL')}</div>
                    <div className="text-green-600">Ventas Hoy</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-center">
                    <div className="font-bold text-blue-700">{metricas.clientesHoy}</div>
                    <div className="text-blue-600">Clientes</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded px-2 py-1 text-center">
                    <div className="font-bold text-purple-700">{metricas.ocupacionActual}%</div>
                    <div className="text-purple-600">Ocupación</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Restaurante */}
      <RestaurantSelector />

      {selectedRestaurant.status === 'activo' ? (
        <>
          {/* Métricas Principales */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Ventas de Hoy */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ventas de Hoy
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metricas.ventasHoy.toLocaleString('es-CL')}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {parseFloat(crecimientoVentas) > 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={parseFloat(crecimientoVentas) > 0 ? "text-green-600" : "text-red-600"}>
                    {crecimientoVentas}%
                  </span>
                  <span className="ml-1">vs ayer</span>
                </div>
              </CardContent>
            </Card>

            {/* Clientes de Hoy */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clientes Hoy
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas.clientesHoy}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {parseFloat(crecimientoClientes) > 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={parseFloat(crecimientoClientes) > 0 ? "text-green-600" : "text-red-600"}>
                    {crecimientoClientes}%
                  </span>
                  <span className="ml-1">vs ayer</span>
                </div>
              </CardContent>
            </Card>

            {/* Ocupación Actual */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ocupación Actual
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <ChefHat className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas.ocupacionActual}%</div>
                <Progress value={metricas.ocupacionActual} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {metricas.mesasOcupadas}/{metricas.mesasDisponibles + metricas.mesasOcupadas} mesas
                </p>
              </CardContent>
            </Card>

            {/* Calificación Promedio */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/5" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Satisfacción
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {metricas.calificacionPromedio}
                  <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metricas.totalCalificaciones} calificaciones
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos y Analytics */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Tendencia de Ventas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Tendencia de Ventas - {selectedRestaurant.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{crecimientoSemanal}% esta semana
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ventasData}>
                      <defs>
                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="mes" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Area 
                        type="monotone" 
                        dataKey="ventas" 
                        stroke="#8B5CF6" 
                        fillOpacity={1} 
                        fill="url(#colorVentas)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="proyeccion" 
                        stroke="#94A3B8" 
                        fillOpacity={0} 
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sección de Ocupación y Clientes */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Ocupación por Hora */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Ocupación por Horario</CardTitle>
                <p className="text-sm text-muted-foreground">Hoy - {selectedRestaurant.name}</p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ocupacionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="hora" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Bar dataKey="ocupacion" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribución de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Tipos de Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tipoClienteData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Adicionales Específicas */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Operación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reservas hoy:</span>
                  <span className="font-semibold">{metricas.reservasHoy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reservas mañana:</span>
                  <span className="font-semibold">{metricas.reservasManana}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tiempo espera promedio:</span>
                  <span className="font-semibold">{metricas.tiempoEsperaPromedio} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mesas disponibles:</span>
                  <span className="font-semibold">{metricas.mesasDisponibles}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Financiero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ticket promedio:</span>
                  <span className="font-semibold">${metricas.ticketPromedio.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ventas esta semana:</span>
                  <span className="font-semibold">${metricas.ventasSemana.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ventas sem. pasada:</span>
                  <span className="font-semibold">${metricas.ventasSemanaPasada.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Crecimiento semanal:</span>
                  <span className={`font-semibold ${parseFloat(crecimientoSemanal) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {crecimientoSemanal}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Satisfacción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating promedio:</span>
                  <span className="font-semibold flex items-center">
                    {metricas.calificacionPromedio} <Star className="h-3 w-3 text-yellow-500 ml-1 fill-current" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total calificaciones:</span>
                  <span className="font-semibold">{metricas.totalCalificaciones}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedRestaurant.type === 'principal' ? 'Principal' : 'Sucursal'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(selectedRestaurant.status)}`}>
                    <span className="capitalize">{selectedRestaurant.status}</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Rápidas Específicas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              onClick={() => window.location.href = `/mesas?restaurant=${selectedRestaurant.id}`}
            >
              <ChefHat className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Gestionar Mesas</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              onClick={() => window.location.href = `/reservas?restaurant=${selectedRestaurant.id}`}
            >
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Nueva Reserva</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-green-50 hover:border-green-200 transition-colors"
              onClick={() => window.location.href = `/clientes?restaurant=${selectedRestaurant.id}`}
            >
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Gestionar Clientes</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
              onClick={() => window.location.href = `/calificaciones?restaurant=${selectedRestaurant.id}`}
            >
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-sm font-medium">Ver Calificaciones</span>
            </Button>
          </div>

          {/* Alertas Específicas del Restaurante */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                Alertas - {selectedRestaurant.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metricas.ventasHoy > metricas.ventasAyer && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Ventas superaron las de ayer</p>
                        <p className="text-xs text-green-600">
                          Ayer: ${metricas.ventasAyer.toLocaleString('es-CL')} • Hoy: ${metricas.ventasHoy.toLocaleString('es-CL')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Logrado</Badge>
                  </div>
                )}
                
                {metricas.ocupacionActual > 90 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <Timer className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Ocupación muy alta ({metricas.ocupacionActual}%)</p>
                        <p className="text-xs text-yellow-600">Considerar gestión de esperas</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Atención</Badge>
                  </div>
                )}
                
                {metricas.reservasManana > metricas.reservasHoy && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Mañana hay más reservas que hoy</p>
                        <p className="text-xs text-blue-600">
                          Hoy: {metricas.reservasHoy} • Mañana: {metricas.reservasManana}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">Info</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Vista para Restaurante en Mantenimiento */
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center text-yellow-800">
              <Timer className="w-5 h-5 mr-2" />
              Restaurante en Mantenimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-700">
                {selectedRestaurant.name} se encuentra temporalmente en mantenimiento.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-800">Información del Restaurante</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Ubicación:</span>
                      <span>{selectedRestaurant.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipo:</span>
                      <span className="capitalize">{selectedRestaurant.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                        En Mantenimiento
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-800">Datos Recientes</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Última venta:</span>
                      <span>${metricas.ventasAyer.toLocaleString('es-CL')} (ayer)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="flex items-center">
                        {metricas.calificacionPromedio} <Star className="h-3 w-3 text-yellow-500 ml-1 fill-current" />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reservas mañana:</span>
                      <span>{metricas.reservasManana}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-yellow-200">
                <p className="text-sm text-yellow-600 mb-3">
                  Reapertura programada para mañana. Las reservas siguen activas.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  onClick={() => {
                    // Aquí podrías abrir un modal para gestionar el mantenimiento
                    alert('Funcionalidad de gestión de mantenimiento próximamente');
                  }}
                >
                  Gestionar Mantenimiento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
