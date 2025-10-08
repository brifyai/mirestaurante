import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Providers from './components/providers';
import { RestaurantProvider } from './contexts/RestaurantContext';
import ProtectedRoute from './components/protected-route';
import AuthWrapper from './components/auth-wrapper';
import DashboardContent from './pages/_components/dashboard-content';
import SignInPage from './pages/auth/signin/page';
import SignUpPage from './pages/auth/signup/page';
import AnalisisFeedbackPage from './pages/analisis-feedback/page';
import BandejaPage from './pages/bandeja/page';
import CalificacionesPage from './pages/calificaciones/page';
import CampanasPage from './pages/campanas/page';
import CatalogoWhatsappPage from './pages/catalogo-whatsapp/page';
import ClientesPage from './pages/clientes/page';
import ConfiguracionPage from './pages/configuracion/page';
import ConfiguracionWhatsappPage from './pages/configuracion/whatsapp/page';
import IaInsightsPage from './pages/ia-insights/page';
import MenuPage from './pages/menu/page';
import MesaPage from './pages/mesa/[numero]/page';
import MesasPage from './pages/mesas/page';
import MetricasPage from './pages/metricas/page';
import PerfilPage from './pages/perfil/page';
import PortalPage from './pages/portal/page';
import PortalLinksPage from './pages/portal-links/page';
import PortalQrPage from './pages/portal-qr/page';
import ReportesPage from './pages/reportes/page';
import ReservasConfiguracionPage from './pages/reservas/configuracion/page';

function App() {
  return (
    <Router>
      <Providers>
        <RestaurantProvider>
          <Routes>
            {/* Rutas públicas de autenticación */}
            <Route 
              path="/auth/signin" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <SignInPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/signup" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <SignUpPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas protegidas */}
            <Route 
              path="/:restaurantSlug?" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <DashboardContent />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analisis-feedback" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <AnalisisFeedbackPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bandeja" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <BandejaPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calificaciones" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <CalificacionesPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/campanas" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <CampanasPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/catalogo-whatsapp" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <CatalogoWhatsappPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clientes" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <ClientesPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracion" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <ConfiguracionPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracion/whatsapp" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <ConfiguracionWhatsappPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ia-insights" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <IaInsightsPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/menu" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <MenuPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mesa/:numero" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <MesaPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mesas" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <MesasPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/metricas" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <MetricasPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <PerfilPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <PortalPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/portal-links" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <PortalLinksPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/portal-qr" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <PortalQrPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reportes" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <ReportesPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservas/configuracion" 
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <ReservasConfiguracionPage />
                  </AuthWrapper>
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta catch-all para rutas no encontradas */}
            <Route 
              path="*" 
              element={
                <ProtectedRoute>
                  <Navigate to="/" replace />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </RestaurantProvider>
      </Providers>
    </Router>
  );
}

export default App;