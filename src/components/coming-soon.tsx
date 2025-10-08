
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction, Calendar } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            {icon || <Construction className="h-16 w-16 text-purple-500" />}
          </div>
          <CardTitle className="text-2xl">Próximamente</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-lg">
            Esta funcionalidad está en desarrollo y estará disponible pronto.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-purple-700">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Estimado: Próxima actualización</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Mientras tanto, puedes usar las funcionalidades disponibles como Portal QR y Gestión de Reservas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
