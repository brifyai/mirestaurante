
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Download,
  Filter,
  Eye,
  DollarSign,
  Target,
  Clock,
  Star,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Cake,
  Gift,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Database,
  FileText,
  Printer,
  Share2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Percent,
  CreditCard,
  ShoppingCart,
  Heart,
  Crown,
  Trophy,
  Calendar as CalendarIcon,
  Clock4,
  Users2,
  Building2,
  Smartphone,
  Globe,
  Search,
  Settings,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import Swal from 'sweetalert2';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend,
  ComposedChart
} from 'recharts';

interface ReporteMetrica {
  titulo: string;
  valor: string | number;
  cambio: number;
  tendencia: 'up' | 'down' | 'stable';
  periodo: string;
  icono: React.ReactNode;
  color: string;
}

export default function ReportesContent() {
  const [activeTab, setActiveTab] = useState('general');
  const [filtroFecha, setFiltroFecha] = useState('mes');
  const [tipoExporte, setTipoExporte] = useState('pdf');
  const [actualizando, setActualizando] = useState(false);

  const handleActualizarDatos = async () => {
    setActualizando(true);
    try {
      // Simular actualización de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      Swal.fire({
        title: 'Datos actualizados',
        text: 'Los datos han sido actualizados exitosamente',
        icon: 'success',
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Error al actualizar datos',
        icon: 'error'
      });
    } finally {
      setActualizando(false);
    }
  };

  const handleCompartirDashboard = () => {
    const dashboardUrl = `${window.location.origin}/reportes?shared=true&token=${Date.now()}`;
    navigator.clipboard.writeText(dashboardUrl);
    Swal.fire({
      title: 'Enlace copiado',
      text: 'El enlace del dashboard ha sido copiado al portapapeles. Puedes compartir este enlace para que otros vean los reportes',
      icon: 'success',
      timer: 3000
    });
  };

  const handleExportar = (tipo: string) => {
    Swal.fire({
      title: 'Exportación iniciada',
      text: `Iniciando exportación de ${tipo}. El archivo se descargará automáticamente cuando esté listo. También se enviará una copia por email`,
      icon: 'info',
      timer: 3000
    });
  };

  const handleExportarTodo = () => {
    Swal.fire({
      title: '¿Exportar todos los reportes?',
      html: `
        Esto incluye:<br>
        • Reporte General<br>
        • Reporte Financiero<br>
        • Analytics de Clientes<br>
        • Datos de Campañas<br><br>
        <strong>El archivo será de gran tamaño.</strong>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, exportar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Exportación iniciada',
          text: 'Preparando exportación completa. Esto puede tomar varios minutos. Recibirás una notificación cuando esté listo.',
          icon: 'info',
          timer: 4000
        });
      }
    });
  };

  // Datos de métricas principales
  const metricas: ReporteMetrica[] = [
    {
      titulo: 'Ingresos Totales',
      valor: '$48,950,000',
      cambio: 15.2,
      tendencia: 'up',
      periodo: 'vs mes anterior',
      icono: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      titulo: 'Total Clientes',
      valor: '5,016',
      cambio: 8.3,
      tendencia: 'up',
      periodo: 'vs mes anterior',
      icono: <Users className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      titulo: 'Reservas Completadas',
      valor: '1,287',
      cambio: 12.1,
      tendencia: 'up',
      periodo: 'vs mes anterior',
      icono: <Calendar className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      titulo: 'Ticket Promedio',
      valor: '$23,500',
      cambio: 3.7,
      tendencia: 'up',
      periodo: 'vs mes anterior',
      icono: <Target className="w-5 h-5" />,
      color: 'text-orange-600'
    },
    {
      titulo: 'Tasa Ocupación',
      valor: '87%',
      cambio: 5.2,
      tendencia: 'up',
      periodo: 'vs mes anterior',
      icono: <Activity className="w-5 h-5" />,
      color: 'text-indigo-600'
    },
    {
      titulo: 'Campañas Activas',
      valor: '28',
      cambio: -2.1,
      tendencia: 'down',
      periodo: 'vs mes anterior',
      icono: <MessageSquare className="w-5 h-5" />,
      color: 'text-pink-600'
    }
  ];

  // Datos de ingresos por mes
  const datosIngresos = [
    { mes: 'Ene', ingresos: 4200000, reservas: 180, clientes: 890, campanasEnviadas: 12 },
    { mes: 'Feb', ingresos: 3800000, reservas: 165, clientes: 820, campanasEnviadas: 15 },
    { mes: 'Mar', ingresos: 4600000, reservas: 195, clientes: 950, campanasEnviadas: 18 },
    { mes: 'Abr', ingresos: 4100000, reservas: 175, clientes: 875, campanasEnviadas: 14 },
    { mes: 'May', ingresos: 4800000, reservas: 205, clientes: 985, campanasEnviadas: 20 },
    { mes: 'Jun', ingresos: 5200000, reservas: 220, clientes: 1050, campanasEnviadas: 22 },
    { mes: 'Jul', ingresos: 5600000, reservas: 240, clientes: 1120, campanasEnviadas: 25 },
    { mes: 'Ago', ingresos: 4900000, reservas: 210, clientes: 995, campanasEnviadas: 23 }
  ];

  // Datos de clientes por canal
  const datosClientesCanal = [
    { name: 'WhatsApp', value: 2340, color: '#10B981', porcentaje: 46.6 },
    { name: 'Portal QR', value: 1890, color: '#8B5CF6', porcentaje: 37.7 },
    { name: 'Facebook', value: 520, color: '#3B82F6', porcentaje: 10.4 },
    { name: 'Instagram', value: 266, color: '#F59E0B', porcentaje: 5.3 }
  ];

  // Datos de reservas por día de la semana
  const datosReservasDia = [
    { dia: 'Lun', reservas: 45, ocupacion: 65, ingresos: 980000 },
    { dia: 'Mar', reservas: 52, ocupacion: 73, ingresos: 1120000 },
    { dia: 'Mié', reservas: 48, ocupacion: 69, ingresos: 1050000 },
    { dia: 'Jue', reservas: 67, ocupacion: 89, ingresos: 1450000 },
    { dia: 'Vie', reservas: 89, ocupacion: 98, ingresos: 1890000 },
    { dia: 'Sáb', reservas: 95, ocupacion: 100, ingresos: 2100000 },
    { dia: 'Dom', reservas: 78, ocupacion: 92, ingresos: 1650000 }
  ];

  // Datos de campañas por efectividad
  const datosCampanas = [
    { tipo: 'WhatsApp', enviadas: 45, leidas: 42, clicks: 28, conversiones: 15, roi: 320 },
    { tipo: 'Email', enviadas: 180, leidas: 142, clicks: 67, conversiones: 23, roi: 250 },
    { tipo: 'Cumpleaños', enviadas: 23, leidas: 22, clicks: 18, conversiones: 12, roi: 480 },
    { tipo: 'Recompra', enviadas: 67, leidas: 58, clicks: 34, conversiones: 19, roi: 290 }
  ];

  // Top 10 clientes más valiosos
  const topClientes = [
    { nombre: 'María González', email: 'maria@email.com', reservas: 24, gasto: 892000, ultimaVisita: '2025-08-30' },
    { nombre: 'Carlos Rodríguez', email: 'carlos@email.com', reservas: 19, gasto: 745000, ultimaVisita: '2025-09-01' },
    { nombre: 'Ana Morales', email: 'ana@email.com', reservas: 22, gasto: 698000, ultimaVisita: '2025-08-28' },
    { nombre: 'Diego Silva', email: 'diego@email.com', reservas: 18, gasto: 623000, ultimaVisita: '2025-08-25' },
    { nombre: 'Carmen López', email: 'carmen@email.com', reservas: 16, gasto: 587000, ultimaVisita: '2025-09-02' }
  ];

  // Datos de horas pico
  const datosHorasPico = [
    { hora: '12:00', reservas: 15, ocupacion: 78 },
    { hora: '13:00', reservas: 28, ocupacion: 95 },
    { hora: '14:00', reservas: 22, ocupacion: 87 },
    { hora: '19:00', reservas: 32, ocupacion: 98 },
    { hora: '20:00', reservas: 45, ocupacion: 100 },
    { hora: '21:00', reservas: 38, ocupacion: 92 },
    { hora: '22:00', reservas: 18, ocupacion: 65 }
  ];

  // Análisis de retención por cohorte
  const datosRetencion = [
    { cohorte: 'Ene 2025', mes1: 100, mes2: 78, mes3: 65, mes4: 52, mes5: 45, mes6: 38 },
    { cohorte: 'Feb 2025', mes1: 100, mes2: 82, mes3: 68, mes4: 54, mes5: 47, mes6: 0 },
    { cohorte: 'Mar 2025', mes1: 100, mes2: 75, mes3: 61, mes4: 48, mes5: 0, mes6: 0 },
    { cohorte: 'Abr 2025', mes1: 100, mes2: 79, mes3: 63, mes4: 0, mes5: 0, mes6: 0 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };



  const getTendenciaIcon = (tendencia: 'up' | 'down' | 'stable') => {
    switch (tendencia) {
      case 'up':
        return <ArrowUpCircle className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDownCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Reportes y Analytics</h1>
            <p className="text-gray-600">
              Análisis completo y detallado de todos los datos de tu restaurante
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="flex items-center space-x-2">
              <Label>Período:</Label>
              <select
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="semana">Última Semana</option>
                <option value="mes">Último Mes</option>
                <option value="trimestre">Último Trimestre</option>
                <option value="ano">Último Año</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
            <Button variant="outline" onClick={handleActualizarDatos} disabled={actualizando}>
              <RefreshCw className={`w-4 h-4 mr-2 ${actualizando ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {metricas.map((metrica, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-100 ${metrica.color}`}>
                  {metrica.icono}
                </div>
                <div className="flex items-center space-x-1">
                  {getTendenciaIcon(metrica.tendencia)}
                  <span className={`text-sm font-medium ${
                    metrica.tendencia === 'up' ? 'text-green-600' : 
                    metrica.tendencia === 'down' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {metrica.cambio > 0 ? '+' : ''}{metrica.cambio}%
                  </span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metrica.valor}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {metrica.titulo}
                </div>
                <div className="text-xs text-gray-500">
                  {metrica.periodo}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 rounded-lg p-1">
          <TabsTrigger 
            value="general" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
            onClick={() => {
              setActiveTab('general');
              Swal.fire({
                title: 'Cargando reporte',
                text: 'Cargando reporte general...',
                icon: 'info',
                timer: 1500
              });
            }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger 
            value="clientes" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Users className="w-4 h-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="reservas" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Calendar className="w-4 h-4" />
            <span>Reservas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="campanas" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Campañas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="financiero" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
            onClick={() => {
              setActiveTab('financiero');
              Swal.fire({
                title: 'Cargando reporte',
                text: 'Cargando reporte financiero...',
                icon: 'info',
                timer: 1500
              });
            }}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financiero</span>
          </TabsTrigger>
          <TabsTrigger 
            value="avanzados" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Target className="w-4 h-4" />
            <span>Avanzados</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB: General */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolución de Ingresos */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Ingresos Mensual</CardTitle>
                <CardDescription>
                  Seguimiento de ingresos, reservas y adquisición de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={datosIngresos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'ingresos' ? formatCurrency(value) : value,
                        name === 'ingresos' ? 'Ingresos' : 
                        name === 'reservas' ? 'Reservas' : 
                        name === 'clientes' ? 'Nuevos Clientes' : 'Campañas'
                      ]}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="ingresos" fill="#8B5CF6" fillOpacity={0.3} />
                    <Bar yAxisId="right" dataKey="reservas" fill="#10B981" />
                    <Line yAxisId="right" type="monotone" dataKey="clientes" stroke="#F59E0B" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Clientes por Canal</CardTitle>
                <CardDescription>
                  Origen de adquisición de tu base de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={datosClientesCanal}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {datosClientesCanal.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Clientes']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {datosClientesCanal.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{item.value.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{item.porcentaje}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones de Exportación</CardTitle>
              <CardDescription>
                Exporta y comparte tus reportes en diferentes formatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Formato de Exportación</Label>
                  <select
                    value={tipoExporte}
                    onChange={(e) => setTipoExporte(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="pptx">PowerPoint</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => handleExportar('Reporte General')} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Reporte General
                  </Button>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={handleCompartirDashboard}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Clientes */}
        <TabsContent value="clientes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Clientes VIP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span>Top 5 Clientes VIP</span>
                </CardTitle>
                <CardDescription>
                  Clientes con mayor gasto y frecuencia de visitas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topClientes.map((cliente, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{cliente.nombre}</div>
                          <div className="text-sm text-gray-500">{cliente.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{formatCurrency(cliente.gasto)}</div>
                        <div className="text-sm text-gray-500">{cliente.reservas} reservas</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Análisis Demográfico */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis Demográfico</CardTitle>
                <CardDescription>
                  Distribución de clientes por características
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Edades */}
                  <div>
                    <h5 className="font-medium text-gray-800 mb-3">Distribución por Edad</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">18-25 años</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">26-35 años</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">36-50 años</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                          <span className="text-sm font-medium">32%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">50+ años</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                          </div>
                          <span className="text-sm font-medium">18%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segmentación RFM */}
                  <div>
                    <h5 className="font-medium text-gray-800 mb-3">Segmentación RFM</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-lg font-bold text-green-600">1,256</div>
                        <div className="text-sm text-green-700">Campeones</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-lg font-bold text-blue-600">892</div>
                        <div className="text-sm text-blue-700">Leales</div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-lg font-bold text-yellow-600">654</div>
                        <div className="text-sm text-yellow-700">Potencial</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-lg font-bold text-red-600">234</div>
                        <div className="text-sm text-red-700">En Riesgo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Retención y Lifetime Value */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Retención por Cohorte</CardTitle>
              <CardDescription>
                Seguimiento de retención de clientes nuevos por mes de adquisición
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Cohorte</th>
                      <th className="text-center p-3">Mes 1</th>
                      <th className="text-center p-3">Mes 2</th>
                      <th className="text-center p-3">Mes 3</th>
                      <th className="text-center p-3">Mes 4</th>
                      <th className="text-center p-3">Mes 5</th>
                      <th className="text-center p-3">Mes 6</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosRetencion.map((cohorte, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{cohorte.cohorte}</td>
                        <td className="p-3 text-center">
                          <span className="inline-block w-12 h-6 bg-green-500 text-white text-xs rounded-full leading-6">
                            {cohorte.mes1}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block w-12 h-6 text-white text-xs rounded-full leading-6 ${
                            cohorte.mes2 > 70 ? 'bg-green-500' : cohorte.mes2 > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {cohorte.mes2 > 0 ? `${cohorte.mes2}%` : '-'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block w-12 h-6 text-white text-xs rounded-full leading-6 ${
                            cohorte.mes3 > 60 ? 'bg-green-500' : cohorte.mes3 > 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {cohorte.mes3 > 0 ? `${cohorte.mes3}%` : '-'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block w-12 h-6 text-white text-xs rounded-full leading-6 ${
                            cohorte.mes4 > 50 ? 'bg-green-500' : cohorte.mes4 > 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {cohorte.mes4 > 0 ? `${cohorte.mes4}%` : '-'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block w-12 h-6 text-white text-xs rounded-full leading-6 ${
                            cohorte.mes5 > 40 ? 'bg-green-500' : cohorte.mes5 > 25 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {cohorte.mes5 > 0 ? `${cohorte.mes5}%` : '-'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block w-12 h-6 text-white text-xs rounded-full leading-6 ${
                            cohorte.mes6 > 35 ? 'bg-green-500' : cohorte.mes6 > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {cohorte.mes6 > 0 ? `${cohorte.mes6}%` : '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button onClick={() => handleExportar('Análisis de Retención')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Análisis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Reservas */}
        <TabsContent value="reservas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reservas por Día de la Semana */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis por Día de la Semana</CardTitle>
                <CardDescription>
                  Patrones de reservas, ocupación e ingresos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={datosReservasDia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'ingresos' ? formatCurrency(value) : 
                        name === 'ocupacion' ? `${value}%` : `${value} reservas`,
                        name === 'reservas' ? 'Reservas' : 
                        name === 'ocupacion' ? 'Ocupación' : 'Ingresos'
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="reservas" fill="#8B5CF6" />
                    <Bar yAxisId="right" dataKey="ocupacion" fill="#10B981" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Horas Pico */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Horas Pico</CardTitle>
                <CardDescription>
                  Demanda por horarios del día
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={datosHorasPico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'ocupacion' ? `${value}%` : `${value} reservas`,
                        name === 'reservas' ? 'Reservas' : 'Ocupación'
                      ]}
                    />
                    <Line type="monotone" dataKey="reservas" stroke="#8B5CF6" strokeWidth={3} />
                    <Line type="monotone" dataKey="ocupacion" stroke="#F59E0B" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas de Reservas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600">1,287</div>
                <div className="text-sm text-gray-600">Reservas Completadas</div>
                <div className="text-xs text-green-600 mt-1">+12.3% vs mes anterior</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-600">87%</div>
                <div className="text-sm text-gray-600">Tasa de Ocupación</div>
                <div className="text-xs text-green-600 mt-1">+5.2% vs mes anterior</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-orange-600">43</div>
                <div className="text-sm text-gray-600">No-Shows</div>
                <div className="text-xs text-red-600 mt-1">3.3% del total</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <RefreshCw className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600">29</div>
                <div className="text-sm text-gray-600">Cancelaciones</div>
                <div className="text-xs text-yellow-600 mt-1">2.3% del total</div>
              </CardContent>
            </Card>
          </div>

          {/* Exportar Reportes de Reservas */}
          <Card>
            <CardHeader>
              <CardTitle>Exportar Reportes de Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => handleExportar('Reservas por Día')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Reporte Semanal
                </Button>
                <Button onClick={() => handleExportar('Horas Pico')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Análisis Horario
                </Button>
                <Button onClick={() => handleExportar('Ocupación')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Reporte Ocupación
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Campañas */}
        <TabsContent value="campanas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Efectividad por Tipo de Campaña */}
            <Card>
              <CardHeader>
                <CardTitle>Efectividad por Tipo de Campaña</CardTitle>
                <CardDescription>
                  ROI y métricas de conversión por canal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datosCampanas.map((campana, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{campana.tipo}</h4>
                        <Badge className={`${
                          campana.roi > 400 ? 'bg-green-500' :
                          campana.roi > 300 ? 'bg-blue-500' :
                          campana.roi > 200 ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}>
                          ROI: {campana.roi}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{campana.enviadas}</div>
                          <div className="text-gray-600">Enviadas</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{campana.leidas}</div>
                          <div className="text-gray-600">Leídas</div>
                          <div className="text-xs text-gray-500">
                            {((campana.leidas / campana.enviadas) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-orange-600">{campana.clicks}</div>
                          <div className="text-gray-600">Clicks</div>
                          <div className="text-xs text-gray-500">
                            {((campana.clicks / campana.leidas) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{campana.conversiones}</div>
                          <div className="text-gray-600">Conversiones</div>
                          <div className="text-xs text-gray-500">
                            {((campana.conversiones / campana.clicks) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métricas de Campañas */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Consolidadas</CardTitle>
                <CardDescription>
                  Resumen general del rendimiento de campañas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">315</div>
                      <div className="text-sm text-blue-700">Total Campañas</div>
                      <div className="text-xs text-gray-600">Últimos 6 meses</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">78.4%</div>
                      <div className="text-sm text-green-700">Tasa Apertura Promedio</div>
                      <div className="text-xs text-gray-600">Todas las campañas</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>WhatsApp</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Email</span>
                        <span className="font-medium">78.9%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78.9%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Automatizadas</span>
                        <span className="font-medium">86.7%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '86.7%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI por Mes */}
          <Card>
            <CardHeader>
              <CardTitle>ROI de Campañas por Mes</CardTitle>
              <CardDescription>
                Retorno de inversión mensual de todas las campañas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={datosIngresos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`${value} campañas`, 'Campañas Enviadas']}
                  />
                  <Line type="monotone" dataKey="campanasEnviadas" stroke="#8B5CF6" strokeWidth={3} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Financiero */}
        <TabsContent value="financiero" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Ingresos Totales</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  {formatCurrency(48950000)}
                </div>
                <p className="text-xs text-green-600 mt-1">+15.2% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Ticket Promedio</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-2">
                  {formatCurrency(23500)}
                </div>
                <p className="text-xs text-blue-600 mt-1">+3.7% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">Crecimiento Mensual</span>
                </div>
                <div className="text-2xl font-bold text-purple-600 mt-2">
                  12.8%
                </div>
                <p className="text-xs text-purple-600 mt-1">Promedio últimos 6 meses</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-6 w-6 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">Margen Operacional</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 mt-2">
                  28.5%
                </div>
                <p className="text-xs text-orange-600 mt-1">Saludable</p>
              </CardContent>
            </Card>
          </div>

          {/* Análisis Financiero Detallado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos vs Proyección</CardTitle>
                <CardDescription>
                  Comparación con objetivos planteados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={datosIngresos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: any) => [formatCurrency(value), 'Ingresos']} />
                    <Line type="monotone" dataKey="ingresos" stroke="#10B981" strokeWidth={3} name="Real" />
                    <Line type="monotone" dataKey="ingresos" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Proyección" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Rentabilidad</CardTitle>
                <CardDescription>
                  Desglose de costos e ingresos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">Ingresos Brutos</span>
                    <span className="text-green-600 font-bold">{formatCurrency(48950000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">Costos Operacionales</span>
                    <span className="text-red-600 font-bold">{formatCurrency(35000000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-800">Utilidad Neta</span>
                    <span className="text-blue-600 font-bold">{formatCurrency(13950000)}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">28.5%</div>
                      <div className="text-sm text-gray-600">Margen de Utilidad</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Exportar Reportes Financieros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button onClick={() => handleExportar('Estado de Resultados')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Estado de Resultados
                </Button>
                <Button onClick={() => handleExportar('Flujo de Caja')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Flujo de Caja
                </Button>
                <Button onClick={() => handleExportar('Análisis de Rentabilidad')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Rentabilidad
                </Button>
                <Button onClick={() => handleExportar('Proyecciones')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Proyecciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Avanzados */}
        <TabsContent value="avanzados" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Lifetime Value */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span>Customer Lifetime Value</span>
                </CardTitle>
                <CardDescription>
                  Valor promedio de vida de los clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">{formatCurrency(450000)}</div>
                    <div className="text-sm text-gray-600">CLV Promedio</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clientes VIP (Top 20%)</span>
                      <span className="font-semibold text-green-600">{formatCurrency(890000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clientes Frecuentes (30%)</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(520000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clientes Ocasionales (50%)</span>
                      <span className="font-semibold text-gray-600">{formatCurrency(180000)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 mb-2">Recomendación</h5>
                    <p className="text-sm text-yellow-700">
                      Enfocar campañas en convertir clientes ocasionales a frecuentes puede 
                      aumentar el CLV promedio en un 35%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predicción de Churn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span>Predicción de Churn</span>
                </CardTitle>
                <CardDescription>
                  Clientes en riesgo de abandono
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">234</div>
                      <div className="text-sm text-red-700">Alto Riesgo</div>
                      <div className="text-xs text-gray-600">4.7%</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">456</div>
                      <div className="text-sm text-yellow-700">Riesgo Medio</div>
                      <div className="text-xs text-gray-600">9.1%</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">4,326</div>
                      <div className="text-sm text-green-700">Bajo Riesgo</div>
                      <div className="text-xs text-gray-600">86.2%</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-3">Factores de Riesgo Principales</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Sin visita &gt; 60 días</span>
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Alto Impacto
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Reducción en frecuencia</span>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Medio Impacto
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>No abre emails/WhatsApp</span>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Medio Impacto
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Crear Campaña de Retención
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Heat Map de Actividad */}
          <Card>
            <CardHeader>
              <CardTitle>Heat Map de Actividad</CardTitle>
              <CardDescription>
                Patrón de actividad por hora y día de la semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 gap-1 text-xs mb-2">
                  <div></div>
                  <div className="text-center font-medium">Lun</div>
                  <div className="text-center font-medium">Mar</div>
                  <div className="text-center font-medium">Mié</div>
                  <div className="text-center font-medium">Jue</div>
                  <div className="text-center font-medium">Vie</div>
                  <div className="text-center font-medium">Sáb</div>
                  <div className="text-center font-medium">Dom</div>
                </div>
                
                {['11:00', '12:00', '13:00', '14:00', '19:00', '20:00', '21:00', '22:00'].map((hora, horaIndex) => (
                  <div key={hora} className="grid grid-cols-8 gap-1 mb-1">
                    <div className="text-xs font-medium text-right pr-2">{hora}</div>
                    {[0.3, 0.6, 0.4, 0.8, 0.9, 1.0, 0.7].map((intensidad, diaIndex) => (
                      <div 
                        key={diaIndex} 
                        className="h-6 rounded"
                        style={{
                          backgroundColor: `rgba(139, 92, 246, ${intensidad})`,
                        }}
                        title={`${hora} - ${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][diaIndex]}: ${Math.round(intensidad * 100)}% ocupación`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(139, 92, 246, 0.3)' }}></div>
                  <span>Baja</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(139, 92, 246, 0.6)' }}></div>
                  <span>Media</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(139, 92, 246, 1)' }}></div>
                  <span>Alta</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exportación Avanzada */}
          <Card>
            <CardHeader>
              <CardTitle>Exportación de Reportes Avanzados</CardTitle>
              <CardDescription>
                Reportes especializados y análisis detallados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button onClick={() => handleExportar('Análisis CLV')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Análisis CLV Completo
                </Button>
                <Button onClick={() => handleExportar('Predicción Churn')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Lista Clientes en Riesgo
                </Button>
                <Button onClick={() => handleExportar('Segmentación RFM')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Segmentación RFM
                </Button>
                <Button onClick={() => handleExportar('Heat Map')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Heat Map Actividad
                </Button>
                <Button onClick={() => handleExportar('Análisis Cohorte')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Análisis de Cohortes
                </Button>
                <Button onClick={() => handleExportar('Dashboard Ejecutivo')} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Dashboard Ejecutivo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Acciones Flotantes */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-lg" onClick={handleExportarTodo}>
          <Download className="w-5 h-5 mr-2" />
          Exportar Todo
        </Button>
        <Button size="lg" variant="outline" className="bg-white shadow-lg" onClick={handleActualizarDatos} disabled={actualizando}>
          <RefreshCw className={`w-5 h-5 mr-2 ${actualizando ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
