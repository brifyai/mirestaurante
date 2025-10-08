
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Edit } from 'lucide-react';
import Swal from 'sweetalert2';

interface BotonLink {
  id: string;
  titulo: string;
  clicks: number;
  url: string;
  activo: boolean;
}

export default function PortalLinksContent() {
  const [tituloPortal, setTituloPortal] = useState('DRINKGARDEN');
  const [urlPortal] = useState('https://airestaurante.com/links/jaraquemada');

  const [botones, setBotones] = useState<BotonLink[]>([
    { id: '1', titulo: 'Contáctanos', clicks: 5580, url: '#', activo: true },
    { id: '2', titulo: 'Nuestra Carta', clicks: 1194, url: '#', activo: true },
    { id: '3', titulo: 'Reserva Aquí', clicks: 3070, url: '#', activo: true },
    { id: '4', titulo: '¿Cómo llegar?', clicks: 2049, url: '#', activo: true },
  ]);

  // Estadísticas
  const estadisticas = {
    visitasPortal: 19289,
    ultimos7Dias: 217,
    ayer: 26,
    hoy: 19,
    clicksBotones: 17193
  };

  const copiarUrl = () => {
    navigator.clipboard.writeText(urlPortal);
    Swal.fire({
      title: 'URL copiada',
      text: 'La URL ha sido copiada al portapapeles',
      icon: 'success',
      timer: 2000
    });
  };

  const [editandoBoton, setEditandoBoton] = useState<string | null>(null);
  const [mostrarModalBoton, setMostrarModalBoton] = useState(false);
  const [nuevoBoton, setNuevoBoton] = useState({
    titulo: '',
    url: '',
    tipo: 'enlace' as 'enlace' | 'telefono' | 'email' | 'whatsapp'
  });
  
  // Estado para configuraciones
  const [configuraciones, setConfiguraciones] = useState({
    popup: {
      activo: true,
      titulo: 'Bienvenido a DrinkGarden',
      mensaje: 'Descubre nuestros mejores cocteles',
      duracion: 5000
    },
    captacion: {
      activa: true,
      campos: ['nombre', 'email', 'telefono'],
      incentivo: 'Descuento 10% en primera visita'
    },
    horarios: {
      mostrarEstado: true,
      horaApertura: '18:00',
      horaCierre: '02:00',
      diasOperacion: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab']
    },
    pixel: {
      metaPixelId: '',
      googleAnalyticsId: '',
      facebookConversions: false
    }
  });

  const handleEditarBoton = (id: string) => {
    const boton = botones.find(b => b.id === id);
    if (boton) {
      setNuevoBoton({
        titulo: boton.titulo,
        url: boton.url,
        tipo: 'enlace'
      });
      setEditandoBoton(id);
      setMostrarModalBoton(true);
    }
  };

  const handleAgregarBoton = () => {
    setNuevoBoton({ titulo: '', url: '', tipo: 'enlace' });
    setEditandoBoton(null);
    setMostrarModalBoton(true);
  };

  const handleGuardarBoton = () => {
    if (!nuevoBoton.titulo || !nuevoBoton.url) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor complete todos los campos',
        icon: 'warning'
      });
      return;
    }

    if (editandoBoton) {
      setBotones(prev => prev.map(boton =>
        boton.id === editandoBoton
          ? { ...boton, titulo: nuevoBoton.titulo, url: nuevoBoton.url }
          : boton
      ));
      Swal.fire({
        title: 'Actualizado',
        text: 'Botón actualizado exitosamente',
        icon: 'success',
        timer: 2000
      });
    } else {
      const nuevoBotonObj: BotonLink = {
        id: Date.now().toString(),
        titulo: nuevoBoton.titulo,
        url: nuevoBoton.url,
        clicks: 0,
        activo: true
      };
      setBotones(prev => [...prev, nuevoBotonObj]);
      Swal.fire({
        title: 'Agregado',
        text: 'Botón agregado exitosamente',
        icon: 'success',
        timer: 2000
      });
    }

    setMostrarModalBoton(false);
    setNuevoBoton({ titulo: '', url: '', tipo: 'enlace' });
    setEditandoBoton(null);
  };

  const handleRealizarEmailMkt = () => {
    // Aquí integrarías con tu servicio de email marketing
    Swal.fire({
      title: 'Campaña iniciada',
      text: 'Se está iniciando la campaña de Email Marketing a tu base de datos. Se enviará a todos los clientes que visitaron tu portal. Podrás ver estadísticas en la sección Campañas.',
      icon: 'success',
      confirmButtonText: 'Entendido'
    });
  };

  const handleGuardarConfiguracion = (seccion: string) => {
    Swal.fire({
      title: 'Configuración guardada',
      text: `Configuración de ${seccion} guardada exitosamente`,
      icon: 'success',
      timer: 2000
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              Portal de Links PRO 
              <Badge className="ml-3 bg-blue-100 text-blue-800">Suscripción activa</Badge>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo - Botones */}
        <div className="lg:col-span-1 space-y-6">
          {/* Configuración del Portal */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Portal de Links</Label>
                  <div className="flex mt-2">
                    <Input
                      value={urlPortal}
                      readOnly
                      className="flex-1 text-sm bg-gray-50"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-2"
                      onClick={copiarUrl}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Título de Portal</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      value={tituloPortal}
                      onChange={(e) => setTituloPortal(e.target.value)}
                      className="flex-1"
                    />
                    <span className="ml-2 text-xs text-gray-500">0/70</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{estadisticas.visitasPortal.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Visitas al Portal</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{estadisticas.ultimos7Dias}</div>
                  <div className="text-xs text-gray-600">Últ. 7 Días</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{estadisticas.ayer}</div>
                  <div className="text-xs text-gray-600">Ayer</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center mt-4 pt-4 border-t">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{estadisticas.hoy}</div>
                  <div className="text-xs text-gray-600">Hoy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.clicksBotones.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Clicks en Botones</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones Cargados */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">BOTONES CARGADOS</CardTitle>
                <span className="text-sm text-gray-500">4/12</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {botones.map((boton) => (
                  <div key={boton.id} className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-600 px-2 py-1 rounded text-sm font-mono">
                        {boton.clicks.toLocaleString()}
                      </div>
                      <span className="font-medium">{boton.titulo}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-300 hover:text-white"
                      onClick={() => handleEditarBoton(boton.id)}
                    >
                      <span className="underline text-sm">Editar</span>
                    </Button>
                  </div>
                ))}

                <Button 
                  onClick={handleAgregarBoton}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-8 rounded-lg flex items-center justify-center font-medium transition-colors duration-200"
                >
                  <span className="text-4xl mr-2">+</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Derecho - Configuraciones */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="configuracion" className="space-y-6">
                <div className="w-full overflow-x-auto">
                  <TabsList className="flex w-max min-w-full h-auto bg-gray-100 rounded-lg p-1">
                    <TabsTrigger 
                      value="configuracion" 
                      className="px-4 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200"
                      onClick={() => Swal.fire({
                        title: 'Configuración activa',
                        text: 'Configuración de botones activa',
                        icon: 'info',
                        timer: 2000
                      })}
                    >
                      CONFIGURACIÓN DE BOTONES
                    </TabsTrigger>
                    <TabsTrigger 
                      value="popup" 
                      className="px-4 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200"
                      onClick={() => Swal.fire({
                        title: 'Popup de bienvenida',
                        text: 'Configuración de popup de bienvenida activa',
                        icon: 'info',
                        timer: 2000
                      })}
                    >
                      POPUP DE BIENVENIDA
                    </TabsTrigger>
                    <TabsTrigger 
                      value="captacion" 
                      className="px-4 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200"
                    >
                      CAPTACIÓN DE DATOS (1.203)
                    </TabsTrigger>
                    <TabsTrigger 
                      value="indicar" 
                      className="px-4 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200"
                    >
                      INDICAR ABIERTO / CERRADO
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pixel" 
                      className="px-4 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200"
                    >
                      PIXEL DE META
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="configuracion" className="space-y-6">
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <Button 
                        className="bg-black text-white hover:bg-gray-800 px-6 py-3 font-medium transition-colors duration-200" 
                        onClick={handleRealizarEmailMkt}
                      >
                        REALIZAR EMAIL MKT
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-lg font-semibold text-blue-600 uppercase">
                        Nuestro Portal de Links te permite tener en un link, varios botones<br/>
                        que redireccionen a las acciones que desees
                      </p>
                      
                      <p className="text-gray-600 uppercase">
                        Aquí se configuran los botones agregados o los a ser editados
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="popup" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Popup de Bienvenida</CardTitle>
                      <p className="text-sm text-gray-600">Configure el mensaje que verán los visitantes al ingresar</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Activar Popup</Label>
                        <Switch
                          checked={configuraciones.popup.activo}
                          onCheckedChange={(checked) => setConfiguraciones(prev => ({
                            ...prev,
                            popup: { ...prev.popup, activo: checked }
                          }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Título del Popup</Label>
                        <Input
                          value={configuraciones.popup.titulo}
                          onChange={(e) => setConfiguraciones(prev => ({
                            ...prev,
                            popup: { ...prev.popup, titulo: e.target.value }
                          }))}
                          placeholder="Ej: ¡Bienvenido a DrinkGarden!"
                        />
                      </div>
                      
                      <div>
                        <Label>Mensaje</Label>
                        <Textarea
                          value={configuraciones.popup.mensaje}
                          onChange={(e) => setConfiguraciones(prev => ({
                            ...prev,
                            popup: { ...prev.popup, mensaje: e.target.value }
                          }))}
                          placeholder="Mensaje de bienvenida para tus visitantes"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label>Duración (milisegundos)</Label>
                        <Input
                          type="number"
                          value={configuraciones.popup.duracion}
                          onChange={(e) => setConfiguraciones(prev => ({
                            ...prev,
                            popup: { ...prev.popup, duracion: parseInt(e.target.value) }
                          }))}
                        />
                      </div>
                      
                      <Button 
                        onClick={() => handleGuardarConfiguracion('Popup')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors duration-200"
                      >
                        Guardar Configuración
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="captacion" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Captación de Datos (1.203 registros)</CardTitle>
                      <p className="text-sm text-gray-600">Sistema para recopilar información de visitantes</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Activar Captación</Label>
                        <Switch
                          checked={configuraciones.captacion.activa}
                          onCheckedChange={(checked) => setConfiguraciones(prev => ({
                            ...prev,
                            captacion: { ...prev.captacion, activa: checked }
                          }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Incentivo para registro</Label>
                        <Input
                          value={configuraciones.captacion.incentivo}
                          onChange={(e) => setConfiguraciones(prev => ({
                            ...prev,
                            captacion: { ...prev.captacion, incentivo: e.target.value }
                          }))}
                          placeholder="Ej: Descuento 10% en primera visita"
                        />
                      </div>
                      
                      <div>
                        <Label>Campos a solicitar</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['nombre', 'email', 'telefono', 'fecha_nacimiento', 'preferencias'].map(campo => (
                            <div key={campo} className="flex items-center space-x-2">
                              <Checkbox 
                                checked={configuraciones.captacion.campos.includes(campo)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setConfiguraciones(prev => ({
                                      ...prev,
                                      captacion: {
                                        ...prev.captacion,
                                        campos: [...prev.captacion.campos, campo]
                                      }
                                    }));
                                  } else {
                                    setConfiguraciones(prev => ({
                                      ...prev,
                                      captacion: {
                                        ...prev.captacion,
                                        campos: prev.captacion.campos.filter(c => c !== campo)
                                      }
                                    }));
                                  }
                                }}
                              />
                              <Label className="capitalize">{campo.replace('_', ' ')}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          onClick={() => handleGuardarConfiguracion('Captación')}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors duration-200"
                        >
                          Guardar Configuración
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        >
                          Descargar Base de Datos (CSV)
                        </Button>
                      </div>
                      
                      {/* Estadísticas */}
                      <div className="bg-gray-50 p-4 rounded-lg mt-4">
                        <h4 className="font-semibold mb-2">Estadísticas de Captación</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">1,203</div>
                            <div className="text-xs text-gray-600">Total Registros</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">89</div>
                            <div className="text-xs text-gray-600">Este Mes</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">7.3%</div>
                            <div className="text-xs text-gray-600">Tasa Conversión</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="indicar" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Indicar Abierto / Cerrado</CardTitle>
                      <p className="text-sm text-gray-600">Muestra el estado actual del negocio a los visitantes</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Mostrar Estado</Label>
                        <Switch
                          checked={configuraciones.horarios.mostrarEstado}
                          onCheckedChange={(checked) => setConfiguraciones(prev => ({
                            ...prev,
                            horarios: { ...prev.horarios, mostrarEstado: checked }
                          }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Hora de Apertura</Label>
                          <Input
                            type="time"
                            value={configuraciones.horarios.horaApertura}
                            onChange={(e) => setConfiguraciones(prev => ({
                              ...prev,
                              horarios: { ...prev.horarios, horaApertura: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label>Hora de Cierre</Label>
                          <Input
                            type="time"
                            value={configuraciones.horarios.horaCierre}
                            onChange={(e) => setConfiguraciones(prev => ({
                              ...prev,
                              horarios: { ...prev.horarios, horaCierre: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Días de Operación</Label>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                          {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((dia, index) => {
                            const diaKey = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'][index];
                            return (
                              <div key={dia} className="text-center">
                                <Checkbox
                                  checked={configuraciones.horarios.diasOperacion.includes(diaKey)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setConfiguraciones(prev => ({
                                        ...prev,
                                        horarios: {
                                          ...prev.horarios,
                                          diasOperacion: [...prev.horarios.diasOperacion, diaKey]
                                        }
                                      }));
                                    } else {
                                      setConfiguraciones(prev => ({
                                        ...prev,
                                        horarios: {
                                          ...prev.horarios,
                                          diasOperacion: prev.horarios.diasOperacion.filter(d => d !== diaKey)
                                        }
                                      }));
                                    }
                                  }}
                                />
                                <div className="text-xs mt-1">{dia}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Vista Previa */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Vista Previa</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">
                            Abierto - Cierra a las {configuraciones.horarios.horaCierre}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleGuardarConfiguracion('Horarios')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors duration-200"
                      >
                        Guardar Configuración
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pixel" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pixel de Meta & Analytics</CardTitle>
                      <p className="text-sm text-gray-600">Integración con plataformas de seguimiento y analytics</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Meta Pixel ID</Label>
                        <Input
                          value={configuraciones.pixel.metaPixelId}
                          onChange={(e) => setConfiguraciones(prev => ({
                            ...prev,
                            pixel: { ...prev.pixel, metaPixelId: e.target.value }
                          }))}
                          placeholder="123456789012345"
                        />
                        <p className="text-xs text-gray-500 mt-1">Para Facebook Ads y tracking</p>
                      </div>
                      
                      <div>
                        <Label>Google Analytics ID</Label>
                        <Input
                          value={configuraciones.pixel.googleAnalyticsId}
                          onChange={(e) => setConfiguraciones(prev => ({
                            ...prev,
                            pixel: { ...prev.pixel, googleAnalyticsId: e.target.value }
                          }))}
                          placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-xs text-gray-500 mt-1">Para Google Analytics 4</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Facebook Conversions API</Label>
                          <p className="text-xs text-gray-500">Mejora el tracking de eventos</p>
                        </div>
                        <Switch
                          checked={configuraciones.pixel.facebookConversions}
                          onCheckedChange={(checked) => setConfiguraciones(prev => ({
                            ...prev,
                            pixel: { ...prev.pixel, facebookConversions: checked }
                          }))}
                        />
                      </div>
                      
                      {/* Eventos Tracked */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Eventos que se rastrean:</h4>
                        <div className="text-sm space-y-1">
                          <div>✅ PageView - Vista de página</div>
                          <div>✅ Lead - Captación de datos</div>
                          <div>✅ Contact - Click en botones de contacto</div>
                          <div>✅ ViewContent - Vista de catálogo</div>
                          <div>✅ InitiateCheckout - Inicio de reserva</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          onClick={() => handleGuardarConfiguracion('Pixel')}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors duration-200"
                        >
                          Guardar Configuración
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-100 hover:border-gray-500 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        >
                          Probar Configuración
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Editar/Agregar Botón */}
      {mostrarModalBoton && (
        <Dialog open={mostrarModalBoton} onOpenChange={setMostrarModalBoton}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editandoBoton ? 'Editar Botón' : 'Agregar Nuevo Botón'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Título del Botón</Label>
                <Input
                  value={nuevoBoton.titulo}
                  onChange={(e) => setNuevoBoton(prev => ({...prev, titulo: e.target.value}))}
                  placeholder="Ej: Contáctanos por WhatsApp"
                />
              </div>
              
              <div>
                <Label>Tipo de Enlace</Label>
                <select
                  value={nuevoBoton.tipo}
                  onChange={(e) => setNuevoBoton(prev => ({...prev, tipo: e.target.value as any}))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="enlace">🔗 Enlace Web</option>
                  <option value="whatsapp">📱 WhatsApp</option>
                  <option value="telefono">📞 Teléfono</option>
                  <option value="email">📧 Email</option>
                </select>
              </div>
              
              <div>
                <Label>
                  {nuevoBoton.tipo === 'whatsapp' && 'Número de WhatsApp'}
                  {nuevoBoton.tipo === 'telefono' && 'Número de Teléfono'}
                  {nuevoBoton.tipo === 'email' && 'Dirección de Email'}
                  {nuevoBoton.tipo === 'enlace' && 'URL del Enlace'}
                </Label>
                <Input
                  value={nuevoBoton.url}
                  onChange={(e) => setNuevoBoton(prev => ({...prev, url: e.target.value}))}
                  placeholder={
                    nuevoBoton.tipo === 'whatsapp' ? '+56912345678' :
                    nuevoBoton.tipo === 'telefono' ? '+56912345678' :
                    nuevoBoton.tipo === 'email' ? 'contacto@restaurante.com' :
                    'https://ejemplo.com'
                  }
                />
              </div>

              {nuevoBoton.tipo === 'whatsapp' && (
                <div className="bg-green-50 p-3 rounded-lg text-sm">
                  <strong>💡 Tip:</strong> El número debe incluir código de país (+56 para Chile).
                  Se generará automáticamente el enlace de WhatsApp.
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setMostrarModalBoton(false);
                  setEditandoBoton(null);
                  setNuevoBoton({ titulo: '', url: '', tipo: 'enlace' });
                }}
                className="border-gray-300 hover:bg-gray-100 hover:border-gray-500 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleGuardarBoton} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors duration-200"
              >
                {editandoBoton ? 'Actualizar Botón' : 'Agregar Botón'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
