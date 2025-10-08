

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  MessageSquare,
  Star,
  Users,
  Calendar,
  Clock,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Zap
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface FeedbackStats {
  totalFeedbacks: number;
  averageSatisfaction: number;
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number;
  
  categoryScores: {
    food: { average: number; trend: string };
    service: { average: number; trend: string };
    ambiance: { average: number; trend: string };
    price: { average: number; trend: string };
    cleanliness: { average: number; trend: string };
  };
  
  positiveKeywords: Array<{word: string, count: number}>;
  negativeKeywords: Array<{word: string, count: number}>;
  
  satisfactionByHour: Array<{hour: string, satisfaction: number, count: number}>;
  satisfactionByDay: Array<{day: string, satisfaction: number, count: number}>;
  satisfactionByWeek: Array<{week: string, satisfaction: number, count: number}>;
  
  recentFeedbacks: Array<{
    id: string;
    clientName: string;
    originalMessage: string;
    sentimentScore: number;
    sentimentLabel: string;
    timestamp: string;
    actionTaken: string;
  }>;
  
  alerts: Array<{
    type: 'SUDDEN_DROP' | 'RECURRING_COMPLAINT' | 'EXCEPTIONAL_PRAISE';
    message: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
    timestamp: string;
  }>;
}

export default function FeedbackAnalyticsDashboard() {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/feedback?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Error cargando analíticas');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const exportData = () => {
    if (!stats) return;
    
    const csvData = stats.recentFeedbacks.map(feedback => ({
      fecha: new Date(feedback.timestamp).toLocaleDateString(),
      cliente: feedback.clientName,
      mensaje: feedback.originalMessage,
      puntuacion: feedback.sentimentScore,
      sentimiento: feedback.sentimentLabel,
      accion: feedback.actionTaken
    }));
    
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4) return 'text-blue-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'UP') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'DOWN') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <CheckCircle className="w-4 h-4 text-gray-500" />;
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
        <span className="ml-2 text-lg">Cargando análisis...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar las estadísticas de feedback. Inténtalo de nuevo.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-500" />
            <span>Análisis de Feedback con IA</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Insights inteligentes sobre la experiencia de tus clientes
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Alertas importantes */}
      {stats.alerts.length > 0 && (
        <div className="space-y-2">
          {stats.alerts.map((alert, index) => (
            <Alert key={index} className={
              alert.urgency === 'HIGH' ? 'border-red-500 bg-red-50' :
              alert.urgency === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {alert.type === 'SUDDEN_DROP' ? '📉 Caída Súbita' :
                 alert.type === 'RECURRING_COMPLAINT' ? '🔄 Queja Recurrente' :
                 '🌟 Elogio Excepcional'}
              </AlertTitle>
              <AlertDescription>
                {alert.message}
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
            <p className="text-xs text-muted-foreground">
              Comentarios analizados por IA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSatisfactionColor(stats.averageSatisfaction)}`}>
              {stats.averageSatisfaction.toFixed(1)}/5
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(stats.trendDirection)}
              <span className="ml-1">
                {stats.trendDirection === 'UP' ? '+' : stats.trendDirection === 'DOWN' ? '-' : ''}
                {stats.trendPercentage.toFixed(1)}% vs período anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reseñas Google</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.recentFeedbacks.filter(f => f.actionTaken === 'GOOGLE_REVIEW').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Solicitudes enviadas automáticamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalamientos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.recentFeedbacks.filter(f => f.actionTaken === 'MANAGER_ESCALATION').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Casos escalados a gerencia
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análisis por categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span>Puntuación por Categorías</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.categoryScores).map(([category, data]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {category === 'food' ? 'Comida' : 
                       category === 'service' ? 'Servicio' :
                       category === 'ambiance' ? 'Ambiente' :
                       category === 'price' ? 'Precio' : 'Limpieza'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getSatisfactionColor(data.average)}`}>
                        {data.average.toFixed(1)}
                      </span>
                      {getTrendIcon(data.trend)}
                    </div>
                  </div>
                  <Progress value={(data.average / 5) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span>Satisfacción por Hora del Día</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsLineChart data={stats.satisfactionByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Palabras clave más frecuentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Palabras Clave Positivas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.positiveKeywords.slice(0, 8).map((keyword, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {keyword.word}
                  </Badge>
                  <span className="text-sm font-medium">{keyword.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Palabras Clave Negativas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.negativeKeywords.slice(0, 8).map((keyword, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {keyword.word}
                  </Badge>
                  <span className="text-sm font-medium">{keyword.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LineChart className="w-5 h-5 text-purple-500" />
            <span>Tendencia de Satisfacción</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={stats.satisfactionByWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feedbacks recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span>Feedbacks Recientes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentFeedbacks.slice(0, 10).map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{feedback.clientName}</span>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        feedback.sentimentLabel === 'VERY_POSITIVE' ? 'default' :
                        feedback.sentimentLabel === 'POSITIVE' ? 'secondary' :
                        feedback.sentimentLabel === 'NEUTRAL' ? 'outline' :
                        'destructive'
                      }
                    >
                      {feedback.sentimentScore}/5
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(feedback.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  "{feedback.originalMessage}"
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {feedback.sentimentLabel}
                  </Badge>
                  <Badge 
                    variant={
                      feedback.actionTaken === 'GOOGLE_REVIEW' ? 'default' :
                      feedback.actionTaken === 'MANAGER_ESCALATION' ? 'destructive' :
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {feedback.actionTaken === 'GOOGLE_REVIEW' ? 'Reseña Google' :
                     feedback.actionTaken === 'MANAGER_ESCALATION' ? 'Escalado' :
                     feedback.actionTaken === 'FOLLOW_UP' ? 'Seguimiento' : 'Sin acción'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

