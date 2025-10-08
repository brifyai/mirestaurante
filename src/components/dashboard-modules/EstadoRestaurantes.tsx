
'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MapPin,
  BarChart3,
  Activity,
  Timer,
  AlertCircle
} from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';

interface EstadoRestaurantesProps {
  dragHandleProps?: any;
}

export default function EstadoRestaurantes({ dragHandleProps }: EstadoRestaurantesProps) {
  const navigate = useNavigate();
  const { restaurants, setSelectedRestaurant, setViewMode, isLoading, error } = useRestaurant();

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
      default: return <Building2 className="h-3 w-3" />;
    }
  };

  return (
    <Card {...dragHandleProps} id="estado-restaurantes">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Estado de Restaurantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-muted-foreground">Cargando restaurantes...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-purple-600 hover:text-purple-800 text-sm underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes restaurantes asociados</p>
              <p className="text-sm text-muted-foreground mt-2">
                Contacta al administrador para asignarte restaurantes
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{restaurant.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {restaurant.location}
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(restaurant.status)}>
                  {getStatusIcon(restaurant.status)}
                  <span className="ml-1 capitalize">{restaurant.status}</span>
                </Badge>
              </div>

              {restaurant.status === 'activo' ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="font-medium">${restaurant.metrics.ventasHoy.toLocaleString('es-CL')}</div>
                    <div className="text-xs text-muted-foreground">Ventas hoy</div>
                  </div>
                  <div>
                    <div className="font-medium">{restaurant.metrics.clientesHoy}</div>
                    <div className="text-xs text-muted-foreground">Clientes</div>
                  </div>
                  <div>
                    <div className="font-medium">{restaurant.metrics.ocupacionActual}%</div>
                    <div className="text-xs text-muted-foreground">Ocupación</div>
                  </div>
                  <div>
                    <div className="font-medium">{restaurant.metrics.calificacionPromedio.toFixed(1)} ★</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-sm text-yellow-800 font-medium">
                    {restaurant.status === 'mantenimiento' ? 'En Mantenimiento' : 'Cerrado'}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {restaurant.status === 'mantenimiento' 
                      ? 'Reapertura programada para mañana'
                      : 'Verificar estado operacional'
                    }
                  </p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  onClick={() => {
                    // Crear slug del restaurante
                    const slug = restaurant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    // Cambiar a vista específica del restaurante
                    setSelectedRestaurant(restaurant);
                    setViewMode('specific');
                    // Navegar a la URL con el slug
                    navigate(`/${slug}`);
                  }}
                >
                  <BarChart3 className="h-3 w-3 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
