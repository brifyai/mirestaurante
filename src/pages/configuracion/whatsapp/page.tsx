'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WhatsAppConfigContent from './_components/whatsapp-config-content';
import WhatsAppSetupGuide from './_components/whatsapp-setup-guide';
import { Settings, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/contexts/NavigationContext';

export default function WhatsAppConfigPage() {
  const navigation = useNavigation();
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Configuración de WhatsApp</h1>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigation.navigateTo('/configuracion')}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Configura la integración de WhatsApp para tu restaurante. Puedes elegir entre WhatsApp Business API o Evolution API.
          </p>
        </div>

        <Tabs defaultValue="configuracion" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configuracion">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </TabsTrigger>
            <TabsTrigger value="guia">
              <BookOpen className="h-4 w-4 mr-2" />
              Guía de Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configuracion" className="mt-6">
            <WhatsAppConfigContent />
          </TabsContent>

          <TabsContent value="guia" className="mt-6">
            <WhatsAppSetupGuide />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
