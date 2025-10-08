
'use client';

import React, { ReactNode } from 'react';
import Header from './header';
import MobileHeader from './mobile-header';

interface ResponsiveWrapperProps {
  children: ReactNode;
}

export default function ResponsiveWrapper({ children }: ResponsiveWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Desktop Header - Only visible on large screens and up */}
      <div className="hidden lg:block w-full print:hidden">
        <Header />
      </div>

      {/* Mobile Header - Only visible on screens smaller than large */}
      <div className="block lg:hidden w-full print:hidden">
        <MobileHeader />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6 max-w-7xl">
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-50" />
      <div className="fixed top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-200 to-transparent opacity-30" />
    </div>
  );
}
