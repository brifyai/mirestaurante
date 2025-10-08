
import React from 'react';
import AuthWrapper from '@/components/auth-wrapper';
import DashboardContent from './_components/dashboard-content';

export default function HomePage() {
  return (
    <AuthWrapper>
      <DashboardContent />
    </AuthWrapper>
  );
}
