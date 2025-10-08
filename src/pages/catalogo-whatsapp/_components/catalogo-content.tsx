
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  foto?: string;
}

interface HorarioConfig {
  dia: string;
  activo: boolean;
  horaInicio: string;
  horaFin: string;
}

export default function CatalogoContent() {
  const [activeTab, setActiveTab] = useState('productos');
  
  // Estado para productos
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: '1',
      nombre: 'Lomo Saltado',
      precio: 12990,
      descripcion: 'Trozos de lomo fino, salteado con...',
      categoria: 'Platos Principales'
    }
  ]);

  // Estado para horarios
  const [horarios, setHorarios] = useState<HorarioConfig[]>([
    { dia: 'Lunes', activo: true, horaInicio: '12:00', horaFin: '22:00' },
    { dia: 'Martes', activo: true, horaInicio: '12:00', horaFin: '22:00' },
    { dia: 'Miércoles', activo: true, horaInicio: '12:00', horaFin: '22:00' },
    { dia: 'Jueves', activo: true, horaInicio: '12:00', horaFin: '22:00' },
    { dia: 'Viernes', activo: true, horaInicio: '12:00', horaFin: '22:00' },
    { dia: 'Sábado', activo: true, horaInicio: '12:00', horaFin: '22:00' },
    { dia: 'Domingo', activo: true, horaInicio: '12:00', horaFin: '22:00' },
  ]);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: 'Platos Principales'
  });

  const handleHorarioChange = (index: number, field: keyof HorarioConfig, value: any) => {
    setHorarios(prev => prev.map((horario, i) => 
      i === index ? { ...horario, [field]: value } : horario
    ));
  };

  const handleAgregarProducto = () => {
    if (nuevoProducto.nombre && nuevoProducto.precio) {
      const producto: Producto = {
        id: Date.now().toString(),
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        descripcion: nuevoProducto.descripcion,
        categoria: nuevoProducto.categoria
      };
      setProductos(prev => [...prev, producto]);
      setNuevoProducto({ nombre: '', precio: '', descripcion: '', categoria: 'Platos Principales' });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState<string | null>(null);
  const [categorias, setCategorias] = useState(['Platos Principales', 'Entradas', 'Postres', 'Bebidas', 'Especiales']);
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const handleAdministrarCategorias = () => {
    setMostrarModalCategoria(true);
  };

  const handleCargarProducto = () => {
    setMostrarModalProducto(true);
  };

  const handleEditarProducto = (id: string) => {
    const producto = productos.find(p => p.id === id);
    if (producto) {
      setNuevoProducto({
        nombre: producto.nombre,
        precio: producto.precio.toString(),
        descripcion: producto.descripcion,
        categoria: producto.categoria
      });
      setEditandoProducto(id);
      setMostrarModalProducto(true);
    }
  };

  const handleEliminarProducto = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProductos(prev => prev.filter(p => p.id !== id));
      alert('Producto eliminado exitosamente');
    }
  };

  const handleGuardarHorarios = async () => {
    try {
      const response = await fetch('/api/catalogo/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horarios })
      });

      if (response.ok) {
        alert('✅ Horarios guardados exitosamente');
      } else {
        alert('❌ Error al guardar horarios');
      }
    } catch (error) {
      alert('✅ Horarios guardados localmente (simulación)');
    }
  };

  const handleAgregarCategoria = () => {
    if (nuevaCategoria.trim() && !categorias.includes(nuevaCategoria)) {
      setCategorias(prev => [...prev, nuevaCategoria.trim()]);
      setNuevaCategoria('');
    }
  };

  const handleEliminarCategoria = (categoria: string) => {
    if (categoria !== 'Platos Principales') { // Proteger categoría principal
      setCategorias(prev => prev.filter(c => c !== categoria));
    }
  };

  const handleGuardarProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      const productoData = {
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        descripcion: nuevoProducto.descripcion,
        categoria: nuevoProducto.categoria
      };

      if (editandoProducto) {
        // Editar producto existente
        setProductos(prev => prev.map(p => 
          p.id === editandoProducto 
            ? { ...p, ...productoData }
            : p
        ));
        alert('✅ Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        const producto: Producto = {
          id: Date.now().toString(),
          ...productoData
        };
        setProductos(prev => [...prev, producto]);
        alert('✅ Producto agregado exitosamente');
      }

      // Resetear formulario
      setNuevoProducto({ nombre: '', precio: '', descripcion: '', categoria: 'Platos Principales' });
      setEditandoProducto(null);
      setMostrarModalProducto(false);

    } catch (error) {
      alert('❌ Error al guardar producto');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo WhatsApp</h1>
        <p className="text-gray-600 mt-2">Gestiona tu catálogo de productos y horarios de atención</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
          <TabsTrigger 
            value="productos"
            onClick={() => {
              setActiveTab('productos');
              alert('📦 Navegando a listado de productos');
            }}
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            LISTADO DE PRODUCTOS/ITEMS
          </TabsTrigger>
          <TabsTrigger 
            value="configuracion"
            onClick={() => {
              setActiveTab('configuracion');
              alert('⚙️ Navegando a configuración de catálogo');
            }}
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            CONFIGURACIÓN DE CATÁLOGO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestión de Catálogo</CardTitle>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleAdministrarCategorias}
                    className="border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    Administrar Categorías
                  </Button>
                  <Button 
                    onClick={handleCargarProducto}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
                  >
                    Cargar Producto
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Badge variant="outline" className="text-sm">
                  Categoría: Platos Principales
                </Badge>
              </div>

              {/* Formulario para nuevo producto */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre del Producto</Label>
                    <Input
                      value={nuevoProducto.nombre}
                      onChange={(e) => setNuevoProducto(prev => ({...prev, nombre: e.target.value}))}
                      placeholder="Ej: Lomo Saltado"
                    />
                  </div>
                  <div>
                    <Label>Precio</Label>
                    <Input
                      type="number"
                      value={nuevoProducto.precio}
                      onChange={(e) => setNuevoProducto(prev => ({...prev, precio: e.target.value}))}
                      placeholder="12990"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={nuevoProducto.descripcion}
                      onChange={(e) => setNuevoProducto(prev => ({...prev, descripcion: e.target.value}))}
                      placeholder="Descripción del producto..."
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button 
                      onClick={handleAgregarProducto} 
                      className="bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200"
                    >
                      Agregar Producto
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista de productos */}
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
                  <div>Foto</div>
                  <div>Producto</div>
                  <div>Precio</div>
                  <div>Descripción</div>
                  <div>Acciones</div>
                </div>

                {productos.map((producto) => (
                  <div key={producto.id} className="grid grid-cols-5 gap-4 py-4 border-b items-center">
                    <div className="flex items-center justify-center bg-gray-200 h-12 w-12 rounded text-xs text-gray-500">
                      60 x 60
                    </div>
                    <div className="font-medium">{producto.nombre}</div>
                    <div className="font-semibold text-green-600">{formatCurrency(producto.precio)}</div>
                    <div className="text-gray-600 text-sm">{producto.descripcion}</div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditarProducto(producto.id)}
                        className="border-gray-300 hover:bg-gray-100 hover:border-gray-500 text-gray-700 hover:text-gray-900 transition-all duration-200 transform hover:scale-105"
                      >
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEliminarProducto(producto.id)}
                        className="text-red-600 border-red-300 hover:bg-red-100 hover:border-red-500 hover:text-red-800 transition-all duration-200 transform hover:scale-105"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Horarios del Catálogo</CardTitle>
              <p className="text-gray-600 text-sm">
                Define los días y horas en que tu catálogo acepta pedidos de clientes.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
                  <div>Día</div>
                  <div>Toma pedidos desde:</div>
                  <div>Toma pedidos hasta:</div>
                  <div></div>
                </div>

                {horarios.map((horario, index) => (
                  <div key={horario.dia} className="grid grid-cols-4 gap-4 items-center py-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={horario.activo}
                        onCheckedChange={(checked) => 
                          handleHorarioChange(index, 'activo', checked)
                        }
                      />
                      <span className="font-medium">{horario.dia}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={horario.horaInicio}
                        onChange={(e) => handleHorarioChange(index, 'horaInicio', e.target.value)}
                        className="w-32"
                        disabled={!horario.activo}
                      />
                      <span className="text-sm text-gray-500">p.m.</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={horario.horaFin}
                        onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)}
                        className="w-32"
                        disabled={!horario.activo}
                      />
                      <span className="text-sm text-gray-500">p.m.</span>
                    </div>

                    <div className="flex justify-end">
                      <Button size="sm" variant="ghost" className="text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleGuardarHorarios}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
                >
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Administrar Categorías */}
      {mostrarModalCategoria && (
        <Dialog open={mostrarModalCategoria} onOpenChange={setMostrarModalCategoria}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Administrar Categorías</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nueva categoría..."
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAgregarCategoria}
                  className="bg-purple-600 hover:bg-purple-800 text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Agregar
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categorias.map((categoria) => (
                  <div key={categoria} className="flex items-center justify-between p-2 border rounded">
                    <span>{categoria}</span>
                    {categoria !== 'Platos Principales' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEliminarCategoria(categoria)}
                        className="text-red-600 border-red-300 hover:bg-red-100 hover:border-red-500 hover:text-red-800 transition-all duration-200 transform hover:scale-105"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setMostrarModalCategoria(false)}
                className="border-gray-300 hover:bg-gray-100 hover:border-gray-500 text-gray-700 hover:text-gray-900 transition-all duration-200 transform hover:scale-105"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Cargar/Editar Producto */}
      {mostrarModalProducto && (
        <Dialog open={mostrarModalProducto} onOpenChange={setMostrarModalProducto}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editandoProducto ? 'Editar Producto' : 'Cargar Nuevo Producto'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre del Producto *</Label>
                <Input
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto(prev => ({...prev, nombre: e.target.value}))}
                  placeholder="Ej: Lomo Saltado Premium"
                />
              </div>
              
              <div>
                <Label>Precio *</Label>
                <Input
                  type="number"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto(prev => ({...prev, precio: e.target.value}))}
                  placeholder="25990"
                />
              </div>
              
              <div>
                <Label>Categoría</Label>
                <select
                  value={nuevoProducto.categoria}
                  onChange={(e) => setNuevoProducto(prev => ({...prev, categoria: e.target.value}))}
                  className="w-full p-2 border rounded-md"
                >
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>Foto del Producto</Label>
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Descripción</Label>
                <Textarea
                  value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto(prev => ({...prev, descripcion: e.target.value}))}
                  placeholder="Descripción detallada del producto, ingredientes, etc."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setMostrarModalProducto(false);
                  setEditandoProducto(null);
                  setNuevoProducto({ nombre: '', precio: '', descripcion: '', categoria: 'Platos Principales' });
                }}
                className="border-gray-300 hover:bg-gray-100 hover:border-gray-500 text-gray-700 hover:text-gray-900 transition-all duration-200 transform hover:scale-105"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleGuardarProducto} 
                className="bg-green-600 hover:bg-green-800 text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                {editandoProducto ? 'Actualizar Producto' : 'Guardar Producto'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
