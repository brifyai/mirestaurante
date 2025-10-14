import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  is_active?: boolean;
  lastLoginAt?: string;
  [key: string]: any;
}

export interface AuthSession {
  id: string;
  email: string;
  name?: string;
  role?: string;
  loggedInAt?: string;
  [key: string]: any;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const navigate = useNavigate();

  // Función para validar datos de autenticación de la tabla User personalizada
  const validateAuthData = useCallback(
    (userData: string | null, sessionData: string | null): boolean => {
      try {
        if (!userData || !sessionData) {
          return false;
        }

        const parsedUser = JSON.parse(userData);
        const parsedSession = JSON.parse(sessionData);

        // Validar estructura de usuario de la tabla User personalizada
        if (
          !parsedUser ||
          !parsedUser.id ||
          !parsedUser.email ||
          typeof parsedUser.id !== "string" ||
          typeof parsedUser.email !== "string"
        ) {
          console.log("useAuth - Datos de usuario inválidos:", parsedUser);
          return false;
        }

        // Validar que la sesión tenga los campos básicos
        if (!parsedSession || !parsedSession.id || !parsedSession.email) {
          console.log("useAuth - Datos de sesión inválidos:", parsedSession);
          return false;
        }

        // Verificar que el ID de usuario coincida con el de la sesión
        if (parsedUser.id !== parsedSession.id) {
          console.log("useAuth - ID de usuario no coincide con ID de sesión");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error validando datos de autenticación:", error);
        return false;
      }
    },
    [],
  );

  // Función para limpiar datos de autenticación
  const clearAuthData = useCallback(() => {
    try {
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_session");
      sessionStorage.clear();

      // Limpiar cookies relacionadas con la sesión
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        if (name.trim().includes("session") || name.trim().includes("auth")) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    } catch (error) {
      console.error("Error limpiando datos de autenticación:", error);
    }
  }, []);

  // Función para forzar una verificación inmediata y actualizar el estado
  const forceUpdate = useCallback(() => {
    const userData = localStorage.getItem("user_data");
    const sessionData = localStorage.getItem("user_session");

    if (validateAuthData(userData, sessionData)) {
      const parsedUser = JSON.parse(userData!);
      const parsedSession = JSON.parse(sessionData!);

      setAuthState({
        user: parsedUser,
        session: parsedSession,
        isLoading: false,
        isAuthenticated: true,
      });
      return true;
    } else {
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }
  }, [validateAuthData]);
  const checkAuth = useCallback(() => {
    try {
      const userData = localStorage.getItem("user_data");
      const sessionData = localStorage.getItem("user_session");

      console.log("useAuth - Verificando autenticación...");

      if (!validateAuthData(userData, sessionData)) {
        console.log("useAuth - Datos inválidos o faltantes");
        clearAuthData();
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return false;
      }

      const parsedUser = JSON.parse(userData!);
      const parsedSession = JSON.parse(sessionData!);

      console.log("useAuth - Autenticación válida para:", parsedUser.email);

      setAuthState({
        user: parsedUser,
        session: parsedSession,
        isLoading: false,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error("useAuth - Error verificando autenticación:", error);
      clearAuthData();
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }
  }, [validateAuthData, clearAuthData]);

  // Función para hacer logout
  const logout = useCallback(() => {
    console.log("useAuth - Cerrando sesión...");
    clearAuthData();
    setAuthState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
    navigate("/auth/signin", { replace: true });
  }, [clearAuthData, navigate]);

  // Función para redirigir a login si no está autenticado
  const requireAuth = useCallback(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      console.log("useAuth - Redirigiendo a login - no autenticado");
      navigate("/auth/signin", { replace: true });
      return false;
    }
    return authState.isAuthenticated;
  }, [authState.isAuthenticated, authState.isLoading, navigate]);

  // Verificar autenticación al montar el hook
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Verificar autenticación cuando cambie el almacenamiento
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_data" || e.key === "user_session") {
        console.log("useAuth - Cambio en almacenamiento detectado");
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuth]);

  // Verificar autenticación periódicamente y en eventos de ventana
  useEffect(() => {
    // Verificación periódica cada 30 segundos
    const authInterval = setInterval(() => {
      console.log("useAuth - Verificación periódica");
      checkAuth();
    }, 30000);

    // Verificar cuando la ventana gana foco
    const handleFocus = () => {
      console.log("useAuth - Verificación por focus");
      checkAuth();
    };

    // Verificar cuando la página se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("useAuth - Verificación por visibilidad");
        checkAuth();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(authInterval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkAuth]);

  return {
    ...authState,
    logout,
    requireAuth,
    checkAuth,
    forceUpdate,
    clearAuthData,
  };
}
