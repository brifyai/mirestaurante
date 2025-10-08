
'use client';

import React, { useState, useEffect } from 'react';
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
  Building2,
  Activity,
  AlertCircle,
  CheckCircle2,
  Timer,
  MapPin,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, PieChart as RechartsPieChart, Cell } from 'recharts';
import RestaurantSelector from '@/components/restaurant-selector';
import DraggableDashboardModules from '@/components/DraggableDashboardModules';

export default function GeneralDashboard() {
  const { getGeneralMetrics } = useRestaurant();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const generalMetrics = getGeneralMetrics();
  
  // Cálculos de crecimiento
  const crecimientoVentas = ((generalMetrics.ventasHoy - generalMetrics.ventasAyer) / generalMetrics.ventasAyer * 100).toFixed(1);
  const crecimientoClientes = ((generalMetrics.clientesHoy - generalMetrics.clientesAyer) / generalMetrics.clientesAyer * 100).toFixed(1);

  return (
    <div className="space-y-4 lg:space-y-8">
      {/* Header Prominente Vista General */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 lg:p-8">
          <div className="text-center space-y-3 lg:space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium">
              <PieChart className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">VISTA GENERAL CONSOLIDADA</span>
              <span className="sm:hidden">VISTA GENERAL</span>
            </div>
            <h1 className="text-xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              <span className="hidden sm:inline">Dashboard Ejecutivo Multi-Restaurante</span>
              <span className="sm:hidden">Dashboard Ejecutivo</span>
            </h1>
            <p className="text-sm lg:text-lg text-muted-foreground">
              <span className="hidden sm:inline">Resumen consolidado de toda la red de restaurantes</span>
              <span className="sm:hidden">Resumen consolidado</span>
            </p>
            <p className="text-xs lg:text-sm text-muted-foreground">
              <span className="hidden sm:inline">
                {currentTime.toLocaleDateString('es-CL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {currentTime.toLocaleTimeString('es-CL')}
              </span>
              <span className="sm:hidden">
                {currentTime.toLocaleDateString('es-CL', { 
                  day: 'numeric', 
                  month: 'short',
                  year: '2-digit'
                })} • {currentTime.toLocaleTimeString('es-CL', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-6 mt-4 lg:mt-6">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm">
                <Building2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">{generalMetrics.totalRestaurantes} Restaurantes Total</span>
                <span className="sm:hidden">{generalMetrics.totalRestaurantes} Total</span>
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm">
                <Activity className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">{generalMetrics.restaurantesActivos} Activos</span>
                <span className="sm:hidden">{generalMetrics.restaurantesActivos} Act.</span>
              </Badge>
              {generalMetrics.restaurantesInactivos > 0 && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm">
                  <Timer className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">{generalMetrics.restaurantesInactivos} En Mantenimiento</span>
                  <span className="sm:hidden">{generalMetrics.restaurantesInactivos} Mant.</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Consolidadas Principales */}
      <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
        {/* Ventas Totales */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 lg:pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">
              <span className="hidden sm:inline">Ventas Totales Hoy</span>
              <span className="sm:hidden">Ventas Hoy</span>
            </CardTitle>
            <div className="h-6 w-6 lg:h-8 lg:w-8 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-1 lg:pt-2">
            <div className="text-lg lg:text-2xl font-bold">${generalMetrics.ventasHoy.toLocaleString('es-CL')}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {parseFloat(crecimientoVentas) > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={parseFloat(crecimientoVentas) > 0 ? "text-green-600" : "text-red-600"}>
                {crecimientoVentas}%
              </span>
              <span className="ml-1 hidden sm:inline">vs ayer (${generalMetrics.ventasAyer.toLocaleString('es-CL')})</span>
              <span className="ml-1 sm:hidden">vs ayer</span>
            </div>
          </CardContent>
        </Card>

        {/* Clientes Totales */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 lg:pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">
              <span className="hidden sm:inline">Clientes Total</span>
              <span className="sm:hidden">Clientes</span>
            </CardTitle>
            <div className="h-6 w-6 lg:h-8 lg:w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-1 lg:pt-2">
            <div className="text-lg lg:text-2xl font-bold">{generalMetrics.clientesHoy}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {parseFloat(crecimientoClientes) > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={parseFloat(crecimientoClientes) > 0 ? "text-green-600" : "text-red-600"}>
                {crecimientoClientes}%
              </span>
              <span className="ml-1 hidden sm:inline">vs ayer ({generalMetrics.clientesAyer})</span>
              <span className="ml-1 sm:hidden">vs ayer</span>
            </div>
          </CardContent>
        </Card>

        {/* Ocupación Promedio */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ocupación Promedio
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <ChefHat className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(generalMetrics.ocupacionActual)}%</div>
            <Progress value={generalMetrics.ocupacionActual} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {generalMetrics.mesasOcupadas}/{generalMetrics.mesasDisponibles + generalMetrics.mesasOcupadas} mesas totales
            </p>
          </CardContent>
        </Card>

        {/* Satisfacción Promedio */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Satisfacción Global
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {generalMetrics.calificacionPromedio.toFixed(1)}
              <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Promedio ponderado de todos los restaurantes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Selector de Restaurante */}
      <RestaurantSelector />

      {/* Módulos Reorganizables del Dashboard */}
      <DraggableDashboardModules showControls={true} />
    </div>
  );
}
