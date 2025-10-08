import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'

// Verificación de autenticación ANTES de renderizar cualquier componente
const checkAuthBeforeRender = () => {
  try {
    const userData = localStorage.getItem('user_data');
    const sessionData = localStorage.getItem('user_session');
    const currentPath = window.location.pathname;

    console.log('🔐 MAIN.TSX - Verificación PRE-RENDER absoluta');
    console.log('🔐 MAIN.TSX - Path actual:', currentPath);
    console.log('🔐 MAIN.TSX - userData existe:', !!userData);
    console.log('🔐 MAIN.TSX - sessionData existe:', !!sessionData);

    // Si estamos en rutas de auth, permitir el acceso
    if (currentPath.startsWith('/auth/')) {
      console.log('🔐 MAIN.TSX - Ruta de auth permitida');
      return;
    }

    // Si no hay datos de sesión, redirigir inmediatamente
    if (!userData || !sessionData) {
      console.log('🔐 MAIN.TSX - NO HAY SESIÓN - REDIRIGIENDO A LOGIN');
      window.location.replace('/auth/signin');
      return;
    }

    // Verificar que los datos sean válidos
    const parsedUser = JSON.parse(userData);
    const parsedSession = JSON.parse(sessionData);

    if (!parsedUser || !parsedUser.id || !parsedUser.email || !parsedSession) {
      console.log('🔐 MAIN.TSX - DATOS INVÁLIDOS - LIMPIANDO Y REDIRIGIENDO');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_session');
      sessionStorage.clear();
      window.location.replace('/auth/signin');
      return;
    }

    console.log('🔐 MAIN.TSX - AUTENTICACIÓN VÁLIDA - PERMITIENDO RENDER');
  } catch (error) {
    console.error('🔐 MAIN.TSX - ERROR en verificación:', error);
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_session');
    sessionStorage.clear();
    window.location.replace('/auth/signin');
  }
};

// Verificar autenticación antes de renderizar
checkAuthBeforeRender();

// Renderizar la aplicación (si no se redirigió, significa que está autenticado)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);