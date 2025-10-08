
'use client';

import React, { ReactNode } from 'react';
import { NavigationProvider } from '../contexts/NavigationContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <NavigationProvider>
      {children}
    </NavigationProvider>
  );
}
