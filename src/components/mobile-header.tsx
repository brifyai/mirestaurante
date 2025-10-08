

'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../contexts/RestaurantContext';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Menu,
  Home, 
  QrCode, 
  Calendar, 
  MessageSquare, 
  Mail, 
  Megaphone,
  BarChart3,
  Settings,
  Zap,
  LogOut, 
  User,
  Bell,
  Users,
  ChefHat,
  MapPin,
  Star,
  TrendingUp,
  Activity,
  Utensils,
  Sparkles,
  X,
  PieChart,
  Target
} from 'lucide-react';

const mobileNavigation = [
  // Operaciones Principales
  {
    section: 'Operaciones',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Mesas', href: '/mesas', icon: ChefHat },
      { name: 'Reservas', href: '/reservas', icon: Calendar },
      { name: 'Clientes', href: '/clientes', icon: Users },
      { name: 'Calificaciones', href: '/calificaciones', icon: Star }
    ]
  },
  // Digital y Marketing
  {
    section: 'Digital',
    items: [
      { name: 'Portal QR', href: '/portal-qr', icon: QrCode },
      { name: 'Bandeja', href: '/bandeja', icon: Mail, badge: 4 },
      { name: 'WhatsApp', href: '/configuracion/whatsapp', icon: Zap },
      { name: 'Campañas', href: '/campanas', icon: Megaphone }
    ]
  },
  // Analytics
  {
    section: 'Analytics',
    items: [
      { name: 'Reportes', href: '/reportes', icon: BarChart3 },
      { name: 'Métricas', href: '/metricas', icon: TrendingUp },
      { name: 'IA Insights', href: '/ia-insights', icon: Activity }
    ]
  }
];

export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [notifications, setNotifications] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { viewMode, selectedRestaurant } = useRestaurant();

  // Check for user session in localStorage
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const userData = localStorage.getItem('user_data');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            name: parsedUser.name || 'Usuario',
            email: parsedUser.email || ''
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_data') {
        checkUserSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    try {
      // Limpiar completamente el almacenamiento local
      localStorage.removeItem('user_session');
      localStorage.removeItem('user_data');
      
      // Limpiar también sessionStorage si se usa
      sessionStorage.clear();
      
      // Limpiar cualquier cookie relacionada con la sesión
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Resetear el estado del usuario
      setUser(null);
      
      // Cerrar el menú móvil
      setIsOpen(false);
      
      // Forzar recarga de la página para limpiar cualquier estado en memoria
      window.location.href = '/auth/signin';
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback navigation en caso de error
      setIsOpen(false);
      window.location.href = '/auth/signin';
    }
  };

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isNavigationDisabled = pathname === '/';

  return (
    <>
      {/* Top Info Bar Mobile */}
      <div className="lg:hidden border-b border-border/40 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 p-2">
        <div className="flex items-center justify-between text-xs text-white/90">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-3 w-3" />
            <span className="text-xs">Sistema v2.1</span>
            <Activity className="h-3 w-3 ml-2" />
            <span className="text-xs">Activo</span>
          </div>
          {viewMode === 'specific' && selectedRestaurant ? (
            <div className="flex items-center space-x-2 text-xs">
              <MapPin className="h-3 w-3" />
              <span className="font-medium truncate max-w-24">{selectedRestaurant.name}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-xs">
              <PieChart className="h-3 w-3" />
              <span>Vista General</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Logo Mobile */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shadow-sm">
              <Utensils className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Restaurante
              </h1>
            </div>
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative h-9 w-9 p-0"
              onClick={() => {
                // Handler para notificaciones móviles
                console.log('Notifications clicked on mobile');
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

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    {/* User Profile */}
                    {user ? (
                      <div className="flex items-center space-x-3 mb-6">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={''} alt={user.name || ''} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name || 'Usuario'}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 mb-6">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gray-400 text-white">
                            ?
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">No autenticado</p>
                          <p className="text-xs text-muted-foreground truncate">Inicia sesión</p>
                        </div>
                      </div>
                    )}

                    <Separator className="mb-4" />

                    {/* Navigation Status */}
                    {isNavigationDisabled && (
                      <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-yellow-600" />
                          <span className="text-xs font-medium text-yellow-700">Vista General Activa</span>
                        </div>
                        <p className="text-xs text-yellow-600 mt-1">
                          <a href="#estado-restaurantes" className="underline hover:text-yellow-800">
                            Selecciona un restaurante específico
                          </a> para acceder a todas las funciones operativas.
                        </p>
                      </div>
                    )}

                    {/* Navigation Sections */}
                    {mobileNavigation.map((section, index) => (
                      <div key={section.section} className="mb-6">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          {section.section}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm transition-colors",
                                isActivePath(item.href) 
                                  ? "bg-accent text-accent-foreground" 
                                  : "hover:bg-accent hover:text-accent-foreground",
                                isNavigationDisabled && section.section !== 'Analytics' && "opacity-50"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                              </div>
                              {item.badge && (
                                <Badge variant="destructive" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                        {index < mobileNavigation.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}

                    <Separator className="my-4" />

                    {/* Settings & Profile */}
                    <div className="space-y-1 mb-4">
                      <Link
                        to="/perfil"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <User className="h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                      <Link
                        to="/configuracion"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Configuración</span>
                      </Link>
                    </div>

                    <Separator className="my-4" />

                    {/* Sign Out */}
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
