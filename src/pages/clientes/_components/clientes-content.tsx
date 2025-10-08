

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MobileOptimizedTable from '@/components/mobile-optimized-table';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  TrendingUp,
  Heart,
  Gift,
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  UserPlus,
  Crown,
  Zap
} from 'lucide-react';
import Swal from 'sweetalert2';

// Datos de ejemplo para clientes
const clientesData = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+57 300 123 4567',
    fechaRegistro: '2024-01-15',
    ultimaVisita: '2024-09-10',
    totalVisitas: 15,
    gastoTotal: 450000,
    gastoPromedio: 30000,
    categoría: 'VIP',
    preferencias: ['Terraza', 'Cena romántica', 'Vino tinto'],
    cumpleanos: '1985-06-12',
    notas: 'Cliente frecuente, prefiere mesa con vista',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria.garcia@email.com',
    telefono: '+57 301 234 5678',
    fechaRegistro: '2024-02-20',
    ultimaVisita: '2024-09-12',
    totalVisitas: 8,
    gastoTotal: 240000,
    gastoPromedio: 30000,
    categoría: 'Regular',
    preferencias: ['Almuerzo ejecutivo', 'Zona interior'],
    cumpleanos: '1990-03-25',
    notas: 'Siempre puntual, vegetariana',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 3,
    nombre: 'Carlos López',
    email: 'carlos.lopez@email.com',
    telefono: '+57 302 345 6789',
    fechaRegistro: '2024-03-10',
    ultimaVisita: '2024-09-08',
    totalVisitas: 22,
    gastoTotal: 680000,
    gastoPromedio: 31000,
    categoría: 'VIP',
    preferencias: ['Cenas de negocios', 'Zona VIP', 'Whisky'],
    cumpleanos: '1978-11-08',
    notas: 'Cliente corporativo, siempre reserva para grupos',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 4,
    nombre: 'Ana Martín',
    email: 'ana.martin@email.com',
    telefono: '+57 303 456 7890',
    fechaRegistro: '2024-05-05',
    ultimaVisita: '2024-09-11',
    totalVisitas: 5,
    gastoTotal: 125000,
    gastoPromedio: 25000,
    categoría: 'Nuevo',
    preferencias: ['Brunch', 'Terraza'],
    cumpleanos: '1995-07-18',
    notas: 'Cliente joven, activa en redes sociales',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 5,
    nombre: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    telefono: '+57 304 567 8901',
    fechaRegistro: '2023-12-01',
    ultimaVisita: '2024-09-09',
    totalVisitas: 35,
    gastoTotal: 1200000,
    gastoPromedio: 34000,
    categoría: 'VIP',
    preferencias: ['Cena familiar', 'Zona interior', 'Parrilla'],
    cumpleanos: '1972-04-30',
    notas: 'Cliente fundador, muy leal',
    avatar: '/api/placeholder/40/40'
  },
];

const estadisticasClientes = {
  totalClientes: 247,
  clientesVIP: 45,
  clientesRegulares: 156,
  clientesNuevos: 46,
  promedioVisitasMes: 3.2,
  satisfaccionPromedio: 4.7,
  ticketPromedio: 32000,
  retencion: 85
};

const categorias = [
  { nombre: 'VIP', color: 'bg-purple-100 text-purple-800', icon: Crown },
  { nombre: 'Regular', color: 'bg-blue-100 text-blue-800', icon: Users },
  { nombre: 'Nuevo', color: 'bg-green-100 text-green-800', icon: UserPlus }
];

export default function ClientesContent() {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActiva, setVistaActiva] = useState('lista');

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'Nuevo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'VIP': return <Crown className="w-3 h-3" />;
      case 'Regular': return <Users className="w-3 h-3" />;
      case 'Nuevo': return <UserPlus className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  const clientesFiltrados = clientesData.filter(cliente => {
    const cumpleBusqueda = cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
                          cliente.telefono.includes(busqueda);
    const cumpleCategoria = filtroCategoria === 'todas' || cliente.categoría === filtroCategoria;
    
    return cumpleBusqueda && cumpleCategoria;
  });

  const handleNuevoCliente = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Nuevo Cliente',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium mb-2">Nombre Completo</label>
            <input id="nombre" class="swal2-input" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input id="email" type="email" class="swal2-input" placeholder="cliente@email.com" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Teléfono</label>
            <input id="telefono" class="swal2-input" placeholder="+57 300 123 4567" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Fecha de Cumpleaños</label>
            <input id="cumpleanos" type="date" class="swal2-input" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Notas</label>
            <textarea id="notas" class="swal2-textarea" placeholder="Preferencias, alergias, etc."></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear Cliente',
      cancelButtonText: 'Cancelar',
      width: 600,
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement)?.value;
        const email = (document.getElementById('email') as HTMLInputElement)?.value;
        const telefono = (document.getElementById('telefono') as HTMLInputElement)?.value;
        
        if (!nombre || !email || !telefono) {
          Swal.showValidationMessage('Por favor completa los campos obligatorios');
          return false;
        }
        
        return {
          nombre,
          email,
          telefono,
          cumpleanos: (document.getElementById('cumpleanos') as HTMLInputElement)?.value,
          notas: (document.getElementById('notas') as HTMLTextAreaElement)?.value,
        }
      }
    });

    if (formValues) {
      await Swal.fire({
        title: '¡Cliente Creado!',
        text: `${formValues.nombre} ha sido agregado exitosamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleEditarCliente = async (cliente: any) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Cliente',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium mb-2">Nombre Completo</label>
            <input id="nombre" class="swal2-input" value="${cliente.nombre}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input id="email" type="email" class="swal2-input" value="${cliente.email}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Teléfono</label>
            <input id="telefono" class="swal2-input" value="${cliente.telefono}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Categoría</label>
            <select id="categoria" class="swal2-select">
              <option value="Nuevo" ${cliente.categoría === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
              <option value="Regular" ${cliente.categoría === 'Regular' ? 'selected' : ''}>Regular</option>
              <option value="VIP" ${cliente.categoría === 'VIP' ? 'selected' : ''}>VIP</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Notas</label>
            <textarea id="notas" class="swal2-textarea">${cliente.notas}</textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      width: 600,
      preConfirm: () => {
        return {
          nombre: (document.getElementById('nombre') as HTMLInputElement)?.value,
          email: (document.getElementById('email') as HTMLInputElement)?.value,
          telefono: (document.getElementById('telefono') as HTMLInputElement)?.value,
          categoria: (document.getElementById('categoria') as HTMLSelectElement)?.value,
          notas: (document.getElementById('notas') as HTMLTextAreaElement)?.value,
        }
      }
    });

    if (formValues) {
      await Swal.fire({
        title: '¡Cliente Actualizado!',
        text: `Los datos de ${formValues.nombre} han sido actualizados`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleEnviarMensaje = async (cliente: any) => {
    const { value: mensaje } = await Swal.fire({
      title: `Enviar Mensaje a ${cliente.nombre}`,
      html: `
        <div class="text-left space-y-4">
          <div class="bg-gray-50 p-3 rounded">
            <p class="text-sm"><strong>Cliente:</strong> ${cliente.nombre}</p>
            <p class="text-sm"><strong>Teléfono:</strong> ${cliente.telefono}</p>
            <p class="text-sm"><strong>Email:</strong> ${cliente.email}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Mensaje</label>
            <textarea id="mensaje" class="swal2-textarea" style="min-height: 120px; resize: vertical; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; font-size: 0.875rem; line-height: 1.25rem;" placeholder="Escribe tu mensaje aquí..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="swal2-styled swal2-default-outline" style="display: inline-block; background-color: rgba(0,0,0,0); color: #313131; border: 1px solid rgba(0,0,0,0.2); border-radius: 0.25rem; padding: 0.375rem 0.75rem; font-size: 0.875rem; line-height: 1.5rem; text-align: center; cursor: pointer;" onclick="document.getElementById('mensaje').value = '¡Hola! Tenemos una promoción especial para ti.'">Promoción</button>
            <button type="button" class="swal2-styled swal2-default-outline" style="display: inline-block; background-color: rgba(0,0,0,0); color: #313131; border: 1px solid rgba(0,0,0,0.2); border-radius: 0.25rem; padding: 0.375rem 0.75rem; font-size: 0.875rem; line-height: 1.5rem; text-align: center; cursor: pointer;" onclick="document.getElementById('mensaje').value = 'Recordatorio: Tienes una reserva confirmada.'">Recordatorio</button>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enviar Mensaje',
      cancelButtonText: 'Cancelar',
      width: 600,
      preConfirm: () => {
        const mensaje = (document.getElementById('mensaje') as HTMLTextAreaElement)?.value;
        if (!mensaje) {
          Swal.showValidationMessage('Por favor escribe un mensaje');
          return false;
        }
        return mensaje;
      }
    });

    if (mensaje) {
      await Swal.fire({
        title: '¡Mensaje Enviado!',
        text: `Mensaje enviado exitosamente a ${cliente.nombre}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleExportarCSV = () => {
    const headers = ['Nombre', 'Email', 'Teléfono', 'Categoría', 'Total Visitas', 'Gasto Total', 'Última Visita'];
    const csvData = clientesData.map(cliente => [
      cliente.nombre,
      cliente.email,
      cliente.telefono,
      cliente.categoría,
      cliente.totalVisitas,
      cliente.gastoTotal,
      cliente.ultimaVisita
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    Swal.fire({
      title: '¡Exportado!',
      text: 'Base de datos de clientes exportada exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6 p-3 lg:p-6">
      {/* Header - Mobile Optimized */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:justify-between lg:items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
            <span className="hidden sm:inline">Gestión de Clientes</span>
            <span className="sm:hidden">Clientes</span>
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">
            <span className="hidden sm:inline">Base de datos integral de clientes</span>
            <span className="sm:hidden">Base de datos</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportarCSV}
            className="text-green-600 border-green-600 hover:bg-green-50 h-9 lg:h-10 text-sm btn-mobile"
          >
            <Download className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
          <Button 
            onClick={handleNuevoCliente}
            className="bg-blue-600 hover:bg-blue-700 text-white h-9 lg:h-10 text-sm btn-mobile"
          >
            <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas - Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm text-gray-600">
                  <span className="hidden sm:inline">Total Clientes</span>
                  <span className="sm:hidden">Total</span>
                </p>
                <p className="text-lg lg:text-2xl font-bold text-blue-600">{estadisticasClientes.totalClientes}</p>
              </div>
              <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm text-gray-600">
                  <span className="hidden sm:inline">Clientes VIP</span>
                  <span className="sm:hidden">VIP</span>
                </p>
                <p className="text-lg lg:text-2xl font-bold text-purple-600">{estadisticasClientes.clientesVIP}</p>
              </div>
              <Crown className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Promedio</p>
                <p className="text-2xl font-bold text-green-600">${estadisticasClientes.ticketPromedio.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retención</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticasClientes.retencion}%</p>
              </div>
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principal */}
      <Tabs value={vistaActiva} onValueChange={setVistaActiva} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lista">Lista de Clientes</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="segmentacion">Segmentación</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las categorías</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Nuevo">Nuevo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Clientes */}
          <div className="grid gap-4">
            {clientesFiltrados.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={cliente.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-lg">
                          {cliente.nombre.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{cliente.nombre}</h3>
                          <Badge variant="outline" className={`${getCategoriaColor(cliente.categoría)} flex items-center gap-1`}>
                            {getCategoriaIcon(cliente.categoría)}
                            {cliente.categoría}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{cliente.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{cliente.telefono}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Última visita: {cliente.ultimaVisita}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{cliente.totalVisitas} visitas</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-green-600">
                        ${cliente.gastoTotal.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Promedio: ${cliente.gastoPromedio.toLocaleString()}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditarCliente(cliente)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleEnviarMensaje(cliente)}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Mensaje
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Preferencias y Notas */}
                  {(cliente.preferencias.length > 0 || cliente.notas) && (
                    <div className="mt-4 pt-4 border-t">
                      {cliente.preferencias.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Preferencias: </span>
                          <div className="flex gap-1 mt-1">
                            {cliente.preferencias.map((pref, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {pref}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {cliente.notas && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Notas: </span>
                          <span className="text-sm text-gray-600">{cliente.notas}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-6">
          {/* Gráficos y métricas adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((categoria) => {
              const count = clientesData.filter(c => c.categoría === categoria.nombre).length;
              const IconComponent = categoria.icon;
              return (
                <Card key={categoria.nombre}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      Clientes {categoria.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">{count}</div>
                    <div className="text-sm text-gray-600">
                      {Math.round((count / clientesData.length) * 100)}% del total
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Métricas adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfacción</p>
                    <p className="text-xl font-bold text-yellow-600">{estadisticasClientes.satisfaccionPromedio}/5</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Visitas/Mes</p>
                    <p className="text-xl font-bold text-blue-600">{estadisticasClientes.promedioVisitasMes}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Nuevos/Mes</p>
                    <p className="text-xl font-bold text-green-600">12</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reactivados</p>
                    <p className="text-xl font-bold text-purple-600">8</p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segmentacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segmentación de Clientes</CardTitle>
              <p className="text-gray-600">Análisis detallado por segmentos</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Por Categoría */}
                <div>
                  <h3 className="font-semibold mb-3">Por Categoría</h3>
                  <div className="space-y-2">
                    {categorias.map(categoria => {
                      const count = clientesData.filter(c => c.categoría === categoria.nombre).length;
                      const percentage = Math.round((count / clientesData.length) * 100);
                      const IconComponent = categoria.icon;
                      
                      return (
                        <div key={categoria.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <span className="font-medium">{categoria.nombre}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{count} clientes</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Por Frecuencia de Visita */}
                <div>
                  <h3 className="font-semibold mb-3">Por Frecuencia de Visita</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded border border-green-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {clientesData.filter(c => c.totalVisitas >= 20).length}
                        </div>
                        <div className="text-sm text-green-700">Muy Frecuentes (20+)</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded border border-blue-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {clientesData.filter(c => c.totalVisitas >= 10 && c.totalVisitas < 20).length}
                        </div>
                        <div className="text-sm text-blue-700">Regulares (10-19)</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded border border-orange-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {clientesData.filter(c => c.totalVisitas < 10).length}
                        </div>
                        <div className="text-sm text-orange-700">Ocasionales (1-9)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
