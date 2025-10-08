
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  ZoomIn, ZoomOut, RotateCw, Copy, Trash2, Move, MousePointer, 
  Square, Circle, Minus, Grid, Layers, Undo, Redo, Save, 
  Download, Upload, Settings, Eye, EyeOff, Lock, Unlock,
  AlignLeft, AlignCenter, AlignRight, AlignHorizontalSpaceBetween,
  AlignStartVertical, AlignEndVertical, AlignCenterVertical, AlignVerticalSpaceAround,
  Play, Users, Calendar, Clock, TrendingUp, Maximize, Minimize, Plus, Edit2
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

// Interfaces
interface Mesa {
  id: string;
  numero: string;
  capacidad: number;
  x: number;
  y: number;
  forma: 'cuadrada' | 'redonda' | 'rectangular';
  tipo: 'normal' | 'vip' | 'barra' | 'terraza' | 'privada';
  estado: 'libre' | 'ocupada' | 'reservada' | 'limpieza' | 'bloqueada';
  rotation: number;
  width: number;
  height: number;
  visible: boolean;
  locked: boolean;
  color?: string;
}

interface ViewportState {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

interface DragState {
  isDragging: boolean;
  dragStartPos: { x: number; y: number };
  selectedMesaIds: string[];
  initialPositions: { [id: string]: { x: number; y: number } };
}

export default function MapaMesasContent() {
  // Estados principales
  const [mesas, setMesas] = useState<Mesa[]>([
    {
      id: '1',
      numero: '1',
      capacidad: 4,
      x: 100,
      y: 100,
      forma: 'cuadrada',
      tipo: 'normal',
      estado: 'libre',
      rotation: 0,
      width: 80,
      height: 80,
      visible: true,
      locked: false,
    },
    {
      id: '2',
      numero: '2',
      capacidad: 2,
      x: 250,
      y: 100,
      forma: 'redonda',
      tipo: 'normal',
      estado: 'ocupada',
      rotation: 0,
      width: 60,
      height: 60,
      visible: true,
      locked: false,
    },
    {
      id: '3',
      numero: '3',
      capacidad: 6,
      x: 400,
      y: 100,
      forma: 'rectangular',
      tipo: 'vip',
      estado: 'reservada',
      rotation: 0,
      width: 120,
      height: 60,
      visible: true,
      locked: false,
    },
  ]);

  const [selectedMesaIds, setSelectedMesaIds] = useState<string[]>([]);
  const [viewport, setViewport] = useState<ViewportState>({ zoom: 1, offsetX: 50, offsetY: 50 });
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [currentTool, setCurrentTool] = useState<'select' | 'add' | 'pan'>('select');
  const [newMesaType, setNewMesaType] = useState<{forma: Mesa['forma'], tipo: Mesa['tipo'], capacidad: number}>({
    forma: 'cuadrada',
    tipo: 'normal',
    capacidad: 4
  });

  // Estados para drag & drop
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStartPos: { x: 0, y: 0 },
    selectedMesaIds: [],
    initialPositions: {}
  });

  // Estados de edición
  const [editingMesa, setEditingMesa] = useState<Mesa | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Referencias
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });

  // Utilidades
  const snapToGridFn = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    return {
      x: (screenX - rect.left - viewport.offsetX) / viewport.zoom,
      y: (screenY - rect.top - viewport.offsetY) / viewport.zoom
    };
  }, [viewport]);

  const worldToScreen = useCallback((worldX: number, worldY: number) => {
    return {
      x: worldX * viewport.zoom + viewport.offsetX,
      y: worldY * viewport.zoom + viewport.offsetY
    };
  }, [viewport]);

  // Funciones de mesa
  const createMesa = useCallback((x: number, y: number) => {
    const newId = (mesas.length + 1).toString();
    const newMesa: Mesa = {
      id: newId,
      numero: newId,
      capacidad: newMesaType.capacidad,
      x: snapToGridFn(x),
      y: snapToGridFn(y),
      forma: newMesaType.forma,
      tipo: newMesaType.tipo,
      estado: 'libre',
      rotation: 0,
      width: newMesaType.forma === 'rectangular' ? 120 : newMesaType.forma === 'redonda' ? 60 : 80,
      height: newMesaType.forma === 'rectangular' ? 60 : newMesaType.forma === 'redonda' ? 60 : 80,
      visible: true,
      locked: false,
    };
    
    setMesas(prev => [...prev, newMesa]);
    setSelectedMesaIds([newId]);
  }, [mesas.length, newMesaType, snapToGridFn]);

  const deleteMesa = useCallback((mesaId: string) => {
    setMesas(prev => prev.filter(mesa => mesa.id !== mesaId));
    setSelectedMesaIds(prev => prev.filter(id => id !== mesaId));
  }, []);

  const updateMesa = useCallback((mesaId: string, updates: Partial<Mesa>) => {
    setMesas(prev => prev.map(mesa => 
      mesa.id === mesaId ? { ...mesa, ...updates } : mesa
    ));
  }, []);

  const duplicateMesa = useCallback((mesaId: string) => {
    const originalMesa = mesas.find(m => m.id === mesaId);
    if (!originalMesa) return;

    const newId = (Math.max(...mesas.map(m => parseInt(m.id))) + 1).toString();
    const newMesa: Mesa = {
      ...originalMesa,
      id: newId,
      numero: newId,
      x: originalMesa.x + 20,
      y: originalMesa.y + 20,
    };
    
    setMesas(prev => [...prev, newMesa]);
    setSelectedMesaIds([newId]);
  }, [mesas]);

  // Funciones de selección
  const selectMesa = useCallback((mesaId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedMesaIds(prev => 
        prev.includes(mesaId) ? prev.filter(id => id !== mesaId) : [...prev, mesaId]
      );
    } else {
      setSelectedMesaIds([mesaId]);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMesaIds([]);
  }, []);

  // Funciones de edición avanzada
  const openEditDialog = useCallback((mesaId: string) => {
    const mesa = mesas.find(m => m.id === mesaId);
    if (mesa) {
      setEditingMesa(mesa);
      setShowEditDialog(true);
    }
  }, [mesas]);

  const saveEditedMesa = useCallback(() => {
    if (editingMesa) {
      updateMesa(editingMesa.id, editingMesa);
      setShowEditDialog(false);
      setEditingMesa(null);
    }
  }, [editingMesa, updateMesa]);

  // Funciones de movimiento
  const startDragging = useCallback((mesaId: string, startPos: { x: number; y: number }) => {
    const selectedIds = selectedMesaIds.includes(mesaId) ? selectedMesaIds : [mesaId];
    const initialPositions: { [id: string]: { x: number; y: number } } = {};
    
    selectedIds.forEach(id => {
      const mesa = mesas.find(m => m.id === id);
      if (mesa) {
        initialPositions[id] = { x: mesa.x, y: mesa.y };
      }
    });

    setDragState({
      isDragging: true,
      dragStartPos: startPos,
      selectedMesaIds: selectedIds,
      initialPositions
    });

    if (!selectedMesaIds.includes(mesaId)) {
      setSelectedMesaIds([mesaId]);
    }
  }, [selectedMesaIds, mesas]);

  const updateDragging = useCallback((currentPos: { x: number; y: number }) => {
    if (!dragState.isDragging) return;

    const deltaX = currentPos.x - dragState.dragStartPos.x;
    const deltaY = currentPos.y - dragState.dragStartPos.y;

    dragState.selectedMesaIds.forEach(id => {
      const initialPos = dragState.initialPositions[id];
      if (initialPos) {
        updateMesa(id, {
          x: snapToGridFn(initialPos.x + deltaX),
          y: snapToGridFn(initialPos.y + deltaY)
        });
      }
    });
  }, [dragState, snapToGridFn, updateMesa]);

  const stopDragging = useCallback(() => {
    setDragState({
      isDragging: false,
      dragStartPos: { x: 0, y: 0 },
      selectedMesaIds: [],
      initialPositions: {}
    });
  }, []);

  // Event handlers del canvas
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (currentTool === 'add') {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      createMesa(worldPos.x, worldPos.y);
      return;
    }

    if (currentTool === 'select') {
      clearSelection();
    }
  }, [currentTool, screenToWorld, createMesa, clearSelection]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (currentTool === 'pan' || e.button === 1) {
      isPanning.current = true;
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      return;
    }
  }, [currentTool]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning.current) {
      const deltaX = e.clientX - lastPanPoint.current.x;
      const deltaY = e.clientY - lastPanPoint.current.y;
      setViewport(prev => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY
      }));
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (dragState.isDragging) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      updateDragging(worldPos);
    }
  }, [dragState.isDragging, screenToWorld, updateDragging]);

  const handleCanvasMouseUp = useCallback(() => {
    isPanning.current = false;
    if (dragState.isDragging) {
      stopDragging();
    }
  }, [dragState.isDragging, stopDragging]);

  const handleCanvasWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.1, Math.min(5, viewport.zoom + delta));
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      const factor = newZoom / viewport.zoom;
      
      setViewport(prev => ({
        zoom: newZoom,
        offsetX: centerX - (centerX - prev.offsetX) * factor,
        offsetY: centerY - (centerY - prev.offsetY) * factor,
      }));
    }
  }, [viewport.zoom]);

  // Funciones de utilidad para renderizado
  const getMesaStyle = useCallback((mesa: Mesa, isSelected: boolean) => {
    const screenPos = worldToScreen(mesa.x, mesa.y);
    const baseClasses = "absolute border-2 transition-all duration-200 cursor-move flex items-center justify-center text-sm font-bold";
    
    let shapeClasses = "";
    let colorClasses = "";
    let borderClasses = "";

    // Forma
    switch (mesa.forma) {
      case 'redonda':
        shapeClasses = "rounded-full";
        break;
      case 'rectangular':
        shapeClasses = "rounded-lg";
        break;
      default:
        shapeClasses = "rounded-md";
    }

    // Color según estado
    switch (mesa.estado) {
      case 'libre':
        colorClasses = "bg-green-100 text-green-800";
        break;
      case 'ocupada':
        colorClasses = "bg-red-100 text-red-800";
        break;
      case 'reservada':
        colorClasses = "bg-yellow-100 text-yellow-800";
        break;
      case 'limpieza':
        colorClasses = "bg-blue-100 text-blue-800";
        break;
      default:
        colorClasses = "bg-gray-100 text-gray-800";
    }

    // Borde según tipo y selección
    if (isSelected) {
      borderClasses = "border-blue-500 shadow-lg z-10";
    } else if (mesa.tipo === 'vip') {
      borderClasses = "border-yellow-500";
    } else {
      borderClasses = "border-gray-400";
    }

    return {
      className: `${baseClasses} ${shapeClasses} ${colorClasses} ${borderClasses}`,
      style: {
        left: `${screenPos.x}px`,
        top: `${screenPos.y}px`,
        width: `${mesa.width * viewport.zoom}px`,
        height: `${mesa.height * viewport.zoom}px`,
        transform: `rotate(${mesa.rotation}deg)`,
        zIndex: isSelected ? 10 : 1,
      }
    };
  }, [worldToScreen, viewport.zoom]);

  const renderGrid = useCallback(() => {
    if (!showGrid) return null;

    const lines = [];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const startX = -viewport.offsetX / viewport.zoom;
    const startY = -viewport.offsetY / viewport.zoom;
    const endX = (rect.width - viewport.offsetX) / viewport.zoom;
    const endY = (rect.height - viewport.offsetY) / viewport.zoom;

    const gridSpacing = gridSize * viewport.zoom;

    // Líneas verticales
    for (let x = Math.floor(startX / gridSize) * gridSize; x <= endX; x += gridSize) {
      const screenX = x * viewport.zoom + viewport.offsetX;
      lines.push(
        <line
          key={`v-${x}`}
          x1={screenX}
          y1={0}
          x2={screenX}
          y2={rect.height}
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    }

    // Líneas horizontales
    for (let y = Math.floor(startY / gridSize) * gridSize; y <= endY; y += gridSize) {
      const screenY = y * viewport.zoom + viewport.offsetY;
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={screenY}
          x2={rect.width}
          y2={screenY}
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    }

    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {lines}
      </svg>
    );
  }, [showGrid, gridSize, viewport]);

  // Cargar layout al inicio
  useEffect(() => {
    const loadInitialLayout = async () => {
      try {
        const response = await fetch('/api/mesas/layout');
        const result = await response.json();
        
        if (result.success && result.data && result.data.mesas?.length > 0) {
          setMesas(result.data.mesas);
          if (result.data.viewport) {
            setViewport(result.data.viewport);
          }
          console.log('Layout inicial cargado desde el servidor');
        } else {
          console.log('No hay layout guardado, usando mesas por defecto');
        }
      } catch (error) {
        console.error('Error al cargar layout inicial:', error);
      }
    };

    loadInitialLayout();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedMesaIds.forEach(id => deleteMesa(id));
      } else if (e.key === 'Escape') {
        clearSelection();
      } else if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        selectedMesaIds.forEach(id => duplicateMesa(id));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMesaIds, deleteMesa, clearSelection, duplicateMesa]);

  // Funciones para trabajar con la API
  const saveLayoutToServer = async () => {
    try {
      const response = await fetch('/api/mesas/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mesas, viewport }),
      });

      const result = await response.json();
      
      if (result.success) {
        await Swal.fire({
          title: '✅ Layout Guardado',
          text: 'La configuración de mesas se ha guardado exitosamente en el servidor',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al guardar layout:', error);
      Swal.fire('Error', 'No se pudo guardar la configuración', 'error');
    }
  };

  const loadLayoutFromServer = async () => {
    try {
      const response = await fetch('/api/mesas/layout');
      const result = await response.json();
      
      if (result.success && result.data) {
        setMesas(result.data.mesas || []);
        if (result.data.viewport) {
          setViewport(result.data.viewport);
        }
        await Swal.fire({
          title: '✅ Layout Cargado',
          text: 'Configuración cargada desde el servidor',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error al cargar layout:', error);
      Swal.fire('Error', 'No se pudo cargar la configuración', 'error');
    }
  };

  const showTemplateSelector = async () => {
    try {
      const response = await fetch('/api/mesas/templates');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const templates = result.data;
      const templateOptions = templates.reduce((options: any, template: any) => {
        options[template.id] = `${template.nombre} (${template.capacidadTotal} personas)`;
        return options;
      }, {});

      const { value: selectedTemplateId } = await Swal.fire({
        title: 'Seleccionar Template',
        input: 'select',
        inputOptions: templateOptions,
        inputPlaceholder: 'Selecciona un template',
        showCancelButton: true,
        confirmButtonText: 'Aplicar Template',
        cancelButtonText: 'Cancelar',
        html: '<p class="text-sm text-gray-600 mb-4">Los templates incluyen configuraciones predefinidas de mesas optimizadas para diferentes tipos de restaurante.</p>'
      });

      if (selectedTemplateId) {
        const templateResponse = await fetch('/api/mesas/templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ templateId: selectedTemplateId }),
        });

        const templateResult = await templateResponse.json();
        
        if (templateResult.success) {
          setMesas(templateResult.data.mesas);
          setViewport(templateResult.data.viewport);
          setSelectedMesaIds([]);
          
          await Swal.fire({
            title: '✅ Template Aplicado',
            text: templateResult.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(templateResult.error);
        }
      }
    } catch (error) {
      console.error('Error con templates:', error);
      Swal.fire('Error', 'No se pudieron cargar los templates', 'error');
    }
  };

  const exportLayout = async () => {
    const layout = { mesas, viewport };
    
    // Crear archivo JSON para descarga
    const dataStr = JSON.stringify(layout, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `layout-mesas-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    await Swal.fire({
      title: '✅ Layout Exportado',
      text: 'Archivo descargado exitosamente',
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });
  };

  const importLayout = async () => {
    const { value: file } = await Swal.fire({
      title: 'Importar Layout',
      input: 'file',
      inputAttributes: {
        accept: '.json',
        'aria-label': 'Subir archivo de layout'
      },
      showCancelButton: true,
      confirmButtonText: 'Importar',
      cancelButtonText: 'Cancelar'
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const layout = JSON.parse(e.target?.result as string);
          if (layout.mesas) {
            setMesas(layout.mesas);
            if (layout.viewport) {
              setViewport(layout.viewport);
            }
            setSelectedMesaIds([]);
            Swal.fire('¡Importado!', 'Layout cargado exitosamente', 'success');
          } else {
            throw new Error('Formato de archivo inválido');
          }
        } catch (error) {
          Swal.fire('Error', 'Archivo inválido o formato incorrecto', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllMesas = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará todas las mesas del mapa',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setMesas([]);
      setSelectedMesaIds([]);
      Swal.fire('¡Eliminado!', 'Todas las mesas han sido eliminadas', 'success');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            href="/reservas/configuracion"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Volver a Configuración
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Editor de Mapa de Mesas</h1>
          <Badge variant="secondary" className="text-xs">
            {mesas.length} mesas • {selectedMesaIds.length} seleccionadas
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={showTemplateSelector}>
            <Grid className="w-4 h-4 mr-1" />
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={loadLayoutFromServer}>
            <Upload className="w-4 h-4 mr-1" />
            Cargar
          </Button>
          <Button variant="outline" size="sm" onClick={importLayout}>
            <Download className="w-4 h-4 mr-1" />
            Importar Archivo
          </Button>
          <Button variant="outline" size="sm" onClick={exportLayout}>
            <Download className="w-4 h-4 mr-1" />
            Exportar Archivo
          </Button>
          <Button variant="outline" size="sm" onClick={clearAllMesas}>
            <Trash2 className="w-4 h-4 mr-1 text-red-500" />
            Limpiar Todo
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={saveLayoutToServer}
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar Layout
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Herramientas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Herramientas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={currentTool === 'select' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('select')}
                  >
                    <MousePointer className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'add' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('add')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'pan' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('pan')}
                  >
                    <Move className="w-4 h-4" />
                  </Button>
                </div>
                
                {currentTool === 'select' && (
                  <div className="text-xs text-gray-600">
                    Click para seleccionar, arrastra para mover
                  </div>
                )}
                {currentTool === 'add' && (
                  <div className="text-xs text-gray-600">
                    Click en el canvas para agregar mesa
                  </div>
                )}
                {currentTool === 'pan' && (
                  <div className="text-xs text-gray-600">
                    Arrastra para mover la vista
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuración de nueva mesa */}
            {currentTool === 'add' && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Nueva Mesa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Forma</Label>
                    <Select 
                      value={newMesaType.forma} 
                      onValueChange={(value) => setNewMesaType(prev => ({...prev, forma: value as Mesa['forma']}))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cuadrada">Cuadrada</SelectItem>
                        <SelectItem value="redonda">Redonda</SelectItem>
                        <SelectItem value="rectangular">Rectangular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Tipo</Label>
                    <Select 
                      value={newMesaType.tipo} 
                      onValueChange={(value) => setNewMesaType(prev => ({...prev, tipo: value as Mesa['tipo']}))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="barra">Barra</SelectItem>
                        <SelectItem value="terraza">Terraza</SelectItem>
                        <SelectItem value="privada">Privada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Capacidad: {newMesaType.capacidad}</Label>
                    <Slider
                      value={[newMesaType.capacidad]}
                      onValueChange={(value) => setNewMesaType(prev => ({...prev, capacidad: value[0]}))}
                      min={1}
                      max={12}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vista y Grid */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Vista</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Zoom: {Math.round(viewport.zoom * 100)}%</Label>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setViewport(prev => ({...prev, zoom: Math.max(0.1, prev.zoom - 0.2)}))}
                    >
                      <ZoomOut className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setViewport(prev => ({...prev, zoom: Math.min(5, prev.zoom + 0.2)}))}
                    >
                      <ZoomIn className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Mostrar grilla</Label>
                  <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Ajustar a grilla</Label>
                  <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                </div>

                <div>
                  <Label className="text-xs">Tamaño grilla: {gridSize}px</Label>
                  <Slider
                    value={[gridSize]}
                    onValueChange={(value) => setGridSize(value[0])}
                    min={10}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setViewport({ zoom: 1, offsetX: 50, offsetY: 50 })}
                  className="w-full"
                >
                  Resetear Vista
                </Button>
              </CardContent>
            </Card>

            {/* Lista de mesas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Mesas ({mesas.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {mesas.map(mesa => {
                    const isSelected = selectedMesaIds.includes(mesa.id);
                    return (
                      <div
                        key={mesa.id}
                        className={`p-2 rounded text-xs border cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => selectMesa(mesa.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Mesa #{mesa.numero}</div>
                            <div className="text-gray-600">
                              {mesa.capacidad} personas • {mesa.tipo}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(mesa.id);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMesa(mesa.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {selectedMesaIds.length > 0 && (
                  <div className="border-t pt-2">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => selectedMesaIds.forEach(id => duplicateMesa(id))}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Duplicar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs text-red-500"
                        onClick={() => selectedMesaIds.forEach(id => deleteMesa(id))}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className={`w-full h-full relative ${
              currentTool === 'add' ? 'cursor-crosshair' : 
              currentTool === 'pan' ? 'cursor-move' : 'cursor-default'
            }`}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onWheel={handleCanvasWheel}
            onClick={handleCanvasClick}
          >
            {/* Grid */}
            {renderGrid()}
            
            {/* Mesas */}
            {mesas.filter(mesa => mesa.visible).map(mesa => {
              const isSelected = selectedMesaIds.includes(mesa.id);
              const { className, style } = getMesaStyle(mesa, isSelected);
              
              return (
                <div
                  key={mesa.id}
                  className={className}
                  style={style}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentTool === 'select') {
                      selectMesa(mesa.id, e.ctrlKey);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    if (currentTool === 'select' && !mesa.locked) {
                      const worldPos = screenToWorld(e.clientX, e.clientY);
                      startDragging(mesa.id, worldPos);
                    }
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(mesa.id);
                  }}
                >
                  <div className="text-center leading-tight">
                    <div className="font-bold">#{mesa.numero}</div>
                    <div className="text-xs">{mesa.capacidad}p</div>
                    {mesa.tipo === 'vip' && <div className="text-xs">👑</div>}
                  </div>
                  
                  {/* Indicadores de estado */}
                  {mesa.locked && (
                    <Lock className="absolute -top-1 -right-1 w-3 h-3 text-red-500" />
                  )}
                </div>
              );
            })}
            
            {/* Información de herramientas */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded shadow text-xs">
              <div><strong>Herramienta:</strong> {currentTool}</div>
              <div><strong>Zoom:</strong> {Math.round(viewport.zoom * 100)}%</div>
              <div><strong>Mesas:</strong> {mesas.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de edición */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Mesa #{editingMesa?.numero}</DialogTitle>
          </DialogHeader>
          
          {editingMesa && (
            <div className="space-y-4">
              <div>
                <Label>Número de Mesa</Label>
                <Input
                  value={editingMesa.numero}
                  onChange={(e) => setEditingMesa(prev => prev ? {...prev, numero: e.target.value} : null)}
                />
              </div>
              
              <div>
                <Label>Capacidad</Label>
                <Slider
                  value={[editingMesa.capacidad]}
                  onValueChange={(value) => setEditingMesa(prev => prev ? {...prev, capacidad: value[0]} : null)}
                  min={1}
                  max={12}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-gray-600">{editingMesa.capacidad} personas</div>
              </div>
              
              <div>
                <Label>Forma</Label>
                <Select
                  value={editingMesa.forma}
                  onValueChange={(value) => setEditingMesa(prev => prev ? {...prev, forma: value as Mesa['forma']} : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cuadrada">Cuadrada</SelectItem>
                    <SelectItem value="redonda">Redonda</SelectItem>
                    <SelectItem value="rectangular">Rectangular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tipo</Label>
                <Select
                  value={editingMesa.tipo}
                  onValueChange={(value) => setEditingMesa(prev => prev ? {...prev, tipo: value as Mesa['tipo']} : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="barra">Barra</SelectItem>
                    <SelectItem value="terraza">Terraza</SelectItem>
                    <SelectItem value="privada">Privada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Estado</Label>
                <Select
                  value={editingMesa.estado}
                  onValueChange={(value) => setEditingMesa(prev => prev ? {...prev, estado: value as Mesa['estado']} : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="libre">Libre</SelectItem>
                    <SelectItem value="ocupada">Ocupada</SelectItem>
                    <SelectItem value="reservada">Reservada</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="bloqueada">Bloqueada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingMesa.locked}
                  onCheckedChange={(checked) => setEditingMesa(prev => prev ? {...prev, locked: checked} : null)}
                />
                <Label>Bloquear posición</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedMesa}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
