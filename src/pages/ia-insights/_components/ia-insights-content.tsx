

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target,
  Users,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Eye,
  ArrowRight,
  Calendar,
  DollarSign,
  ChefHat,
  MessageSquare,
  Gauge,
  Crosshair,
  Wand2,
  RefreshCw,
  Download
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Swal from 'sweetalert2';

// Datos de predicción para los próximos meses
const prediccionVentas = [
  { mes: 'Oct', real: null, prediccion: 1850000, confianza: 85 },
  { mes: 'Nov', real: null, prediccion: 2100000, confianza: 78 },
  { mes: 'Dic', real: null, prediccion: 2450000, confianza: 72 },
  { mes: 'Ene', real: null, prediccion: 1950000, confianza: 82 },
  { mes: 'Feb', real: null, prediccion: 2200000, confianza: 80 }
];

// Datos históricos para entrenamiento
const datosHistoricos = [
  { mes: 'May', real: 1380000, prediccion: 1350000 },
  { mes: 'Jun', real: 1550000, prediccion: 1580000 },
  { mes: 'Jul', real: 1680000, prediccion: 1650000 },
  { mes: 'Ago', real: 1720000, prediccion: 1740000 },
  { mes: 'Sep', real: 1450000, prediccion: 1480000 }
];

// Insights generados por IA
const insights = [
  {
    id: 1,
    tipo: 'oportunidad',
    titulo: 'Incremento de demanda los viernes',
    descripcion: 'La IA detecta un patrón de incremento del 35% en reservas los viernes entre 7-9 PM. Considera ampliar personal.',
    prioridad: 'alta',
    impacto: 'Incremento potencial de $180,000/mes',
    accion: 'Optimizar staffing viernes noche',
    confianza: 92,
    categoria: 'operaciones'
  },
  {
    id: 2,
    tipo: 'alerta',
    titulo: 'Riesgo de abandono de clientes VIP',
    descripcion: 'El modelo identifica patrones de disminución en frecuencia de visitas de 8 clientes VIP en los últimos 30 días.',
    prioridad: 'critica',
    impacto: 'Pérdida potencial de $320,000/año',
    accion: 'Campaña de retención personalizada',
    confianza: 88,
    categoria: 'clientes'
  },
  {
    id: 3,
    tipo: 'optimizacion',
    titulo: 'Ajuste de precios para postres',
    descripcion: 'El análisis sugiere que los postres tienen elasticidad de precio favorable. Incremento del 8% no afectaría demanda.',
    prioridad: 'media',
    impacto: 'Incremento de margen: $45,000/mes',
    accion: 'Revisar pricing de postres premium',
    confianza: 79,
    categoria: 'precios'
  },
  {
    id: 4,
    tipo: 'tendencia',
    titulo: 'Crecimiento en pedidos veganos',
    descripcion: 'Incremento sostenido del 28% en pedidos de opciones veganas en los últimos 3 meses.',
    prioridad: 'media',
    impacto: 'Oportunidad de nuevo segmento',
    accion: 'Ampliar menú vegano',
    confianza: 94,
    categoria: 'menu'
  },
  {
    id: 5,
    tipo: 'eficiencia',
    titulo: 'Optimización de horarios de personal',
    descripción: 'El modelo recomienda reasignar 2 meseros del turno mañana al turno noche para mejorar eficiencia.',
    prioridad: 'baja',
    impacto: 'Ahorro de $25,000/mes',
    accion: 'Rebalancear turnos de personal',
    confianza: 86,
    categoria: 'personal'
  }
];

// Datos para análisis de sentimientos
const sentimientosReseñas = [
  { aspecto: 'Servicio', positivo: 85, neutral: 10, negativo: 5 },
  { aspecto: 'Comida', positivo: 92, neutral: 6, negativo: 2 },
  { aspecto: 'Ambiente', positivo: 78, neutral: 18, negativo: 4 },
  { aspecto: 'Precio', positivo: 65, neutral: 25, negativo: 10 },
  { aspecto: 'Ubicación', positivo: 88, neutral: 10, negativo: 2 },
  { aspecto: 'Limpieza', positivo: 95, neutral: 4, negativo: 1 }
];

// Predicciones de comportamiento del cliente
const perfilesClientes = [
  { 
    segmento: 'Familias Jóvenes', 
    probabilidadRegreso: 78, 
    gastoPromedio: 45000, 
    frecuencia: 'Semanal',
    recomendacion: 'Menú infantil especial' 
  },
  { 
    segmento: 'Profesionales', 
    probabilidadRegreso: 85, 
    gastoPromedio: 28000, 
    frecuencia: 'Almuerzo diario',
    recomendacion: 'Servicio express mediodía' 
  },
  { 
    segmento: 'Parejas Románticas', 
    probabilidadRegreso: 92, 
    gastoPromedio: 75000, 
    frecuencia: 'Mensual',
    recomendacion: 'Paquetes de cena romántica' 
  },
  { 
    segmento: 'Grupos Sociales', 
    probabilidadRegreso: 82, 
    gastoPromedio: 35000, 
    frecuencia: 'Quincenal',
    recomendacion: 'Promociones grupales fin de semana' 
  }
];

// Análisis de competencia basado en IA
const analisisCompetencia = {
  posicionamiento: 'Superior',
  ventajaCompetitiva: ['Calidad del servicio', 'Innovación en menú', 'Experiencia digital'],
  amenazas: ['Nuevo competidor zona norte', 'Incremento costos ingredientes'],
  oportunidades: ['Expansión delivery', 'Eventos corporativos', 'Catering premium'],
  score: 8.2
};

export default function IAInsightsContent() {
  const [tipoAnalisis, setTipoAnalisis] = useState('todos');
  const [vistaActiva, setVistaActiva] = useState('insights');

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'oportunidad': return 'bg-green-100 text-green-800 border-green-200';
      case 'alerta': return 'bg-red-100 text-red-800 border-red-200';
      case 'optimizacion': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tendencia': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'eficiencia': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'oportunidad': return <TrendingUp className="w-4 h-4" />;
      case 'alerta': return <AlertTriangle className="w-4 h-4" />;
      case 'optimizacion': return <Target className="w-4 h-4" />;
      case 'tendencia': return <BarChart3 className="w-4 h-4" />;
      case 'eficiencia': return <Zap className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const insightsFiltrados = insights.filter(insight => 
    tipoAnalisis === 'todos' || insight.tipo === tipoAnalisis
  );

  const handleImplementarAccion = async (insight: any) => {
    const result = await Swal.fire({
      title: `Implementar Acción`,
      html: `
        <div class="text-left space-y-4">
          <div class="bg-blue-50 p-4 rounded border">
            <h3 class="font-semibold text-blue-800 mb-2">${insight.titulo}</h3>
            <p class="text-sm text-blue-700">${insight.descripcion}</p>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">Acción recomendada:</span>
              <span class="text-blue-600">${insight.accion}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Impacto esperado:</span>
              <span class="text-green-600">${insight.impacto}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Confianza IA:</span>
              <span class="text-purple-600">${insight.confianza}%</span>
            </div>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Implementar',
      cancelButtonText: 'Revisar Después',
      width: 600
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: '¡Acción Programada!',
        text: 'La recomendación ha sido añadida a tu lista de tareas',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleGenerarNuevosInsights = async () => {
    const result = await Swal.fire({
      title: 'Generando Nuevos Insights...',
      html: `
        <div class="space-y-4">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
          <p class="text-sm text-gray-600">La IA está analizando los datos más recientes...</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        setTimeout(() => {
          Swal.update({
            title: '¡Análisis Completado!',
            html: `
              <div class="space-y-3">
                <div class="text-green-600">
                  <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p class="font-semibold">Se han generado 3 nuevos insights</p>
                <p class="text-sm text-gray-600">Los insights han sido añadidos a tu dashboard</p>
              </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Ver Insights'
          });
        }, 3000);
      }
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            IA Insights
          </h1>
          <p className="text-gray-600 mt-2">Análisis predictivo y recomendaciones inteligentes</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => console.log('Exportar insights')}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            onClick={handleGenerarNuevosInsights}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generar Insights
          </Button>
        </div>
      </div>

      {/* Estado de IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Precisión IA</p>
                <p className="text-2xl font-bold text-purple-600">94.2%</p>
              </div>
              <Gauge className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Insights Activos</p>
                <p className="text-2xl font-bold text-blue-600">{insights.length}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impacto Potencial</p>
                <p className="text-2xl font-bold text-green-600">$570K</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Competitivo</p>
                <p className="text-2xl font-bold text-orange-600">{analisisCompetencia.score}/10</p>
              </div>
              <Crosshair className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principal */}
      <Tabs value={vistaActiva} onValueChange={setVistaActiva} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="predicciones">Predicciones</TabsTrigger>
          <TabsTrigger value="clientes">Análisis Clientes</TabsTrigger>
          <TabsTrigger value="sentimientos">Sentimientos</TabsTrigger>
          <TabsTrigger value="competencia">Competencia</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtrar Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Select value={tipoAnalisis} onValueChange={setTipoAnalisis}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Tipo de Insight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="oportunidad">Oportunidades</SelectItem>
                    <SelectItem value="alerta">Alertas</SelectItem>
                    <SelectItem value="optimizacion">Optimización</SelectItem>
                    <SelectItem value="tendencia">Tendencias</SelectItem>
                    <SelectItem value="eficiencia">Eficiencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Insights */}
          <div className="space-y-4">
            {insightsFiltrados.map((insight) => (
              <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className={`${getTipoColor(insight.tipo)} flex items-center gap-1`}>
                          {getTipoIcon(insight.tipo)}
                          {insight.tipo.charAt(0).toUpperCase() + insight.tipo.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPrioridadColor(insight.prioridad)}`}></div>
                          <span className="text-sm font-medium capitalize">{insight.prioridad}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {insight.confianza}% confianza
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{insight.titulo}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{insight.descripcion}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Acción Recomendada</span>
                          </div>
                          <p className="text-sm text-blue-700">{insight.accion}</p>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Impacto Esperado</span>
                          </div>
                          <p className="text-sm text-green-700">{insight.impacto}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleImplementarAccion(insight)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Implementar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => console.log('Ver detalles')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predicciones" className="space-y-6">
          {/* Predicción de Ventas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Predicción de Ventas - Próximos 5 Meses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[...datosHistoricos, ...prediccionVentas]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: any) => [`$${(value / 1000000).toFixed(2)}M`, 'Valor']} />
                  <Line 
                    type="monotone" 
                    dataKey="real" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Ventas Históricas"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="prediccion" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicción IA"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-5 gap-4">
                {prediccionVentas.map((pred) => (
                  <div key={pred.mes} className="text-center p-3 bg-green-50 rounded border border-green-200">
                    <div className="font-semibold text-green-800">{pred.mes}</div>
                    <div className="text-lg font-bold text-green-600">
                      ${(pred.prediccion / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-600">{pred.confianza}% confianza</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Factores de Influencia */}
          <Card>
            <CardHeader>
              <CardTitle>Factores de Influencia en Predicciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { factor: 'Estacionalidad', influencia: 85, descripcion: 'Patrones históricos de temporada alta/baja' },
                  { factor: 'Tendencias de Mercado', influencia: 72, descripcion: 'Comportamiento del sector restaurantero' },
                  { factor: 'Eventos Locales', influencia: 68, descripcion: 'Festivales, feriados y eventos especiales' },
                  { factor: 'Clima', influencia: 45, descripcion: 'Condiciones meteorológicas y su impacto' },
                  { factor: 'Competencia', influencia: 38, descripcion: 'Actividad de competidores cercanos' }
                ].map((item) => (
                  <div key={item.factor} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.factor}</h3>
                      <p className="text-sm text-gray-600">{item.descripcion}</p>
                    </div>
                    <div className="w-32">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Influencia</span>
                        <span>{item.influencia}%</span>
                      </div>
                      <Progress value={item.influencia} className="w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6">
          {/* Perfiles de Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Análisis Predictivo de Segmentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perfilesClientes.map((perfil) => (
                  <Card key={perfil.segmento} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-3">{perfil.segmento}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Probabilidad de Regreso</span>
                          <span className="font-semibold text-green-600">{perfil.probabilidadRegreso}%</span>
                        </div>
                        <Progress value={perfil.probabilidadRegreso} className="w-full" />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Gasto Promedio</span>
                            <p className="font-semibold">${perfil.gastoPromedio.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Frecuencia</span>
                            <p className="font-semibold">{perfil.frecuencia}</p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Recomendación IA</span>
                          </div>
                          <p className="text-sm text-blue-700">{perfil.recomendacion}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Predicción de Churn */}
          <Card>
            <CardHeader>
              <CardTitle>Predicción de Abandono de Clientes (Churn)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded border border-green-200">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-green-700">Clientes Leales</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">6%</div>
                  <div className="text-sm text-yellow-700">En Riesgo</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded border border-red-200">
                  <div className="text-2xl font-bold text-red-600">2%</div>
                  <div className="text-sm text-red-700">Alto Riesgo</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold mb-3">Clientes en Alto Riesgo</h3>
                {[
                  { nombre: 'Carlos Mendoza', riesgo: 85, ultimaVisita: '45 días', razon: 'Disminución frecuencia' },
                  { nombre: 'Ana Rodríguez', riesgo: 78, ultimaVisita: '32 días', razon: 'Calificaciones bajas recientes' },
                  { nombre: 'Luis González', riesgo: 72, ultimaVisita: '28 días', razon: 'Cambio en patrones de pedido' }
                ].map((cliente) => (
                  <div key={cliente.nombre} className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                    <div>
                      <h4 className="font-medium">{cliente.nombre}</h4>
                      <p className="text-sm text-gray-600">Última visita: {cliente.ultimaVisita}</p>
                      <p className="text-sm text-red-600">{cliente.razon}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{cliente.riesgo}%</div>
                      <Button size="sm" className="mt-1 bg-red-600 hover:bg-red-700 text-white">
                        Activar Retención
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentimientos" className="space-y-6">
          {/* Análisis de Sentimientos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Análisis de Sentimientos en Reseñas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sentimientosReseñas.map((aspecto) => (
                  <Card key={aspecto.aspecto}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">{aspecto.aspecto}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-600">Positivo</span>
                          <span className="font-semibold text-green-600">{aspecto.positivo}%</span>
                        </div>
                        <Progress value={aspecto.positivo} className="w-full [&>div]:bg-green-500" />
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Neutral: {aspecto.neutral}%</span>
                          <span className="text-red-600">Negativo: {aspecto.negativo}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tendencias de Sentimiento */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Sentimientos (Últimos 6 Meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { mes: 'Abr', positivo: 82, neutral: 15, negativo: 3 },
                  { mes: 'May', positivo: 85, neutral: 12, negativo: 3 },
                  { mes: 'Jun', positivo: 88, neutral: 10, negativo: 2 },
                  { mes: 'Jul', positivo: 86, neutral: 11, negativo: 3 },
                  { mes: 'Ago', positivo: 89, neutral: 9, negativo: 2 },
                  { mes: 'Sep', positivo: 91, neutral: 7, negativo: 2 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="positivo" stackId="1" stroke="#10B981" fill="#10B981" name="Positivo" />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Neutral" />
                  <Area type="monotone" dataKey="negativo" stackId="1" stroke="#EF4444" fill="#EF4444" name="Negativo" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Palabras Clave Más Mencionadas */}
          <Card>
            <CardHeader>
              <CardTitle>Palabras Clave Más Mencionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">😋</div>
                  <div className="font-semibold">Delicioso</div>
                  <div className="text-sm text-gray-600">847 menciones</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="font-semibold">Excelente</div>
                  <div className="text-sm text-gray-600">623 menciones</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">👨‍🍳</div>
                  <div className="font-semibold">Servicio</div>
                  <div className="text-sm text-gray-600">512 menciones</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏠</div>
                  <div className="font-semibold">Ambiente</div>
                  <div className="text-sm text-gray-600">398 menciones</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competencia" className="space-y-6">
          {/* Análisis Competitivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crosshair className="w-5 h-5" />
                Posicionamiento Competitivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">{analisisCompetencia.score}/10</div>
                    <div className="text-lg font-semibold">{analisisCompetencia.posicionamiento}</div>
                    <div className="text-sm text-gray-600">Posición en el mercado</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Ventajas Competitivas</h3>
                      <ul className="space-y-1">
                        {analisisCompetencia.ventajaCompetitiva.map((ventaja, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-green-700">
                            <CheckCircle2 className="w-4 h-4" />
                            {ventaja}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">Amenazas</h3>
                    <ul className="space-y-1">
                      {analisisCompetencia.amenazas.map((amenaza, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-red-700">
                          <AlertTriangle className="w-4 h-4" />
                          {amenaza}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Oportunidades</h3>
                    <ul className="space-y-1">
                      {analisisCompetencia.oportunidades.map((oportunidad, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-blue-700">
                          <TrendingUp className="w-4 h-4" />
                          {oportunidad}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Radar de Competencia */}
          <Card>
            <CardHeader>
              <CardTitle>Comparación Multi-dimensional</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={[
                  { aspecto: 'Calidad', tuRestaurante: 9, promedio: 7 },
                  { aspecto: 'Servicio', tuRestaurante: 8, promedio: 6 },
                  { aspecto: 'Precio', tuRestaurante: 6, promedio: 7 },
                  { aspecto: 'Ambiente', tuRestaurante: 9, promedio: 7 },
                  { aspecto: 'Ubicación', tuRestaurante: 8, promedio: 8 },
                  { aspecto: 'Innovación', tuRestaurante: 9, promedio: 5 }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="aspecto" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar 
                    name="Tu Restaurante" 
                    dataKey="tuRestaurante" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Promedio Mercado" 
                    dataKey="promedio" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
