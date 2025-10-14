"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Link,
} from "lucide-react";
import Swal from "sweetalert2";
import QRCode from "qrcode";
import { ArrivalsManager } from "@/lib/arrivals-manager";
import { supabase } from "@/lib/supabase";

// Tipos para los datos de mesas
interface Mesa {
  id: string;
  numero: string;
  capacidad: number;
  estado: "LIBRE" | "OCUPADA" | "RESERVADA" | "LIMPIEZA" | "MANTENIMIENTO";
  cliente_actual: string | null;
  cliente_phone: string | null;
  cliente_email: string | null;
  hora_ocupacion: string | null;
  tiempo_estimado_ocupacion: string | null;
  hora_reserva: string | null;
  facturacion_actual: number;
  posicion_x: number;
  posicion_y: number;
  notas: string | null;
  zona_id: string | null;
  zona_nombre: string | null;
  zona_color: string | null;
  zona_color_hex: string | null;
  tiempo_ocupado_formateado: string | null;
}

interface Zona {
  id: string;
  nombre: string;
  descripcion: string | null;
  color: string;
  color_hex: string;
  posicion_x: number;
  posicion_y: number;
  ancho: number;
  alto: number;
  capacidad_maxima: number;
  mesas_count: number;
}

interface Estadisticas {
  totalMesas: number;
  mesasOcupadas: number;
  mesasLibres: number;
  mesasReservadas: number;
  mesasLimpieza: number;
  mesasMantenimiento: number;
  ocupacionPromedio: number;
  facturacionTotal: number;
  rotacionPromedio: number;
}

export default function MesasContent() {
  // Estados para los datos dinámicos
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [estadisticasGenerales, setEstadisticasGenerales] =
    useState<Estadisticas>({
      totalMesas: 0,
      mesasOcupadas: 0,
      mesasLibres: 0,
      mesasReservadas: 0,
      mesasLimpieza: 0,
      mesasMantenimiento: 0,
      ocupacionPromedio: 0,
      facturacionTotal: 0,
      rotacionPromedio: 0,
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados existentes
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [filtroZona, setFiltroZona] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [vistaActiva, setVistaActiva] = useState("cuadricula");
  const [modoEditor, setModoEditor] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [mostrarCuadricula, setMostrarCuadricula] = useState(true);
  const [mesasPosition, setMesasPosition] = useState<{
    [key: string]: { x: number; y: number };
  }>({});
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(0);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);
  const [modoEdicionZona, setModoEdicionZona] = useState(false);
  const [herramientaActiva, setHerramientaActiva] = useState<
    "mover" | "zona" | "mesa"
  >("mover");

  // Estados para drag and drop
  const [draggedItem, setDraggedItem] = useState<Mesa | Zona | null>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Early return si los datos aún están cargando
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos de mesas...</p>
          </div>
        </div>
      </div>
    );
  }

  // Early return si hay error
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong className="font-bold">Error al cargar datos: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <button
              onClick={() => cargarDatos()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Función para crear mesa de prueba sin zona en base de datos
  const crearMesaSinZona = async () => {
    try {
      const numeroMesa = String(Math.floor(Math.random() * 900) + 100); // Número aleatorio entre 100-999

      console.log("🧪 Creando mesa de prueba sin zona en BD...");

      // Obtener restaurant_id de las mesas existentes
      const restaurantId = mesas[0]?.restaurant_id;
      if (!restaurantId) {
        await Swal.fire({
          title: "Error",
          text: "No se pudo obtener el ID del restaurante",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      // Crear mesa en la base de datos
      const { data, error } = await supabase
        .from("mesas")
        .insert([
          {
            restaurant_id: restaurantId,
            zona_id: null, // Sin zona asignada
            numero: numeroMesa,
            capacidad: 4,
            estado: "LIBRE",
            posicion_x: 0,
            posicion_y: 0,
            notas: "Mesa de prueba sin zona - creada para testing drag & drop",
          },
        ])
        .select();

      if (error) {
        console.error("❌ Error creando mesa de prueba:", error);
        await Swal.fire({
          title: "Error",
          text: `No se pudo crear la mesa: ${error.message}`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      console.log("✅ Mesa de prueba creada en BD:", data);

      await Swal.fire({
        title: "¡Mesa Creada!",
        text: `Mesa ${numeroMesa} creada sin zona para pruebas`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Recargar datos para ver la nueva mesa
      await cargarDatos();
    } catch (error) {
      console.error("❌ Error en crearMesaSinZona:", error);
      await Swal.fire({
        title: "Error Inesperado",
        text: "Ocurrió un error al crear la mesa de prueba",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // Función para recargar datos con cache busting
  const recargarDatosCompletos = async () => {
    try {
      console.log("🔄 Recarga completa con cache busting...");
      setLoading(true);

      // Forzar recarga con timestamp para evitar cache
      const timestamp = Date.now();

      // Cargar mesas con JOIN fresco
      const { data: mesasData, error: mesasError } = await supabase
        .from("mesas")
        .select(
          `
          *,
          zonas:zona_id (
            id,
            nombre,
            color,
            color_hex
          )
        `,
        )
        .order("numero")
        .limit(1000); // Agregar limit para forzar nueva query

      if (mesasError) throw mesasError;

      // Formatear los datos
      const mesasFormateadas = mesasData.map((mesa) => ({
        ...mesa,
        zona_nombre: mesa.zonas?.nombre || null,
        zona_color: mesa.zonas?.color || null,
        zona_color_hex: mesa.zonas?.color_hex || null,
        tiempo_ocupado_formateado: mesa.hora_ocupacion
          ? `${Math.floor((Date.now() - new Date(mesa.hora_ocupacion).getTime()) / (1000 * 60 * 60))}h ${Math.floor(((Date.now() - new Date(mesa.hora_ocupacion).getTime()) / (1000 * 60)) % 60)}m`
          : null,
      }));

      console.log("📊 Mesas recargadas:", mesasFormateadas.length);

      // Log de mesas sin zona después de recargar
      const mesasSinZona = mesasFormateadas.filter((m) => !m.zona_nombre);
      console.log(
        "🚫 Mesas sin zona después de recargar:",
        mesasSinZona.length,
        mesasSinZona.map((m) => m.numero),
      );

      setMesas(mesasFormateadas);

      // Recargar zonas también
      const { data: zonasData, error: zonasError } = await supabase
        .from("zonas")
        .select("*")
        .order("nombre");

      if (zonasError) throw zonasError;
      setZonas(zonasData);

      console.log("✅ Recarga completa exitosa");
    } catch (error) {
      console.error("❌ Error en recarga completa:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar datos desde Supabase
  const cargarDatos = async () => {
    try {
      console.log("🔄 Iniciando carga de datos...");
      setLoading(true);
      setError(null);

      let mesasFinales = [];

      // Cargar mesas directamente con JOIN para tener control total
      console.log("📇 Cargando mesas desde tabla directa con JOIN...");
      const { data: mesasDirect, error: mesasDirectError } = await supabase
        .from("mesas")
        .select(
          `
          *,
          zonas:zona_id (
            id,
            nombre,
            color,
            color_hex
          )
        `,
        )
        .order("numero");

      if (mesasDirectError) throw mesasDirectError;

      // Formatear los datos
      const mesasFormateadas = mesasDirect.map((mesa) => ({
        ...mesa,
        zona_nombre: mesa.zonas?.nombre || null,
        zona_color: mesa.zonas?.color || null,
        zona_color_hex: mesa.zonas?.color_hex || null,
        tiempo_ocupado_formateado: mesa.hora_ocupacion
          ? `${Math.floor((Date.now() - new Date(mesa.hora_ocupacion).getTime()) / (1000 * 60 * 60))}h ${Math.floor(((Date.now() - new Date(mesa.hora_ocupacion).getTime()) / (1000 * 60)) % 60)}m`
          : null,
      }));

      console.log("📊 Mesas cargadas:", mesasFormateadas.length);
      console.log(
        "🔍 Primeras 3 mesas para debug:",
        mesasFormateadas.slice(0, 3).map((m) => ({
          numero: m.numero,
          zona_id: m.zona_id,
          zona_nombre: m.zona_nombre,
          estado: m.estado,
        })),
      );
      console.log(
        "🚫 Mesas sin zona_nombre:",
        mesasFormateadas
          .filter((m) => !m.zona_nombre)
          .map((m) => ({
            numero: m.numero,
            zona_id: m.zona_id,
            zona_nombre: m.zona_nombre,
          })),
      );

      setMesas(mesasFormateadas);
      mesasFinales = mesasFormateadas;

      // Cargar zonas
      const { data: zonasData, error: zonasError } = await supabase
        .from("zonas")
        .select("*")
        .order("nombre");

      if (zonasError) throw zonasError;
      console.log("🏢 Zonas cargadas:", zonasData.length);
      setZonas(zonasData);

      // Calcular estadísticas
      const stats = calcularEstadisticas(mesasFinales);
      console.log("📈 Estadísticas calculadas:", stats);
      setEstadisticasGenerales(stats);

      console.log("✅ Carga de datos completada exitosamente");
    } catch (err) {
      console.error("❌ Error cargando datos:", err);
      setError("Error al cargar los datos de mesas");
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular estadísticas
  const calcularEstadisticas = (mesasData: any[]): Estadisticas => {
    const totalMesas = mesasData.length;
    const mesasOcupadas = mesasData.filter(
      (m) => m.estado === "OCUPADA",
    ).length;
    const mesasLibres = mesasData.filter((m) => m.estado === "LIBRE").length;
    const mesasReservadas = mesasData.filter(
      (m) => m.estado === "RESERVADA",
    ).length;
    const mesasLimpieza = mesasData.filter(
      (m) => m.estado === "LIMPIEZA",
    ).length;
    const mesasMantenimiento = mesasData.filter(
      (m) => m.estado === "MANTENIMIENTO",
    ).length;

    const facturacionTotal = mesasData.reduce(
      (sum, mesa) => sum + (mesa.facturacion_actual || 0),
      0,
    );
    const ocupacionPromedio =
      totalMesas > 0 ? (mesasOcupadas / totalMesas) * 100 : 0;

    return {
      totalMesas,
      mesasOcupadas,
      mesasLibres,
      mesasReservadas,
      mesasLimpieza,
      mesasMantenimiento,
      ocupacionPromedio: Math.round(ocupacionPromedio),
      facturacionTotal,
      rotacionPromedio: 2.3, // Este podría calcularse con datos históricos
    };
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Estado para el modal de asignar cliente
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para abrir modal de asignar cliente
  const handleAsignarCliente = (mesa: Mesa) => {
    setSelectedMesa(mesa);
    setFormData({ nombre: "", telefono: "", email: "" });
    setShowAssignModal(true);
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función para enviar el formulario
  const handleAssignSubmit = async () => {
    if (!formData.nombre.trim()) {
      return;
    }

    if (!selectedMesa) return;

    setIsSubmitting(true);
    try {
      // Llamar a la función asignar_cliente_mesa
      const { error } = await supabase.rpc("asignar_cliente_mesa", {
        mesa_uuid: selectedMesa.id,
        nombre_cliente: formData.nombre.trim(),
        telefono_cliente: formData.telefono.trim() || null,
        email_cliente: formData.email.trim() || null,
        tiempo_estimado: "2 hours", // Tiempo estimado por defecto
      });

      if (error) throw error;

        // Registrar en el sistema
        ArrivalsManager.addArrival({
          guestName: formData.nombre,
          tableNumber: selectedMesa.numero,
          type: "manual",
        });

        // Cerrar modal y recargar datos
        setShowAssignModal(false);
        cargarDatos();
      } catch (error) {
        console.error("Error asignando cliente:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toUpperCase()) {
      case "OCUPADA":
        return "bg-red-100 text-red-800 border-red-200";
      case "LIBRE":
        return "bg-green-100 text-green-800 border-green-200";
      case "RESERVADA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "LIMPIEZA":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "MANTENIMIENTO":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toUpperCase()) {
      case "OCUPADA":
        return <Users className="w-4 h-4" />;
      case "LIBRE":
        return <CheckCircle2 className="w-4 h-4" />;
      case "RESERVADA":
        return <Clock className="w-4 h-4" />;
      case "LIMPIEZA":
        return <RotateCcw className="w-4 h-4" />;
      case "MANTENIMIENTO":
        return <Settings2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const mesasFiltradas = mesas.filter((mesa) => {
    const cumpleBusqueda =
      String(mesa.numero).toLowerCase().includes(busqueda.toLowerCase()) ||
      (mesa.cliente_actual &&
        mesa.cliente_actual.toLowerCase().includes(busqueda.toLowerCase()));
    const cumpleEstado =
      filtroEstado === "todas" || mesa.estado.toLowerCase() === filtroEstado;
    const cumpleZona =
      filtroZona === "todas" ||
      (mesa.zona_nombre && mesa.zona_nombre === filtroZona);

    return cumpleBusqueda && cumpleEstado && cumpleZona;
  });

  const handleAccionMesa = async (accion: string, mesa: Mesa) => {
    let titulo = "";
    let texto = "";
    let icono: "warning" | "question" | "info" = "warning";

    switch (accion) {
      case "liberar":
        titulo = "Liberar Mesa";
        texto = `¿Confirmar liberación de mesa ${mesa.numero}?`;
        break;
      case "limpiar":
        titulo = "Marcar para Limpieza";
        texto = `Mesa ${mesa.numero} será marcada para limpieza`;
        break;
      case "mantenimiento":
        titulo = "Enviar a Mantenimiento";
        texto = `Mesa ${mesa.numero} será enviada a mantenimiento`;
        icono = "question";
        break;
      case "activar":
        titulo = "Activar Mesa";
        texto = `Mesa ${mesa.numero} será activada y disponible`;
        icono = "info";
        break;
    }

    const result = await Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        // Ejecutar la acción en la base de datos
        let updateData: any = {};

        switch (accion) {
          case "liberar":
            // Debug: mostrar el ID que se está pasando
            console.log("🔍 Intentando liberar mesa:", {
              mesa_id: mesa.id,
              mesa_numero: mesa.numero,
              mesa_id_type: typeof mesa.id,
              estado_actual: mesa.estado,
            });

            // Llamar a la función liberar_mesa
            const { error: liberarError } = await supabase.rpc("liberar_mesa", {
              mesa_uuid: mesa.id,
            });
            if (liberarError) {
              console.error("❌ Error al liberar mesa:", liberarError);
              throw liberarError;
            }
            console.log("✅ Mesa liberada exitosamente");
            break;
          case "limpiar":
            updateData = {
              estado: "LIMPIEZA",
              cliente_actual: null,
              cliente_phone: null,
              cliente_email: null,
              hora_ocupacion: null,
              tiempo_estimado_ocupacion: null,
              notas: "Enviada a limpieza el " + new Date().toISOString(),
            };
            break;
          case "mantenimiento":
            const { value: notasMantenimiento } = await Swal.fire({
              title: "Notas de Mantenimiento",
              input: "text",
              inputLabel: "Describe el problema",
              inputPlaceholder: "Ej: Silla rota, luz no funciona...",
              showCancelButton: true,
              confirmButtonText: "Enviar a Mantenimiento",
              cancelButtonText: "Cancelar",
            });

            if (notasMantenimiento) {
              // Llamar a la función enviar_mesa_mantenimiento
              const { error: mantError } = await supabase.rpc(
                "enviar_mesa_mantenimiento",
                {
                  mesa_uuid: mesa.id,
                  notas_mantenimiento: notasMantenimiento,
                },
              );
              if (mantError) throw mantError;
            } else {
              return; // El usuario canceló
            }
            break;
          case "activar":
            // Debug: mostrar información antes de activar
            console.log("🔧 Intentando activar mesa:", {
              mesa_id: mesa.id,
              mesa_numero: mesa.numero,
              estado_actual: mesa.estado,
              zona_actual: mesa.zona_nombre,
            });

            // Llamar a la función activar_mesa
            const { error: activarError } = await supabase.rpc("activar_mesa", {
              mesa_uuid: mesa.id,
            });
            if (activarError) {
              console.error("❌ Error al activar mesa:", activarError);
              throw activarError;
            }
            console.log(
              "✅ Mesa activada exitosamente - debería quedar en estado LIBRE",
            );
            break;
        }

        // Actualización directa para casos que no usan funciones RPC
        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from("mesas")
            .update(updateData)
            .eq("id", mesa.id);

          if (updateError) throw updateError;
        }

        await Swal.fire({
          title: "¡Completado!",
          text: `Acción realizada en mesa ${mesa.numero}`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Recargar datos para mostrar cambios
        cargarDatos();
      } catch (error) {
        console.error("Error al realizar acción:", error);
        await Swal.fire({
          title: "Error",
          text: "No se pudo realizar la acción. Por favor, intenta nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleNuevaMesa = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Nueva Mesa",
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
              <option value="">Sin zona</option>
              ${zonas.map((zona) => `<option value="${zona.id}">${zona.nombre}</option>`).join("")}
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear Mesa",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return {
          numero: (document.getElementById("numero") as HTMLInputElement)
            ?.value,
          capacidad: (document.getElementById("capacidad") as HTMLSelectElement)
            ?.value,
          zona: (document.getElementById("zona") as HTMLSelectElement)?.value,
        };
      },
    });

    if (formValues) {
      try {
        // Obtener el restaurant_id (por ahora usamos el primero)
        const { data: restaurants } = await supabase
          .from("restaurants")
          .select("id")
          .limit(1);
        const restaurantId = restaurants?.[0]?.id;

        if (!restaurantId) {
          throw new Error("No se encontró un restaurante activo");
        }

        const { error } = await supabase.from("mesas").insert({
          restaurant_id: restaurantId,
          zona_id: formValues.zona || null,
          numero: formValues.numero,
          capacidad: parseInt(formValues.capacidad),
          estado: "LIBRE",
        });

        if (error) throw error;

        await Swal.fire({
          title: "¡Mesa Creada!",
          text: `Mesa ${formValues.numero} agregada correctamente`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Recargar datos para mostrar la nueva mesa
        cargarDatos();
      } catch (error) {
        console.error("Error creando mesa:", error);
        await Swal.fire({
          title: "Error",
          text: "No se pudo crear la mesa. Por favor, intenta nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleEditorMesas = async () => {
    const { value: opcion } = await Swal.fire({
      title: "Editor de Mesas",
      text: "Selecciona la acción que deseas realizar:",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Diseño Visual",
      denyButtonText: "Configuración Avanzada",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#dd6b20",
      cancelButtonColor: "#6c757d",
      showClass: {
        popup: "swal2-noanimation",
        backdrop: "swal2-noanimation",
      },
      didOpen: () => {
        // Aplicar estilos inline al botón deny para asegurar el fondo
        const denyButton = document.querySelector(".swal2-deny");
        if (denyButton) {
          (denyButton as HTMLElement).style.backgroundColor = "#dd6b20";
          (denyButton as HTMLElement).style.color = "white";
          (denyButton as HTMLElement).style.borderColor = "#dd6b20";
          (denyButton as HTMLElement).style.fontWeight = "500";

          // Añadir hover effect
          (denyButton as HTMLElement).addEventListener("mouseenter", () => {
            (denyButton as HTMLElement).style.backgroundColor = "#c85a1a";
            (denyButton as HTMLElement).style.borderColor = "#c85a1a";
          });

          (denyButton as HTMLElement).addEventListener("mouseleave", () => {
            (denyButton as HTMLElement).style.backgroundColor = "#dd6b20";
            (denyButton as HTMLElement).style.borderColor = "#dd6b20";
          });
        }
      },
    });

    if (opcion === true) {
      // Activar modo editor visual
      setModoEditor(true);
      setVistaActiva("editor");
      await Swal.fire({
        title: "¡Modo Editor Activado!",
        text: "Ahora puedes arrastrar las mesas para reorganizarlas",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else if (opcion === false) {
      // Configuración avanzada
      const { value: formValues } = await Swal.fire({
        title: "Configuración Avanzada",
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
        confirmButtonText: "Aplicar Configuración",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          return {
            distribucion: (
              document.getElementById("distribucion") as HTMLSelectElement
            )?.value,
            espaciado: (
              document.getElementById("espaciado") as HTMLInputElement
            )?.value,
            prioridad: (
              document.getElementById("prioridad") as HTMLSelectElement
            )?.value,
          };
        },
      });

      if (formValues) {
        await Swal.fire({
          title: "¡Configuración Aplicada!",
          text: `Distribución ${formValues.distribucion} aplicada con éxito`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  const guardarCambiosEditor = async () => {
    if (cambiosSinGuardar === 0) {
      await Swal.fire({
        title: "Sin cambios",
        text: "No hay cambios para guardar",
        icon: "info",
        confirmButtonText: "Entendido",
      });
      return;
    }

    await Swal.fire({
      title: "¿Guardar cambios?",
      text: `Se guardarán ${cambiosSinGuardar} cambio(s) en la distribución de mesas`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setModoEditor(false);
        setVistaActiva("mapa");
        setMesaSeleccionada(null);
        setCambiosSinGuardar(0);
        setMesasPosition({});
        Swal.fire({
          title: "¡Guardado!",
          text: "La distribución de mesas ha sido guardada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const cancelarEditor = async () => {
    if (cambiosSinGuardar > 0) {
      const result = await Swal.fire({
        title: "¡Atención!",
        text: `Tienes ${cambiosSinGuardar} cambio(s) sin guardar. ¿Deseas continuar y perder los cambios?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Salir sin Guardar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    setModoEditor(false);
    setVistaActiva("mapa");
    setMesaSeleccionada(null);
    setCambiosSinGuardar(0);
    setMesasPosition({});
  };

  // Funciones para el drag & drop
  const handleDragStart = (e: React.DragEvent, item: Mesa | Zona) => {
    console.log("🚀 DRAG START - DEBUGGING COMPLETO:", {
      item_completo: item,
      item_keys: Object.keys(item),
      type: "numero" in item ? "mesa" : "zona",
      numero: "numero" in item ? item.numero : null,
      zona_id: "zona_id" in item ? item.zona_id : null,
      zona_nombre: "zona_nombre" in item ? item.zona_nombre : null,
      id: item.id,
    });

    // Verificar la serialización JSON
    const itemString = JSON.stringify(item);
    const parsedBack = JSON.parse(itemString);
    console.log("🔄 VERIFICACIÓN SERIALIZACIÓN:", {
      original: item,
      serialized_length: itemString.length,
      parsed_back: parsedBack,
      numero_original: item.numero,
      numero_parsed: parsedBack.numero,
      zona_id_original: "zona_id" in item ? item.zona_id : "NO_EXISTE",
      zona_id_parsed: parsedBack.zona_id || "NULL_OR_UNDEFINED",
    });

    setDraggedItem(item);
    e.dataTransfer.setData("text/plain", itemString);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverZone(null);
  };

  const handleDragOverZona = (e: React.DragEvent, zona: any) => {
    e.preventDefault();

    // Obtener datos del dataTransfer directamente
    try {
      const data = e.dataTransfer.getData("text/plain");
      if (!data) {
        console.log("❌ No hay datos en dataTransfer");
        e.dataTransfer.dropEffect = "none";
        return;
      }

      const draggedData = JSON.parse(data);

      console.log(`🎯 DRAG OVER ${zona.nombre} - DEBUGGING ZONA_ID:`, {
        draggedData_completo: draggedData,
        draggedData_keys: Object.keys(draggedData),
        numero: draggedData.numero,
        zona_id: draggedData.zona_id,
        zona_nombre: draggedData.zona_nombre,
        id: draggedData.id,
        zona_id_tipo: typeof draggedData.zona_id,
        zona_destino_id: zona.id,
        zona_destino_nombre: zona.nombre,
      });

      // Si no hay numero, significa que no es una mesa válida
      if (!draggedData.numero) {
        console.log("❌ NO ES MESA - draggedData:", draggedData);
        e.dataTransfer.dropEffect = "none";
        return;
      }

      // Simplificar: si es mesa y NO es la misma zona, permitir drop
      const esMesa = !!draggedData.numero;
      const esLaMismaZona = draggedData.zona_id === zona.id;
      const puedeHacerDrop = esMesa && !esLaMismaZona;

      console.log(`🔍 VALIDACIÓN SIMPLE:`, {
        esMesa,
        zonaActual: draggedData.zona_id,
        zonaDestino: zona.id,
        esLaMismaZona,
        puedeHacerDrop,
      });

      if (puedeHacerDrop) {
        console.log(`✅ PERMITIENDO drop en ${zona.nombre}`);
        e.dataTransfer.dropEffect = "copy";
        setDragOverZone(zona.id);
      } else {
        console.log(`❌ NO permitiendo drop en ${zona.nombre}`);
        e.dataTransfer.dropEffect = "none";
      }
    } catch (error) {
      console.error("❌ Error en dragOver:", error);
      e.dataTransfer.dropEffect = "none";
    }
  };

  const handleDragLeaveZona = (zona: any) => {
    console.log(`🚪 Drag leave zona ${zona.nombre}`);
    setDragOverZone(null);
  };

  const handleDrop = (e: React.DragEvent, targetZona?: any) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));

    console.log("🎯 DROP EVENT TRIGGERED:");
    console.log("  - Event target:", e.target);
    console.log("  - Current target:", e.currentTarget);
    console.log("  - Data completa:", data);
    console.log("  - Target Zona:", targetZona);

    // Si targetZona es undefined, intentamos encontrar la zona a través del DOM
    if (!targetZona && data.numero) {
      console.log("⚠️ targetZona es undefined, buscando zona desde DOM...");

      // Buscar si el drop ocurrió sobre una zona directamente
      const targetElement = e.target as HTMLElement;
      const zonaElement = targetElement.closest("[data-zona-id]");

      if (zonaElement) {
        const zonaId = zonaElement.getAttribute("data-zona-id");
        targetZona = zonas.find((z) => z.id === zonaId);
        console.log("🔍 Zona encontrada desde DOM:", targetZona?.nombre);
      }
    }

    console.log("  - Es mesa (tiene numero):", !!data.numero);
    console.log("  - Tiene targetZona:", !!targetZona);
    console.log("  - zona_id actual:", data.zona_id);
    console.log("  - zona_nombre actual:", data.zona_nombre);

    // Verificar si es una mesa sin zona
    const esMesaSinZona =
      data.numero &&
      (data.zona_id === null ||
        data.zona_id === undefined ||
        !data.zona_id ||
        data.zona_nombre === null ||
        !data.zona_nombre);

    // Verificar si es una mesa con zona que se está moviendo a otra zona
    const esMesaConZona =
      data.numero &&
      data.zona_id &&
      targetZona &&
      data.zona_id !== targetZona.id;

    console.log("  - Es mesa sin zona:", esMesaSinZona);
    console.log("  - Es mesa con zona moviéndose:", esMesaConZona);
    console.log("  - Data completa mesa:", {
      id: data.id,
      numero: data.numero,
      zona_id: data.zona_id,
      zona_nombre: data.zona_nombre,
    });
    console.log("  - TargetZona completo:", {
      id: targetZona.id,
      nombre: targetZona.nombre,
    });
    console.log(
      "  - Comparación de zonas:",
      `"${data.zona_id}" !== "${targetZona.id}" =`,
      data.zona_id !== targetZona.id,
    );

    // Caso 1: Mesa sin zona que se asigna a una zona
    if (esMesaSinZona && targetZona) {
      console.log("✅ Asignando mesa sin zona a zona");
      asignarMesaAZona(data, targetZona);
      return;
    }
    // Caso 2: Mesa con zona que se mueve a otra zona
    else if (esMesaConZona) {
      console.log("✅ Moviendo mesa entre zonas");
      const zonaOrigenActual = zonas.find((z) => z.id === data.zona_id);
      console.log("  - Zona origen encontrada:", zonaOrigenActual?.nombre);
      moverMesaEntreZonas(data, zonaOrigenActual, targetZona);
      return;
    }
    // Mensaje informativo para otros casos
    else {
      console.log("ℹ️ Operación no válida para este tipo de movimento");
      if (data.numero) {
        const mensaje = !targetZona
          ? "Suelta la mesa sobre una zona"
          : data.zona_id === targetZona.id
            ? `La mesa ${data.numero} ya está en la zona ${targetZona.nombre}`
            : "Operación no soportada";

        console.log("📢 Mensaje para usuario:", mensaje);
        console.log("  - Razón:", {
          esMesaSinZona,
          esMesaConZona,
          hayTargetZona: !!targetZona,
          mismaZona: data.zona_id === targetZona?.id,
        });
      }
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Si es una zona (tiene nombre y color_hex)
    if (data.nombre && data.color_hex) {
      setZonas((prev) =>
        prev.map((zona) =>
          zona.id === data.id
            ? {
                ...zona,
                posicion_x: Math.max(0, x - 100),
                posicion_y: Math.max(0, y - 50),
              }
            : zona,
        ),
      );
      setCambiosSinGuardar((prev) => prev + 1);
    }
    // Si es una mesa (tiene numero)
    else if (data.numero) {
      setMesasPosition((prev) => ({
        ...prev,
        [data.numero]: {
          x: Math.max(0, x - 25),
          y: Math.max(0, y - 25),
        },
      }));
      setCambiosSinGuardar((prev) => prev + 1);
    }
  };

  // Función para asignar una mesa a una zona
  const asignarMesaAZona = async (mesa: any, zona: any) => {
    try {
      console.log("🎯 INICIANDO ASIGNACIÓN DE MESA:");
      console.log("  - Mesa:", mesa);
      console.log("  - Zona:", zona);
      console.log("  - Mesa ID:", mesa.id);
      console.log("  - Zona ID:", zona.id);
      console.log("  - Mesa numero:", mesa.numero);
      console.log("  - Zona nombre:", zona.nombre);

      // Verificar que tenemos los datos necesarios
      if (!mesa.id) {
        console.error("❌ Mesa ID no encontrado:", mesa);
        await Swal.fire({
          title: "Error",
          text: "ID de mesa no válido",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      if (!zona.id) {
        console.error("❌ Zona ID no encontrado:", zona);
        await Swal.fire({
          title: "Error",
          text: "ID de zona no válido",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      console.log("✅ IDs válidos, procediendo con actualización en BD...");

      // Simplificar: no usar posicionamiento absoluto, solo asignar zona_id
      // La visualización se manejará en el frontend con CSS Grid
      console.log("📐 Asignando mesa a zona:", {
        mesa: mesa.numero,
        zona: zona.nombre,
        zona_id: zona.id,
      });

      const nuevaPosicionX = 0; // Reset posiciones para usar CSS Grid
      const nuevaPosicionY = 0;

      // Actualizar en la base de datos
      const { data, error } = await supabase
        .from("mesas")
        .update({
          zona_id: zona.id,
          posicion_x: nuevaPosicionX,
          posicion_y: nuevaPosicionY,
        })
        .eq("id", mesa.id)
        .select();

      console.log("📊 Resultado de actualización:", { data, error });

      if (error) {
        console.error("❌ Error SQL asignando mesa a zona:", error);
        await Swal.fire({
          title: "Error de Base de Datos",
          text: `No se pudo asignar la mesa: ${error.message}`,
          icon: "error",
          timer: 5000,
          showConfirmButton: true,
        });
        return;
      }

      console.log("✅ Mesa actualizada en BD exitosamente");

      // Verificar si se actualizó alguna fila
      if (!data || data.length === 0) {
        console.warn("⚠️ No se encontró la mesa para actualizar");
        await Swal.fire({
          title: "Advertencia",
          text: "No se encontró la mesa en la base de datos",
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      console.log("🔄 Actualizando estado local inmediatamente...");

      // Actualizar el estado local inmediatamente para feedback visual
      setMesas((prev) => {
        const updatedMesas = prev.map((m) =>
          m.id === mesa.id
            ? {
                ...m,
                zona_id: zona.id,
                zona_nombre: zona.nombre,
                zona_color: zona.color,
                zona_color_hex: zona.color_hex,
                posicion_x: 0, // Reset para usar CSS Grid
                posicion_y: 0, // Reset para usar CSS Grid
              }
            : m,
        );

        const mesaActualizada = updatedMesas.find((m) => m.id === mesa.id);
        console.log("📝 Estado local actualizado inmediatamente:", {
          numero: mesaActualizada?.numero,
          zona_nombre: mesaActualizada?.zona_nombre,
          zona_id: mesaActualizada?.zona_id,
        });

        // Forzar re-render inmediato
        requestAnimationFrame(() => {
          console.log("🎨 Re-render forzado");
        });

        return updatedMesas;
      });

      // Limpiar estados de drag
      setDraggedItem(null);
      setDragOverZone(null);

      console.log("🎉 Mostrando confirmación...");

      // Mostrar confirmación
      await Swal.fire({
        title: "¡Mesa Asignada!",
        text: `Mesa ${mesa.numero} asignada a zona "${zona.nombre}"`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      console.log("🔄 Recargando datos para sincronización...");

      // Esperar un momento para asegurar que la BD se actualice
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Recargar datos con cache busting
      console.log("🔄 Recargando datos después de asignación...");
      await recargarDatosCompletos();

      // Verificar que la mesa se actualizó correctamente
      setTimeout(() => {
        const mesaVerificada = mesas.find((m) => m.id === mesa.id);
        const mesasSinZona = mesas.filter((m) => !m.zona_nombre && !m.zona_id);
        console.log("🔍 Verificación final después de asignación:", {
          mesa_asignada: {
            numero: mesa.numero,
            encontrada: !!mesaVerificada,
            zona_actual: mesaVerificada?.zona_nombre,
            zona_id: mesaVerificada?.zona_id,
          },
          mesas_sin_zona_restantes: {
            total: mesasSinZona.length,
            numeros: mesasSinZona.map((m) => m.numero),
          },
        });
      }, 100);
    } catch (error) {
      console.error("❌ Error crítico en asignarMesaAZona:", error);
      await Swal.fire({
        title: "Error Inesperado",
        text: "Ocurrió un error inesperado al asignar la mesa",
        icon: "error",
        timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      // Asegurar que se limpien los estados de drag
      setDraggedItem(null);
      setDragOverZone(null);
    }
  };

  // Función para mover una mesa de una zona a otra
  const moverMesaEntreZonas = async (
    mesa: any,
    zonaOrigen: any,
    zonaDestino: any,
  ) => {
    try {
      console.log("🔄 MOVIENDO MESA ENTRE ZONAS:");
      console.log(
        "  - Mesa:",
        mesa.numero,
        `(${mesa.zona_nombre || "Sin zona"})`,
      );
      console.log("  - Zona Destino:", zonaDestino.nombre);

      // Verificar que estamos moviendo realmente a una zona diferente
      if (mesa.zona_id === zonaDestino.id) {
        console.log("⚠️ La mesa ya está en esta zona");
        await Swal.fire({
          title: "Mesa ya en zona",
          text: `La mesa ${mesa.numero} ya está asignada a la zona ${zonaDestino.nombre}`,
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      // Actualizar en la base de datos
      const { data, error } = await supabase
        .from("mesas")
        .update({
          zona_id: zonaDestino.id,
          posicion_x: 0, // Reset posiciones para que la zona destino la organice
          posicion_y: 0,
        })
        .eq("id", mesa.id)
        .select();

      if (error) {
        console.error("❌ Error moviendo mesa entre zonas:", error);
        await Swal.fire({
          title: "Error",
          text: `No se pudo mover la mesa: ${error.message}`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      // Actualizar estado local inmediatamente
      setMesas((prev) => {
        const updatedMesas = prev.map((m) =>
          m.id === mesa.id
            ? {
                ...m,
                zona_id: zonaDestino.id,
                zona_nombre: zonaDestino.nombre,
                zona_color: zonaDestino.color,
                zona_color_hex: zonaDestino.color_hex,
                posicion_x: 0,
                posicion_y: 0,
              }
            : m,
        );

        const mesaActualizada = updatedMesas.find((m) => m.id === mesa.id);
        console.log("📝 Mesa movida:", {
          numero: mesaActualizada?.numero,
          zona_anterior: mesa.zona_nombre,
          zona_nueva: mesaActualizada?.zona_nombre,
        });

        return updatedMesas;
      });

      // Mostrar confirmación
      await Swal.fire({
        title: "¡Mesa Movida!",
        html: `
          <div class="text-left">
            <p>Mesa <strong>${mesa.numero}</strong> movida exitosamente</p>
            <div class="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
              <span class="text-sm">De:</span>
              <span class="font-medium">${mesa.zona_nombre || "Sin zona"}</span>
            </div>
            <div class="mt-1 flex items-center justify-between p-2 bg-green-50 rounded">
              <span class="text-sm">A:</span>
              <span class="font-medium text-green-800">${zonaDestino.nombre}</span>
            </div>
          </div>
        `,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

      // Recargar datos para sincronización completa
      setTimeout(() => {
        recargarDatosCompletos();
      }, 500);
    } catch (error) {
      console.error("❌ Error crítico al mover mesa entre zonas:", error);
      await Swal.fire({
        title: "Error Inesperado",
        text: "Ocurrió un error al mover la mesa entre zonas",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setDraggedItem(null);
      setDragOverZone(null);
    }
  };

  const handleClickMesa = (mesa: Mesa) => {
    console.log(
      "🗺️ Click en mesa en mapa/editor:",
      mesa.numero,
      "Estado:",
      mesa.estado,
      "Modo Editor:",
      modoEditor,
    );

    // Mostrar detalles de la mesa tanto en modo editor como en modo normal
    const getEstadoColor = (estado: string) => {
      switch (estado) {
        case "LIBRE":
          return "bg-green-100 text-green-800 border-green-200";
        case "OCUPADA":
          return "bg-red-100 text-red-800 border-red-200";
        case "RESERVADA":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "LIMPIEZA":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "MANTENIMIENTO":
          return "bg-gray-100 text-gray-800 border-gray-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getEstadoIcon = (estado: string) => {
      switch (estado) {
        case "LIBRE":
          return "✅";
        case "OCUPADA":
          return "🍽️";
        case "RESERVADA":
          return "📅";
        case "LIMPIEZA":
          return "🧹";
        case "MANTENIMIENTO":
          return "🔧";
        default:
          return "🪑";
      }
    };

    // Mostrar modal con detalles de la mesa
    Swal.fire({
      title: `
        <div class="flex items-center gap-2">
          <span class="text-2xl">${getEstadoIcon(mesa.estado)}</span>
          <span>Mesa ${mesa.numero}</span>
          ${modoEditor ? '<span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded ml-2">EDITOR</span>' : ""}
        </div>
      `,
      html: `
        <div class="text-left space-y-3">
          <!-- Estado y Capacidad -->
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm font-semibold text-gray-600">Estado</p>
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold border ${getEstadoColor(mesa.estado)}">
                ${mesa.estado}
              </span>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-600">Capacidad</p>
              <p class="text-2xl font-bold text-blue-600">${mesa.capacidad}</p>
              <p class="text-xs text-gray-500">personas</p>
            </div>
          </div>

          <!-- Información Adicional -->
          <div class="space-y-2">
            <p><strong>Zona:</strong> ${mesa.zona_nombre || '<span class="text-gray-400">Sin zona asignada</span>'}</p>

            ${
              mesa.cliente_actual
                ? `
            <div class="p-2 bg-blue-50 border border-blue-200 rounded">
              <p class="text-sm"><strong>Cliente actual:</strong></p>
              <p class="font-semibold text-blue-800">${mesa.cliente_actual}</p>
              ${mesa.cliente_phone ? `<p class="text-xs text-blue-600">📞 ${mesa.cliente_phone}</p>` : ""}
              ${mesa.cliente_email ? `<p class="text-xs text-blue-600">✉️ ${mesa.cliente_email}</p>` : ""}
            </div>
            `
                : ""
            }

            ${
              mesa.tiempo_ocupado_formateado
                ? `
            <div class="p-2 bg-red-50 border border-red-200 rounded">
              <p><strong>Tiempo ocupado:</strong></p>
              <p class="font-semibold text-red-800">${mesa.tiempo_ocupado_formateado}</p>
            </div>
            `
                : ""
            }

            ${
              mesa.hora_reserva
                ? `
            <div class="p-2 bg-blue-50 border border-blue-200 rounded">
              <p><strong>Reserva a las:</strong></p>
              <p class="font-semibold text-blue-800">${new Date(mesa.hora_reserva).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            `
                : ""
            }

            ${
              mesa.facturacion_actual > 0
                ? `
            <div class="p-2 bg-green-50 border border-green-200 rounded">
              <p><strong>Facturación actual:</strong></p>
              <p class="text-xl font-bold text-green-800">$${mesa.facturacion_actual.toLocaleString("es-CO")}</p>
            </div>
            `
                : ""
            }

            ${
              mesa.notas
                ? `
            <div class="p-2 bg-gray-50 border border-gray-200 rounded">
              <p><strong>Notas:</strong></p>
              <p class="text-sm text-gray-700">${mesa.notas}</p>
            </div>
            `
                : ""
            }
          </div>

          ${
            modoEditor
              ? `
            <div class="mt-3 p-3 bg-purple-50 border border-purple-200 rounded">
              <p class="text-xs text-purple-600"><strong>Modo Editor:</strong> Puedes arrastrar esta mesa a otra zona para reorganizarla.</p>
            </div>
            `
              : ""
          }
        </div>
      `,
      icon: undefined,
      confirmButtonText: modoEditor ? "Seleccionar Mesa" : "Cerrar",
      showCancelButton: modoEditor,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#6b7280",
      width: modoEditor ? "500px" : "450px",
      didOpen: () => {
        if (modoEditor) {
          setMesaSeleccionada(mesa);
        }
      },
    }).then((result) => {
      if (modoEditor && result.isConfirmed) {
        // Si está en modo editor y confirmó, mantener seleccionada
        setMesaSeleccionada(mesa);
        console.log("🎯 Mesa seleccionada en modo editor:", mesa.numero);
      }
    });
  };

  // Las funciones de drag and drop ya están definidas arriba

  const handleClickZona = (zona: Zona, e: React.MouseEvent) => {
    e.stopPropagation();
    if (modoEditor) {
      setZonaSeleccionada(zona);
      console.log("🏢 Zona seleccionada:", zona.nombre);
    }
  };

  const handleDoubleClickZona = async (zona: Zona, e: React.MouseEvent) => {
    e.stopPropagation();
    if (modoEditor) {
      await editarZona(zona);
    }
  };

  // Funciones de herramientas del editor
  const toggleCuadricula = () => {
    setMostrarCuadricula(!mostrarCuadricula);
  };

  const alinearMesas = async () => {
    const { value: alineacion } = await Swal.fire({
      title: "Alinear Mesas",
      text: "Selecciona el tipo de alineación:",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Horizontal",
      denyButtonText: "Vertical",
      cancelButtonText: "Cancelar",
    });

    if (alineacion !== undefined) {
      // Simular alineación
      setCambiosSinGuardar((prev) => prev + 1);
      await Swal.fire({
        title: "¡Alineación Completada!",
        text: `Mesas alineadas ${alineacion ? "horizontalmente" : "verticalmente"}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const configurarMesa = async () => {
    if (!mesaSeleccionada) {
      await Swal.fire({
        title: "Selecciona una mesa",
        text: "Primero debes seleccionar una mesa para configurar",
        icon: "warning",
        confirmButtonText: "Entendido",
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
              <option value="2" ${mesaSeleccionada.capacidad === 2 ? "selected" : ""}>2 personas</option>
              <option value="4" ${mesaSeleccionada.capacidad === 4 ? "selected" : ""}>4 personas</option>
              <option value="6" ${mesaSeleccionada.capacidad === 6 ? "selected" : ""}>6 personas</option>
              <option value="8" ${mesaSeleccionada.capacidad === 8 ? "selected" : ""}>8 personas</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Zona</label>
            <select id="zona" class="swal2-select">
              <option value="Interior" ${mesaSeleccionada.zona === "Interior" ? "selected" : ""}>Interior</option>
              <option value="Terraza" ${mesaSeleccionada.zona === "Terraza" ? "selected" : ""}>Terraza</option>
              <option value="VIP" ${mesaSeleccionada.zona === "VIP" ? "selected" : ""}>VIP</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Estado</label>
            <select id="estado" class="swal2-select">
              <option value="LIBRE" ${mesaSeleccionada.estado === "LIBRE" ? "selected" : ""}>Libre</option>
              <option value="OCUPADA" ${mesaSeleccionada.estado === "OCUPADA" ? "selected" : ""}>Ocupada</option>
              <option value="RESERVADA" ${mesaSeleccionada.estado === "RESERVADA" ? "selected" : ""}>Reservada</option>
              <option value="LIMPIEZA" ${mesaSeleccionada.estado === "LIMPIEZA" ? "selected" : ""}>Limpieza</option>
              <option value="MANTENIMIENTO" ${mesaSeleccionada.estado === "MANTENIMIENTO" ? "selected" : ""}>Mantenimiento</option>
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return {
          numero: (document.getElementById("numero") as HTMLInputElement)
            ?.value,
          capacidad: parseInt(
            (document.getElementById("capacidad") as HTMLSelectElement)?.value,
          ),
          zona: (document.getElementById("zona") as HTMLSelectElement)?.value,
          estado: (document.getElementById("estado") as HTMLSelectElement)
            ?.value,
        };
      },
    });

    if (formValues) {
      setCambiosSinGuardar((prev) => prev + 1);
      await Swal.fire({
        title: "¡Mesa Actualizada!",
        text: `Configuración de mesa ${formValues.numero} guardada correctamente`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const eliminarZona = async (zona: Zona) => {
    const result = await Swal.fire({
      title: "¿Eliminar Zona?",
      text: `Se eliminará la zona "${zona.nombre}". Las mesas de esta zona quedarán sin asignar.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setZonas((prev) => prev.filter((z) => z.id !== zona.id));
      setZonaSeleccionada(null);
      setCambiosSinGuardar((prev) => prev + 1);

      await Swal.fire({
        title: "Zona Eliminada",
        text: `La zona "${zona.nombre}" ha sido eliminada`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const crearNuevaZona = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Nueva Zona",
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
      confirmButtonText: "Crear Zona",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = (
          document.getElementById("nombreZona") as HTMLInputElement
        )?.value;
        if (!nombre || nombre.trim() === "") {
          Swal.showValidationMessage("El nombre de la zona es obligatorio");
          return false;
        }
        return {
          nombre: nombre.trim(),
          colorHex: (document.getElementById("colorZona") as HTMLSelectElement)
            ?.value,
          ancho: parseInt(
            (document.getElementById("anchoZona") as HTMLInputElement)?.value,
          ),
          alto: parseInt(
            (document.getElementById("altoZona") as HTMLInputElement)?.value,
          ),
        };
      },
    });

    if (formValues) {
      const nuevaZona = {
        id: Date.now(),
        nombre: formValues.nombre,
        mesas: 0,
        ocupadas: 0,
        color: `bg-${formValues.colorHex.substring(1)}-500`,
        colorHex: formValues.colorHex,
        posicion_x: 100,
        posicion_y: 100,
        ancho: formValues.ancho,
        alto: formValues.alto,
      };

      setZonas((prev) => [...prev, nuevaZona]);
      setCambiosSinGuardar((prev) => prev + 1);

      await Swal.fire({
        title: "¡Zona Creada!",
        text: `Zona "${formValues.nombre}" creada correctamente`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
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
              <option value="#3b82f6" ${zona.colorHex === "#3b82f6" ? "selected" : ""}>Azul</option>
              <option value="#10b981" ${zona.colorHex === "#10b981" ? "selected" : ""}>Verde</option>
              <option value="#8b5cf6" ${zona.colorHex === "#8b5cf6" ? "selected" : ""}>Morado</option>
              <option value="#f59e0b" ${zona.colorHex === "#f59e0b" ? "selected" : ""}>Naranja</option>
              <option value="#ef4444" ${zona.colorHex === "#ef4444" ? "selected" : ""}>Rojo</option>
              <option value="#6b7280" ${zona.colorHex === "#6b7280" ? "selected" : ""}>Gris</option>
              <option value="#ec4899" ${zona.colorHex === "#ec4899" ? "selected" : ""}>Rosa</option>
              <option value="#14b8a6" ${zona.colorHex === "#14b8a6" ? "selected" : ""}>Turquesa</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Ancho (px)</label>
            <input id="anchoZona" class="swal2-input" type="number" value="${zona.ancho}" min="150" max="500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Alto (px)</label>
            <input id="altoZona" class="swal2-input" type="number" value="${zona.alto}" min="120" max="400" />
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = (
          document.getElementById("nombreZona") as HTMLInputElement
        )?.value;
        if (!nombre || nombre.trim() === "") {
          Swal.showValidationMessage("El nombre de la zona es obligatorio");
          return false;
        }
        return {
          nombre: nombre.trim(),
          colorHex: (document.getElementById("colorZona") as HTMLSelectElement)
            ?.value,
          ancho: parseInt(
            (document.getElementById("anchoZona") as HTMLInputElement)?.value,
          ),
          alto: parseInt(
            (document.getElementById("altoZona") as HTMLInputElement)?.value,
          ),
        };
      },
    });

    if (formValues) {
      setZonas((prev) =>
        prev.map((z) =>
          z.id === zona.id
            ? {
                ...z,
                nombre: formValues.nombre,
                colorHex: formValues.colorHex,
                color: `bg-${formValues.colorHex.substring(1)}-500`,
                ancho: formValues.ancho,
                alto: formValues.alto,
              }
            : z,
        ),
      );
      setCambiosSinGuardar((prev) => prev + 1);

      await Swal.fire({
        title: "¡Zona Actualizada!",
        text: `Zona "${formValues.nombre}" actualizada correctamente`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const moverZona = (
    zonaId: string,
    nuevaPosicion: { x: number; y: number },
  ) => {
    setZonas((prev) =>
      prev.map((zona) =>
        zona.id === zonaId
          ? {
              ...zona,
              posicion_x: nuevaPosicion.x,
              posicion_y: nuevaPosicion.y,
            }
          : zona,
      ),
    );
    setCambiosSinGuardar((prev) => prev + 1);
  };

  // Funciones para códigos QR
  const generarQRMesa = async (mesa: any) => {
    try {
      // Generar URL única para la mesa
      const baseUrl = "https://tu-restaurante.com";
      const mesaUrl = `${baseUrl}/mesa/${mesa.numero}?id=${mesa.id}&zona=${mesa.zona}&cap=${mesa.capacidad}`;

      // Generar el código QR
      const qrDataURL = await QRCode.toDataURL(mesaUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return {
        dataURL: qrDataURL,
        url: mesaUrl,
      };
    } catch (error) {
      console.error("Error generando QR:", error);
      throw error;
    }
  };

  const handleGenerarQRIndividual = async (mesa: any) => {
    const result = await Swal.fire({
      title: "⚠️ Generar Código QR",
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
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Generar QR",
      cancelButtonText: "Cancelar",
      width: "500px",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Generando QR...",
          text: "Por favor espera",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
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
          icon: "success",
          showConfirmButton: false,
          showCloseButton: true,
          width: "400px",
          didOpen: () => {
            const descargarBtn = document.getElementById("descargarQR");
            const copiarBtn = document.getElementById("copiarURL");

            descargarBtn?.addEventListener("click", () => {
              descargarQR(qrData.dataURL, `Mesa_${mesa.numero}_QR`);
            });

            copiarBtn?.addEventListener("click", () => {
              navigator.clipboard.writeText(qrData.url);
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "URL copiada al portapapeles",
                showConfirmButton: false,
                timer: 2000,
              });
            });
          },
        });
      } catch (error) {
        await Swal.fire({
          title: "Error",
          text: "Hubo un problema al generar el código QR",
          icon: "error",
        });
      }
    }
  };

  const handleGenerarQRMasivo = async () => {
    const result = await Swal.fire({
      title: "⚠️ Generar Códigos QR Masivo",
      html: `
        <div class="text-left">
          <p class="mb-4">¿Deseas generar códigos QR para <strong>todas las mesas</strong>?</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-800">
              <strong>⚠️ Atención:</strong><br>
              • Se generarán ${mesas.length} códigos QR<br>
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
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Generar Todo",
      cancelButtonText: "Cancelar",
      width: "500px",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Generando códigos QR...",
          html: "Procesando mesa <b>1</b> de <b>" + mesas.length + "</b>",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Generar QR para todas las mesas
        const qrPromises = mesas.map(async (mesa, index) => {
          // Actualizar progreso
          Swal.getHtmlContainer()!.querySelector("b")!.textContent = (
            index + 1
          ).toString();

          const qrData = await generarQRMesa(mesa);
          return {
            mesa,
            qrData,
          };
        });

        const resultados = await Promise.all(qrPromises);

        // Crear un archivo ZIP (simulado con descarga múltiple)
        await Swal.fire({
          title: "¡QR Generados!",
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
          icon: "success",
          showConfirmButton: false,
          showCloseButton: true,
          width: "450px",
          didOpen: () => {
            const descargarBtn = document.getElementById("descargarTodos");
            descargarBtn?.addEventListener("click", async () => {
              for (const resultado of resultados) {
                await new Promise((resolve) => setTimeout(resolve, 500)); // Delay entre descargas
                descargarQR(
                  resultado.qrData.dataURL,
                  `Mesa_${resultado.mesa.numero}_QR`,
                );
              }

              // También generar archivo de texto con URLs
              const urls = resultados
                .map((r) => `Mesa ${r.mesa.numero}: ${r.qrData.url}`)
                .join("\n");
              descargarTexto(urls, "URLs_Mesas_QR.txt");

              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Descarga completada",
                showConfirmButton: false,
                timer: 3000,
              });
            });
          },
        });
      } catch (error) {
        await Swal.fire({
          title: "Error",
          text: "Hubo un problema al generar los códigos QR masivos",
          icon: "error",
        });
      }
    }
  };

  const descargarQR = (dataURL: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const descargarTexto = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
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
      {
        id: "1",
        guestName: "Juan Pérez",
        tableNumber: "01",
        time: "20:00",
        covers: 2,
        guestPhone: "+56912345678",
      },
      {
        id: "2",
        guestName: "María García",
        tableNumber: "03",
        time: "19:30",
        covers: 4,
        guestPhone: "+56987654321",
      },
      {
        id: "3",
        guestName: "Carlos López",
        tableNumber: "04",
        time: "21:00",
        covers: 2,
        guestPhone: "+56955443322",
      },
      {
        id: "4",
        guestName: "Ana Martín",
        tableNumber: "07",
        time: "20:30",
        covers: 3,
        guestPhone: "+56911223344",
      },
      {
        id: "5",
        guestName: "Roberto Silva",
        tableNumber: mesa.numero,
        time: "19:00",
        covers: 4,
        guestPhone: "+56933445566",
      },
    ];

    // Buscar si hay una reserva para esta mesa hoy
    const reservaEncontrada = reservasHoy.find(
      (r) => r.tableNumber === mesa.numero,
    );

    if (reservaEncontrada) {
      // Mostrar confirmación de llegada automática
      const result = await Swal.fire({
        title: "🎉 ¡Reserva Detectada!",
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
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Confirmar Llegada",
        cancelButtonText: "No es mi reserva",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        width: "500px",
      });

      if (result.isConfirmed) {
        // Marcar llegada y mostrar mensaje de bienvenida
        await Swal.fire({
          title: "✅ ¡Bienvenido a nuestro restaurante!",
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
                    Registrado a las ${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
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
          icon: "success",
          confirmButtonText: "Ver Menú Digital",
          confirmButtonColor: "#3b82f6",
          timer: 8000,
          timerProgressBar: true,
          width: "550px",
        });

        // Registrar llegada automática en el sistema global
        ArrivalsManager.addArrival({
          guestName: reservaEncontrada.guestName,
          tableNumber: mesa.numero,
          type: "automatic",
        });
      }
    } else {
      // No hay reserva para esta mesa
      await Swal.fire({
        title: "❌ No hay reservas para esta mesa",
        html: `
          <div class="text-center">
            <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-yellow-800">Mesa ${mesa.numero}</p>
              <p class="text-yellow-700">No encontramos ninguna reserva para esta mesa hoy</p>
            </div>

            <div class="text-left bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-blue-800">
                <strong>¿Deseas hacer una asignación manual?</strong><br>
                • Puedes usar el botón "Asignar Cliente"<br>
                • Solicitar al cliente sus datos<br>
                • Registrar el número de mesa
              </p>
            </div>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#f59e0b",
      });

      // Recargar la página para reflejar los cambios
      window.location.reload();

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Cliente asignado exitosamente",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleVisualizarQRMesa = async (mesa: any) => {
    try {
      Swal.fire({
        title: "Generando vista previa...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
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
        icon: "info",
        confirmButtonText: "Cerrar",
        width: "400px",
      });
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "No se pudo generar la vista previa del código QR",
        icon: "error",
      });
    }
  };



  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mesas</h1>
          <p className="text-gray-600 mt-2">
            Control inteligente de ocupación y estado
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => cargarDatos()}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
            disabled={loading}
          >
            <RotateCcw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refrescar
          </Button>
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
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Mesas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {estadisticasGenerales.totalMesas}
                </p>
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
                <p className="text-2xl font-bold text-red-600">
                  {estadisticasGenerales.mesasOcupadas}
                </p>
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
                <p className="text-2xl font-bold text-green-600">
                  {estadisticasGenerales.mesasLibres}
                </p>
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
                <p className="text-2xl font-bold text-purple-600">
                  {estadisticasGenerales.ocupacionPromedio}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principal */}
      <Tabs
        value={vistaActiva}
        onValueChange={setVistaActiva}
        className="w-full"
      >
        <TabsList
          className={`grid w-full ${modoEditor ? "grid-cols-5" : "grid-cols-4"}`}
        >
          <TabsTrigger value="cuadricula">Vista Cuadrícula</TabsTrigger>
          <TabsTrigger value="mapa">Mapa de Mesas</TabsTrigger>
          <TabsTrigger value="qr-codes" className="text-orange-700">
            <QrCode className="w-4 h-4 mr-2" />
            Códigos QR
          </TabsTrigger>
          {modoEditor && (
            <TabsTrigger
              value="editor"
              className="bg-purple-50 text-purple-700"
            >
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
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="libre">Libres</SelectItem>
                    <SelectItem value="ocupada">Ocupadas</SelectItem>
                    <SelectItem value="reservada">Reservadas</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroZona} onValueChange={setFiltroZona}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por zona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las zonas</SelectItem>
                    {zonas.map((zona) => (
                      <SelectItem key={zona.id} value={zona.nombre}>
                        {zona.nombre}
                      </SelectItem>
                    ))}
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
                    <CardTitle className="text-lg lg:text-xl font-bold">
                      Mesa {mesa.numero}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`${getEstadoColor(mesa.estado)} flex items-center gap-1 text-xs`}
                    >
                      {getEstadoIcon(mesa.estado)}
                      <span className="hidden sm:inline">
                        {mesa.estado.charAt(0).toUpperCase() +
                          mesa.estado.slice(1)}
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
                      {mesa.zona_nombre || "Sin zona"}
                    </span>
                  </div>

                  {mesa.cliente_actual && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                      <Users className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="truncate">
                        <span className="hidden sm:inline">Cliente: </span>
                        {mesa.cliente_actual}
                      </span>
                    </div>
                  )}

                  {mesa.tiempo_ocupado_formateado && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                      <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>
                        <span className="hidden sm:inline">Tiempo: </span>
                        {mesa.tiempo_ocupado_formateado}
                      </span>
                    </div>
                  )}

                  {mesa.facturacion_actual > 0 && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                      <DollarSign className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>
                        <span className="hidden sm:inline">Facturación: </span>$
                        {mesa.facturacion_actual.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Acciones - Mobile Optimized */}
                  <div className="space-y-2 mt-3 lg:mt-4">
                    {/* Fila 1: Acciones principales */}
                    <div className="flex gap-1.5 lg:gap-2">
                      {mesa.estado === "OCUPADA" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Debug: mostrar datos de la mesa antes de liberar
                              console.log(
                                "🖱️ Click en Liberar Mesa - Datos completos:",
                                {
                                  id: mesa.id,
                                  numero: mesa.numero,
                                  estado: mesa.estado,
                                  cliente_actual: mesa.cliente_actual,
                                  zona_nombre: mesa.zona_nombre,
                                  objeto_completo: mesa,
                                },
                              );
                              handleAccionMesa("liberar", mesa);
                            }}
                            className="flex-1 text-xs h-8 btn-mobile"
                          >
                            <CheckCircle2 className="w-3 h-3 lg:mr-1" />
                            <span className="hidden sm:inline ml-1">
                              Liberar
                            </span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAccionMesa("limpiar", mesa);
                            }}
                            className="flex-1 text-xs h-8 btn-mobile"
                          >
                            <RotateCcw className="w-3 h-3 lg:mr-1" />
                            <span className="hidden sm:inline ml-1">
                              Limpiar
                            </span>
                          </Button>
                        </>
                      )}

                      {mesa.estado === "LIBRE" && (
                        <Button
                          size="sm"
                          className="w-full text-xs h-8 bg-green-600 hover:bg-green-700 text-white btn-mobile"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAsignarCliente(mesa);
                          }}
                        >
                          <Users className="w-3 h-3 lg:mr-1" />
                          <span className="hidden sm:inline ml-1">
                            Asignar Cliente
                          </span>
                          <span className="sm:hidden ml-1">Asignar</span>
                        </Button>
                      )}

                      {(mesa.estado === "LIMPIEZA" ||
                        mesa.estado === "MANTENIMIENTO") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAccionMesa("activar", mesa);
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
              <div
                className="bg-gray-50 p-6 rounded-lg min-h-[600px] relative"
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  e.preventDefault();
                  // Solo procesar drop si no es sobre una zona específica
                  const targetElement = e.target as HTMLElement;
                  const zonaElement = targetElement.closest("[data-zona-id]");

                  if (!zonaElement) {
                    console.log("⚠️ Drop fuera de cualquier zona, ignorando");
                    return;
                  }

                  // Buscar la zona y llamar handleDrop con la zona correcta
                  const zonaId = zonaElement.getAttribute("data-zona-id");
                  const targetZona = zonas.find((z) => z.id === zonaId);

                  if (targetZona) {
                    console.log(
                      "🎯 Drop sobre zona desde contenedor principal:",
                      targetZona.nombre,
                    );
                    handleDrop(e, targetZona);
                  }
                }}
              >
                {/* Debug - Información del estado actual */}
                <div className="absolute top-2 left-2 bg-white p-2 rounded text-xs shadow-md z-10">
                  <p>Zonas: {zonas.length}</p>
                  <p>Mesas: {mesas.length}</p>
                  <p>
                    Mesas con zona: {mesas.filter((m) => m.zona_nombre).length}
                  </p>
                  <p>
                    Mesas sin zona:{" "}
                    {mesas.filter((m) => !m.zona_nombre && !m.zona_id).length}
                  </p>
                </div>

                {/* Renderizar zonas dinámicamente */}
                {zonas.map((zona) => {
                  const mesasEnZona = mesas.filter(
                    (m) =>
                      m.zona_nombre === zona.nombre || m.zona_id === zona.id,
                  );

                  // Calcular dimensiones necesarias basadas en las mesas
                  const mesasCount = mesasEnZona.length;
                  const minCols = 3;
                  const mesaSize = 48; // Tamaño de mesa
                  const gap = 8; // Gap entre mesas
                  const padding = 32; // Padding interno
                  const headerHeight = 40; // Altura del header

                  const cols = Math.max(
                    minCols,
                    Math.min(4, Math.ceil(Math.sqrt(mesasCount))),
                  );
                  const rows = Math.ceil(mesasCount / cols);

                  const calculatedWidth = Math.max(
                    Number(zona.ancho) || 200,
                    cols * mesaSize + (cols - 1) * gap + padding * 2,
                  );
                  const calculatedHeight = Math.max(
                    Number(zona.alto) || 150,
                    rows * mesaSize +
                      (rows - 1) * gap +
                      padding * 2 +
                      headerHeight,
                  );

                  // Debug logging para dimensiones
                  console.log(`📐 Zona ${zona.nombre} - Auto-resize:`, {
                    mesas_count: mesasCount,
                    original: { w: zona.ancho, h: zona.alto },
                    calculated: { w: calculatedWidth, h: calculatedHeight },
                    grid: { cols, rows },
                    mesas: mesasEnZona.map((m) => m.numero),
                  });

                  return (
                    <div
                      key={zona.id}
                      data-zona-id={zona.id}
                      className={`absolute p-4 rounded-lg border-2 cursor-move hover:shadow-lg transition-all ${
                        dragOverZone === zona.id
                          ? "ring-4 ring-green-400 ring-opacity-50 shadow-xl scale-105 bg-green-50"
                          : ""
                      }`}
                      style={{
                        backgroundColor: zona.color_hex + "20",
                        borderColor: zona.color_hex,
                        left: `${zona.posicion_x}px`,
                        top: `${zona.posicion_y}px`,
                        width: `${calculatedWidth}px`,
                        height: `${calculatedHeight}px`,
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, zona)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOverZona(e, zona)}
                      onDragLeave={(e) => handleDragLeaveZona(zona)}
                      onDrop={(e) => {
                        console.log("🎯 Drop en zona (editor):", zona.nombre);
                        e.preventDefault();
                        e.stopPropagation();
                        handleDrop(e, zona);
                      }}
                    >
                      <h3
                        className="font-semibold mb-3"
                        style={{ color: zona.color_hex }}
                      >
                        ZONA {zona.nombre.toUpperCase()}
                      </h3>
                      <div
                        className="grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${cols}, 1fr)`,
                          width: "100%",
                        }}
                      >
                        {mesasEnZona.map((mesa) => (
                          <div
                            key={mesa.id}
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, mesa);
                            }}
                            className={`w-12 h-12 rounded border-2 flex items-center justify-center text-xs font-bold cursor-move hover:scale-105 transition-all ${
                              mesa.estado === "OCUPADA"
                                ? "bg-red-200 border-red-400 text-red-800"
                                : mesa.estado === "LIBRE"
                                  ? "bg-green-200 border-green-400 text-green-800"
                                  : mesa.estado === "RESERVADA"
                                    ? "bg-blue-200 border-blue-400 text-blue-800"
                                    : "bg-gray-200 border-gray-400 text-gray-800"
                            } ${
                              mesaSeleccionada?.id === mesa.id
                                ? "ring-4 ring-purple-400 ring-opacity-100 shadow-xl scale-110 bg-purple-50"
                                : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClickMesa && handleClickMesa(mesa);
                            }}
                            title={`Mesa ${mesa.numero} - ${mesa.estado} - Zona: ${zona.nombre}`}
                          >
                            {mesa.numero}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Mostrar información de estado */}
                {zonas.length === 0 && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-600">No hay zonas configuradas</p>
                      <p className="text-sm text-gray-500">
                        Las mesas se mostrarán abajo
                      </p>
                    </div>
                  </div>
                )}

                {/* Mesas sin zona */}
                {mesas.filter((m) => !m.zona_nombre && !m.zona_id).length >
                  0 && (
                  <div className="absolute bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg border-2 border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <h4 className="font-semibold text-sm text-orange-800">
                        Mesas sin Zona
                      </h4>
                    </div>
                    <p className="text-xs text-orange-600 mb-3 bg-orange-50 p-2 rounded-lg">
                      🎯 Arrastra estas mesas a cualquier zona para asignarlas
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {mesas
                        .filter((m) => !m.zona_nombre && !m.zona_id)
                        .map((mesa) => (
                          <div
                            key={mesa.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, mesa)}
                            onDragEnd={handleDragEnd}
                            className={`w-10 h-10 rounded-lg border-2 text-xs font-bold flex items-center justify-center cursor-move transition-all duration-200 hover:scale-110 hover:shadow-md ${
                              draggedItem?.id === mesa.id
                                ? "opacity-50 scale-95 rotate-3"
                                : ""
                            } ${
                              mesa.estado === "OCUPADA"
                                ? "bg-red-200 border-red-400 text-red-800"
                                : mesa.estado === "LIBRE"
                                  ? "bg-green-200 border-green-400 text-green-800"
                                  : "bg-gray-200 border-gray-400 text-gray-800"
                            }`}
                            title={`Mesa ${mesa.numero} - ${mesa.estado} - Click y arrastra a una zona`}
                          >
                            {mesa.numero}
                          </div>
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {mesas.filter((m) => !m.zona_nombre && !m.zona_id).length}{" "}
                      mesa(s) por asignar
                    </div>
                  </div>
                )}

                {/* Leyenda */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border">
                  <h4 className="font-medium text-sm mb-2">Leyenda</h4>
                  <div className="space-y-1">
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
                      <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
                      <span>Limpieza</span>
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
                <div className="flex gap-3">
                  <Button
                    onClick={() => cargarDatos()}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    disabled={loading}
                  >
                    <RotateCcw
                      className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                    />
                    Refrescar
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleGenerarQRMasivo();
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generar QR Masivo
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
                      <h3 className="font-semibold text-gray-900">
                        Códigos Únicos
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cada mesa tiene su QR exclusivo
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Experiencia Cliente
                      </h3>
                      <p className="text-sm text-gray-600">
                        Acceso directo desde móvil
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Control Estado
                      </h3>
                      <p className="text-sm text-gray-600">
                        Seguimiento en tiempo real
                      </p>
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
                {mesas.map((mesa) => (
                  <div
                    key={mesa.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Mesa {mesa.numero}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {mesa.zona_nombre || "Sin zona"} • {mesa.capacidad}{" "}
                          personas
                        </p>
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
                        <span>
                          URL: https://tu-restaurante.com/mesa/{mesa.numero}
                        </span>
                      </div>

                      {mesa.cliente_actual && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>Cliente actual: {mesa.cliente_actual}</span>
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
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Genera el código QR</p>
                      <p className="text-gray-600">
                        Cada mesa obtiene un código único e intransferible
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Coloca el código en la mesa</p>
                      <p className="text-gray-600">
                        Imprime y coloca de forma visible para los clientes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Cliente escanea el código</p>
                      <p className="text-gray-600">
                        Acceso directo al menú, pedidos y experiencia digital
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Control automático</p>
                      <p className="text-gray-600">
                        El sistema identifica la mesa y gestiona el estado
                        automáticamente
                      </p>
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
                    <p className="font-medium text-yellow-800 mb-1">
                      ⚠️ Códigos Únicos
                    </p>
                    <p className="text-yellow-700">
                      Cada mesa debe tener su código único. No dupliques códigos
                      entre mesas.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="font-medium text-blue-800 mb-1">
                      💡 Ubicación Visible
                    </p>
                    <p className="text-blue-700">
                      Coloca el QR en un lugar fácil de ver y escanear por los
                      clientes.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-medium text-green-800 mb-1">
                      ✅ Mantenimiento
                    </p>
                    <p className="text-green-700">
                      Revisa periódicamente que los códigos estén en buen estado
                      y funcionen.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="font-medium text-purple-800 mb-1">
                      🔄 Regeneración
                    </p>
                    <p className="text-purple-700">
                      Puedes regenerar códigos en cualquier momento si es
                      necesario.
                    </p>
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
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    Instrucciones
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Arrastra mesas y zonas para reorganizar</li>
                    <li>• Click simple: Seleccionar</li>
                    <li>• Doble click en zona: Editar propiedades</li>
                    <li>• Usar "Nueva Zona" para agregar áreas</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    Herramientas
                  </h4>
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        crearMesaSinZona();
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Mesa Debug
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
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    Estado
                  </h4>
                  <p
                    className={`text-xs ${cambiosSinGuardar > 0 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {cambiosSinGuardar > 0 ? "⚠" : "✓"} Cambios sin guardar:{" "}
                    {cambiosSinGuardar}
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
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  e.preventDefault();
                  // Solo procesar drop si no es sobre una zona específica
                  const targetElement = e.target as HTMLElement;
                  const zonaElement = targetElement.closest("[data-zona-id]");

                  if (!zonaElement) {
                    console.log("⚠️ Drop fuera de cualquier zona, ignorando");
                    return;
                  }

                  // Buscar la zona y llamar handleDrop con la zona correcta
                  const zonaId = zonaElement.getAttribute("data-zona-id");
                  const targetZona = zonas.find((z) => z.id === zonaId);

                  if (targetZona) {
                    console.log(
                      "🎯 Drop sobre zona desde contenedor principal:",
                      targetZona.nombre,
                    );
                    handleDrop(e, targetZona);
                  }
                }}
              >
                {/* Debug - Información del estado actual */}
                <div className="absolute top-2 left-2 bg-white p-3 rounded-lg text-xs shadow-lg z-10 max-w-xs">
                  <h4 className="font-semibold mb-2 text-purple-700">
                    Debug Panel
                  </h4>
                  <div className="space-y-1">
                    <p>Zonas: {zonas.length}</p>
                    <p>Mesas: {mesas.length}</p>
                    <p className="text-orange-600">
                      Mesas sin zona:{" "}
                      {mesas.filter((m) => !m.zona_nombre && !m.zona_id).length}
                    </p>
                    <p>Cambios sin guardar: {cambiosSinGuardar}</p>
                    {draggedItem && (
                      <p className="text-blue-600">
                        Arrastrando:{" "}
                        {"numero" in draggedItem
                          ? `Mesa ${draggedItem.numero}`
                          : `Zona ${draggedItem.nombre}`}
                      </p>
                    )}
                    {dragOverZone && (
                      <p className="text-green-600">
                        Hover en zona:{" "}
                        {zonas.find((z) => z.id === dragOverZone)?.nombre}
                      </p>
                    )}
                    {zonaSeleccionada && (
                      <p>Zona seleccionada: {zonaSeleccionada.nombre}</p>
                    )}
                    {mesaSeleccionada && (
                      <p>Mesa seleccionada: {mesaSeleccionada.numero}</p>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-gray-500">Mesas sin zona:</p>
                    {mesas
                      .filter((m) => !m.zona_nombre && !m.zona_id)
                      .map((m) => (
                        <div key={m.id} className="text-orange-600">
                          #{m.numero} (id: {m.id?.slice(0, 8)}...) zona_id:{" "}
                          {m.zona_id}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Renderizar zonas dinámicamente - Editables */}
                {zonas.map((zona) => {
                  const mesasEnZona = mesas.filter(
                    (m) =>
                      m.zona_nombre === zona.nombre || m.zona_id === zona.id,
                  );

                  // Calcular dimensiones necesarias basadas en las mesas
                  const mesasCount = mesasEnZona.length;
                  const minCols = 3;
                  const mesaSize = 48;
                  const gap = 8;
                  const padding = 32;
                  const headerHeight = 60; // Más alto para el editor

                  const cols = Math.max(
                    minCols,
                    Math.min(5, Math.ceil(Math.sqrt(mesasCount))),
                  );
                  const rows = Math.ceil(mesasCount / cols);

                  const calculatedWidth = Math.max(
                    Number(zona.ancho) || 200,
                    cols * mesaSize + (cols - 1) * gap + padding * 2,
                  );
                  const calculatedHeight = Math.max(
                    Number(zona.alto) || 150,
                    rows * mesaSize +
                      (rows - 1) * gap +
                      padding * 2 +
                      headerHeight,
                  );

                  // Debug logging para editor
                  if (zona.nombre === "INTERIOR" || mesasCount > 10) {
                    console.log(`📐 EDITOR - Zona ${zona.nombre}:`, {
                      mesas_count: mesasCount,
                      grid: { cols, rows },
                      dimensions: {
                        original: `${zona.ancho}x${zona.alto}`,
                        calculated: `${calculatedWidth}x${calculatedHeight}`,
                      },
                    });
                  }

                  return (
                    <div
                      key={zona.id}
                      data-zona-id={zona.id}
                      className={`absolute p-4 rounded-lg border-2 cursor-move hover:shadow-lg transition-all ${
                        dragOverZone === zona.id
                          ? "ring-4 ring-green-400 ring-opacity-50 shadow-xl scale-105 bg-green-50"
                          : ""
                      }`}
                      style={{
                        backgroundColor: zona.color_hex + "20",
                        borderColor: zona.color_hex,
                        left: `${zona.posicion_x}px`,
                        top: `${zona.posicion_y}px`,
                        width: `${calculatedWidth}px`,
                        height: `${calculatedHeight}px`,
                      }}
                      onClick={(e) => handleClickZona(zona, e)}
                      onDoubleClick={(e) => handleDoubleClickZona(zona, e)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, zona)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOverZona(e, zona)}
                      onDragLeave={(e) => handleDragLeaveZona(zona)}
                      onDrop={(e) => {
                        console.log("🎯 Drop en zona:", zona.nombre);
                        e.preventDefault();
                        e.stopPropagation();
                        handleDrop(e, zona);
                      }}
                    >
                      <div
                        className="flex items-center justify-between mb-3 pointer-events-none"
                        style={{ color: zona.color_hex }}
                      >
                        <h3 className="font-semibold text-sm uppercase tracking-wide">
                          {zona.nombre}
                        </h3>
                        <div className="text-xs opacity-60">
                          {
                            mesas.filter(
                              (m) =>
                                m.zona_id === zona.id ||
                                m.zona_nombre === zona.nombre,
                            ).length
                          }{" "}
                          mesas
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
                      <div
                        className="grid gap-2 flex-1"
                        style={{
                          gridTemplateColumns: `repeat(${cols}, 1fr)`,
                          width: "100%",
                        }}
                      >
                        {mesasEnZona.map((mesa) => (
                          <div
                            key={mesa.id}
                            className={`w-12 h-12 rounded border-2 flex items-center justify-center text-xs font-bold cursor-move hover:scale-110 transition-all shadow-md ${
                              mesa.estado === "OCUPADA"
                                ? "bg-red-200 border-red-400 text-red-800"
                                : mesa.estado === "LIBRE"
                                  ? "bg-green-200 border-green-400 text-green-800"
                                  : mesa.estado === "RESERVADA"
                                    ? "bg-blue-200 border-blue-400 text-blue-800"
                                    : "bg-gray-200 border-gray-400 text-gray-800"
                            } ${
                              mesaSeleccionada?.id === mesa.id
                                ? "ring-4 ring-purple-400 ring-opacity-100 shadow-xl scale-110 bg-purple-50"
                                : ""
                            }`}
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, mesa);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClickMesa(mesa);
                            }}
                            title={`Mesa ${mesa.numero} - ${mesa.estado} - Zona: ${zona.nombre}`}
                          >
                            {mesa.numero}
                          </div>
                        ))}
                      </div>

                      {/* Indicador de auto-resize */}
                      <div
                        className="absolute bottom-1 right-1 text-xs opacity-50"
                        style={{ color: zona.color_hex }}
                        title={`Auto: ${calculatedWidth}x${calculatedHeight}px`}
                      >
                        📐
                      </div>
                    </div>
                  );
                })}

                {/* Cuadrícula de guías */}
                {mostrarCuadricula && (
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="#9333ea"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )}

                {/* Instrucciones de ayuda */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-lg border shadow-lg max-w-md">
                  <p className="text-xs text-gray-700 text-center">
                    <Move3D className="w-4 h-4 inline mr-1" />
                    Arrastra las zonas y mesas para reorganizar
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Click simple: seleccionar • Doble click: editar • Los
                    cambios se marcan arriba
                  </p>
                </div>

                {/* Mostrar información de estado */}
                {zonas.length === 0 && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-600">No hay zonas configuradas</p>
                      <p className="text-sm text-gray-500">
                        Las mesas se mostrarán abajo
                      </p>
                    </div>
                  </div>
                )}

                {/* Mesas sin zona */}
                {mesas.filter((m) => !m.zona_nombre && !m.zona_id).length >
                  0 && (
                  <div className="absolute bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg border-2 border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <h4 className="font-semibold text-sm text-orange-800">
                        Mesas sin Zona
                      </h4>
                    </div>
                    <p className="text-xs text-orange-600 mb-3 bg-orange-50 p-2 rounded-lg">
                      🎯 Arrastra estas mesas a cualquier zona para asignarlas
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {mesas
                        .filter((m) => !m.zona_nombre && !m.zona_id)
                        .map((mesa) => (
                          <div
                            key={mesa.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, mesa)}
                            onDragEnd={handleDragEnd}
                            className={`w-10 h-10 rounded-lg border-2 text-xs font-bold flex items-center justify-center cursor-move transition-all duration-200 hover:scale-110 hover:shadow-md ${
                              draggedItem?.id === mesa.id
                                ? "opacity-50 scale-95 rotate-3"
                                : ""
                            } ${
                              mesa.estado === "OCUPADA"
                                ? "bg-red-200 border-red-400 text-red-800"
                                : mesa.estado === "LIBRE"
                                  ? "bg-green-200 border-green-400 text-green-800"
                                  : "bg-gray-200 border-gray-400 text-gray-800"
                            }`}
                            title={`Mesa ${mesa.numero} - ${mesa.estado} - Click y arrastra a una zona`}
                          >
                            {mesa.numero}
                          </div>
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {mesas.filter((m) => !m.zona_nombre && !m.zona_id).length}{" "}
                      mesa(s) por asignar
                    </div>
                  </div>
                )}

                {/* Leyenda */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border">
                  <h4 className="font-medium text-sm mb-2">Leyenda</h4>
                  <div className="space-y-1">
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
                      <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
                      <span>Limpieza</span>
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

        <TabsContent value="estadisticas" className="space-y-6">
          {/* Métricas por Zona */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zonas.map((zona) => (
              <Card key={zona.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: zona.color_hex }}
                    ></div>
                    {zona.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ocupación</span>
                      <span className="font-semibold">
                        {
                          mesas.filter(
                            (m) =>
                              m.zona_id === zona.id && m.estado === "OCUPADA",
                          ).length
                        }
                        /{mesas.filter((m) => m.zona_id === zona.id).length}
                      </span>
                    </div>
                    <Progress
                      value={
                        mesas.filter((m) => m.zona_id === zona.id).length > 0
                          ? (mesas.filter(
                              (m) =>
                                m.zona_id === zona.id && m.estado === "OCUPADA",
                            ).length /
                              mesas.filter((m) => m.zona_id === zona.id)
                                .length) *
                            100
                          : 0
                      }
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                      {mesas.filter((m) => m.zona_id === zona.id).length > 0
                        ? Math.round(
                            (mesas.filter(
                              (m) =>
                                m.zona_id === zona.id && m.estado === "OCUPADA",
                            ).length /
                              mesas.filter((m) => m.zona_id === zona.id)
                                .length) *
                              100,
                          )
                        : 0}
                      % ocupación
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Dimensiones:</span>
                      <span>
                        {zona.ancho}x{zona.alto}px
                      </span>
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

      {/* Modal para Asignar Cliente a Mesa */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Asignar Cliente a Mesa
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Ingresa los datos del cliente para asignarlo a la mesa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Información de la mesa */}
            {selectedMesa && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Mesa {selectedMesa.numero}
                  </span>
                  <span className="text-sm text-blue-600">
                    • Zona {selectedMesa.zona_nombre || "Sin zona"}
                  </span>
                </div>
              </div>
            )}

            {/* Formulario */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                  Nombre del Cliente <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                  Teléfono <span className="text-gray-400">(opcional)</span>
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-gray-400">(opcional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignModal(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignSubmit}
              disabled={!formData.nombre.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Asignando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Asignar</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
