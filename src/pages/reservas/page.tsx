
import React from 'react';
import AuthWrapper from '@/components/auth-wrapper';
import ReservasContent from './_components/reservas-content';

export default function ReservasPage() {
  return (
    <AuthWrapper>
      <ReservasContent />
    </AuthWrapper>
  );
}
