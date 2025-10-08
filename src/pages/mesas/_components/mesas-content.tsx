

'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ChefHat, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Settings2,
  Eye,
  Edit,
  RotateCcw,
  PauseCircle,
  PlayCircle,
  Trash2,
  Timer,
  DollarSign,
  TrendingUp,
  Activity,
  Utensils,
  Move3D,
  Grid3x3,
  Zap,
  Save,
  MousePointer,
  QrCode,
  Download,
  Smartphone,
  Link
} from 'lucide-react';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';
import { ArrivalsManager } from '@/lib/arrivals-manager';

// Datos de ejemplo para las mesas
const mesasData = [
  { id: 1, numero: '01', capacidad: 2, estado: 'ocupada', cliente: 'Juan Pérez', tiempoOcupada: '1h 25m', tiempoEstimado: '2h', zona: 'Terraza', facturacion: 45000 },
  { id: 2, numero: '02', capacidad: 4, estado: 'libre', cliente: null, tiempoOcupada: null, tiempoEstimado: null, zona: 'Interior', facturacion: 0 },
  { id: 3, numero: '03', capacidad: 6, estado: 'reservada', cliente: 'María García', tiempoOcupada: null, tiempoEstimado: '19:30', zona: 'VIP', facturacion: 0 },
  { id: 4, numero: '04', capacidad: 2, estado: 'ocupada', cliente: 'Carlos López', tiempoOcupada: '45m', tiempoEstimado: '1h 30m', zona: 'Interior', facturacion: 28000 },
  { id: 5, numero: '05', capacidad: 8, estado: 'mantenimiento', cliente: null, tiempoOcupada: null, tiempoEstimado: null, zona: 'VIP', facturacion: 0 },
  { id: 6, numero: '06', capacidad: 4, estado: 'libre', cliente: null, tiempoOcupada: null, tiempoEstimado: null, zona: 'Terraza', facturacion: 0 },
  { id: 7, numero: '07', capacidad: 2, estado: 'ocupada', cliente: 'Ana Martín', tiempoOcupada: '2h 10m', tiempoEstimado: '2h 30m', zona: 'Interior', facturacion: 67000 },
  { id: 8, numero: '08', capacidad: 6, estado: 'limpieza', cliente: null, tiempoOcupada: null, tiempoEstimado: '10m', zona: 'VIP', facturacion: 0 },
];

const estadisticasGenerales = {
  totalMesas: 24,
  mesasOcupadas: 8,
  mesasLibres: 12,
  mesasReservadas: 3,
  mesasMantenimiento: 1,
  ocupacionPromedio: 65,
  facturacionTotal: 140000,
  rotacionPromedio: 2.3
};

const zonasIniciales = [
  { id: 1, nombre: 'Interior', mesas: 12, ocupadas: 4, color: 'bg-blue-500', colorHex: '#3b82f6', posicion: { x: 40, y: 40 }, tamaño: { width: 320, height: 200 } },
  { id: 2, nombre: 'Terraza', mesas: 8, ocupadas: 2, color: 'bg-green-500', colorHex: '#10b981', posicion: { x: 400, y: 40 }, tamaño: { width: 200, height: 150 } },
  { id: 3, nombre: 'VIP', mesas: 4, ocupadas: 2, color: 'bg-purple-500', colorHex: '#8b5cf6', posicion: { x: 220, y: 280 }, tamaño: { width: 280, height: 180 } }
];

export default function MesasContent() {
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroZona, setFiltroZona] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActiva, setVistaActiva] = useState('cuadricula');
  const [modoEditor, setModoEditor] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<any>(null);
  const [mostrarCuadricula, setMostrarCuadricula] = useState(true);
  const [mesasPosition, setMesasPosition] = useState<{[key: string]: {x: number, y: number}}>({});
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(0);
  const [zonas, setZonas] = useState(zonasIniciales);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<any>(null);
  const [modoEdicionZona, setModoEdicionZona] = useState(false);
  const [herramientaActiva, setHerramientaActiva] = useState<'mover' | 'zona' | 'mesa'>('mover');
  const dragRef = useRef<HTMLDivElement>(null);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ocupada': return 'bg-red-100 text-red-800 border-red-200';
      case 'libre': return 'bg-green-100 text-green-800 border-green-200';
      case 'reservada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'limpieza': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'mantenimiento': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'ocupada': return <Users className="w-4 h-4" />;
      case 'libre': return <CheckCircle2 className="w-4 h-4" />;
      case 'reservada': return <Clock className="w-4 h-4" />;
      case 'limpieza': return <RotateCcw className="w-4 h-4" />;
      case 'mantenimiento': return <Settings2 className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const mesasFiltradas = mesasData.filter(mesa => {
    const cumpleBusqueda = mesa.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
                          (mesa.cliente && mesa.cliente.toLowerCase().includes(busqueda.toLowerCase()));
    const cumpleEstado = filtroEstado === 'todas' || mesa.estado === filtroEstado;
    const cumpleZona = filtroZona === 'todas' || mesa.zona === filtroZona;
    
    return cumpleBusqueda && cumpleEstado && cumpleZona;
  });

  const handleAccionMesa = async (accion: string, mesa: any) => {
    let titulo = '';
    let texto = '';
    let icono: 'warning' | 'question' | 'info' = 'warning';

    switch (accion) {
      case 'liberar':
        titulo = 'Liberar Mesa';
        texto = `¿Confirmar liberación de mesa ${mesa.numero}?`;
        break;
      case 'limpiar':
        titulo = 'Marcar para Limpieza';
        texto = `Mesa ${mesa.numero} será marcada para limpieza`;
        break;
      case 'mantenimiento':
        titulo = 'Enviar a Mantenimiento';
        texto = `Mesa ${mesa.numero} será enviada a mantenimiento`;
        icono = 'question';
        break;
      case 'activar':
        titulo = 'Activar Mesa';
        texto = `Mesa ${mesa.numero} será activada y disponible`;
        icono = 'info';
        break;
    }

    const result = await Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: '¡Completado!',
        text: `Acción realizada en mesa ${mesa.numero}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleNuevaMesa = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Nueva Mesa',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Número de Mesa</label>
            <input id="numero" class="swal2-input" placeholder="Ej: 09" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Capacidad</label>
            <select id="capacidad" class="swal2-select">
              <option value="2">2 personas</option>
              <option value="4">4 personas</option>
              <option value="6">6 personas</option>
              <option value="8">8 personas</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Zona</label>
            <select id="zona" class="swal2-select">
              <option value="Interior">Interior</option>
              <option value="Terraza">Terraza</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear Mesa',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          numero: (document.getElementById('numero') as HTMLInputElement)?.value,
          capacidad: (document.getElementById('capacidad') as HTMLSelectElement)?.value,
          zona: (document.getElementById('zona') as HTMLSelectElement)?.value,
        }
      }
    });

    if (formValues) {
      await Swal.fire({
        title: '¡Mesa Creada!',
        text: `Mesa ${formValues.numero} agregada correctamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleEditorMesas = async () => {
    const { value: opcion } = await Swal.fire({
      title: 'Editor de Mesas',
      text: 'Selecciona la acción que deseas realizar:',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Diseño Visual',
      denyButtonText: 'Configuración Avanzada',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#dd6b20',
      cancelButtonColor: '#6c757d'
    });

    if (opcion === true) {
      // Activar modo editor visual
      setModoEditor(true);
      setVistaActiva('editor');
      await Swal.fire({
        title: '¡Modo Editor Activado!',
        text: 'Ahora puedes arrastrar las mesas para reorganizarlas',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else if (opcion === false) {
      // Configuración avanzada
      const { value: formValues } = await Swal.fire({
        title: 'Configuración Avanzada',
        html: `
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Distribución Automática</label>
              <select id="distribucion" class="swal2-select">
                <option value="cuadrada">Distribución Cuadrada</option>
                <option value="lineal">Distribución Lineal</option>
                <option value="circular">Distribución Circular</option>
                <option value="optimizada">Optimizada por IA</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Espaciado entre Mesas</label>
              <input id="espaciado" class="swal2-input" placeholder="2.0" type="number" step="0.5" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Prioridad de Ubicación</label>
              <select id="prioridad" class="swal2-select">
                <option value="accesibilidad">Accesibilidad</option>
                <option value="flujo">Flujo de Clientes</option>
                <option value="privacidad">Privacidad</option>
                <option value="vista">Vista Panorámica</option>
              </select>
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Aplicar Configuración',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          return {
            distribucion: (document.getElementById('distribucion') as HTMLSelectElement)?.value,
            espaciado: (document.getElementById('espaciado') as HTMLInputElement)?.value,
            prioridad: (document.getElementById('prioridad') as HTMLSelectElement)?.value,
          }
        }
      });

      if (formValues) {
        await Swal.fire({
          title: '¡Configuración Aplicada!',
          text: `Distribución ${formValues.distribucion} aplicada con éxito`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  const guardarCambiosEditor = async () => {
    if (cambiosSinGuardar === 0) {
      await Swal.fire({
        title: 'Sin cambios',
        text: 'No hay cambios para guardar',
        icon: 'info',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    await Swal.fire({
      title: '¿Guardar cambios?',
      text: `Se guardarán ${cambiosSinGuardar} cambio(s) en la distribución de mesas`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setModoEditor(false);
        setVistaActiva('mapa');
        setMesaSeleccionada(null);
        setCambiosSinGuardar(0);
        setMesasPosition({});
        Swal.fire({
          title: '¡Guardado!',
          text: 'La distribución de mesas ha sido guardada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const cancelarEditor = async () => {
    if (cambiosSinGuardar > 0) {
      const result = await Swal.fire({
        title: '¡Atención!',
        text: `Tienes ${cambiosSinGuardar} cambio(s) sin guardar. ¿Deseas continuar y perder los cambios?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Salir sin Guardar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    setModoEditor(false);
    setVistaActiva('mapa');
    setMesaSeleccionada(null);
    setCambiosSinGuardar(0);
    setMesasPosition({});
  };

  // Funciones para el drag & drop
  const handleDragStart = (e: React.DragEvent, mesa: any) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(mesa));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (data.type === 'zona') {
      // Mover zona
      moverZona(data.id, { x, y });
    } else {
      // Mover mesa
      setMesasPosition(prev => ({
        ...prev,
        [data.numero]: { x, y }
      }));
      setCambiosSinGuardar(prev => prev + 1);
    }
  };

  const handleClickMesa = (mesa: any) => {
    if (modoEditor) {
      setMesaSeleccionada(mesa);
    }
  };

  // Funciones de herramientas del editor
  const toggleCuadricula = () => {
    setMostrarCuadricula(!mostrarCuadricula);
  };

  const alinearMesas = async () => {
    const { value: alineacion } = await Swal.fire({
      title: 'Alinear Mesas',
      text: 'Selecciona el tipo de alineación:',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Horizontal',
      denyButtonText: 'Vertical',
      cancelButtonText: 'Cancelar'
    });

    if (alineacion !== undefined) {
      // Simular alineación
      setCambiosSinGuardar(prev => prev + 1);
      await Swal.fire({
        title: '¡Alineación Completada!',
        text: `Mesas alineadas ${alineacion ? 'horizontalmente' : 'verticalmente'}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const configurarMesa = async () => {
    if (!mesaSeleccionada) {
      await Swal.fire({
        title: 'Selecciona una mesa',
        text: 'Primero debes seleccionar una mesa para configurar',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: `Configurar Mesa ${mesaSeleccionada.numero}`,
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Número de Mesa</label>
            <input id="numero" class="swal2-input" value="${mesaSeleccionada.numero}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Capacidad</label>
            <select id="capacidad" class="swal2-select">
              <option value="2" ${mesaSeleccionada.capacidad === 2 ? 'selected' : ''}>2 personas</option>
              <option value="4" ${mesaSeleccionada.capacidad === 4 ? 'selected' : ''}>4 personas</option>
              <option value="6" ${mesaSeleccionada.capacidad === 6 ? 'selected' : ''}>6 personas</option>
              <option value="8" ${mesaSeleccionada.capacidad === 8 ? 'selected' : ''}>8 personas</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Zona</label>
            <select id="zona" class="swal2-select">
              <option value="Interior" ${mesaSeleccionada.zona === 'Interior' ? 'selected' : ''}>Interior</option>
              <option value="Terraza" ${mesaSeleccionada.zona === 'Terraza' ? 'selected' : ''}>Terraza</option>
              <option value="VIP" ${mesaSeleccionada.zona === 'VIP' ? 'selected' : ''}>VIP</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Estado</label>
            <select id="estado" class="swal2-select">
              <option value="libre" ${mesaSeleccionada.estado === 'libre' ? 'selected' : ''}>Libre</option>
              <option value="ocupada" ${mesaSeleccionada.estado === 'ocupada' ? 'selected' : ''}>Ocupada</option>
              <option value="reservada" ${mesaSeleccionada.estado === 'reservada' ? 'selected' : ''}>Reservada</option>
              <option value="limpieza" ${mesaSeleccionada.estado === 'limpieza' ? 'selected' : ''}>Limpieza</option>
              <option value="mantenimiento" ${mesaSeleccionada.estado === 'mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          numero: (document.getElementById('numero') as HTMLInputElement)?.value,
          capacidad: parseInt((document.getElementById('capacidad') as HTMLSelectElement)?.value),
          zona: (document.getElementById('zona') as HTMLSelectElement)?.value,
          estado: (document.getElementById('estado') as HTMLSelectElement)?.value,
        }
      }
    });

    if (formValues) {
      setCambiosSinGuardar(prev => prev + 1);
      await Swal.fire({
        title: '¡Mesa Actualizada!',
        text: `Configuración de mesa ${formValues.numero} guardada correctamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  // Funciones para gestión de zonas
  const crearNuevaZona = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Crear Nueva Zona',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Nombre de la Zona</label>
            <input id="nombreZona" class="swal2-input" placeholder="Ej: Balcón, Jardín, Privado..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Color de la Zona</label>
            <select id="colorZona" class="swal2-select">
              <option value="#3b82f6">Azul</option>
              <option value="#10b981">Verde</option>
              <option value="#8b5cf6">Morado</option>
              <option value="#f59e0b">Naranja</option>
              <option value="#ef4444">Rojo</option>
              <option value="#6b7280">Gris</option>
              <option value="#ec4899">Rosa</option>
              <option value="#14b8a6">Turquesa</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Ancho (px)</label>
            <input id="anchoZona" class="swal2-input" type="number" value="250" min="150" max="500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Alto (px)</label>
            <input id="altoZona" class="swal2-input" type="number" value="180" min="120" max="400" />
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear Zona',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('nombreZona') as HTMLInputElement)?.value;
        if (!nombre || nombre.trim() === '') {
          Swal.showValidationMessage('El nombre de la zona es obligatorio');
          return false;
        }
        return {
          nombre: nombre.trim(),
          colorHex: (document.getElementById('colorZona') as HTMLSelectElement)?.value,
          ancho: parseInt((document.getElementById('anchoZona') as HTMLInputElement)?.value),
          alto: parseInt((document.getElementById('altoZona') as HTMLInputElement)?.value),
        }
      }
    });

    if (formValues) {
      const nuevaZona = {
        id: Date.now(),
        nombre: formValues.nombre,
        mesas: 0,
        ocupadas: 0,
        color: `bg-${formValues.colorHex.substring(1)}-500`,
        colorHex: formValues.colorHex,
        posicion: { x: 100, y: 100 },
        tamaño: { width: formValues.ancho, height: formValues.alto }
      };
      
      setZonas(prev => [...prev, nuevaZona]);
      setCambiosSinGuardar(prev => prev + 1);
      
      await Swal.fire({
        title: '¡Zona Creada!',
        text: `Zona "${formValues.nombre}" creada correctamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const editarZona = async (zona: any) => {
    const { value: formValues } = await Swal.fire({
      title: `Editar Zona: ${zona.nombre}`,
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Nombre de la Zona</label>
            <input id="nombreZona" class="swal2-input" value="${zona.nombre}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Color de la Zona</label>
            <select id="colorZona" class="swal2-select">
              <option value="#3b82f6" ${zona.colorHex === '#3b82f6' ? 'selected' : ''}>Azul</option>
              <option value="#10b981" ${zona.colorHex === '#10b981' ? 'selected' : ''}>Verde</option>
              <option value="#8b5cf6" ${zona.colorHex === '#8b5cf6' ? 'selected' : ''}>Morado</option>
              <option value="#f59e0b" ${zona.colorHex === '#f59e0b' ? 'selected' : ''}>Naranja</option>
              <option value="#ef4444" ${zona.colorHex === '#ef4444' ? 'selected' : ''}>Rojo</option>
              <option value="#6b7280" ${zona.colorHex === '#6b7280' ? 'selected' : ''}>Gris</option>
              <option value="#ec4899" ${zona.colorHex === '#ec4899' ? 'selected' : ''}>Rosa</option>
              <option value="#14b8a6" ${zona.colorHex === '#14b8a6' ? 'selected' : ''}>Turquesa</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Ancho (px)</label>
            <input id="anchoZona" class="swal2-input" type="number" value="${zona.tamaño.width}" min="150" max="500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Alto (px)</label>
            <input id="altoZona" class="swal2-input" type="number" value="${zona.tamaño.height}" min="120" max="400" />
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('nombreZona') as HTMLInputElement)?.value;
        if (!nombre || nombre.trim() === '') {
          Swal.showValidationMessage('El nombre de la zona es obligatorio');
          return false;
        }
        return {
          nombre: nombre.trim(),
          colorHex: (document.getElementById('colorZona') as HTMLSelectElement)?.value,
          ancho: parseInt((document.getElementById('anchoZona') as HTMLInputElement)?.value),
          alto: parseInt((document.getElementById('altoZona') as HTMLInputElement)?.value),
        }
      }
    });

    if (formValues) {
      setZonas(prev => prev.map(z => 
        z.id === zona.id 
          ? {
              ...z,
              nombre: formValues.nombre,
              colorHex: formValues.colorHex,
              color: `bg-${formValues.colorHex.substring(1)}-500`,
              tamaño: { width: formValues.ancho, height: formValues.alto }
            }
          : z
      ));
      setCambiosSinGuardar(prev => prev + 1);
      
      await Swal.fire({
        title: '¡Zona Actualizada!',
        text: `Zona "${formValues.nombre}" actualizada correctamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const eliminarZona = async (zona: any) => {
    const result = await Swal.fire({
      title: '¿Eliminar Zona?',
      html: `
        <div class="text-center">
          <p>¿Estás seguro que deseas eliminar la zona <strong>"${zona.nombre}"</strong>?</p>
          <br>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
            <p class="text-sm text-yellow-800">
              <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer.
              Las mesas de esta zona deberán ser reasignadas manualmente.
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setZonas(prev => prev.filter(z => z.id !== zona.id));
      setZonaSeleccionada(null);
      setCambiosSinGuardar(prev => prev + 1);
      
      await Swal.fire({
        title: '¡Zona Eliminada!',
        text: `Zona "${zona.nombre}" eliminada correctamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const moverZona = (zonaId: number, nuevaPosicion: { x: number, y: number }) => {
    setZonas(prev => prev.map(zona => 
      zona.id === zonaId 
        ? { ...zona, posicion: nuevaPosicion }
        : zona
    ));
    setCambiosSinGuardar(prev => prev + 1);
  };

  const handleClickZona = (zona: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (modoEditor) {
      setZonaSeleccionada(zona);
      setMesaSeleccionada(null);
    }
  };

  const handleDoubleClickZona = (zona: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (modoEditor) {
      editarZona(zona);
    }
  };

  // Funciones para códigos QR
  const generarQRMesa = async (mesa: any) => {
    try {
      // Generar URL única para la mesa
      const baseUrl = 'https://tu-restaurante.com';
      const mesaUrl = `${baseUrl}/mesa/${mesa.numero}?id=${mesa.id}&zona=${mesa.zona}&cap=${mesa.capacidad}`;
      
      // Generar el código QR
      const qrDataURL = await QRCode.toDataURL(mesaUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return {
        dataURL: qrDataURL,
        url: mesaUrl
      };
    } catch (error) {
      console.error('Error generando QR:', error);
      throw error;
    }
  };

  const handleGenerarQRIndividual = async (mesa: any) => {
    const result = await Swal.fire({
      title: '⚠️ Generar Código QR',
      html: `
        <div class="text-left">
          <p class="mb-4">¿Deseas generar el código QR para la <strong>Mesa ${mesa.numero}</strong>?</p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-sm text-yellow-800">
              <strong>⚠️ Importante:</strong><br>
              • El código QR será único para esta mesa<br>
              • Los clientes podrán acceder directamente a esta mesa<br>
              • Se incluirá información del estado y zona<br>
              • El código anterior quedará invalidado
            </p>
          </div>
          <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Información incluida:</strong><br>
              • Mesa: ${mesa.numero}<br>
              • Zona: ${mesa.zona}<br>
              • Capacidad: ${mesa.capacidad} personas<br>
              • Estado actual: ${mesa.estado}
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Generar QR',
      cancelButtonText: 'Cancelar',
      width: '500px'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Generando QR...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const qrData = await generarQRMesa(mesa);
        
        await Swal.fire({
          title: `Código QR - Mesa ${mesa.numero}`,
          html: `
            <div class="text-center">
              <img src="${qrData.dataURL}" alt="QR Mesa ${mesa.numero}" class="mx-auto mb-4 border rounded-lg" style="max-width: 200px;">
              <p class="text-sm text-gray-600 mb-2">URL generada:</p>
              <div class="bg-gray-100 p-2 rounded text-xs break-all mb-4">
                ${qrData.url}
              </div>
              <div class="flex gap-2 justify-center">
                <button id="descargarQR" class="swal2-styled" style="background-color: #10b981;">
                  Descargar QR
                </button>
                <button id="copiarURL" class="swal2-styled" style="background-color: #3b82f6;">
                  Copiar URL
                </button>
              </div>
            </div>
          `,
          icon: 'success',
          showConfirmButton: false,
          showCloseButton: true,
          width: '400px',
          didOpen: () => {
            const descargarBtn = document.getElementById('descargarQR');
            const copiarBtn = document.getElementById('copiarURL');
            
            descargarBtn?.addEventListener('click', () => {
              descargarQR(qrData.dataURL, `Mesa_${mesa.numero}_QR`);
            });
            
            copiarBtn?.addEventListener('click', () => {
              navigator.clipboard.writeText(qrData.url);
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'URL copiada al portapapeles',
                showConfirmButton: false,
                timer: 2000
              });
            });
          }
        });
      } catch (error) {
        await Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al generar el código QR',
          icon: 'error'
        });
      }
    }
  };

  const handleGenerarQRMasivo = async () => {
    const result = await Swal.fire({
      title: '⚠️ Generar Códigos QR Masivo',
      html: `
        <div class="text-left">
          <p class="mb-4">¿Deseas generar códigos QR para <strong>todas las mesas</strong>?</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-800">
              <strong>⚠️ Atención:</strong><br>
              • Se generarán ${mesasData.length} códigos QR<br>
              • Todos los códigos anteriores quedarán invalidados<br>
              • Este proceso puede tardar varios minutos<br>
              • Se descargará un archivo ZIP con todos los QR
            </p>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-sm text-blue-800">
              <strong>Se incluirá:</strong><br>
              • Código QR individual para cada mesa<br>
              • Imagen en alta calidad (PNG)<br>
              • Archivo de texto con las URLs<br>
              • Documentación de uso
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Generar Todo',
      cancelButtonText: 'Cancelar',
      width: '500px'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Generando códigos QR...',
          html: 'Procesando mesa <b>1</b> de <b>' + mesasData.length + '</b>',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Generar QR para todas las mesas
        const qrPromises = mesasData.map(async (mesa, index) => {
          // Actualizar progreso
          Swal.getHtmlContainer()!.querySelector('b')!.textContent = (index + 1).toString();
          
          const qrData = await generarQRMesa(mesa);
          return {
            mesa,
            qrData
          };
        });

        const resultados = await Promise.all(qrPromises);
        
        // Crear un archivo ZIP (simulado con descarga múltiple)
        await Swal.fire({
          title: '¡QR Generados!',
          html: `
            <div class="text-center">
              <p class="mb-4">Se han generado <strong>${resultados.length}</strong> códigos QR exitosamente.</p>
              <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p class="text-sm text-green-800">
                  ✅ Todos los códigos QR están listos<br>
                  ✅ URLs únicas generadas<br>
                  ✅ Archivos preparados para descarga
                </p>
              </div>
              <button id="descargarTodos" class="swal2-styled" style="background-color: #10b981;">
                Descargar Todos los QR
              </button>
            </div>
          `,
          icon: 'success',
          showConfirmButton: false,
          showCloseButton: true,
          width: '450px',
          didOpen: () => {
            const descargarBtn = document.getElementById('descargarTodos');
            descargarBtn?.addEventListener('click', async () => {
              for (const resultado of resultados) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Delay entre descargas
                descargarQR(resultado.qrData.dataURL, `Mesa_${resultado.mesa.numero}_QR`);
              }
              
              // También generar archivo de texto con URLs
              const urls = resultados.map(r => 
                `Mesa ${r.mesa.numero}: ${r.qrData.url}`
              ).join('\n');
              descargarTexto(urls, 'URLs_Mesas_QR.txt');
              
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Descarga completada',
                showConfirmButton: false,
                timer: 3000
              });
            });
          }
        });
      } catch (error) {
        await Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al generar los códigos QR masivos',
          icon: 'error'
        });
      }
    }
  };

  const descargarQR = (dataURL: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const descargarTexto = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Función para detectar llegada automática cuando escanean QR
  const detectarLlegadaAutomatica = async (mesa: any) => {
    // Simular reservas de hoy (normalmente esto vendría de una API/base de datos)
    const reservasHoy = [
      { id: '1', guestName: 'Juan Pérez', tableNumber: '01', time: '20:00', covers: 2, guestPhone: '+56912345678' },
      { id: '2', guestName: 'María García', tableNumber: '03', time: '19:30', covers: 4, guestPhone: '+56987654321' },
      { id: '3', guestName: 'Carlos López', tableNumber: '04', time: '21:00', covers: 2, guestPhone: '+56955443322' },
      { id: '4', guestName: 'Ana Martín', tableNumber: '07', time: '20:30', covers: 3, guestPhone: '+56911223344' },
      { id: '5', guestName: 'Roberto Silva', tableNumber: mesa.numero, time: '19:00', covers: 4, guestPhone: '+56933445566' }
    ];

    // Buscar si hay una reserva para esta mesa hoy
    const reservaEncontrada = reservasHoy.find(r => r.tableNumber === mesa.numero);

    if (reservaEncontrada) {
      // Mostrar confirmación de llegada automática
      const result = await Swal.fire({
        title: '🎉 ¡Reserva Detectada!',
        html: `
          <div class="text-center">
            <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-lg font-semibold text-green-800">${reservaEncontrada.guestName}</p>
              <p class="text-green-700">Tu reserva ha sido detectada automáticamente</p>
            </div>
            
            <div class="text-left bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-blue-800">
                <strong>Detalles de tu reserva:</strong><br>
                • Mesa: ${mesa.numero}<br>
                • Hora: ${reservaEncontrada.time}<br>
                • Personas: ${reservaEncontrada.covers}<br>
                • Zona: ${mesa.zona}
              </p>
            </div>

            <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p class="text-sm text-purple-800">
                <strong>✨ ¡Bienvenido!</strong><br>
                • Tu llegada ha sido registrada automáticamente<br>
                • Puedes ver el menú escaneando este mismo QR<br>
                • Un mesero te atenderá en breve
              </p>
            </div>
          </div>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Confirmar Llegada',
        cancelButtonText: 'No es mi reserva',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        width: '500px'
      });

      if (result.isConfirmed) {
        // Marcar llegada y mostrar mensaje de bienvenida
        await Swal.fire({
          title: '✅ ¡Bienvenido a nuestro restaurante!',
          html: `
            <div class="text-center">
              <div class="mb-4">
                <p class="text-xl font-semibold">${reservaEncontrada.guestName}</p>
                <p class="text-gray-600">Mesa ${mesa.numero} - Zona ${mesa.zona}</p>
              </div>
              
              <div class="space-y-3">
                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p class="text-sm text-green-800">
                    <strong>✅ Llegada confirmada</strong><br>
                    Registrado a las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p class="text-sm text-blue-800">
                    <strong>🍽️ Próximos pasos:</strong><br>
                    • Explora nuestro menú digital<br>
                    • Un mesero te atenderá pronto<br>
                    • Tiempo promedio de servicio: 15-20 min
                  </p>
                </div>

                <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p class="text-sm text-orange-800">
                    <strong>📱 Recordatorio:</strong><br>
                    Recibirás mensajes de WhatsApp con actualizaciones de tu pedido al ${reservaEncontrada.guestPhone}
                  </p>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                  ¡Gracias por elegirnos! Esperamos que tengas una experiencia excepcional.
                </p>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Ver Menú Digital',
          confirmButtonColor: '#3b82f6',
          timer: 8000,
          timerProgressBar: true,
          width: '550px'
        });

        // Registrar llegada automática en el sistema global
        ArrivalsManager.addArrival({
          guestName: reservaEncontrada.guestName,
          tableNumber: mesa.numero,
          type: 'automatic',
          reservationId: reservaEncontrada.id
        });
        
        console.log(`✅ Cliente ${reservaEncontrada.guestName} llegó automáticamente a mesa ${mesa.numero}`);
      }
    } else {
      // No hay reserva, mostrar acceso normal al menú
      await Swal.fire({
        title: '📱 Acceso al Menú Digital',
        html: `
          <div class="text-center">
            <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-lg font-semibold text-blue-800">Mesa ${mesa.numero}</p>
              <p class="text-blue-700">Zona ${mesa.zona} • Capacidad: ${mesa.capacidad} personas</p>
            </div>
            
            <div class="text-left bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-gray-800">
                <strong>🍽️ Bienvenido:</strong><br>
                • No se detectó reserva para esta mesa<br>
                • Puedes ver nuestro menú digital<br>
                • Si tienes reserva, consulta con el personal
              </p>
            </div>

            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-sm text-green-800">
                <strong>Menú disponible 24/7:</strong><br>
                • Platos principales<br>
                • Bebidas y cócteles<br>
                • Postres especiales<br>
                • Ofertas del día
              </p>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Ver Menú',
        confirmButtonColor: '#059669',
        width: '450px'
      });
    }
  };

  const handleVisualizarQRMesa = async (mesa: any) => {
    try {
      Swal.fire({
        title: 'Generando vista previa...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const qrData = await generarQRMesa(mesa);
      
      await Swal.fire({
        title: `Vista Previa QR - Mesa ${mesa.numero}`,
        html: `
          <div class="text-center">
            <img src="${qrData.dataURL}" alt="QR Mesa ${mesa.numero}" class="mx-auto mb-4 border rounded-lg" style="max-width: 180px;">
            <div class="text-left">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p class="text-sm text-blue-800">
                  <strong>Información de la Mesa:</strong><br>
                  • Número: ${mesa.numero}<br>
                  • Zona: ${mesa.zona}<br>
                  • Capacidad: ${mesa.capacidad} personas<br>
                  • Estado: ${mesa.estado}
                </p>
              </div>
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p class="text-xs text-gray-600 mb-1">URL del QR:</p>
                <p class="text-xs font-mono break-all">${qrData.url}</p>
              </div>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '400px'
      });
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo generar la vista previa del código QR',
        icon: 'error'
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mesas</h1>
          <p className="text-gray-600 mt-2">Control inteligente de ocupación y estado</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleGenerarQRMasivo();
            }}
            variant="outline"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <QrCode className="w-4 h-4 mr-2" />
            QR Masivo
          </Button>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEditorMesas();
            }}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Move3D className="w-4 h-4 mr-2" />
            Editor de Mesas
          </Button>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNuevaMesa();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Mesa
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Mesas</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticasGenerales.totalMesas}</p>
              </div>
              <ChefHat className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ocupadas</p>
                <p className="text-2xl font-bold text-red-600">{estadisticasGenerales.mesasOcupadas}</p>
              </div>
              <Users className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">{estadisticasGenerales.mesasLibres}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ocupación</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticasGenerales.ocupacionPromedio}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principal */}
      <Tabs value={vistaActiva} onValueChange={setVistaActiva} className="w-full">
        <TabsList className={`grid w-full ${modoEditor ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <TabsTrigger value="cuadricula">Vista Cuadrícula</TabsTrigger>
          <TabsTrigger value="mapa">Mapa de Mesas</TabsTrigger>
          <TabsTrigger value="qr-codes" className="text-orange-700">
            <QrCode className="w-4 h-4 mr-2" />
            Códigos QR
          </TabsTrigger>
          {modoEditor && (
            <TabsTrigger value="editor" className="bg-purple-50 text-purple-700">
              <Move3D className="w-4 h-4 mr-2" />
              Editor Visual
            </TabsTrigger>
          )}
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="cuadricula" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por mesa o cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los estados</SelectItem>
                    <SelectItem value="libre">Libre</SelectItem>
                    <SelectItem value="ocupada">Ocupada</SelectItem>
                    <SelectItem value="reservada">Reservada</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroZona} onValueChange={setFiltroZona}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Zona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las zonas</SelectItem>
                    <SelectItem value="Interior">Interior</SelectItem>
                    <SelectItem value="Terraza">Terraza</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Mesas - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {mesasFiltradas.map((mesa) => (
              <Card key={mesa.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg lg:text-xl font-bold">Mesa {mesa.numero}</CardTitle>
                    <Badge variant="outline" className={`${getEstadoColor(mesa.estado)} flex items-center gap-1 text-xs`}>
                      {getEstadoIcon(mesa.estado)}
                      <span className="hidden sm:inline">
                        {mesa.estado.charAt(0).toUpperCase() + mesa.estado.slice(1)}
                      </span>
                      <span className="sm:hidden">
                        {mesa.estado.charAt(0).toUpperCase()}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 lg:space-y-3">
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                    <Users className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>
                      <span className="hidden sm:inline">Capacidad: </span>
                      {mesa.capacidad} pers.
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                    <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>
                      <span className="hidden sm:inline">Zona: </span>
                      {mesa.zona}
                    </span>
                  </div>

                  {mesa.cliente && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                      <Users className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="truncate">
                        <span className="hidden sm:inline">Cliente: </span>
                        {mesa.cliente}
                      </span>
                    </div>
                  )}

                  {mesa.tiempoOcupada && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                      <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>
                        <span className="hidden sm:inline">Tiempo: </span>
                        {mesa.tiempoOcupada}
                      </span>
                    </div>
                  )}

                  {mesa.facturacion > 0 && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                      <DollarSign className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>
                        <span className="hidden sm:inline">Facturación: </span>
                        ${mesa.facturacion.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Acciones - Mobile Optimized */}
                  <div className="space-y-2 mt-3 lg:mt-4">
                    {/* Fila 1: Acciones principales */}
                    <div className="flex gap-1.5 lg:gap-2">
                      {mesa.estado === 'ocupada' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAccionMesa('liberar', mesa);
                            }}
                            className="flex-1 text-xs h-8 btn-mobile"
                          >
                            <CheckCircle2 className="w-3 h-3 lg:mr-1" />
                            <span className="hidden sm:inline ml-1">Liberar</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAccionMesa('limpiar', mesa);
                            }}
                            className="flex-1 text-xs h-8 btn-mobile"
                          >
                            <RotateCcw className="w-3 h-3 lg:mr-1" />
                            <span className="hidden sm:inline ml-1">Limpiar</span>
                          </Button>
                        </>
                      )}
                      
                      {mesa.estado === 'libre' && (
                        <Button
                          size="sm"
                          className="w-full text-xs h-8 bg-green-600 hover:bg-green-700 text-white btn-mobile"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Asignar cliente');
                          }}
                        >
                          <Users className="w-3 h-3 lg:mr-1" />
                          <span className="hidden sm:inline ml-1">Asignar Cliente</span>
                          <span className="sm:hidden ml-1">Asignar</span>
                        </Button>
                      )}

                      {(mesa.estado === 'limpieza' || mesa.estado === 'mantenimiento') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAccionMesa('activar', mesa);
                          }}
                          className="w-full text-xs h-8 btn-mobile"
                        >
                          <PlayCircle className="w-3 h-3 lg:mr-1" />
                          <span className="hidden sm:inline ml-1">Activar</span>
                          <span className="sm:hidden ml-1">Act.</span>
                        </Button>
                      )}
                    </div>
                    
                    {/* Fila 2: Códigos QR */}
                    <div className="flex gap-1.5 lg:gap-2 border-t pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleVisualizarQRMesa(mesa);
                        }}
                        className="flex-1 text-xs h-8 border-blue-200 text-blue-700 hover:bg-blue-50 btn-mobile"
                        title="Ver código QR de la mesa"
                      >
                        <Eye className="w-3 h-3 lg:mr-1" />
                        <span className="hidden sm:inline ml-1">Ver QR</span>
                        <span className="sm:hidden ml-1">QR</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleGenerarQRIndividual(mesa);
                        }}
                        className="flex-1 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                        title="Generar y descargar código QR único"
                      >
                        <QrCode className="w-3 h-3 mr-1" />
                        Generar QR
                      </Button>
                    </div>
                    
                    {/* Botón para simular escaneo QR y detección automática */}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          detectarLlegadaAutomatica(mesa);
                        }}
                        className="w-full text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
                        title="Simular escaneo de QR por cliente"
                      >
                        <Smartphone className="w-3 h-3 mr-1" />
                        Simular Escaneo QR
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mapa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Mapa Interactivo de Mesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg min-h-[600px] relative">
                {/* Zona Interior */}
                <div className="absolute top-10 left-10 bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3">ZONA INTERIOR</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {mesasData.filter(m => m.zona === 'Interior').slice(0, 6).map(mesa => (
                      <div
                        key={mesa.id}
                        className={`w-16 h-16 rounded border-2 flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 transition-transform ${
                          mesa.estado === 'ocupada' ? 'bg-red-200 border-red-400 text-red-800' :
                          mesa.estado === 'libre' ? 'bg-green-200 border-green-400 text-green-800' :
                          mesa.estado === 'reservada' ? 'bg-blue-200 border-blue-400 text-blue-800' :
                          'bg-gray-200 border-gray-400 text-gray-800'
                        }`}
                      >
                        {mesa.numero}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zona Terraza */}
                <div className="absolute top-10 right-10 bg-green-100 p-4 rounded-lg border-2 border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">ZONA TERRAZA</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {mesasData.filter(m => m.zona === 'Terraza').map(mesa => (
                      <div
                        key={mesa.id}
                        className={`w-16 h-16 rounded border-2 flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 transition-transform ${
                          mesa.estado === 'ocupada' ? 'bg-red-200 border-red-400 text-red-800' :
                          mesa.estado === 'libre' ? 'bg-green-200 border-green-400 text-green-800' :
                          mesa.estado === 'reservada' ? 'bg-blue-200 border-blue-400 text-blue-800' :
                          'bg-gray-200 border-gray-400 text-gray-800'
                        }`}
                      >
                        {mesa.numero}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zona VIP */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-3">ZONA VIP</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {mesasData.filter(m => m.zona === 'VIP').map(mesa => (
                      <div
                        key={mesa.id}
                        className={`w-20 h-20 rounded border-2 flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 transition-transform ${
                          mesa.estado === 'ocupada' ? 'bg-red-200 border-red-400 text-red-800' :
                          mesa.estado === 'libre' ? 'bg-green-200 border-green-400 text-green-800' :
                          mesa.estado === 'reservada' ? 'bg-blue-200 border-blue-400 text-blue-800' :
                          'bg-gray-200 border-gray-400 text-gray-800'
                        }`}
                      >
                        {mesa.numero}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leyenda */}
                <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
                  <h4 className="font-semibold mb-2">Leyenda</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                      <span>Ocupada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                      <span>Libre</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                      <span>Reservada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
                      <span>Mantenimiento</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr-codes" className="space-y-6">
          {/* Header de Códigos QR */}
          <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <QrCode className="w-5 h-5" />
                  Gestión de Códigos QR por Mesa
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleGenerarQRMasivo();
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generar Todo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <QrCode className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Códigos Únicos</h3>
                      <p className="text-sm text-gray-600">Cada mesa tiene su QR exclusivo</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Experiencia Cliente</h3>
                      <p className="text-sm text-gray-600">Acceso directo desde móvil</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Control Estado</h3>
                      <p className="text-sm text-gray-600">Seguimiento en tiempo real</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Mesas con QR */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Códigos QR por Mesa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mesasData.map((mesa) => (
                  <div 
                    key={mesa.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Mesa {mesa.numero}</h3>
                        <p className="text-sm text-gray-600">{mesa.zona} • {mesa.capacidad} personas</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getEstadoColor(mesa.estado)} flex items-center gap-1`}
                      >
                        {getEstadoIcon(mesa.estado)}
                        {mesa.estado}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Link className="w-3 h-3" />
                        <span>URL: https://tu-restaurante.com/mesa/{mesa.numero}</span>
                      </div>
                      
                      {mesa.cliente && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>Cliente actual: {mesa.cliente}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Último QR: Hace 2 días</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleVisualizarQRMesa(mesa);
                        }}
                        className="flex-1 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleGenerarQRIndividual(mesa);
                        }}
                        className="flex-1 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <QrCode className="w-3 h-3 mr-1" />
                        Generar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información y Guía de Uso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  ¿Cómo Funciona?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium">Genera el código QR</p>
                      <p className="text-gray-600">Cada mesa obtiene un código único e intransferible</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium">Coloca el código en la mesa</p>
                      <p className="text-gray-600">Imprime y coloca de forma visible para los clientes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium">Cliente escanea el código</p>
                      <p className="text-gray-600">Acceso directo al menú, pedidos y experiencia digital</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <p className="font-medium">Control automático</p>
                      <p className="text-gray-600">El sistema identifica la mesa y gestiona el estado automáticamente</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Consejos Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="font-medium text-yellow-800 mb-1">⚠️ Códigos Únicos</p>
                    <p className="text-yellow-700">Cada mesa debe tener su código único. No dupliques códigos entre mesas.</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="font-medium text-blue-800 mb-1">💡 Ubicación Visible</p>
                    <p className="text-blue-700">Coloca el QR en un lugar fácil de ver y escanear por los clientes.</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-medium text-green-800 mb-1">✅ Mantenimiento</p>
                    <p className="text-green-700">Revisa periódicamente que los códigos estén en buen estado y funcionen.</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="font-medium text-purple-800 mb-1">🔄 Regeneración</p>
                    <p className="text-purple-700">Puedes regenerar códigos en cualquier momento si es necesario.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {/* Controles del Editor */}
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Zap className="w-5 h-5" />
                  Editor Visual de Mesas - Modo Activo
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      guardarCambiosEditor();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      cancelarEditor();
                    }}
                    className="border-gray-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Instrucciones</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Arrastra mesas y zonas para reorganizar</li>
                    <li>• Click simple: Seleccionar</li>
                    <li>• Doble click en zona: Editar propiedades</li>
                    <li>• Usar "Nueva Zona" para agregar áreas</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Herramientas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant={mostrarCuadricula ? "default" : "outline"} 
                      className="text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCuadricula();
                      }}
                    >
                      <Grid3x3 className="w-3 h-3 mr-1" />
                      Cuadrícula
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alinearMesas();
                      }}
                    >
                      <Move3D className="w-3 h-3 mr-1" />
                      Alinear
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        crearNuevaZona();
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Nueva Zona
                    </Button>
                    {zonaSeleccionada && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          eliminarZona(zonaSeleccionada);
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Estado</h4>
                  <p className={`text-xs ${cambiosSinGuardar > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {cambiosSinGuardar > 0 ? '⚠' : '✓'} Cambios sin guardar: {cambiosSinGuardar}
                  </p>
                  <p className="text-xs text-blue-600">⚡ Modo editor activo</p>
                  {mesaSeleccionada && (
                    <p className="text-xs text-purple-600">
                      <MousePointer className="w-3 h-3 inline mr-1" />
                      Mesa seleccionada: {mesaSeleccionada.numero}
                    </p>
                  )}
                  {zonaSeleccionada && (
                    <p className="text-xs text-green-600">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      Zona seleccionada: {zonaSeleccionada.nombre}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Área del Editor Visual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move3D className="w-5 h-5" />
                Área de Diseño - Arrastra y Reorganiza
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-gray-50 p-6 rounded-lg min-h-[600px] relative border-2 border-dashed border-purple-300"
                ref={dragRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Zonas Dinámicas - Editables */}
                {zonas.map((zona) => (
                  <div
                    key={zona.id}
                    className={`absolute p-4 rounded-lg border-2 cursor-move hover:shadow-lg transition-all duration-200 group ${
                      zonaSeleccionada?.id === zona.id 
                        ? 'ring-4 ring-yellow-400 ring-opacity-50 shadow-xl' 
                        : ''
                    }`}
                    style={{
                      left: zona.posicion.x,
                      top: zona.posicion.y,
                      width: zona.tamaño.width,
                      height: zona.tamaño.height,
                      backgroundColor: `${zona.colorHex}15`,
                      borderColor: zona.colorHex
                    }}
                    onClick={(e) => handleClickZona(zona, e)}
                    onDoubleClick={(e) => handleDoubleClickZona(zona, e)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify({...zona, type: 'zona'}));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <div 
                      className="flex items-center justify-between mb-3 pointer-events-none"
                      style={{ color: zona.colorHex }}
                    >
                      <h3 className="font-semibold text-sm uppercase tracking-wide">
                        {zona.nombre}
                      </h3>
                      <div className="text-xs opacity-60">
                        {zona.mesas} mesas
                      </div>
                    </div>
                    
                    {/* Botones de control de zona */}
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          editarZona(zona);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarZona(zona);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {/* Mesas de la zona */}
                    <div className="grid gap-2" style={{
                      gridTemplateColumns: `repeat(${Math.floor(zona.tamaño.width / 80)}, 1fr)`,
                      maxHeight: zona.tamaño.height - 60
                    }}>
                      {mesasData.filter(m => m.zona === zona.nombre).map(mesa => (
                        <div
                          key={mesa.id}
                          className={`w-12 h-12 rounded border-2 flex items-center justify-center text-xs font-bold cursor-move hover:scale-110 transition-transform shadow-md ${
                            mesa.estado === 'ocupada' ? 'bg-red-200 border-red-400 text-red-800' :
                            mesa.estado === 'libre' ? 'bg-green-200 border-green-400 text-green-800' :
                            mesa.estado === 'reservada' ? 'bg-blue-200 border-blue-400 text-blue-800' :
                            'bg-gray-200 border-gray-400 text-gray-800'
                          } ${mesaSeleccionada?.id === mesa.id ? 'ring-2 ring-purple-400 ring-opacity-70' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, mesa)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClickMesa(mesa);
                          }}
                          style={mesasPosition[mesa.numero] ? {
                            position: 'absolute',
                            left: mesasPosition[mesa.numero].x,
                            top: mesasPosition[mesa.numero].y,
                            zIndex: 20
                          } : {}}
                        >
                          {mesa.numero}
                        </div>
                      ))}
                    </div>
                    
                    {/* Indicador de redimensionamiento */}
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 opacity-30"
                         style={{ borderColor: zona.colorHex }}>
                    </div>
                  </div>
                ))}

                {/* Guías de Cuadrícula */}
                {mostrarCuadricula && (
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#9333ea" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )}

                {/* Instrucciones Overlay */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-lg border shadow-lg max-w-md">
                  <p className="text-xs text-gray-700 text-center">
                    <Move3D className="w-4 h-4 inline mr-1" />
                    Arrastra las zonas y mesas para reorganizar
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Click en zona para seleccionar • Doble click para editar • Usa "Nueva Zona" para agregar
                  </p>
                </div>

                {/* Área de Drop para crear zona rápidamente */}
                {zonas.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
                      <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin zonas definidas</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Comienza creando tu primera zona para organizar las mesas
                      </p>
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          crearNuevaZona();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primera Zona
                      </Button>
                    </div>
                  </div>
                )}

                {/* Panel de Propiedades */}
                <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border min-w-[200px]">
                  <h4 className="font-semibold mb-3 text-sm">Propiedades</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Mesas Totales:</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Espaciado:</span>
                      <span className="font-medium">2.0m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distribución:</span>
                      <span className="font-medium">Manual</span>
                    </div>
                    <hr className="my-2" />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        configurarMesa();
                      }}
                    >
                      <Settings2 className="w-3 h-3 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-6">
          {/* Métricas por Zona */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zonas.map((zona) => (
              <Card key={zona.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: zona.colorHex }}
                    ></div>
                    {zona.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ocupación</span>
                      <span className="font-semibold">{zona.ocupadas}/{zona.mesas}</span>
                    </div>
                    <Progress 
                      value={zona.mesas > 0 ? (zona.ocupadas / zona.mesas) * 100 : 0} 
                      className="w-full" 
                    />
                    <div className="text-sm text-gray-600">
                      {zona.mesas > 0 ? Math.round((zona.ocupadas / zona.mesas) * 100) : 0}% ocupación
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Dimensiones:</span>
                      <span>{zona.tamaño.width}x{zona.tamaño.height}px</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Métricas Adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Facturación Total</p>
                    <p className="text-xl font-bold text-green-600">
                      ${estadisticasGenerales.facturacionTotal.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rotación Promedio</p>
                    <p className="text-xl font-bold text-blue-600">
                      {estadisticasGenerales.rotacionPromedio}x
                    </p>
                  </div>
                  <Timer className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Promedio</p>
                    <p className="text-xl font-bold text-purple-600">1h 45m</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Eficiencia</p>
                    <p className="text-xl font-bold text-orange-600">87%</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
