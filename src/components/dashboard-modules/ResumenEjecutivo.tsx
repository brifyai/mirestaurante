
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, PieChart } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';

interface ResumenEjecutivoProps {
  dragHandleProps?: any;
}

export default function ResumenEjecutivo({ dragHandleProps }: ResumenEjecutivoProps) {
  const { getGeneralMetrics } = useRestaurant();
  const generalMetrics = getGeneralMetrics();

  // Cálculos de crecimiento
  const crecimientoSemanal = ((generalMetrics.ventasSemana - generalMetrics.ventasSemanaPasada) / generalMetrics.ventasSemanaPasada * 100).toFixed(1);

  return (
    <Card {...dragHandleProps}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
          Resumen Ejecutivo Consolidado
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Vista ejecutiva agregada de toda la red de restaurantes - Esta es la información consolidada, no específica de un restaurante
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="font-medium text-green-600">Rendimiento Financiero Global</h4>
            <ul className="text-sm space-y-1">
              <li>• Ventas totales red: ${generalMetrics.ventasSemana.toLocaleString('es-CL')} esta semana</li>
              <li>• Ticket promedio consolidado: ${Math.round(generalMetrics.ticketPromedio).toLocaleString('es-CL')}</li>
              <li>• Crecimiento general: {crecimientoSemanal}%</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-600">Operaciones de Red</h4>
            <ul className="text-sm space-y-1">
              <li>• {generalMetrics.restaurantesActivos}/{generalMetrics.totalRestaurantes} restaurantes operando</li>
              <li>• Ocupación promedio red: {Math.round(generalMetrics.ocupacionActual)}%</li>
              <li>• Total reservas hoy: {generalMetrics.reservasHoy}</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-purple-600">Satisfacción Consolidada</h4>
            <ul className="text-sm space-y-1">
              <li>• Rating promedio red: {generalMetrics.calificacionPromedio.toFixed(1)} ★</li>
              <li>• Tiempo espera promedio: {Math.round(generalMetrics.tiempoEsperaPromedio)} min</li>
              <li>• Total clientes atendidos: {generalMetrics.clientesHoy} hoy</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Recordatorio: Vista General</span>
          </div>
          <p className="text-sm text-blue-700">
            Esta página muestra el resumen consolidado de todos los restaurantes. Para ver detalles operativos específicos como gestión de mesas, reservas individuales, o análisis detallado por restaurante, selecciona un restaurante específico usando el selector arriba.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
