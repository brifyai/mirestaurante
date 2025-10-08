'use client';

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface RouteProtectorProps {
  children: React.ReactNode;
}

export default function RouteProtector({ children }: RouteProtectorProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Verificación síncrona inmediata de autenticación
  const checkAuthSync = () => {
    try {
      const userData = localStorage.getItem('user_data');
      const sessionData = localStorage.getItem('user_session');

      if (userData && sessionData) {
        const parsedUser = JSON.parse(userData);
        const parsedSession = JSON.parse(sessionData);

        if (parsedUser && parsedUser.id && parsedUser.email && parsedSession) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error en verificación síncrona:', error);
      return false;
    }
  };

  // Si no está autenticado inmediatamente, redirigir
  if (isAuthenticated === null) {
    const isAuth = checkAuthSync();
    if (!isAuth) {
      console.log('RouteProtector - Verificación síncrona fallida, redirigiendo inmediatamente');
      return <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />;
    }
    setIsAuthenticated(true);
  }

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Verificar si hay datos de usuario en localStorage
        const userData = localStorage.getItem('user_data');
        const sessionData = localStorage.getItem('user_session');
        
        console.log('RouteProtector - Verificando autenticación:', {
          hasUserData: !!userData,
          hasSessionData: !!sessionData,
          currentPath: window.location.pathname
        });
        
        if (userData && sessionData) {
          // Verificar que los datos sean válidos
          const parsedUser = JSON.parse(userData);
          const parsedSession = JSON.parse(sessionData);
          
          // Verificar que el usuario tenga los campos necesarios
          if (parsedUser && parsedUser.id && parsedUser.email && parsedSession) {
            console.log('RouteProtector - Usuario autenticado:', parsedUser.email);
            setIsAuthenticated(true);
          } else {
            // Datos inválidos, limpiar y redirigir
            console.log('RouteProtector - Datos inválidos, limpiando sesión');
            localStorage.removeItem('user_data');
            localStorage.removeItem('user_session');
            sessionStorage.clear();
            setIsAuthenticated(false);
          }
        } else {
          console.log('RouteProtector - No hay datos de sesión');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('RouteProtector - Error verificando autenticación:', error);
        // En caso de error, limpiar todo y considerar no autenticado
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_session');
        sessionStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Ejecutar verificación inmediata
    checkAuth();

    // Escuchar cambios en el almacenamiento (por si se cierra sesión en otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('RouteProtector - Cambio en almacenamiento:', e.key);
      if (e.key === 'user_data' || e.key === 'user_session') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Verificar autenticación periódicamente (cada 10 segundos para mayor seguridad)
    const authInterval = setInterval(checkAuth, 10000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(authInterval);
    };
  }, []);

  // Escuchar eventos de retroceso/avance del navegador y cambios visibilidad
  useEffect(() => {
    const handlePopState = () => {
      console.log('RouteProtector - PopState detectado, verificando autenticación');
      // Verificar autenticación cada vez que el usuario navega con el botón de retroceso
      const userData = localStorage.getItem('user_data');
      const sessionData = localStorage.getItem('user_session');
      
      if (!userData || !sessionData) {
        console.log('RouteProtector - No hay sesión en popstate, redirigiendo');
        // Si no hay datos de sesión, redirigir al login inmediatamente
        window.location.replace('/auth/signin');
      }
    };

    const handleVisibilityChange = () => {
      // Verificar autenticación cuando la página vuelve a ser visible
      if (!document.hidden) {
        console.log('RouteProtector - Página visible, verificando autenticación');
        const userData = localStorage.getItem('user_data');
        const sessionData = localStorage.getItem('user_session');
        
        if (!userData || !sessionData) {
          console.log('RouteProtector - No hay sesión en visibility change, redirigiendo');
          window.location.replace('/auth/signin');
        }
      }
    };

    const handleFocus = () => {
      // Verificar autenticación cuando la ventana obtiene foco
      console.log('RouteProtector - Ventana enfocada, verificando autenticación');
      const userData = localStorage.getItem('user_data');
      const sessionData = localStorage.getItem('user_session');
      
      if (!userData || !sessionData) {
        console.log('RouteProtector - No hay sesión en focus, redirigiendo');
        window.location.replace('/auth/signin');
      }
    };

    // También verificar cuando el usuario intenta navegar a una nueva ruta
    const handleBeforeUnload = () => {
      const userData = localStorage.getItem('user_data');
      const sessionData = localStorage.getItem('user_session');
      
      if (!userData || !sessionData) {
        console.log('RouteProtector - No hay sesión en beforeunload');
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Mostrar loader mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login con la ruta actual como parámetro
  if (!isAuthenticated) {
    console.log('RouteProtector - Usuario no autenticado, redirigiendo a login desde:', location.pathname);

    // Usar Navigate de React Router inmediatamente
    return <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  console.log('RouteProtector - Usuario autenticado, mostrando contenido protegido');
  return <>{children}</>;
}