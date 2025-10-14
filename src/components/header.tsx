"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRestaurant } from "../contexts/RestaurantContext";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Home,
  QrCode,
  Calendar,
  Link as LinkIcon,
  MessageSquare,
  ShoppingBag,
  Mail,
  Megaphone,
  BarChart3,
  Settings,
  Zap,
  LogOut,
  User,
  Bell,
  TrendingUp,
  Star,
  Users,
  ChefHat,
  MapPin,
  CreditCard,
  PieChart,
  Activity,
  Target,
  Utensils,
  Sparkles,
} from "lucide-react";

const mainNavigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    description: "Panel principal con métricas",
  },
  {
    name: "Mesas",
    href: "/mesas",
    icon: ChefHat,
    description: "Gestión inteligente de mesas",
  },
  {
    name: "Reservas",
    href: "/reservas",
    icon: Calendar,
    description: "Sistema completo de reservas",
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: Users,
    description: "Base de datos de clientes",
  },
  {
    name: "Calificaciones",
    href: "/calificaciones",
    icon: Star,
    description: "Feedback y reviews",
  },
];

const digitalNavigation = [
  {
    name: "Portal QR",
    href: "/portal-qr",
    icon: QrCode,
    description: "Códigos QR personalizados",
  },
  {
    name: "Bandeja",
    href: "/bandeja",
    icon: Mail,
    badge: 4,
    description: "Mensajes unificados",
  },
  {
    name: "WhatsApp",
    href: "/configuracion/whatsapp",
    icon: Zap,
    description: "Configuración API",
  },
  {
    name: "Campañas",
    href: "/campanas",
    icon: Megaphone,
    description: "Marketing digital",
  },
];

const analyticsNavigation = [
  {
    name: "Reportes",
    href: "/reportes",
    icon: BarChart3,
    description: "Análisis empresariales",
  },
  {
    name: "Métricas",
    href: "/metricas",
    icon: TrendingUp,
    description: "KPIs financieros",
  },
  {
    name: "IA Insights",
    href: "/ia-insights",
    icon: Activity,
    description: "Análisis predictivo",
  },
];

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const [notifications, setNotifications] = useState(3);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    image?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { viewMode, selectedRestaurant } = useRestaurant();

  // Check for user session in localStorage
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = localStorage.getItem("user_data");
        if (userData) {
          const parsedUser = JSON.parse(userData);

          // Obtener datos actualizados del usuario desde Supabase
          const { data: userProfile, error } = await supabase
            .from("users")
            .select("name, email, image")
            .eq("id", parsedUser.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            // Usar datos de localStorage como fallback
            setUser({
              name: parsedUser.name || "Usuario",
              email: parsedUser.email || "",
              image: parsedUser.image || "",
            });
          } else {
            // Usar datos actualizados de Supabase
            setUser({
              name: userProfile.name || parsedUser.name || "Usuario",
              email: userProfile.email || parsedUser.email || "",
              image: userProfile.image || parsedUser.image || "",
            });

            // Actualizar localStorage con los datos más recientes
            const updatedUserData = {
              ...parsedUser,
              name: userProfile.name || parsedUser.name,
              email: userProfile.email || parsedUser.email,
              image: userProfile.image || parsedUser.image,
            };
            localStorage.setItem("user_data", JSON.stringify(updatedUserData));
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_data") {
        checkUserSession();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    try {
      // Limpiar completamente el almacenamiento local
      localStorage.removeItem("user_session");
      localStorage.removeItem("user_data");

      // Limpiar también sessionStorage si se usa
      sessionStorage.clear();

      // Limpiar cualquier cookie relacionada con la sesión
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Resetear el estado del usuario
      setUser(null);

      // Forzar recarga de la página para limpiar cualquier estado en memoria
      window.location.href = "/auth/signin";
    } catch (error) {
      console.error("Error signing out:", error);
      // Fallback navigation en caso de error
      window.location.href = "/auth/signin";
    }
  };

  const isActivePath = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Deshabilitar navegación solo en la página de inicio
  const isNavigationDisabled = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="border-b border-border/40 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 p-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs text-white/90">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Sistema Híbrido v2.1</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="h-3 w-3" />
                <span>Estado: Activo</span>
              </div>
              {viewMode === "specific" && selectedRestaurant && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span className="font-medium">{selectedRestaurant.name}</span>
                  <span className="opacity-75">
                    • {selectedRestaurant.location}
                  </span>
                </div>
              )}
              {viewMode === "general" && (
                <div className="flex items-center space-x-1">
                  <PieChart className="h-3 w-3" />
                  <span className="font-medium">Vista Ejecutiva General</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {viewMode === "specific" && selectedRestaurant?.metrics ? (
                <>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>
                      {selectedRestaurant.metrics.clientesHoy} Clientes
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {selectedRestaurant.metrics.reservasHoy} Reservas Hoy
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>Multi-Restaurante</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Vista Consolidada</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Restaurante
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Sistema Híbrido
              </p>
            </div>
          </Link>

          {/* Simple Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                isActivePath("/") ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            {!isNavigationDisabled && (
              <>
                {/* Digital Dropdown Menu - Visible solo cuando se ha seleccionado un restaurante */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                        isActivePath("/portal-qr") ||
                          isActivePath("/bandeja") ||
                          isActivePath("/configuracion/whatsapp") ||
                          isActivePath("/campanas")
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Digital</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {digitalNavigation.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center space-x-3 w-full",
                            isActivePath(item.href)
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="destructive"
                              className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  to="/mesas"
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    isActivePath("/mesas")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <ChefHat className="h-4 w-4" />
                  <span>Mesas</span>
                </Link>

                <Link
                  to="/reservas"
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    isActivePath("/reservas")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Reservas</span>
                </Link>

                <Link
                  to="/clientes"
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    isActivePath("/clientes")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span>Clientes</span>
                </Link>

                {/* El ítem Bandeja ha sido movido al menú Digital */}

                <Link
                  to="/reportes"
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    isActivePath("/reportes")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Reportes</span>
                </Link>
              </>
            )}

            {isNavigationDisabled && (
              <a
                href="#estado-restaurantes"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Target className="h-4 w-4" />
                <span>Selecciona un restaurante</span>
              </a>
            )}
          </nav>

          {/* Quick Actions & User Menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => {
                    // Handler para el botón de notificaciones
                    console.log("Notifications clicked");
                  }}
                >
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuItem className="font-medium">
                  Notificaciones ({notifications})
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Nueva reserva de María González
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  Nueva calificación 5 estrellas
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ventas superaron meta del día
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                  onClick={() => {
                    // El click se maneja por el DropdownMenuTrigger, pero agregamos un handler para testing
                    console.log("Avatar clicked");
                  }}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                      onError={(e) => {
                        console.error(
                          "Error cargando imagen de perfil en header:",
                          e,
                        );
                        console.log("URL de imagen que falló:", user?.image);
                      }}
                      onLoad={() => {
                        console.log(
                          "Imagen de perfil cargada exitosamente en header:",
                          user?.image,
                        );
                      }}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {user ? (
                  <>
                    <DropdownMenuItem className="flex flex-col items-start">
                      <div className="text-sm font-medium">
                        {user.name || "Usuario"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/configuracion"
                        className="flex items-center w-full"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="flex flex-col items-start">
                      <div className="text-sm font-medium">No autenticado</div>
                      <div className="text-xs text-muted-foreground">
                        Inicia sesión para acceder
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/auth/signin"
                        className="flex items-center w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Iniciar sesión
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
