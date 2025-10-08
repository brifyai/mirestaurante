
'use client';

import React, { useState, Suspense, lazy } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import Swal from 'sweetalert2';

// Cargar ReactQuill dinámicamente para evitar problemas de SSR
const ReactQuill = lazy(() => import('react-quill'));
import { 
  Megaphone,
  Users,
  MessageSquare,
  Mail,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  Download,
  Upload,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  PieChart,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
  Heart,
  Star,
  DollarSign,
  Phone,
  MapPin,
  Cake,
  Share2,
  Database,
  FileText,
  Settings
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  canal: 'whatsapp' | 'facebook' | 'instagram' | 'qr' | 'reserva';
  fechaRegistro: string;
  ultimaInteraccion: string;
  totalReservas: number;
  ticketPromedio: number;
  estado: 'activo' | 'inactivo' | 'bloqueado';
  etiquetas: string[];
}

interface Campana {
  id: string;
  titulo: string;
  tipo: 'email' | 'whatsapp' | 'automatizada';
  canal: string;
  fechaCreacion: string;
  fechaEnvio?: string;
  estado: 'borrador' | 'programada' | 'enviada' | 'pausada';
  destinatarios: number;
  enviados: number;
  leidos: number;
  clicks: number;
  conversiones: number;
  ingresos: number;
}

export default function CampanasContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filtroFecha, setFiltroFecha] = useState('mes');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [filtroCanal, setFiltroCanal] = useState('todos');

  // Estados para modales
  const [showEmailCampaignModal, setShowEmailCampaignModal] = useState(false);
  const [showWhatsAppCampaignModal, setShowWhatsAppCampaignModal] = useState(false);
  const [showAICampaignModal, setShowAICampaignModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showBrevoConfigModal, setShowBrevoConfigModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [showCumpleanosConfigModal, setShowCumpleanosConfigModal] = useState(false);
  const [showResenaConfigModal, setShowResenaConfigModal] = useState(false);
  const [showRecompraConfigModal, setShowRecompraConfigModal] = useState(false);

  // Estados para formularios
  const [emailCampaignForm, setEmailCampaignForm] = useState({
    titulo: '',
    asunto: '',
    contenido: '',
    fechaEnvio: '',
    horaEnvio: '',
    segmento: 'todos'
  });

  const [whatsappCampaignForm, setWhatsappCampaignForm] = useState({
    titulo: '',
    mensaje: '',
    fechaEnvio: '',
    horaEnvio: '',
    segmento: 'todos',
    incluirImagen: false,
    urlImagen: ''
  });

  const [clienteForm, setClienteForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    canal: 'qr'
  });

  const [brevoConfig, setBrevoConfig] = useState({
    apiKey: '',
    senderEmail: '',
    senderName: '',
    isConfigured: false
  });

  // Estado para automatización de reseñas
  const [reviewConfig, setReviewConfig] = useState({
    enabled: false,
    horasDesdeVisita: 3,
    templateMensaje: 'Hola! Esperamos que hayas disfrutado tu visita. ¿Podrías dejarnos una reseña?'
  });

  // Estado para automatización de cumpleaños
  const [cumpleanosConfig, setCumpleanosConfig] = useState({
    enabled: false,
    diasAntes: 1,
    horaEnvio: '10:00',
    templateMensaje: '🎂 ¡Feliz cumpleaños {nombre}! Te deseamos un día maravilloso. Disfruta un 20% de descuento en tu próxima visita con el código CUMPLE20.',
    descuentoPorcentaje: 20,
    validezDias: 30,
    incluirImagen: true
  });

  // Estado para automatización de recompra
  const [recompraConfig, setRecompraConfig] = useState({
    enabled: false,
    diasSinVisita: 30,
    frecuenciaEnvio: 'semanal', // semanal, quincenal, mensual
    templateMensaje: '¡Te extrañamos {nombre}! 💕 Regresa y disfruta nuestras nuevas especialidades. Tenemos un 15% de descuento esperándote.',
    descuentoPorcentaje: 15,
    validezDias: 15,
    maxEnvios: 3
  });

  // Estado para mostrar detalles de campaña
  const [showCampaignDetailModal, setShowCampaignDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campana | null>(null);

  // Datos simulados realistas
  const estadisticasGenerales = {
    totalClientes: 5016,
    clientesActivos: 3890,
    nuevosClientes: 156,
    clientesWhatsApp: 2340,
    clientesFacebook: 1450,
    clientesInstagram: 1226,
    ingresosTotal: 48950000,
    ticketPromedio: 23500,
    reservasPendientes: 87,
    tasaConversion: 12.5
  };

  const clientesData: Cliente[] = [
    {
      id: '1',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@email.com',
      telefono: '+56 9 8765 4321',
      fechaNacimiento: '1988-03-15',
      canal: 'whatsapp',
      fechaRegistro: '2025-08-15',
      ultimaInteraccion: '2025-09-01',
      totalReservas: 8,
      ticketPromedio: 28500,
      estado: 'activo',
      etiquetas: ['VIP', 'Cumpleaños Sept']
    },
    {
      id: '2',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      email: 'carlos.rodriguez@email.com',
      telefono: '+56 9 1234 5678',
      fechaNacimiento: '1992-07-22',
      canal: 'instagram',
      fechaRegistro: '2025-07-30',
      ultimaInteraccion: '2025-08-28',
      totalReservas: 5,
      ticketPromedio: 31200,
      estado: 'activo',
      etiquetas: ['Nuevo', 'Instagram']
    },
    {
      id: '3',
      nombre: 'Ana',
      apellido: 'Morales',
      email: 'ana.morales@email.com',
      telefono: '+56 9 9876 5432',
      fechaNacimiento: '1985-12-08',
      canal: 'facebook',
      fechaRegistro: '2025-06-20',
      ultimaInteraccion: '2025-09-02',
      totalReservas: 12,
      ticketPromedio: 25800,
      estado: 'activo',
      etiquetas: ['Fiel', 'Familia']
    }
  ];

  const campanasData: Campana[] = [
    {
      id: '1',
      titulo: 'Disfruta con 40% DCTO pagando con Cencosud',
      tipo: 'email',
      canal: 'Email MKT',
      fechaCreacion: '2025-08-10',
      fechaEnvio: '2025-08-12',
      estado: 'enviada',
      destinatarios: 2500,
      enviados: 2450,
      leidos: 1820,
      clicks: 456,
      conversiones: 87,
      ingresos: 1950000
    },
    {
      id: '2',
      titulo: 'Tú TÚ, pausa perfecta - menú ejecutivo completo',
      tipo: 'email',
      canal: 'Email MKT',
      fechaCreacion: '2025-08-08',
      fechaEnvio: '2025-08-11',
      estado: 'enviada',
      destinatarios: 1800,
      enviados: 1780,
      leidos: 1290,
      clicks: 312,
      conversiones: 54,
      ingresos: 1250000
    },
    {
      id: '3',
      titulo: 'Cumpleaños Especial - 20% Descuento',
      tipo: 'whatsapp',
      canal: 'WhatsApp',
      fechaCreacion: '2025-09-01',
      fechaEnvio: '2025-09-02',
      estado: 'enviada',
      destinatarios: 45,
      enviados: 45,
      leidos: 42,
      clicks: 18,
      conversiones: 12,
      ingresos: 280000
    }
  ];

  const datosIngresos = [
    { mes: 'Ene', ingresos: 4200000, reservas: 180 },
    { mes: 'Feb', ingresos: 3800000, reservas: 165 },
    { mes: 'Mar', ingresos: 4600000, reservas: 195 },
    { mes: 'Abr', ingresos: 4100000, reservas: 175 },
    { mes: 'May', ingresos: 4800000, reservas: 205 },
    { mes: 'Jun', ingresos: 5200000, reservas: 220 },
    { mes: 'Jul', ingresos: 5600000, reservas: 240 },
    { mes: 'Ago', ingresos: 4900000, reservas: 210 }
  ];

  const distribucionCanales = [
    { name: 'WhatsApp', value: 2340, color: '#10B981' },
    { name: 'Facebook', value: 1450, color: '#3B82F6' },
    { name: 'Instagram', value: 1226, color: '#F59E0B' },
    { name: 'QR Portal', value: 3290, color: '#8B5CF6' },
    { name: 'Reservas', value: 1726, color: '#EF4444' }
  ];

  const proyeccionReservas = [
    { fecha: '2025-09-03', reservas: 28, ingresos: 658000 },
    { fecha: '2025-09-04', reservas: 32, ingresos: 752000 },
    { fecha: '2025-09-05', reservas: 41, ingresos: 963500 },
    { fecha: '2025-09-06', reservas: 45, ingresos: 1057500 },
    { fecha: '2025-09-07', reservas: 52, ingresos: 1222000 },
    { fecha: '2025-09-08', reservas: 38, ingresos: 893000 },
    { fecha: '2025-09-09', reservas: 35, ingresos: 822500 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const clientesFiltrados = clientesData.filter(cliente => {
    const matchesSearch = !busquedaCliente || 
      cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      cliente.email.toLowerCase().includes(busquedaCliente.toLowerCase());
    
    const matchesCanal = filtroCanal === 'todos' || cliente.canal === filtroCanal;
    
    return matchesSearch && matchesCanal;
  });

  // Funciones para manejar botones
  const handleCreateEmailCampaign = () => {
    setShowEmailCampaignModal(true);
  };

  const handleCreateWhatsAppCampaign = () => {
    setShowWhatsAppCampaignModal(true);
  };

  const handleCreateAICampaign = () => {
    setShowAICampaignModal(true);
  };

  const handleAddCliente = () => {
    setShowClienteModal(true);
  };

  const handleConfigureBrevo = () => {
    setShowBrevoConfigModal(true);
  };

  const handleSaveEmailCampaign = async () => {
    try {
      const response = await fetch('/api/campanas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'email',
          ...emailCampaignForm
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: '✅ ¡Éxito!',
          text: 'Campaña de email creada exitosamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setShowEmailCampaignModal(false);
        setEmailCampaignForm({
          titulo: '',
          asunto: '',
          contenido: '',
          fechaEnvio: '',
          horaEnvio: '',
          segmento: 'todos'
        });
      } else {
        Swal.fire({
          title: '❌ Error',
          text: result.error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error creating email campaign:', error);
      Swal.fire({
        title: '❌ Error',
        text: 'Error al crear la campaña de email',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSaveWhatsAppCampaign = async () => {
    try {
      const response = await fetch('/api/campanas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'whatsapp',
          ...whatsappCampaignForm
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: '✅ ¡Éxito!',
          text: 'Campaña de WhatsApp creada exitosamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setShowWhatsAppCampaignModal(false);
        setWhatsappCampaignForm({
          titulo: '',
          mensaje: '',
          fechaEnvio: '',
          horaEnvio: '',
          segmento: 'todos',
          incluirImagen: false,
          urlImagen: ''
        });
      } else {
        Swal.fire({
          title: '❌ Error',
          text: result.error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error creating WhatsApp campaign:', error);
      Swal.fire({
        title: '❌ Error',
        text: 'Error al crear la campaña de WhatsApp',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSaveCliente = async () => {
    try {
      const response = await fetch('/api/campanas/clientes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteForm),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: '✅ ¡Éxito!',
          text: 'Cliente agregado exitosamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setShowClienteModal(false);
        setClienteForm({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          fechaNacimiento: '',
          canal: 'qr'
        });
      } else {
        Swal.fire({
          title: '❌ Error',
          text: result.error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error adding client:', error);
      Swal.fire({
        title: '❌ Error',
        text: 'Error al agregar el cliente',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSaveBrevoConfig = async () => {
    try {
      const response = await fetch('/api/campanas/brevo-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brevoConfig),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: '✅ ¡Éxito!',
          text: 'Configuración de Brevo guardada exitosamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setBrevoConfig(prev => ({ ...prev, isConfigured: true }));
        setShowBrevoConfigModal(false);
      } else {
        Swal.fire({
          title: '❌ Error',
          text: result.error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error saving Brevo config:', error);
      Swal.fire({
        title: '❌ Error',
        text: 'Error al guardar la configuración de Brevo',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleQuickAction = (action: string) => {
    Swal.fire({
      title: '🚀 Acción Rápida',
      text: `Ejecutando: ${action}`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  };

  const handleImportClientes = () => {
    Swal.fire({
      title: '📤 Importar Clientes',
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 15px;">Selecciona un archivo CSV con la siguiente estructura:</p>
          <div style="background: #f3f4f6; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-family: monospace; font-size: 12px;">
            nombre,apellido,email,telefono,fechaNacimiento<br>
            Juan,Pérez,juan@email.com,+56912345678,1990-01-15
          </div>
          <input type="file" id="csvFile" accept=".csv,.xlsx,.xls" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '📥 Importar Archivo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const fileInput = document.getElementById('csvFile') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        
        if (!file) {
          Swal.showValidationMessage('Por favor selecciona un archivo');
          return false;
        }
        
        if (!file.name.match(/\.(csv|xlsx|xls)$/)) {
          Swal.showValidationMessage('Por favor selecciona un archivo CSV o Excel válido');
          return false;
        }
        
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const headers = lines[0].split(',');
            const data = [];
            
            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim()) {
                const values = lines[i].split(',');
                const cliente = {
                  nombre: values[0]?.trim(),
                  apellido: values[1]?.trim(),
                  email: values[2]?.trim(),
                  telefono: values[3]?.trim(),
                  fechaNacimiento: values[4]?.trim()
                };
                if (cliente.nombre && cliente.email) {
                  data.push(cliente);
                }
              }
            }
            resolve({ fileName: file.name, clientesImportados: data.length, data });
          };
          reader.readAsText(file);
        });
      }
    }).then((result: any) => {
      if (result.isConfirmed && result.value) {
        const { fileName, clientesImportados } = result.value;
        Swal.fire({
          title: '✅ Importación Exitosa',
          html: `
            <div style="text-align: left;">
              <p><strong>Archivo:</strong> ${fileName}</p>
              <p><strong>Clientes importados:</strong> ${clientesImportados}</p>
              <p style="margin-top: 15px; color: #10b981;">Los clientes han sido agregados a tu base de datos y estarán disponibles para futuras campañas.</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Continuar'
        });
      }
    }).catch((error) => {
      Swal.fire({
        title: 'Error en la importación',
        text: 'Hubo un problema procesando el archivo. Por favor verifica el formato.',
        icon: 'error'
      });
    });
  };

  // Función para ver detalles de campaña
  const handleViewCampaign = (campaña: Campana) => {
    setSelectedCampaign(campaña);
    setShowCampaignDetailModal(true);
  };

  const handleExportCSV = () => {
    // Simular exportación de CSV
    const csvData = clientesFiltrados.map(cliente => ({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      canal: cliente.canal,
      fechaRegistro: cliente.fechaRegistro,
      totalReservas: cliente.totalReservas,
      ticketPromedio: cliente.ticketPromedio,
      estado: cliente.estado
    }));

    const csvContent = [
      ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Canal', 'Fecha Registro', 'Total Reservas', 'Ticket Promedio', 'Estado'],
      ...csvData.map(row => [
        row.nombre,
        row.apellido,
        row.email,
        row.telefono,
        row.canal,
        row.fechaRegistro,
        row.totalReservas,
        row.ticketPromedio,
        row.estado
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Swal.fire({
      title: '✅ ¡Éxito!',
      text: 'Archivo CSV descargado exitosamente',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a AI Restaurante Campañas</h1>
        <p className="text-gray-600">Tu principal medio para comunicarte con clientes de una manera directa y eficaz.</p>
        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm underline">
          Conoce tu Base de Datos y crece
        </a>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">TOTAL DE CLIENTES</p>
                <p className="text-3xl font-bold text-blue-600">{estadisticasGenerales.totalClientes.toLocaleString()}</p>
                <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                  +{estadisticasGenerales.nuevosClientes} este mes
                </Badge>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portal QR</p>
                <p className="text-3xl font-bold text-purple-600">3.290 clientes</p>
                <Badge variant="outline" className="mt-2 text-purple-600 border-purple-600">
                  Canal principal
                </Badge>
              </div>
              <Target className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Restaurante Reservas</p>
                <p className="text-3xl font-bold text-green-600">1.726 clientes</p>
                <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                  {estadisticasGenerales.reservasPendientes} pendientes
                </Badge>
              </div>
              <Calendar className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 rounded-lg p-1">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center space-x-2 rounded-md py-2 px-3 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
            onClick={() => Swal.fire({
              title: 'Dashboard de Campañas',
              text: 'Cargando dashboard de campañas...',
              icon: 'info',
              timer: 1500
            })}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="clientes" 
            className="flex items-center space-x-2 rounded-md py-2 px-3 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
          >
            <Users className="w-4 h-4" />
            <span>Base de Clientes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="campanas" 
            className="flex items-center space-x-2 rounded-md py-2 px-3 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
          >
            <Megaphone className="w-4 h-4" />
            <span>Campañas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="automatizadas" 
            className="flex items-center space-x-2 rounded-md py-2 px-3 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
          >
            <Clock className="w-4 h-4" />
            <span>Automatizadas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="proyecciones" 
            className="flex items-center space-x-2 rounded-md py-2 px-3 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Proyecciones</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB: Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Métricas por Canal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <span>WhatsApp</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {estadisticasGenerales.clientesWhatsApp.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mb-4">clientes activos</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tasa apertura</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Respuestas</span>
                    <span className="font-semibold">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <span>Facebook</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {estadisticasGenerales.clientesFacebook.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mb-4">clientes activos</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tasa apertura</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interacciones</span>
                    <span className="font-semibold">45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                  <span>Instagram</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {estadisticasGenerales.clientesInstagram.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mb-4">clientes activos</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tasa apertura</span>
                    <span className="font-semibold">82%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stories</span>
                    <span className="font-semibold">56%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución por Canales */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Clientes por Canal</CardTitle>
                <CardDescription>Origen de tu base de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={distribucionCanales}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distribucionCanales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [value.toLocaleString(), 'Clientes']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {distribucionCanales.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs">{item.name}: {item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingresos por Campañas */}
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Campañas</CardTitle>
                <CardDescription>Evolución mensual de ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={datosIngresos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Ingresos']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ingresos" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* KPIs Importantes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Ingresos Totales</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(estadisticasGenerales.ingresosTotal)}
                </div>
                <p className="text-xs text-gray-500 mt-1">+15% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Ticket Promedio</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {formatCurrency(estadisticasGenerales.ticketPromedio)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Por persona</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">Tasa Conversión</span>
                </div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {estadisticasGenerales.tasaConversion}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Campañas a reservas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">Clientes Activos</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 mt-1">
                  {estadisticasGenerales.clientesActivos.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: Base de Clientes */}
        <TabsContent value="clientes" className="space-y-6">
          {/* Banner Explicativo */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-1">
                  📋 Base de Clientes + Acciones Rápidas
                </h3>
                <p className="text-sm text-indigo-700 mb-2">
                  Aquí administras tu base de datos completa y puedes enviar mensajes <strong>inmediatos</strong> a clientes seleccionados.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-indigo-600">
                  <span>✅ Ver/editar todos los clientes</span>
                  <span>✅ Buscar y filtrar</span>
                  <span>✅ Envíos inmediatos a seleccionados</span>
                  <span>✅ Acciones rápidas por segmento</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Base de Clientes Completa</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportCSV}
                    className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleImportClientes}
                    className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleAddCliente}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Cliente
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label>Buscar Cliente</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={busquedaCliente}
                      onChange={(e) => setBusquedaCliente(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Filtrar por Canal</Label>
                  <select
                    value={filtroCanal}
                    onChange={(e) => setFiltroCanal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="todos">Todos los canales</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="qr">Portal QR</option>
                    <option value="reserva">Reservas</option>
                  </select>
                </div>
              </div>

              {/* Tabla de Clientes */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Cliente</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Teléfono</th>
                      <th className="text-left p-3">Fecha Nacimiento</th>
                      <th className="text-left p-3">Canal</th>
                      <th className="text-left p-3">Reservas</th>
                      <th className="text-left p-3">Ticket Promedio</th>
                      <th className="text-left p-3">Estado</th>
                      <th className="text-left p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-semibold">{cliente.nombre} {cliente.apellido}</div>
                            <div className="text-sm text-gray-500">
                              {cliente.etiquetas.map((etiqueta, index) => (
                                <Badge key={index} variant="secondary" className="mr-1 text-xs">
                                  {etiqueta}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{cliente.email}</td>
                        <td className="p-3 text-sm">{cliente.telefono}</td>
                        <td className="p-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <Cake className="w-4 h-4 text-pink-500" />
                            <span>{new Date(cliente.fechaNacimiento).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant="outline" 
                            className={`
                              ${cliente.canal === 'whatsapp' ? 'text-green-600 border-green-600' : ''}
                              ${cliente.canal === 'facebook' ? 'text-blue-600 border-blue-600' : ''}
                              ${cliente.canal === 'instagram' ? 'text-purple-600 border-purple-600' : ''}
                            `}
                          >
                            {cliente.canal}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">{cliente.totalReservas}</td>
                        <td className="p-3 text-sm font-semibold">{formatCurrency(cliente.ticketPromedio)}</td>
                        <td className="p-3">
                          <Badge 
                            variant={cliente.estado === 'activo' ? 'default' : 'secondary'}
                            className={cliente.estado === 'activo' ? 'bg-green-500' : ''}
                          >
                            {cliente.estado}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => Swal.fire({
                                title: 'Ver Cliente',
                                html: `
                                  <div class="text-left">
                                    <p><strong>Nombre:</strong> ${cliente.nombre} ${cliente.apellido}</p>
                                    <p><strong>Email:</strong> ${cliente.email}</p>
                                    <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
                                    <p><strong>Total Reservas:</strong> ${cliente.totalReservas}</p>
                                    <p><strong>Ticket Promedio:</strong> $${cliente.ticketPromedio.toLocaleString()}</p>
                                    <p><strong>Estado:</strong> ${cliente.estado}</p>
                                  </div>
                                `,
                                icon: 'info',
                                confirmButtonText: 'Cerrar'
                              })}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => Swal.fire({
                                title: 'Editar Cliente',
                                html: `
                                  <div style="text-align: left;">
                                    <div style="margin-bottom: 15px;">
                                      <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre:</label>
                                      <input id="nombre" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${cliente.nombre}" />
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                      <label style="display: block; margin-bottom: 5px; font-weight: bold;">Apellido:</label>
                                      <input id="apellido" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${cliente.apellido}" />
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                      <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email:</label>
                                      <input id="email" type="email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${cliente.email}" />
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                      <label style="display: block; margin-bottom: 5px; font-weight: bold;">Teléfono:</label>
                                      <input id="telefono" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${cliente.telefono}" />
                                    </div>
                                  </div>
                                `,
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Guardar Cambios',
                                cancelButtonText: 'Cancelar',
                                confirmButtonColor: '#7c3aed',
                                cancelButtonColor: '#6b7280',
                                preConfirm: () => {
                                  const nombre = (document.getElementById('nombre') as HTMLInputElement)?.value;
                                  const apellido = (document.getElementById('apellido') as HTMLInputElement)?.value;
                                  const email = (document.getElementById('email') as HTMLInputElement)?.value;
                                  const telefono = (document.getElementById('telefono') as HTMLInputElement)?.value;
                                  
                                  if (!nombre || !apellido || !email) {
                                    Swal.showValidationMessage('Por favor completa todos los campos obligatorios');
                                    return false;
                                  }
                                  return { nombre, apellido, email, telefono };
                                }
                              }).then((result: any) => {
                                if (result.isConfirmed) {
                                  Swal.fire({
                                    title: '✅ Guardado',
                                    text: 'La información del cliente ha sido actualizada correctamente',
                                    icon: 'success',
                                    timer: 2000
                                  });
                                }
                              })}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => Swal.fire({
                                title: '💬 Enviar Mensaje WhatsApp',
                                html: `
                                  <div style="text-align: left; margin-bottom: 20px;">
                                    <p style="margin-bottom: 15px;"><strong>Destinatario:</strong> ${cliente.nombre} ${cliente.apellido}</p>
                                    <p style="margin-bottom: 15px;"><strong>Teléfono:</strong> ${cliente.telefono}</p>
                                  </div>
                                  <div style="text-align: left;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Mensaje:</label>
                                    <textarea id="mensaje" 
                                      style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;" 
                                      placeholder="Escribe tu mensaje aquí..."
                                    ></textarea>
                                    <div style="margin-top: 10px;">
                                      <small style="color: #666;">💡 Plantillas rápidas:</small>
                                      <div style="margin-top: 8px;">
                                        <button type="button" onclick="document.getElementById('mensaje').value='Hola ${cliente.nombre}, esperamos verte pronto en nuestro restaurante. ¡Gracias por elegirnos!'" 
                                                style="margin-right: 8px; padding: 4px 8px; background: #e5e7eb; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                                          Saludo
                                        </button>
                                        <button type="button" onclick="document.getElementById('mensaje').value='${cliente.nombre}, tenemos una promoción especial para ti. ¡No te la pierdas!'" 
                                                style="margin-right: 8px; padding: 4px 8px; background: #e5e7eb; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                                          Promoción
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                `,
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonText: '📤 Enviar Mensaje',
                                cancelButtonText: '❌ Cancelar',
                                confirmButtonColor: '#10b981',
                                cancelButtonColor: '#6b7280',
                                width: 500,
                                preConfirm: () => {
                                  const mensaje = (document.getElementById('mensaje') as HTMLTextAreaElement)?.value.trim();
                                  if (!mensaje) {
                                    Swal.showValidationMessage('Por favor escribe un mensaje');
                                    return false;
                                  }
                                  return { mensaje };
                                }
                              }).then((result: any) => {
                                if (result.isConfirmed) {
                                  Swal.fire({
                                    title: '✅ Mensaje Enviado',
                                    text: `El mensaje ha sido enviado correctamente a ${cliente.nombre} ${cliente.apellido}`,
                                    icon: 'success',
                                    timer: 3000
                                  });
                                }
                              })}
                            >
                              <MessageSquare className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Mostrando {clientesFiltrados.length} de {clientesData.length} clientes
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => Swal.fire({
                      title: 'Página anterior',
                      text: 'Navegando a la página anterior',
                      icon: 'info',
                      timer: 1500
                    })}
                  >
                    Anterior
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => Swal.fire({
                      title: 'Página 1',
                      text: 'Mostrando página 1 de resultados',
                      icon: 'info',
                      timer: 1500
                    })}
                  >
                    1
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => Swal.fire({
                      title: 'Página 2',
                      text: 'Mostrando página 2 de resultados',
                      icon: 'info',
                      timer: 1500
                    })}
                  >
                    2
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => Swal.fire({
                      title: 'Página 3',
                      text: 'Mostrando página 3 de resultados',
                      icon: 'info',
                      timer: 1500
                    })}
                  >
                    3
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => Swal.fire({
                      title: 'Siguiente página',
                      text: 'Navegando a la siguiente página',
                      icon: 'info',
                      timer: 1500
                    })}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas por Segmento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <span>Acciones Rápidas WhatsApp</span>
                </CardTitle>
                <CardDescription>
                  Envía mensajes inmediatos a los clientes seleccionados o filtrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    <strong>📱 Envío Inmediato:</strong> Selecciona clientes de la tabla y envía mensajes WhatsApp al instante
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleQuickAction('Promoción Rápida WhatsApp')}>
                      <Gift className="w-3 h-3 mr-1" />
                      Promoción Rápida
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleQuickAction('Cumpleañeros WhatsApp')}>
                      <Cake className="w-3 h-3 mr-1" />
                      Cumpleañeros
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleQuickAction('Recordatorio WhatsApp')}>
                      <Clock className="w-3 h-3 mr-1" />
                      Recordatorio
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleQuickAction('Agradecer WhatsApp')}>
                      <Heart className="w-3 h-3 mr-1" />
                      Agradecer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span>Acciones Rápidas Email</span>
                </CardTitle>
                <CardDescription>
                  Envía emails inmediatos a segmentos específicos de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <strong>📧 Envío Inmediato:</strong> Selecciona clientes de la tabla y envía emails personalizados al instante
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={handleConfigureBrevo}>
                        <Settings className="w-3 h-3 mr-1" />
                        Configurar Brevo.com
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleQuickAction('Newsletter rápida Email')}>
                      <FileText className="w-3 h-3 mr-1" />
                      News Rápida
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleQuickAction('Email a segmento VIP')}>
                      <Target className="w-3 h-3 mr-1" />
                      Solo VIP
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleQuickAction('Invitación especial Email')}>
                      <Star className="w-3 h-3 mr-1" />
                      Invitación
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleQuickAction('Encuesta de satisfacción Email')}>
                      <Share2 className="w-3 h-3 mr-1" />
                      Encuesta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: Campañas */}
        <TabsContent value="campanas" className="space-y-6">
          {/* Banner Explicativo */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Megaphone className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-1">
                  🎯 Campañas Profesionales + Programadas
                </h3>
                <p className="text-sm text-orange-700 mb-2">
                  Aquí creas campañas <strong>programadas y elaboradas</strong> con diseño profesional, seguimiento completo y analytics avanzados.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-orange-600">
                  <span>✅ Editor visual de plantillas</span>
                  <span>✅ Programación fecha/hora</span>
                  <span>✅ A/B Testing automático</span>
                  <span>✅ Analytics y ROI detallado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tipos de Campañas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Campañas de email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium mb-4 transition-colors duration-200"
                  onClick={() => setShowEmailCampaignModal(true)}
                >
                  Ir a menú
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Campañas Masivas a Base de Datos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">15 campañas</div>
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={() => setShowHistorialModal(true)}
                >
                  Ver Historial
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Cumpleaños (Automatizada)</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Badge 
                  variant="outline" 
                  className={cumpleanosConfig.enabled ? "text-green-500 border-green-500 mb-4" : "text-orange-500 border-orange-500 mb-4"}
                >
                  {cumpleanosConfig.enabled ? 'Activa' : 'Aún Pendiente'}
                </Badge>
                <div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowCumpleanosConfigModal(true)}
                  >
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Reseña (Automatizada)</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Badge 
                  variant="outline" 
                  className={reviewConfig.enabled ? "text-green-500 border-green-500 mb-4" : "text-orange-500 border-orange-500 mb-4"}
                >
                  {reviewConfig.enabled ? 'Activa' : 'Aún Pendiente'}
                </Badge>
                <div>
                  <Button 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    onClick={() => setShowResenaConfigModal(true)}
                  >
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">ReCompra (Automatizada)</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Badge 
                  variant="outline" 
                  className={recompraConfig.enabled ? "text-green-500 border-green-500 mb-4" : "text-orange-500 border-orange-500 mb-4"}
                >
                  {recompraConfig.enabled ? 'Activa' : 'Aún Pendiente'}
                </Badge>
                <div>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setShowRecompraConfigModal(true)}
                  >
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Campañas por Whatsapp</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium mb-4 transition-colors duration-200"
                  onClick={() => setShowWhatsAppCampaignModal(true)}
                >
                  Ir a menú
                </Button>
                <div className="text-sm text-gray-600 mb-3">
                  Para activar esta función, debes enlazar tu WhatsApp Business.
                </div>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white font-medium mt-3 transition-colors duration-200"
                  onClick={() => window.open('/configuracion/whatsapp', '_blank')}
                >
                  Iniciar Suscripción
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Historial de Campañas */}
          <Card>
            <CardHeader>
              <CardTitle>ÚLTIMAS CAMPAÑAS MASIVAS REALIZADAS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Fecha / Hora</th>
                      <th className="text-left p-3">Canal</th>
                      <th className="text-left p-3">Base de Datos Utilizadas</th>
                      <th className="text-left p-3">Título (Solo para ti)</th>
                      <th className="text-left p-3">Estado</th>
                      <th className="text-left p-3">Métricas</th>
                      <th className="text-left p-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campanasData.map((campana) => (
                      <tr key={campana.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">
                          {campana.fechaEnvio ? new Date(campana.fechaEnvio).toLocaleDateString() : 'No enviada'}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{campana.canal}</Badge>
                        </td>
                        <td className="p-3 text-sm">WIFI, QR, Reservas</td>
                        <td className="p-3 text-sm font-medium">{campana.titulo}</td>
                        <td className="p-3">
                          <Badge 
                            variant={campana.estado === 'enviada' ? 'default' : 'secondary'}
                            className={campana.estado === 'enviada' ? 'bg-green-500' : ''}
                          >
                            {campana.estado}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs">
                          <div className="space-y-1">
                            <div>Enviados: {campana.enviados.toLocaleString()}</div>
                            <div>Leídos: {campana.leidos.toLocaleString()} ({((campana.leidos/campana.enviados)*100).toFixed(1)}%)</div>
                            <div>Clicks: {campana.clicks.toLocaleString()}</div>
                            <div>Conversiones: {campana.conversiones}</div>
                            <div className="font-semibold text-green-600">{formatCurrency(campana.ingresos)}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Button 
                            size="sm" 
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleViewCampaign(campana)}
                          >
                            VER
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Crear Campañas Programadas y Elaboradas */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Crear Campañas Programadas</CardTitle>
              <CardDescription>
                Diseña campañas profesionales con programación, seguimiento y análisis completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Megaphone className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-800 mb-1">
                      Diferencia: Campañas vs Acciones Rápidas
                    </h4>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• <strong>Campañas:</strong> Diseño completo, programación, seguimiento de métricas, A/B testing</li>
                      <li>• <strong>Acciones Rápidas:</strong> Envío inmediato a clientes seleccionados desde la Base de Datos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-24 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleCreateEmailCampaign}
                >
                  <Mail className="w-6 h-6 mb-2" />
                  <span className="font-semibold">Email Campaña</span>
                  <span className="text-xs opacity-90">Editor + Programación</span>
                </Button>
                
                <Button 
                  className="h-24 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleCreateWhatsAppCampaign}
                >
                  <MessageSquare className="w-6 h-6 mb-2" />
                  <span className="font-semibold">WhatsApp Campaña</span>
                  <span className="text-xs opacity-90">Plantillas + Timer</span>
                </Button>
                
                <Button 
                  className="h-24 flex flex-col items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleCreateAICampaign}
                >
                  <Target className="w-6 h-6 mb-2" />
                  <span className="font-semibold">Campaña IA</span>
                  <span className="text-xs opacity-90">Segmentación + Multi-canal</span>
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Funciones Avanzadas
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Programación por fecha/hora</li>
                    <li>• Editor visual de plantillas</li>
                    <li>• A/B Testing automático</li>
                    <li>• Seguimiento de conversiones</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-green-500" />
                    Analytics Incluidos
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tasa de apertura en tiempo real</li>
                    <li>• Click tracking detallado</li>
                    <li>• ROI por campaña</li>
                    <li>• Heat maps de interacción</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Automatizadas */}
        <TabsContent value="automatizadas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cumpleaños */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cake className="w-5 h-5 text-pink-500" />
                  <span>Cumpleaños</span>
                </CardTitle>
                <CardDescription>
                  Envío automático de felicitaciones y descuentos especiales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estado</span>
                    <Switch />
                  </div>
                  <div>
                    <Label className="text-sm">Descuento</Label>
                    <Input placeholder="20%" />
                  </div>
                  <div>
                    <Label className="text-sm">Días de anticipación</Label>
                    <Input placeholder="1" type="number" />
                  </div>
                  <Button className="w-full">Configurar Plantilla</Button>
                </div>
              </CardContent>
            </Card>

            {/* Reseñas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Solicitud de Reseñas</span>
                </CardTitle>
                <CardDescription>
                  Solicita automáticamente reseñas después de cada visita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estado</span>
                    <Switch 
                      checked={reviewConfig.enabled}
                      onCheckedChange={(checked) => setReviewConfig(prev => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Horas después de la llegada del cliente</Label>
                    <Input 
                      type="number" 
                      value={reviewConfig.horasDesdeVisita}
                      onChange={(e) => setReviewConfig(prev => ({ ...prev, horasDesdeVisita: parseInt(e.target.value) || 3 }))}
                      placeholder="3" 
                      min="1"
                      max="72"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ejemplo: Si el cliente llegó a las 14:00 y configuras 3 horas, la solicitud se enviará a las 17:00
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm">Mensaje de solicitud</Label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md resize-none"
                      rows={3}
                      value={reviewConfig.templateMensaje}
                      onChange={(e) => setReviewConfig(prev => ({ ...prev, templateMensaje: e.target.value }))}
                      placeholder="Personaliza el mensaje de solicitud de reseña..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Canal preferido</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>WhatsApp</option>
                      <option>Email</option>
                      <option>Ambos</option>
                    </select>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      Swal.fire({
                        title: '✅ ¡Configuración Guardada!',
                        text: 'La solicitud automática de reseñas ha sido configurada correctamente',
                        icon: 'success',
                        confirmButtonText: 'OK'
                      });
                    }}
                  >
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recompra */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Fidelización</span>
                </CardTitle>
                <CardDescription>
                  Incentiva el regreso de clientes que no han visitado recientemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estado</span>
                    <Switch />
                  </div>
                  <div>
                    <Label className="text-sm">Días sin visita</Label>
                    <Input placeholder="30" type="number" />
                  </div>
                  <div>
                    <Label className="text-sm">Incentivo</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>15% Descuento</option>
                      <option>Postre gratis</option>
                      <option>Bebida cortesía</option>
                    </select>
                  </div>
                  <Button className="w-full">Configurar Plantilla</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas de Campañas Automatizadas */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Campañas Automatizadas</CardTitle>
              <CardDescription>Últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">45</div>
                  <div className="text-sm text-gray-600">Cumpleaños enviados</div>
                  <div className="text-xs text-green-600">12 conversiones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">78</div>
                  <div className="text-sm text-gray-600">Reseñas solicitadas</div>
                  <div className="text-xs text-green-600">23 reseñas recibidas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">156</div>
                  <div className="text-sm text-gray-600">Recompras enviadas</div>
                  <div className="text-xs text-green-600">34 regresos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Proyecciones */}
        <TabsContent value="proyecciones" className="space-y-6">
          {/* Filtros de Fechas */}
          <Card>
            <CardHeader>
              <CardTitle>Proyecciones de Reservas e Ingresos</CardTitle>
              <CardDescription>
                Análisis predictivo basado en datos históricos y campañas activas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div>
                  <Label>Período</Label>
                  <select
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="semana">Esta Semana</option>
                    <option value="mes">Este Mes</option>
                    <option value="trimestre">Próximo Trimestre</option>
                    <option value="ano">Este Año</option>
                  </select>
                </div>
                <div>
                  <Label>Desde</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Hasta</Label>
                  <Input type="date" />
                </div>
                <div className="flex items-end">
                  <Button>
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>

              {/* Métricas de Proyección */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">271</div>
                    <div className="text-sm text-gray-600">Reservas Proyectadas</div>
                    <div className="text-xs text-green-600">+8% vs período anterior</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">6.37M</div>
                    <div className="text-sm text-gray-600">Ingresos Proyectados</div>
                    <div className="text-xs text-green-600">+12% vs período anterior</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">23.5K</div>
                    <div className="text-sm text-gray-600">Ticket Promedio</div>
                    <div className="text-xs text-orange-600">+3% vs período anterior</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">85%</div>
                    <div className="text-sm text-gray-600">Ocupación Estimada</div>
                    <div className="text-xs text-green-600">Óptimo</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Proyección */}
          <Card>
            <CardHeader>
              <CardTitle>Proyección de Reservas e Ingresos - Próximos 7 Días</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={proyeccionReservas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="fecha" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
                    formatter={(value: any, name: string) => [
                      name === 'reservas' ? `${value} reservas` : formatCurrency(value),
                      name === 'reservas' ? 'Reservas' : 'Ingresos'
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="reservas" fill="#8B5CF6" opacity={0.7} />
                  <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Factores de Influencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Factores que Influyen las Proyecciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Campañas WhatsApp activas</span>
                    <Badge className="bg-green-500">+15%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cumpleaños del mes</span>
                    <Badge className="bg-pink-500">+8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fin de semana</span>
                    <Badge className="bg-blue-500">+25%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estacionalidad</span>
                    <Badge className="bg-orange-500">+5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Promociones vigentes</span>
                    <Badge className="bg-purple-500">+12%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Óptimo</span>
                    </div>
                    <p className="text-xs text-green-600">
                      La ocupación proyectada del 85% es ideal. Mantén las campañas actuales.
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">Oportunidad</span>
                    </div>
                    <p className="text-xs text-yellow-600">
                      Martes y miércoles tienen menos reservas. Considera promociones especiales.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">Crecimiento</span>
                    </div>
                    <p className="text-xs text-blue-600">
                      El ticket promedio está creciendo. Considera ampliar la carta premium.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Botón Flotante para Realizar Campaña */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-medium transition-colors duration-200"
          onClick={() => {
            setActiveTab('campanas');
          }}
        >
          <Megaphone className="w-5 h-5 mr-2" />
          Realizar Campaña
        </Button>
      </div>

      {/* Modal: Crear Campaña de Email */}
      {showEmailCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Crear Campaña de Email
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowEmailCampaignModal(false)}>✕</Button>
            </div>

            <div className="space-y-4">
              {!brevoConfig.isConfigured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 mb-2">
                    ⚠️ Necesitas configurar Brevo.com para enviar campañas de email
                  </p>
                  <Button size="sm" variant="outline" onClick={handleConfigureBrevo}>
                    Configurar Brevo
                  </Button>
                </div>
              )}

              <div>
                <Label htmlFor="email-titulo">Título de la Campaña</Label>
                <Input
                  id="email-titulo"
                  value={emailCampaignForm.titulo}
                  onChange={(e) => setEmailCampaignForm(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ej: Newsletter Septiembre 2024"
                />
              </div>

              <div>
                <Label htmlFor="email-asunto">Asunto del Email</Label>
                <Input
                  id="email-asunto"
                  value={emailCampaignForm.asunto}
                  onChange={(e) => setEmailCampaignForm(prev => ({ ...prev, asunto: e.target.value }))}
                  placeholder="Ej: ¡Nuevos platos especiales este mes!"
                />
              </div>

              <div>
                <Label htmlFor="email-contenido">Contenido del Email</Label>
                <div style={{ height: '200px' }}>
                  <Suspense fallback={<div className="h-[150px] bg-gray-50 rounded-md flex items-center justify-center">Cargando editor...</div>}>
                    <ReactQuill
                      value={emailCampaignForm.contenido}
                      onChange={(content) => setEmailCampaignForm(prev => ({ ...prev, contenido: content }))}
                      style={{ height: '150px' }}
                      theme="snow"
                      placeholder="Escribe aquí el contenido de tu email..."
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ]
                      }}
                    />
                  </Suspense>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-fecha">Fecha de Envío</Label>
                  <Input
                    id="email-fecha"
                    type="date"
                    value={emailCampaignForm.fechaEnvio}
                    onChange={(e) => setEmailCampaignForm(prev => ({ ...prev, fechaEnvio: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email-hora">Hora de Envío</Label>
                  <Input
                    id="email-hora"
                    type="time"
                    value={emailCampaignForm.horaEnvio}
                    onChange={(e) => setEmailCampaignForm(prev => ({ ...prev, horaEnvio: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email-segmento">Segmento de Clientes</Label>
                <select
                  id="email-segmento"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={emailCampaignForm.segmento}
                  onChange={(e) => setEmailCampaignForm(prev => ({ ...prev, segmento: e.target.value }))}
                >
                  <option value="todos">Todos los clientes</option>
                  <option value="activos">Solo clientes activos</option>
                  <option value="vip">Clientes VIP</option>
                  <option value="cumpleanos">Cumpleañeros del mes</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEmailCampaignModal(false)} 
                  className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveEmailCampaign} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                >
                  Crear Campaña
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Crear Campaña de WhatsApp */}
      {showWhatsAppCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Crear Campaña de WhatsApp
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowWhatsAppCampaignModal(false)}>✕</Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="whatsapp-titulo">Título de la Campaña</Label>
                <Input
                  id="whatsapp-titulo"
                  value={whatsappCampaignForm.titulo}
                  onChange={(e) => setWhatsappCampaignForm(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ej: Promoción Fin de Semana"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp-mensaje">Mensaje de WhatsApp</Label>
                <textarea
                  id="whatsapp-mensaje"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={6}
                  value={whatsappCampaignForm.mensaje}
                  onChange={(e) => setWhatsappCampaignForm(prev => ({ ...prev, mensaje: e.target.value }))}
                  placeholder="Escribe aquí tu mensaje de WhatsApp..."
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {whatsappCampaignForm.mensaje.length}/1000 caracteres
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="incluir-imagen"
                  checked={whatsappCampaignForm.incluirImagen}
                  onChange={(e) => setWhatsappCampaignForm(prev => ({ ...prev, incluirImagen: e.target.checked }))}
                />
                <Label htmlFor="incluir-imagen">Incluir imagen</Label>
              </div>

              {whatsappCampaignForm.incluirImagen && (
                <div>
                  <Label htmlFor="url-imagen">URL de la imagen</Label>
                  <Input
                    id="url-imagen"
                    value={whatsappCampaignForm.urlImagen}
                    onChange={(e) => setWhatsappCampaignForm(prev => ({ ...prev, urlImagen: e.target.value }))}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsapp-fecha">Fecha de Envío</Label>
                  <Input
                    id="whatsapp-fecha"
                    type="date"
                    value={whatsappCampaignForm.fechaEnvio}
                    onChange={(e) => setWhatsappCampaignForm(prev => ({ ...prev, fechaEnvio: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp-hora">Hora de Envío</Label>
                  <Input
                    id="whatsapp-hora"
                    type="time"
                    value={whatsappCampaignForm.horaEnvio}
                    onChange={(e) => setWhatsappCampaignForm(prev => ({ ...prev, horaEnvio: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp-segmento">Segmento de Clientes</Label>
                <select
                  id="whatsapp-segmento"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={whatsappCampaignForm.segmento}
                  onChange={(e) => setWhatsappCampaignForm(prev => ({ ...prev, segmento: e.target.value }))}
                >
                  <option value="todos">Todos los clientes</option>
                  <option value="activos">Solo clientes activos</option>
                  <option value="vip">Clientes VIP</option>
                  <option value="cumpleanos">Cumpleañeros del mes</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowWhatsAppCampaignModal(false)} 
                  className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveWhatsAppCampaign} 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200"
                >
                  Crear Campaña
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configurar Brevo */}
      {showBrevoConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Settings className="w-5 h-5 mr-2 text-orange-600" />
                Configurar Brevo.com
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowBrevoConfigModal(false)}>✕</Button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📧 Integración con Brevo</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Brevo (anteriormente Sendinblue) es la plataforma que utilizamos para enviar campañas de email marketing profesionales.
                </p>
                <p className="text-xs text-blue-700">
                  Necesitas una cuenta en Brevo.com y tu API Key para configurar el envío de emails.
                </p>
              </div>

              <div>
                <Label htmlFor="brevo-api-key">API Key de Brevo</Label>
                <Input
                  id="brevo-api-key"
                  type="password"
                  value={brevoConfig.apiKey}
                  onChange={(e) => setBrevoConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="v3-xxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obtén tu API Key desde tu cuenta de Brevo → SMTP & API → API Keys
                </p>
              </div>

              <div>
                <Label htmlFor="brevo-sender-email">Email del Remitente</Label>
                <Input
                  id="brevo-sender-email"
                  type="email"
                  value={brevoConfig.senderEmail}
                  onChange={(e) => setBrevoConfig(prev => ({ ...prev, senderEmail: e.target.value }))}
                  placeholder="noreply@turestaurante.com"
                />
              </div>

              <div>
                <Label htmlFor="brevo-sender-name">Nombre del Remitente</Label>
                <Input
                  id="brevo-sender-name"
                  value={brevoConfig.senderName}
                  onChange={(e) => setBrevoConfig(prev => ({ ...prev, senderName: e.target.value }))}
                  placeholder="Mi Restaurante"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={() => setShowBrevoConfigModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSaveBrevoConfig} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Agregar Cliente */}
      {showClienteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Agregar Cliente
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowClienteModal(false)}>✕</Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente-nombre">Nombre</Label>
                  <Input
                    id="cliente-nombre"
                    value={clienteForm.nombre}
                    onChange={(e) => setClienteForm(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <Label htmlFor="cliente-apellido">Apellido</Label>
                  <Input
                    id="cliente-apellido"
                    value={clienteForm.apellido}
                    onChange={(e) => setClienteForm(prev => ({ ...prev, apellido: e.target.value }))}
                    placeholder="Pérez"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cliente-email">Email</Label>
                <Input
                  id="cliente-email"
                  type="email"
                  value={clienteForm.email}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="juan@email.com"
                />
              </div>

              <div>
                <Label htmlFor="cliente-telefono">Teléfono</Label>
                <Input
                  id="cliente-telefono"
                  value={clienteForm.telefono}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div>
                <Label htmlFor="cliente-nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="cliente-nacimiento"
                  type="date"
                  value={clienteForm.fechaNacimiento}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="cliente-canal">Canal de Origen</Label>
                <select
                  id="cliente-canal"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={clienteForm.canal}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, canal: e.target.value as any }))}
                >
                  <option value="qr">Código QR</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="reserva">Reserva Directa</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={() => setShowClienteModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSaveCliente} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Agregar Cliente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Campaña IA */}
      {showAICampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Campaña con IA
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowAICampaignModal(false)}>✕</Button>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">🤖 Campaña Inteligente</h4>
                <p className="text-sm text-purple-800 mb-2">
                  La IA analizará tu base de clientes y creará campañas personalizadas automáticamente.
                </p>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Segmentación automática por comportamiento</li>
                  <li>• Mensajes personalizados por cliente</li>
                  <li>• Horarios optimizados de envío</li>
                  <li>• A/B testing automático</li>
                </ul>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-gray-600 mb-4">Esta funcionalidad estará disponible próximamente</p>
                <Button variant="outline" onClick={() => setShowAICampaignModal(false)}>
                  Entendido
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalles de Campaña */}
      {showCampaignDetailModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-600" />
                Detalles de Campaña
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowCampaignDetailModal(false)}>✕</Button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">{selectedCampaign.titulo}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Canal:</span>
                    <Badge variant="outline" className="ml-2">{selectedCampaign.canal}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <Badge 
                      className={`ml-2 ${
                        selectedCampaign.estado === 'enviada' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedCampaign.estado === 'programada' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedCampaign.estado}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de creación:</span>
                    <span className="ml-2">{new Date(selectedCampaign.fechaCreacion).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de envío:</span>
                    <span className="ml-2">
                      {selectedCampaign.fechaEnvio ? new Date(selectedCampaign.fechaEnvio).toLocaleDateString() : 'No enviada'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedCampaign.destinatarios.toLocaleString()}</div>
                  <div className="text-xs text-blue-800">Destinatarios</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedCampaign.enviados.toLocaleString()}</div>
                  <div className="text-xs text-green-800">Enviados</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{selectedCampaign.leidos.toLocaleString()}</div>
                  <div className="text-xs text-yellow-800">Leídos</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedCampaign.clicks.toLocaleString()}</div>
                  <div className="text-xs text-purple-800">Clicks</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2">📊 Resultados</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-green-700">Conversiones:</span>
                    <span className="ml-2 font-bold">{selectedCampaign.conversiones}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Ingresos Generados:</span>
                    <span className="ml-2 font-bold text-green-600">{formatCurrency(selectedCampaign.ingresos)}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Tasa de Apertura:</span>
                    <span className="ml-2 font-bold">
                      {((selectedCampaign.leidos / selectedCampaign.enviados) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Tasa de Click:</span>
                    <span className="ml-2 font-bold">
                      {((selectedCampaign.clicks / selectedCampaign.leidos) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={() => setShowCampaignDetailModal(false)} className="flex-1">
                  Cerrar
                </Button>
                <Button 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    Swal.fire({
                      title: '📋 Generar Reporte',
                      text: 'Generando reporte detallado de la campaña...',
                      icon: 'info',
                      confirmButtonText: 'OK'
                    });
                  }}
                >
                  Generar Reporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Historial de Campañas */}
      {showHistorialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Historial Completo de Campañas
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowHistorialModal(false)}>✕</Button>
            </div>

            <div className="space-y-6">
              {/* Filtros */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Filtros</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Fecha desde</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label>Fecha hasta</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label>Canal</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1">
                      <option value="">Todos</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1">
                      <option value="">Todos</option>
                      <option value="enviada">Enviada</option>
                      <option value="programada">Programada</option>
                      <option value="borrador">Borrador</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Estadísticas Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Total Enviadas</div>
                    <div className="text-2xl font-bold text-blue-600">42</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Tasa Apertura Promedio</div>
                    <div className="text-2xl font-bold text-green-600">74.2%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Conversiones Totales</div>
                    <div className="text-2xl font-bold text-purple-600">287</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Ingresos Totales</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(6780000)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabla de Historial */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Fecha/Hora</th>
                      <th className="text-left p-3">Campaña</th>
                      <th className="text-left p-3">Canal</th>
                      <th className="text-left p-3">Estado</th>
                      <th className="text-left p-3">Destinatarios</th>
                      <th className="text-left p-3">Enviados</th>
                      <th className="text-left p-3">Apertura</th>
                      <th className="text-left p-3">Clicks</th>
                      <th className="text-left p-3">Conversiones</th>
                      <th className="text-left p-3">Ingresos</th>
                      <th className="text-left p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campanasData.map((campana) => (
                      <tr key={campana.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">
                          {campana.fechaEnvio ? new Date(campana.fechaEnvio).toLocaleDateString() : 'No enviada'}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{campana.titulo}</div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{campana.canal}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant={campana.estado === 'enviada' ? 'default' : 'secondary'}
                            className={campana.estado === 'enviada' ? 'bg-green-500' : ''}
                          >
                            {campana.estado}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">{campana.destinatarios.toLocaleString()}</td>
                        <td className="p-3 text-sm">{campana.enviados.toLocaleString()}</td>
                        <td className="p-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <span>{campana.leidos.toLocaleString()}</span>
                            <span className="text-green-600">({((campana.leidos/campana.enviados)*100).toFixed(1)}%)</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{campana.clicks.toLocaleString()}</td>
                        <td className="p-3 text-sm">{campana.conversiones}</td>
                        <td className="p-3 text-sm font-semibold text-green-600">{formatCurrency(campana.ingresos)}</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewCampaign(campana)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={() => setShowHistorialModal(false)}>
                  Cerrar
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Excel
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configurar Cumpleaños */}
      {showCumpleanosConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Cake className="w-5 h-5 mr-2 text-pink-600" />
                Configurar Campañas de Cumpleaños
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowCumpleanosConfigModal(false)}>✕</Button>
            </div>

            <div className="space-y-6">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h4 className="font-semibold text-pink-900 mb-2">🎂 Campañas Automáticas de Cumpleaños</h4>
                <p className="text-sm text-pink-800">
                  Envía automáticamente mensajes de cumpleaños a tus clientes con descuentos especiales para fidelizar y aumentar las visitas.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Switch 
                  checked={cumpleanosConfig.enabled}
                  onCheckedChange={(checked) => setCumpleanosConfig(prev => ({ ...prev, enabled: checked }))}
                />
                <Label className="font-medium">Activar campañas de cumpleaños automáticas</Label>
              </div>

              {cumpleanosConfig.enabled && (
                <div className="space-y-4 pl-6 border-l-2 border-pink-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dias-antes">Días antes del cumpleaños</Label>
                      <Input
                        id="dias-antes"
                        type="number"
                        min="0"
                        max="7"
                        value={cumpleanosConfig.diasAntes}
                        onChange={(e) => setCumpleanosConfig(prev => ({ ...prev, diasAntes: parseInt(e.target.value) }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">0 = el mismo día</p>
                    </div>
                    <div>
                      <Label htmlFor="hora-envio">Hora de envío</Label>
                      <Input
                        id="hora-envio"
                        type="time"
                        value={cumpleanosConfig.horaEnvio}
                        onChange={(e) => setCumpleanosConfig(prev => ({ ...prev, horaEnvio: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="template-mensaje">Mensaje del cumpleaños</Label>
                    <textarea
                      id="template-mensaje"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 mt-1"
                      value={cumpleanosConfig.templateMensaje}
                      onChange={(e) => setCumpleanosConfig(prev => ({ ...prev, templateMensaje: e.target.value }))}
                      placeholder="Mensaje personalizado..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Usa {'{nombre}'} para personalizar con el nombre del cliente</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="descuento-porcentaje">Porcentaje de descuento (%)</Label>
                      <Input
                        id="descuento-porcentaje"
                        type="number"
                        min="5"
                        max="50"
                        value={cumpleanosConfig.descuentoPorcentaje}
                        onChange={(e) => setCumpleanosConfig(prev => ({ ...prev, descuentoPorcentaje: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="validez-dias">Validez del descuento (días)</Label>
                      <Input
                        id="validez-dias"
                        type="number"
                        min="7"
                        max="60"
                        value={cumpleanosConfig.validezDias}
                        onChange={(e) => setCumpleanosConfig(prev => ({ ...prev, validezDias: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={cumpleanosConfig.incluirImagen}
                      onCheckedChange={(checked) => setCumpleanosConfig(prev => ({ ...prev, incluirImagen: checked }))}
                    />
                    <Label>Incluir imagen de cumpleaños</Label>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={() => setShowCumpleanosConfigModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => {
                    Swal.fire({
                      title: '✅ Configuración Guardada',
                      text: 'Las campañas automáticas de cumpleaños han sido configuradas exitosamente',
                      icon: 'success',
                      confirmButtonText: 'OK'
                    });
                    setShowCumpleanosConfigModal(false);
                  }}
                >
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configurar Reseñas */}
      {showResenaConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                Configurar Solicitud de Reseñas
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowResenaConfigModal(false)}>✕</Button>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">⭐ Solicitud Automática de Reseñas</h4>
                <p className="text-sm text-yellow-800">
                  Después de cada visita, solicita automáticamente a tus clientes que dejen una reseña en Google, TripAdvisor o redes sociales.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Switch 
                  checked={reviewConfig.enabled}
                  onCheckedChange={(checked) => setReviewConfig(prev => ({ ...prev, enabled: checked }))}
                />
                <Label className="font-medium">Activar solicitud automática de reseñas</Label>
              </div>

              {reviewConfig.enabled && (
                <div className="space-y-4 pl-6 border-l-2 border-yellow-200">
                  <div>
                    <Label htmlFor="horas-desde-visita">Horas después de la visita</Label>
                    <Input
                      id="horas-desde-visita"
                      type="number"
                      min="1"
                      max="72"
                      value={reviewConfig.horasDesdeVisita}
                      onChange={(e) => setReviewConfig(prev => ({ ...prev, horasDesdeVisita: parseInt(e.target.value) }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Tiempo de espera antes de enviar la solicitud</p>
                  </div>

                  <div>
                    <Label htmlFor="template-mensaje-resena">Mensaje de solicitud</Label>
                    <textarea
                      id="template-mensaje-resena"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 mt-1"
                      value={reviewConfig.templateMensaje}
                      onChange={(e) => setReviewConfig(prev => ({ ...prev, templateMensaje: e.target.value }))}
                      placeholder="Mensaje para solicitar reseña..."
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Enlaces de Reseñas</h5>
                    <div className="space-y-3">
                      <div>
                        <Label>Google My Business</Label>
                        <Input placeholder="https://g.page/r/..." className="mt-1" />
                      </div>
                      <div>
                        <Label>TripAdvisor</Label>
                        <Input placeholder="https://www.tripadvisor.com/..." className="mt-1" />
                      </div>
                      <div>
                        <Label>Facebook</Label>
                        <Input placeholder="https://www.facebook.com/..." className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={() => setShowResenaConfigModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => {
                    Swal.fire({
                      title: '✅ Configuración Guardada',
                      text: 'La solicitud automática de reseñas ha sido configurada exitosamente',
                      icon: 'success',
                      confirmButtonText: 'OK'
                    });
                    setShowResenaConfigModal(false);
                  }}
                >
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configurar ReCompra */}
      {showRecompraConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Configurar Campañas de ReCompra
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowRecompraConfigModal(false)}>✕</Button>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">💝 Campañas de Fidelización</h4>
                <p className="text-sm text-red-800">
                  Recupera clientes que no han visitado tu restaurante en un tiempo determinado con ofertas especiales y mensajes personalizados.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Switch 
                  checked={recompraConfig.enabled}
                  onCheckedChange={(checked) => setRecompraConfig(prev => ({ ...prev, enabled: checked }))}
                />
                <Label className="font-medium">Activar campañas de recompra automáticas</Label>
              </div>

              {recompraConfig.enabled && (
                <div className="space-y-4 pl-6 border-l-2 border-red-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dias-sin-visita">Días sin visita</Label>
                      <Input
                        id="dias-sin-visita"
                        type="number"
                        min="15"
                        max="180"
                        value={recompraConfig.diasSinVisita}
                        onChange={(e) => setRecompraConfig(prev => ({ ...prev, diasSinVisita: parseInt(e.target.value) }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">Tiempo sin visita para activar campaña</p>
                    </div>
                    <div>
                      <Label htmlFor="frecuencia-envio">Frecuencia de envío</Label>
                      <select
                        id="frecuencia-envio"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={recompraConfig.frecuenciaEnvio}
                        onChange={(e) => setRecompraConfig(prev => ({ ...prev, frecuenciaEnvio: e.target.value }))}
                      >
                        <option value="semanal">Semanal</option>
                        <option value="quincenal">Quincenal</option>
                        <option value="mensual">Mensual</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="template-mensaje-recompra">Mensaje de recompra</Label>
                    <textarea
                      id="template-mensaje-recompra"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 mt-1"
                      value={recompraConfig.templateMensaje}
                      onChange={(e) => setRecompraConfig(prev => ({ ...prev, templateMensaje: e.target.value }))}
                      placeholder="Mensaje para invitar a regresar..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Usa {'{nombre}'} para personalizar con el nombre del cliente</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="descuento-porcentaje-recompra">Descuento (%)</Label>
                      <Input
                        id="descuento-porcentaje-recompra"
                        type="number"
                        min="5"
                        max="30"
                        value={recompraConfig.descuentoPorcentaje}
                        onChange={(e) => setRecompraConfig(prev => ({ ...prev, descuentoPorcentaje: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="validez-dias-recompra">Validez (días)</Label>
                      <Input
                        id="validez-dias-recompra"
                        type="number"
                        min="7"
                        max="30"
                        value={recompraConfig.validezDias}
                        onChange={(e) => setRecompraConfig(prev => ({ ...prev, validezDias: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-envios">Máx. envíos</Label>
                      <Input
                        id="max-envios"
                        type="number"
                        min="1"
                        max="10"
                        value={recompraConfig.maxEnvios}
                        onChange={(e) => setRecompraConfig(prev => ({ ...prev, maxEnvios: parseInt(e.target.value) }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">Por cliente</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={() => setShowRecompraConfigModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    Swal.fire({
                      title: '✅ Configuración Guardada',
                      text: 'Las campañas de recompra han sido configuradas exitosamente',
                      icon: 'success',
                      confirmButtonText: 'OK'
                    });
                    setShowRecompraConfigModal(false);
                  }}
                >
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
