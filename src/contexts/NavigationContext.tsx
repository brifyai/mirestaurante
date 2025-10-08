'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';

interface NavigationContextType {
  isNavigating: boolean;
  navigateTo: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Reset navigation state when path changes
  useEffect(() => {
    setIsNavigating(false);
  }, [location.pathname]);

  const navigateTo = (path: string) => {
    setIsNavigating(true);
    navigate(path);

    // Timeout de seguridad para evitar loading infinito
    const safetyTimeout = setTimeout(() => {
      setIsNavigating(false);
    }, 3000); // 3 segundos máximo de loading

    return () => clearTimeout(safetyTimeout);
  };

  const value: NavigationContextType = {
    isNavigating,
    navigateTo,
  };

  return (
    <NavigationContext.Provider value={value}>
      {isNavigating && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center space-y-4 px-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Restaurante
              </p>
              <p className="text-sm text-muted-foreground">Cargando...</p>
            </div>
          </div>
        </div>
      )}
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
