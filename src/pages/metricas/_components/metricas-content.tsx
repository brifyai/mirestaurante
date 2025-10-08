

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart, 
  Calendar,
  Target,
  Users,
  Clock,
  ShoppingCart,
  Star,
  AlertTriangle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Percent,
  Calculator,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Zap,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

// Datos de ejemplo para métricas
const ventasMensuales = [
  { mes: 'Ene', ventas: 1200000, proyeccion: 1100000, gastos: 800000 },
  { mes: 'Feb', ventas: 1350000, proyeccion: 1200000, gastos: 850000 },
  { mes: 'Mar', ventas: 1180000, proyeccion: 1250000, gastos: 820000 },
  { mes: 'Abr', ventas: 1420000, proyeccion: 1300000, gastos: 900000 },
  { mes: 'May', ventas: 1380000, proyeccion: 1350000, gastos: 880000 },
  { mes: 'Jun', ventas: 1550000, proyeccion: 1400000, gastos: 950000 },
  { mes: 'Jul', ventas: 1680000, proyeccion: 1450000, gastos: 1000000 },
  { mes: 'Ago', ventas: 1720000, proyeccion: 1500000, gastos: 1050000 },
  { mes: 'Sep', ventas: 1450000, proyeccion: 1600000, gastos: 920000 }
];

const categoriasVenta = [
  { nombre: 'Platos Principales', valor: 4500000, color: '#3B82F6' },
  { nombre: 'Bebidas', valor: 2800000, color: '#10B981' },
  { nombre: 'Postres', valor: 1200000, color: '#F59E0B' },
  { nombre: 'Entradas', valor: 1800000, color: '#8B5CF6' },
  { nombre: 'Otros', valor: 700000, color: '#6B7280' }
];

const horasPopulares = [
  { hora: '11:00', ventas: 150000 },
  { hora: '12:00', ventas: 280000 },
  { hora: '13:00', ventas: 420000 },
  { hora: '14:00', ventas: 380000 },
  { hora: '15:00', ventas: 220000 },
  { hora: '18:00', ventas: 180000 },
  { hora: '19:00', ventas: 350000 },
  { hora: '20:00', ventas: 480000 },
  { hora: '21:00', ventas: 520000 },
  { hora: '22:00', ventas: 380000 }
];

const kpisFinancieros = {
  ventasHoy: 145000,
  ventasAyer: 132000,
  ventasMes: 1450000,
  ventasMesAnterior: 1380000,
  margenBruto: 65.2,
  margenNeto: 18.5,
  costoPromedioPorCliente: 32000,
  ticketPromedio: 28500,
  rotacionMesas: 3.2,
  satisfaccionCliente: 4.2,
  tiempoPromedioServicio: 25,
  ocupacionPromedio: 78
};

const gastosOperacionales = [
  { categoria: 'Ingredientes', presupuesto: 400000, gastado: 385000, porcentaje: 96 },
  { categoria: 'Personal', presupuesto: 350000, gastado: 340000, porcentaje: 97 },
  { categoria: 'Servicios', presupuesto: 80000, gastado: 75000, porcentaje: 94 },
  { categoria: 'Marketing', presupuesto: 60000, gastado: 45000, porcentaje: 75 },
  { categoria: 'Mantenimiento', presupuesto: 40000, gastado: 38000, porcentaje: 95 },
  { categoria: 'Otros', presupuesto: 50000, gastado: 42000, porcentaje: 84 }
];

const metasMensuales = [
  { 
    nombre: 'Ventas Totales', 
    actual: 1450000, 
    meta: 1600000, 
    progreso: 90.6,
    tipo: 'dinero'
  },
  { 
    nombre: 'Nuevos Clientes', 
    actual: 125, 
    meta: 150, 
    progreso: 83.3,
    tipo: 'numero'
  },
  { 
    nombre: 'Satisfacción Cliente', 
    actual: 4.2, 
    meta: 4.5, 
    progreso: 93.3,
    tipo: 'rating'
  },
  { 
    nombre: 'Margen de Ganancia', 
    actual: 18.5, 
    meta: 20, 
    progreso: 92.5,
    tipo: 'porcentaje'
  }
];

export default function MetricasContent() {
  const navigation = useNavigation();
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');
  const [vistaActiva, setVistaActiva] = useState('resumen');

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  const calcularCambio = (actual: number, anterior: number) => {
    const cambio = ((actual - anterior) / anterior) * 100;
    return {
      valor: Math.abs(cambio).toFixed(1),
      positivo: cambio >= 0
    };
  };

  const exportarReporte = () => {
    // Implementar exportación de reporte
    console.log('Exportar reporte de métricas');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Métricas Financieras</h1>
          <p className="text-gray-600 mt-2">KPIs y análisis de rendimiento empresarial</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigation.navigateTo('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mes</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="año">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportarReporte}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas Hoy</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatearMoneda(kpisFinancieros.ventasHoy)}
                </p>
                <div className="flex items-center mt-1">
                  {(() => {
                    const cambio = calcularCambio(kpisFinancieros.ventasHoy, kpisFinancieros.ventasAyer);
                    return (
                      <div className={`flex items-center text-xs ${cambio.positivo ? 'text-green-600' : 'text-red-600'}`}>
                        {cambio.positivo ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        <span>{cambio.valor}% vs ayer</span>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Promedio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatearMoneda(kpisFinancieros.ticketPromedio)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+5.2% vs mes anterior</span>
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Margen Neto</p>
                <p className="text-2xl font-bold text-purple-600">{kpisFinancieros.margenNeto}%</p>
                <div className="flex items-center mt-1">
                  <Target className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600">Meta: 20%</span>
                </div>
              </div>
              <Percent className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ocupación</p>
                <p className="text-2xl font-bold text-orange-600">{kpisFinancieros.ocupacionPromedio}%</p>
                <div className="flex items-center mt-1">
                  <Users className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600">Rotación: {kpisFinancieros.rotacionMesas}x</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principal */}
      <Tabs value={vistaActiva} onValueChange={setVistaActiva} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Tendencia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tendencia de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: any) => formatearMoneda(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3} 
                      name="Ventas Reales"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="proyeccion" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.1} 
                      name="Proyección"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución por Categorías */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Ventas por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoriasVenta}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="valor"
                    >
                      {categoriasVenta.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatearMoneda(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoriasVenta.map((categoria, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: categoria.color }}
                        ></div>
                        <span>{categoria.nombre}</span>
                      </div>
                      <span className="font-medium">{formatearMoneda(categoria.valor)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Operacionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Servicio</p>
                    <p className="text-xl font-bold text-blue-600">{kpisFinancieros.tiempoPromedioServicio} min</p>
                  </div>
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfacción</p>
                    <p className="text-xl font-bold text-yellow-600">{kpisFinancieros.satisfaccionCliente}/5</p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Costo por Cliente</p>
                    <p className="text-xl font-bold text-green-600">{formatearMoneda(kpisFinancieros.costoPromedioPorCliente)}</p>
                  </div>
                  <Calculator className="w-6 h-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Margen Bruto</p>
                    <p className="text-xl font-bold text-purple-600">{kpisFinancieros.margenBruto}%</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ventas" className="space-y-6">
          {/* Análisis de Ventas Detallado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Hora del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={horasPopulares}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value: any) => formatearMoneda(value)} />
                    <Bar dataKey="ventas" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rendimiento vs Proyección</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: any) => formatearMoneda(value)} />
                    <Line 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Ventas Reales"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="proyeccion" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Proyección"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Productos */}
          <Card>
            <CardHeader>
              <CardTitle>Top Productos del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { nombre: 'Parrillada Especial', ventas: 450000, cantidad: 85, ranking: 1 },
                  { nombre: 'Salmón Grillado', ventas: 380000, cantidad: 62, ranking: 2 },
                  { nombre: 'Pasta Carbonara', ventas: 320000, cantidad: 94, ranking: 3 },
                  { nombre: 'Cóctel Mojito', ventas: 280000, cantidad: 156, ranking: 4 },
                  { nombre: 'Tiramisú', ventas: 210000, cantidad: 78, ranking: 5 }
                ].map((producto) => (
                  <div key={producto.ranking} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">#{producto.ranking}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{producto.nombre}</h3>
                        <p className="text-sm text-gray-600">{producto.cantidad} unidades vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatearMoneda(producto.ventas)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gastos" className="space-y-6">
          {/* Control de Gastos */}
          <Card>
            <CardHeader>
              <CardTitle>Control de Gastos Operacionales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {gastosOperacionales.map((gasto) => (
                  <div key={gasto.categoria}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{gasto.categoria}</h3>
                        <p className="text-sm text-gray-600">
                          {formatearMoneda(gasto.gastado)} de {formatearMoneda(gasto.presupuesto)}
                        </p>
                      </div>
                      <div className={`text-right ${gasto.porcentaje > 95 ? 'text-red-600' : gasto.porcentaje > 85 ? 'text-orange-600' : 'text-green-600'}`}>
                        <p className="font-semibold">{gasto.porcentaje}%</p>
                        <p className="text-xs">del presupuesto</p>
                      </div>
                    </div>
                    <Progress 
                      value={gasto.porcentaje} 
                      className={`w-full ${gasto.porcentaje > 95 ? 'text-red-600' : gasto.porcentaje > 85 ? 'text-orange-600' : 'text-green-600'}`} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análisis de Rentabilidad */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Rentabilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: any) => formatearMoneda(value)} />
                  <Bar dataKey="ventas" fill="#3B82F6" name="Ingresos" />
                  <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metas" className="space-y-6">
          {/* Seguimiento de Metas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metasMensuales.map((meta) => (
              <Card key={meta.nombre}>
                <CardHeader>
                  <CardTitle className="text-lg">{meta.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {meta.tipo === 'dinero' ? formatearMoneda(meta.actual) :
                         meta.tipo === 'rating' ? `${meta.actual}/5` :
                         meta.tipo === 'porcentaje' ? `${meta.actual}%` :
                         meta.actual}
                      </span>
                      <Badge 
                        variant={meta.progreso >= 100 ? "default" : meta.progreso >= 80 ? "secondary" : "destructive"}
                      >
                        {meta.progreso.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <Progress value={meta.progreso} className="w-full" />
                    
                    <div className="text-sm text-gray-600">
                      Meta: {meta.tipo === 'dinero' ? formatearMoneda(meta.meta) :
                             meta.tipo === 'rating' ? `${meta.meta}/5` :
                             meta.tipo === 'porcentaje' ? `${meta.meta}%` :
                             meta.meta}
                    </div>
                    
                    {meta.progreso < 100 && (
                      <div className="text-sm text-orange-600">
                        Falta: {meta.tipo === 'dinero' ? formatearMoneda(meta.meta - meta.actual) :
                                meta.tipo === 'rating' ? `${(meta.meta - meta.actual).toFixed(1)} puntos` :
                                meta.tipo === 'porcentaje' ? `${(meta.meta - meta.actual).toFixed(1)}%` :
                                (meta.meta - meta.actual)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-6">
          {/* Comparativo Temporal */}
          <Card>
            <CardHeader>
              <CardTitle>Comparativo Temporal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">Este Mes</p>
                  <p className="text-2xl font-bold text-blue-600">{formatearMoneda(kpisFinancieros.ventasMes)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">Mes Anterior</p>
                  <p className="text-2xl font-bold text-gray-600">{formatearMoneda(kpisFinancieros.ventasMesAnterior)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">Crecimiento</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{(((kpisFinancieros.ventasMes - kpisFinancieros.ventasMesAnterior) / kpisFinancieros.ventasMesAnterior) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benchmarking */}
          <Card>
            <CardHeader>
              <CardTitle>Benchmarking del Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: 'Ticket Promedio', tuValor: 28500, promedio: 25000, benchmark: 'Superior' },
                  { metric: 'Margen Neto', tuValor: 18.5, promedio: 15.2, benchmark: 'Superior' },
                  { metric: 'Rotación Mesas', tuValor: 3.2, promedio: 2.8, benchmark: 'Superior' },
                  { metric: 'Tiempo Servicio', tuValor: 25, promedio: 30, benchmark: 'Superior' },
                  { metric: 'Satisfacción Cliente', tuValor: 4.2, promedio: 3.8, benchmark: 'Superior' }
                ].map((item) => (
                  <div key={item.metric} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h3 className="font-medium">{item.metric}</h3>
                      <p className="text-sm text-gray-600">
                        Tu valor: {typeof item.tuValor === 'number' && item.tuValor > 1000 ? 
                                   formatearMoneda(item.tuValor) : 
                                   item.tuValor}
                        {item.metric === 'Tiempo Servicio' && ' min'}
                        {item.metric === 'Satisfacción Cliente' && '/5'}
                        {item.metric === 'Margen Neto' && '%'}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={item.benchmark === 'Superior' ? 'default' : 'secondary'}
                        className="mb-1"
                      >
                        {item.benchmark}
                      </Badge>
                      <p className="text-xs text-gray-600">
                        Promedio: {typeof item.promedio === 'number' && item.promedio > 1000 ? 
                                   formatearMoneda(item.promedio) : 
                                   item.promedio}
                        {item.metric === 'Tiempo Servicio' && ' min'}
                        {item.metric === 'Satisfacción Cliente' && '/5'}
                        {item.metric === 'Margen Neto' && '%'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
