'use client';

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user_data');
        const sessionData = localStorage.getItem('user_session');

        console.log('AuthGuard - Verificando autenticación para:', location.pathname);

        if (!userData || !sessionData) {
          console.log('AuthGuard - No hay datos de sesión, redirigiendo');
          navigate('/auth/signin', { replace: true, state: { from: location.pathname } });
          return;
        }

        const parsedUser = JSON.parse(userData);
        const parsedSession = JSON.parse(sessionData);

        if (!parsedUser || !parsedUser.id || !parsedUser.email || !parsedSession) {
          console.log('AuthGuard - Datos de sesión inválidos, redirigiendo');
          localStorage.removeItem('user_data');
          localStorage.removeItem('user_session');
          sessionStorage.clear();
          navigate('/auth/signin', { replace: true, state: { from: location.pathname } });
          return;
        }

        console.log('AuthGuard - Autenticación válida');
      } catch (error) {
        console.error('AuthGuard - Error verificando autenticación:', error);
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_session');
        sessionStorage.clear();
        navigate('/auth/signin', { replace: true, state: { from: location.pathname } });
      }
    };

    checkAuth();

    // Verificar cada vez que cambie la ubicación
    const unsubscribe = () => {
      checkAuth();
    };

    // Verificar cuando la página gana foco
    const handleFocus = () => {
      console.log('AuthGuard - Página enfocada, verificando autenticación');
      checkAuth();
    };

    // Verificar cuando la página vuelve a ser visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('AuthGuard - Página visible, verificando autenticación');
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, navigate]);

  // Verificación síncrona inmediata
  const userData = localStorage.getItem('user_data');
  const sessionData = localStorage.getItem('user_session');

  if (!userData || !sessionData) {
    console.log('AuthGuard - Verificación síncrona fallida, bloqueando renderizado');
    return null; // No renderizar nada hasta que se redirija
  }

  try {
    const parsedUser = JSON.parse(userData);
    const parsedSession = JSON.parse(sessionData);

    if (!parsedUser || !parsedUser.id || !parsedUser.email || !parsedSession) {
      console.log('AuthGuard - Datos inválidos en verificación síncrona, bloqueando renderizado');
      return null;
    }
  } catch (error) {
    console.log('AuthGuard - Error en verificación síncrona, bloqueando renderizado');
    return null;
  }

  return <>{children}</>;
}