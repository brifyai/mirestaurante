
'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { 
  ChevronDown, 
  Store, 
  MapPin, 
  Activity, 
  Eye, 
  BarChart3,
  Building2,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RestaurantSelector() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    restaurants,
    selectedRestaurant,
    viewMode,
    setSelectedRestaurant,
    setViewMode,
    getGeneralMetrics
  } = useRestaurant();

  const [showSelector, setShowSelector] = useState(false);

  const activeRestaurants = restaurants.filter(r => r.status === 'activo');
  const generalMetrics = getGeneralMetrics();

  const handleViewModeChange = (mode: 'general' | 'specific') => {
    setViewMode(mode);
    if (mode === 'general') {
      setSelectedRestaurant(null);
    }
  };

  const handleRestaurantSelect = (restaurant: any) => {
    // Crear slug del restaurante
    const slug = restaurant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSelectedRestaurant(restaurant);
    setViewMode('specific');
    setShowSelector(false);
    // Navegar a la URL con el slug
    navigate(`/${slug}`);
  };

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
      case 'mantenimiento': return <Settings className="h-3 w-3" />;
      case 'cerrado': return <Store className="h-3 w-3" />;
      default: return <Store className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      {/* Selector Principal */}
      <div className="flex items-center space-x-4">
        {/* Vista Modo Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'general' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "h-8 px-3 text-xs font-medium transition-all",
              viewMode === 'general' 
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
            onClick={() => handleViewModeChange('general')}
          >
            <BarChart3 className="h-3 w-3 mr-2" />
            Vista General
          </Button>
          <Button
            variant={viewMode === 'specific' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "h-8 px-3 text-xs font-medium transition-all",
              viewMode === 'specific' 
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
            onClick={() => handleViewModeChange('specific')}
          >
            <Store className="h-3 w-3 mr-2" />
            Por Restaurante
          </Button>
        </div>

        {/* Selector de Restaurante */}
        {viewMode === 'specific' && (
          <Dialog open={showSelector} onOpenChange={setShowSelector}>
            <DialogTrigger asChild>
              <Button variant="outline" className="min-w-[200px] justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">
                    {selectedRestaurant ? selectedRestaurant.name : 'Seleccionar Restaurante'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Seleccionar Restaurante</span>
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 mt-4 md:grid-cols-2">
                {restaurants.map((restaurant) => (
                  <Card 
                    key={restaurant.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md border-2",
                      selectedRestaurant?.id === restaurant.id 
                        ? "border-primary shadow-md" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => handleRestaurantSelect(restaurant)}
                  >
                    <CardContent className="p-4">
                      {/* Header del Restaurante */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {restaurant.location}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant="outline" className={getStatusColor(restaurant.status)}>
                            {getStatusIcon(restaurant.status)}
                            <span className="ml-1 capitalize">{restaurant.status}</span>
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {restaurant.type === 'principal' ? 'Principal' : 'Sucursal'}
                          </Badge>
                        </div>
                      </div>

                      {/* Métricas Rápidas */}
                      {restaurant.status === 'activo' && (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">${restaurant.metrics.ventasHoy.toLocaleString('es-CL')}</div>
                              <div className="text-xs text-muted-foreground">Ventas hoy</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="font-medium">{restaurant.metrics.clientesHoy}</div>
                              <div className="text-xs text-muted-foreground">Clientes</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-purple-600" />
                            <div>
                              <div className="font-medium">{restaurant.metrics.ocupacionActual}%</div>
                              <div className="text-xs text-muted-foreground">Ocupación</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <div>
                              <div className="font-medium">{restaurant.metrics.reservasHoy}</div>
                              <div className="text-xs text-muted-foreground">Reservas</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {restaurant.status === 'mantenimiento' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800 font-medium">En Mantenimiento</p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Reapertura programada para mañana
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Información Actual */}
      <div className="flex items-center space-x-3">
        {viewMode === 'general' ? (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Building2 className="w-3 h-3 mr-1" />
              {generalMetrics.totalRestaurantes} Restaurantes
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              {generalMetrics.restaurantesActivos} Activos
            </Badge>
            <div className="hidden md:flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">${generalMetrics.ventasHoy.toLocaleString('es-CL')}</span>
              <span>• {generalMetrics.clientesHoy} clientes</span>
            </div>
          </div>
        ) : selectedRestaurant && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Badge variant="outline" className={getStatusColor(selectedRestaurant.status)}>
              {getStatusIcon(selectedRestaurant.status)}
              <span className="ml-1 capitalize">{selectedRestaurant.status}</span>
            </Badge>
            <div className="hidden md:flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{selectedRestaurant.location}</span>
            </div>
            {selectedRestaurant.status === 'activo' && (
              <div className="hidden lg:flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">${selectedRestaurant.metrics.ventasHoy.toLocaleString('es-CL')}</span>
              </div>
            )}
          </div>
        )}

        {/* Indicador de Modo Actual */}
        <div className="flex items-center space-x-2">
          {viewMode === 'general' ? (
            <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Modo: Vista General Consolidada</span>
            </div>
          ) : selectedRestaurant ? (
            <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
              <Store className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                Modo: {selectedRestaurant.name}
              </span>
            </div>
          ) : null}
          
          {/* Botón de Métricas Avanzadas */}
          <Button 
            size="sm" 
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50"
            onClick={() => {
              if (viewMode === 'general') {
                navigation.navigateTo('/metricas?view=general');
              } else {
                navigation.navigateTo(`/metricas?restaurant=${selectedRestaurant?.id}`);
              }
            }}
          >
            <Activity className="w-4 h-4 mr-2" />
            Métricas Avanzadas
          </Button>
        </div>
      </div>
    </div>
  );
}
