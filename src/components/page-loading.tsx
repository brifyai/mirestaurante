'use client';

import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando...</p>
      </div>
    </div>
  );
}
