'use client';

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ResponsiveWrapper from './responsive-wrapper';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading, user, forceUpdate } = useAuth();
  const location = useLocation();

  // Verificación inmediata al renderizar
  useEffect(() => {
    console.log('AuthWrapper - Estado actual:', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      currentPath: location.pathname
    });
    
    // Forzar verificación si no está autenticado pero hay datos en localStorage
    if (!isAuthenticated) {
      const userData = localStorage.getItem('user_data');
      const sessionData = localStorage.getItem('user_session');
      if (userData && sessionData) {
        console.log('AuthWrapper - Forzando actualización de autenticación');
        forceUpdate();
      }
    }
  }, [isAuthenticated, isLoading, user, location.pathname, forceUpdate]);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 text-lg">Verificando autenticación...</p>
          <p className="text-gray-400 text-sm mt-2">Validando credenciales de acceso</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('AuthWrapper - Usuario no autenticado, redirigiendo a login');
    return (
      <Navigate 
        to="/auth/signin" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Verificación adicional de seguridad
  if (!user || !user.id || !user.email) {
    console.log('AuthWrapper - Datos de usuario incompletos, redirigiendo');
    return (
      <Navigate 
        to="/auth/signin" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Si todo está bien, renderizar el contenido dentro del ResponsiveWrapper
  console.log('AuthWrapper - Usuario autenticado, mostrando contenido protegido para:', user.email);
  
  return (
    <ResponsiveWrapper>
      {children}
    </ResponsiveWrapper>
  );
}
