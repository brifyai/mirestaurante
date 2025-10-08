'use client';

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, forceUpdate } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Verificando ruta:', location.pathname);
    // Forzar verificación inmediata en cada cambio de ruta
    forceUpdate();
  }, [location.pathname, forceUpdate]);

  if (!requireAuth) {
    return <>{children}</>;
  }

  // Primero, permitir que el hook haga su trabajo
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Verificación secundaria de localStorage solo si el hook dice que no está autenticado
  if (!isAuthenticated) {
    const userData = localStorage.getItem('user_data');
    const sessionData = localStorage.getItem('user_session');
    
    if (userData && sessionData) {
      try {
        const parsedUser = JSON.parse(userData);
        const parsedSession = JSON.parse(sessionData);
        
        // Si hay datos válidos pero el hook no los detectó, forzar actualización
        if (parsedUser?.id && parsedUser?.email && parsedSession?.id) {
          console.log('ProtectedRoute - Detectados datos válidos, forzando actualización');
          forceUpdate();
          // Mostrar loading mientras se actualiza
          return (
            <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          );
        }
      } catch (error) {
        console.error('ProtectedRoute - Error parseando localStorage:', error);
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_session');
      }
    }
    
    return <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />;
  }

  // Verificación final del usuario
  if (!user?.id || !user?.email) {
    console.log('ProtectedRoute - Datos de usuario incompletos en hook');
    return <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}