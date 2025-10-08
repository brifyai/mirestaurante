
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';

interface AnalisisComparativoProps {
  dragHandleProps?: any;
}

export default function AnalisisComparativo({ dragHandleProps }: AnalisisComparativoProps) {
  const { restaurants, getGeneralMetrics, setSelectedRestaurant, setViewMode } = useRestaurant();
  const generalMetrics = getGeneralMetrics();
  const activeRestaurants = restaurants.filter(r => r.status === 'activo');

  // Cálculos de crecimiento
  const crecimientoSemanal = ((generalMetrics.ventasSemana - generalMetrics.ventasSemanaPasada) / generalMetrics.ventasSemanaPasada * 100).toFixed(1);

  // Datos para gráficos consolidados
  const ventasComparativasData = activeRestaurants.map(restaurant => ({
    name: restaurant.name.replace('AI Restaurante ', ''),
    ventas: restaurant.metrics.ventasHoy,
    meta: restaurant.metrics.ventasAyer * 1.1, // Meta 10% más que ayer
  }));

  const ocupacionData = activeRestaurants.map(restaurant => ({
    name: restaurant.name.replace('AI Restaurante ', ''),
    ocupacion: restaurant.metrics.ocupacionActual,
    mesas: restaurant.metrics.mesasOcupadas + restaurant.metrics.mesasDisponibles,
  }));

  return (
    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-1" {...dragHandleProps}>
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Análisis Comparativo por Restaurante</h2>
            <p className="text-gray-600">Desempeño individual y tendencias por período</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-500">Vista General</Badge>
            <Badge variant="outline">Comparativa Activa</Badge>
          </div>
        </div>

        {/* Gráficos Comparativos */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Ventas por Restaurante */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Ventas por Restaurante</CardTitle>
                  <p className="text-sm text-muted-foreground">Hoy vs Meta</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{crecimientoSemanal}% vs sem. pasada
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ventasComparativasData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Bar dataKey="ventas" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="meta" fill="#94A3B8" radius={[4, 4, 0, 0]} opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Ocupación por Restaurante */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Ocupación por Restaurante</CardTitle>
              <p className="text-sm text-muted-foreground">Estado actual</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ocupacionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Bar dataKey="ocupacion" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla Comparativa Detallada por Fechas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Comparativa Detallada por Períodos
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Análisis de rendimiento por restaurante en diferentes períodos temporales
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Restaurante</th>
                    <th className="text-center py-3 px-2 font-semibold">Hoy</th>
                    <th className="text-center py-3 px-2 font-semibold">Ayer</th>
                    <th className="text-center py-3 px-2 font-semibold">% Cambio</th>
                    <th className="text-center py-3 px-2 font-semibold">Esta Semana</th>
                    <th className="text-center py-3 px-2 font-semibold">Sem. Anterior</th>
                    <th className="text-center py-3 px-2 font-semibold">% Semanal</th>
                    <th className="text-center py-3 px-2 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRestaurants.map((restaurant) => {
                    const cambioVentas = ((restaurant.metrics.ventasHoy - restaurant.metrics.ventasAyer) / restaurant.metrics.ventasAyer * 100).toFixed(1);
                    const cambioSemanal = ((restaurant.metrics.ventasSemana - restaurant.metrics.ventasSemanaPasada) / restaurant.metrics.ventasSemanaPasada * 100).toFixed(1);
                    return (
                      <tr key={restaurant.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium">{restaurant.name.replace('AI Restaurante ', '')}</span>
                            <Badge variant="outline" className="text-xs">
                              {restaurant.type === 'principal' ? 'Principal' : 'Sucursal'}
                            </Badge>
                          </div>
                        </td>
                        <td className="text-center py-3 px-2 font-medium">
                          ${restaurant.metrics.ventasHoy.toLocaleString('es-CL')}
                        </td>
                        <td className="text-center py-3 px-2 text-muted-foreground">
                          ${restaurant.metrics.ventasAyer.toLocaleString('es-CL')}
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            parseFloat(cambioVentas) >= 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {parseFloat(cambioVentas) >= 0 ? '+' : ''}{cambioVentas}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-2 font-medium">
                          ${restaurant.metrics.ventasSemana.toLocaleString('es-CL')}
                        </td>
                        <td className="text-center py-3 px-2 text-muted-foreground">
                          ${restaurant.metrics.ventasSemanaPasada.toLocaleString('es-CL')}
                        </td>
                        <td className="text-center py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            parseFloat(cambioSemanal) >= 0 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {parseFloat(cambioSemanal) >= 0 ? '+' : ''}{cambioSemanal}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-2">
                          <div className="flex items-center justify-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Operando</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Resumen de la Tabla */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {activeRestaurants.filter(r => 
                      ((r.metrics.ventasHoy - r.metrics.ventasAyer) / r.metrics.ventasAyer * 100) > 0
                    ).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Mejoraron hoy</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">
                    {activeRestaurants.filter(r => 
                      ((r.metrics.ventasSemana - r.metrics.ventasSemanaPasada) / r.metrics.ventasSemanaPasada * 100) > 0
                    ).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Crecimiento semanal</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">
                    ${Math.round(generalMetrics.ticketPromedio).toLocaleString('es-CL')}
                  </div>
                  <div className="text-xs text-muted-foreground">Ticket promedio</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">
                    {Math.round(generalMetrics.ocupacionActual)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Ocupación promedio</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
