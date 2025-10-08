
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface MetricasAvanzadasProps {
  dragHandleProps?: any;
}

export default function MetricasAvanzadas({ dragHandleProps }: MetricasAvanzadasProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-1" {...dragHandleProps}>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">¿Qué son las Métricas Avanzadas?</h3>
              <p className="text-sm text-muted-foreground">Panel detallado con datos en tiempo real</p>
            </div>
          </div>
          <Badge className="bg-blue-500">Información</Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-600">En Vista General incluye:</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Dashboard ejecutivo consolidado en tiempo real</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Comparativas automáticas entre restaurantes</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Análisis predictivo de la red completa</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Alertas críticas de todos los restaurantes</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-purple-600">Por Restaurante Específico incluye:</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Operaciones detalladas por mesa y horario</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Flujo de clientes y análisis de ocupación</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Análisis de satisfacción y feedback</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>KPIs específicos y recomendaciones IA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
