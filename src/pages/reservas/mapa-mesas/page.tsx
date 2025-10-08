

import React from 'react';
import AuthWrapper from '@/components/auth-wrapper';
import MapaMesasContent from './_components/mapa-mesas-content';

export default function MapaMesasPage() {
  return (
    <AuthWrapper>
      <MapaMesasContent />
    </AuthWrapper>
  );
}
