
'use client';

import React, { useMemo } from 'react';
import { useDraggableModules, DraggableModule } from '@/hooks/useDraggableModules';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  RotateCcw,
  Move,
  Info,
  Sparkles
} from 'lucide-react';

// Componentes de módulos
import AnalisisComparativo from './dashboard-modules/AnalisisComparativo';
import EstadoRestaurantes from './dashboard-modules/EstadoRestaurantes';
import MetricasAvanzadas from './dashboard-modules/MetricasAvanzadas';
import ResumenEjecutivo from './dashboard-modules/ResumenEjecutivo';

interface DraggableDashboardModulesProps {
  showControls?: boolean;
}

export default function DraggableDashboardModules({ showControls = true }: DraggableDashboardModulesProps) {
  // Definir los módulos iniciales
  const initialModules: DraggableModule[] = useMemo(() => [
    {
      id: 'analisis-comparativo',
      title: 'Análisis Comparativo por Restaurante',
      component: <AnalisisComparativo />,
      order: 0
    },
    {
      id: 'estado-restaurantes',
      title: 'Estado de Restaurantes',
      component: <EstadoRestaurantes />,
      order: 1
    },
    {
      id: 'metricas-avanzadas',
      title: '¿Qué son las Métricas Avanzadas?',
      component: <MetricasAvanzadas />,
      order: 2
    },
    {
      id: 'resumen-ejecutivo',
      title: 'Resumen Ejecutivo Consolidado',
      component: <ResumenEjecutivo />,
      order: 3
    }
  ], []);

  const {
    modules,
    draggedOver,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    resetOrder
  } = useDraggableModules(initialModules);

  // Función para clonar componente con props de drag
  const cloneModuleWithDragProps = (module: DraggableModule) => {
    const isDraggedModule = isDragging === module.id;
    const isDraggedOverModule = draggedOver === module.id && isDragging && isDragging !== module.id;

    const dragHandleProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, module.id),
      onDragOver: (e: React.DragEvent) => handleDragOver(e, module.id),
      onDragLeave: handleDragLeave,
      onDrop: (e: React.DragEvent) => handleDrop(e, module.id),
      onDragEnd: handleDragEnd,
      className: `
        transition-all duration-200 ease-in-out cursor-move relative
        ${isDraggedModule ? 'opacity-50 scale-95 rotate-2 z-10' : 'opacity-100 scale-100 rotate-0'}
        ${isDraggedOverModule ? 'scale-105 shadow-xl ring-2 ring-blue-400 ring-opacity-50' : ''}
        ${isDragging && !isDraggedModule ? 'hover:scale-[1.02] hover:shadow-lg' : ''}
      `.trim(),
      style: {
        transform: isDraggedModule ? 'rotate(2deg) scale(0.95)' : 
                  isDraggedOverModule ? 'scale(1.05)' : 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative' as const,
        zIndex: isDraggedModule ? 50 : isDraggedOverModule ? 40 : 1
      }
    };

    // Recrear el componente con las props de drag
    switch (module.id) {
      case 'analisis-comparativo':
        return <AnalisisComparativo dragHandleProps={dragHandleProps} />;
      case 'estado-restaurantes':
        return <EstadoRestaurantes dragHandleProps={dragHandleProps} />;
      case 'metricas-avanzadas':
        return <MetricasAvanzadas dragHandleProps={dragHandleProps} />;
      case 'resumen-ejecutivo':
        return <ResumenEjecutivo dragHandleProps={dragHandleProps} />;
      default:
        return module.component;
    }
  };

  return (
    <div className="space-y-8">
      {/* Controles de Drag & Drop */}
      {showControls && (
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl p-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-purple-100/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Dashboard Personalizable
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Arrastra y reorganiza los módulos según tu preferencia. El orden se guarda automáticamente.
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Move className="w-3 h-3 mr-1" />
                      Drag & Drop Activo
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Info className="w-3 h-3 mr-1" />
                      {modules.length} Módulos
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  onClick={resetOrder}
                  variant="outline"
                  size="sm"
                  className="bg-white/80 hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restaurar Orden
                </Button>
              </div>
            </div>
            
            {/* Indicadores de Drag */}
            {isDragging && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-sm font-medium text-blue-800">
                    Arrastrando: {modules.find(m => m.id === isDragging)?.title}
                  </span>
                  <Badge className="bg-blue-600 text-white animate-bounce">
                    Activo
                  </Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Suelta sobre otro módulo para intercambiar posiciones
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Módulos Reorganizables */}
      <div className="space-y-8">
        {modules.map((module, index) => {
          const isDraggedModule = isDragging === module.id;
          const isDraggedOverModule = draggedOver === module.id && isDragging && isDragging !== module.id;
          
          return (
            <div
              key={module.id}
              className={`
                relative transition-all duration-300 ease-in-out
                ${isDraggedModule ? 'z-50' : ''}
                ${isDraggedOverModule ? 'z-40' : ''}
              `}
            >
              {/* Indicador Visual de Drag Handle */}
              {showControls && (
                <div className={`
                  absolute -left-8 top-4 z-10 opacity-0 hover:opacity-100 transition-opacity duration-200
                  ${isDragging ? 'opacity-100' : ''}
                `}>
                  <div className="w-6 h-20 bg-gradient-to-b from-purple-400 to-blue-500 rounded-l-lg flex items-center justify-center cursor-move shadow-lg">
                    <GripVertical className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Línea de Drop Zone */}
              {isDraggedOverModule && (
                <div className="absolute -top-4 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-full opacity-60 animate-pulse"></div>
              )}

              {/* Módulo */}
              <div className={`
                ${isDraggedModule ? 'transform rotate-2 scale-95 opacity-50' : ''}
                ${isDraggedOverModule ? 'transform scale-105 shadow-2xl' : ''}
                ${isDragging && !isDraggedModule && !isDraggedOverModule ? 'hover:scale-[1.01]' : ''}
                transition-all duration-200 ease-in-out
              `}>
                {cloneModuleWithDragProps(module)}
              </div>

              {/* Número de orden en modo debug */}
              {showControls && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg z-20">
                  {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback Area */}
      {isDragging && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-2xl">
            <div className="flex items-center space-x-3">
              <GripVertical className="w-5 h-5 animate-pulse" />
              <span className="font-medium">
                Moviendo: {modules.find(m => m.id === isDragging)?.title}
              </span>
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
