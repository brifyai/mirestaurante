"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

// Tipos de datos
interface Restaurant {
  id: string;
  name: string;
  location?: string;
  type?: "principal" | "sucursal";
  image?: string;
  status: "activo" | "mantenimiento" | "cerrado";
  user_id: string;
  slug: string;
  template?: string;
  logo?: string;
  background?: string;
  logo_shape?: "SQUARE" | "ROUND" | "ROUNDED";
  primary_color?: string;
  secondary_color?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metrics?: {
    ventasHoy: number;
    ventasAyer: number;
    clientesHoy: number;
    clientesAyer: number;
    ocupacionActual: number;
    reservasHoy: number;
    reservasManana: number;
    calificacionPromedio: number;
    totalCalificaciones: number;
    mesasDisponibles: number;
    mesasOcupadas: number;
    tiempoEsperaPromedio: number;
    ventasSemana: number;
    ventasSemanaPasada: number;
    ticketPromedio: number;
  };
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  viewMode: "general" | "specific";
  isLoading: boolean;
  error: string | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  setViewMode: (mode: "general" | "specific") => void;
  getGeneralMetrics: () => any;
  refetchRestaurants: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined,
);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [viewMode, setViewMode] = useState<"general" | "specific">("general");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth();

  // Función para obtener restaurantes del usuario autenticado
  const fetchRestaurants = async () => {
    console.log("🔄 fetchRestaurants - Iniciando carga de restaurantes");
    console.log("👤 User ID:", user?.id);
    console.log("🔐 isAuthenticated:", isAuthenticated);

    if (!isAuthenticated || !user?.id) {
      console.log("❌ fetchRestaurants - Usuario no autenticado o sin ID");
      setRestaurants([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(
        "🔍 fetchRestaurants - Consultando restaurantes para user_id:",
        user.id,
      );

      const { data: restaurantsData, error: fetchError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      console.log("📊 fetchRestaurants - Resultado consulta:");
      console.log("- Data:", restaurantsData);
      console.log("- Error:", fetchError);
      console.log("- Cantidad de restaurantes:", restaurantsData?.length || 0);

      if (fetchError) {
        console.error("❌ Error fetching restaurants:", fetchError);
        setError(`Error al cargar los restaurantes: ${fetchError.message}`);
        setRestaurants([]);
        return;
      }

      // Transformar los datos al formato esperado y agregar métricas simuladas
      console.log("🔄 fetchRestaurants - Transformando datos de restaurantes");

      const transformedRestaurants: Restaurant[] = restaurantsData.map(
        (restaurant: any) => {
          console.log("🏪 Procesando restaurante:", restaurant.name);

          return {
            ...restaurant,
            location: restaurant.address || "Sin ubicación",
            type: restaurant.type || "principal",
            image: restaurant.logo || "/images/default-restaurant.jpg",
            status: "activo", // Por defecto todos los restaurantes están activos
            metrics: {
              ventasHoy: Math.floor(Math.random() * 20000) + 5000,
              ventasAyer: Math.floor(Math.random() * 18000) + 4000,
              clientesHoy: Math.floor(Math.random() * 80) + 20,
              clientesAyer: Math.floor(Math.random() * 70) + 15,
              ocupacionActual: Math.floor(Math.random() * 40) + 60,
              reservasHoy: Math.floor(Math.random() * 25) + 5,
              reservasManana: Math.floor(Math.random() * 30) + 8,
              calificacionPromedio:
                Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
              totalCalificaciones: Math.floor(Math.random() * 200) + 50,
              mesasDisponibles: Math.floor(Math.random() * 10) + 5,
              mesasOcupadas: Math.floor(Math.random() * 15) + 5,
              tiempoEsperaPromedio: Math.floor(Math.random() * 20) + 5,
              ventasSemana: Math.floor(Math.random() * 100000) + 50000,
              ventasSemanaPasada: Math.floor(Math.random() * 90000) + 45000,
              ticketPromedio: Math.floor(Math.random() * 10000) + 15000,
            },
          };
        },
      );

      console.log(
        "✅ fetchRestaurants - Restaurantes transformados:",
        transformedRestaurants.length,
      );
      console.log(
        "📋 fetchRestaurants - Primer restaurante:",
        transformedRestaurants[0],
      );

      setRestaurants(transformedRestaurants);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      setError(`Error inesperado al cargar los restaurantes: ${err}`);
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para calcular métricas generales consolidadas
  const getGeneralMetrics = () => {
    const activeRestaurants = restaurants.filter((r) => r.status === "activo");

    if (activeRestaurants.length === 0) {
      return {
        ventasHoy: 0,
        ventasAyer: 0,
        clientesHoy: 0,
        clientesAyer: 0,
        reservasHoy: 0,
        reservasManana: 0,
        mesasDisponibles: 0,
        mesasOcupadas: 0,
        ventasSemana: 0,
        ventasSemanaPasada: 0,
        calificacionPromedio: 0,
        ticketPromedio: 0,
        ocupacionActual: 0,
        tiempoEsperaPromedio: 0,
        totalRestaurantes: 0,
        restaurantesActivos: 0,
        restaurantesInactivos: 0,
      };
    }

    const totalVentasHoy = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.ventasHoy || 0),
      0,
    );
    const totalVentasAyer = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.ventasAyer || 0),
      0,
    );
    const totalClientesHoy = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.clientesHoy || 0),
      0,
    );
    const totalClientesAyer = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.clientesAyer || 0),
      0,
    );
    const totalReservasHoy = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.reservasHoy || 0),
      0,
    );
    const totalReservasManana = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.reservasManana || 0),
      0,
    );
    const totalMesasDisponibles = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.mesasDisponibles || 0),
      0,
    );
    const totalMesasOcupadas = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.mesasOcupadas || 0),
      0,
    );
    const totalVentasSemana = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.ventasSemana || 0),
      0,
    );
    const totalVentasSemanaPasada = activeRestaurants.reduce(
      (sum, r) => sum + (r.metrics?.ventasSemanaPasada || 0),
      0,
    );

    // Promedios ponderados
    const promedioCalificacion =
      activeRestaurants.reduce(
        (sum, r) =>
          sum +
          (r.metrics?.calificacionPromedio || 0) *
            (r.metrics?.totalCalificaciones || 0),
        0,
      ) /
      activeRestaurants.reduce(
        (sum, r) => sum + (r.metrics?.totalCalificaciones || 0),
        0,
      );

    const promedioTicket =
      totalClientesHoy > 0 ? totalVentasHoy / totalClientesHoy : 0;
    const ocupacionPromedio =
      totalMesasDisponibles + totalMesasOcupadas > 0
        ? (totalMesasOcupadas / (totalMesasDisponibles + totalMesasOcupadas)) *
          100
        : 0;
    const promedioTiempoEspera =
      activeRestaurants.length > 0
        ? activeRestaurants.reduce(
            (sum, r) => sum + (r.metrics?.tiempoEsperaPromedio || 0),
            0,
          ) / activeRestaurants.length
        : 0;

    return {
      ventasHoy: totalVentasHoy,
      ventasAyer: totalVentasAyer,
      clientesHoy: totalClientesHoy,
      clientesAyer: totalClientesAyer,
      reservasHoy: totalReservasHoy,
      reservasManana: totalReservasManana,
      mesasDisponibles: totalMesasDisponibles,
      mesasOcupadas: totalMesasOcupadas,
      ventasSemana: totalVentasSemana,
      ventasSemanaPasada: totalVentasSemanaPasada,
      calificacionPromedio: promedioCalificacion || 0,
      ticketPromedio: promedioTicket || 0,
      ocupacionActual: ocupacionPromedio,
      tiempoEsperaPromedio: promedioTiempoEspera,
      totalRestaurantes: restaurants.length,
      restaurantesActivos: activeRestaurants.length,
      restaurantesInactivos: restaurants.length - activeRestaurants.length,
    };
  };

  // Efecto para cargar restaurantes cuando el usuario esté autenticado
  useEffect(() => {
    console.log("🎯 useEffect - Cambio en isAuthenticated o user?.id");
    console.log("- isAuthenticated:", isAuthenticated);
    console.log("- user?.id:", user?.id);
    if (isAuthenticated && user?.id) {
      fetchRestaurants();
    }
  }, [isAuthenticated, user?.id]);

  // Efecto para manejar el modo de vista
  useEffect(() => {
    console.log("🎯 useEffect - Cambio en modo de vista");
    console.log("- selectedRestaurant:", selectedRestaurant?.name);
    console.log("- viewMode:", viewMode);
    if (!selectedRestaurant && viewMode === "specific") {
      console.log("🔄 Cambiando a vista general");
      setViewMode("general");
    }
  }, [selectedRestaurant, viewMode]);

  const value: RestaurantContextType = {
    restaurants,
    selectedRestaurant,
    viewMode,
    isLoading,
    error,
    setSelectedRestaurant,
    setViewMode,
    getGeneralMetrics,
    refetchRestaurants: fetchRestaurants,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
