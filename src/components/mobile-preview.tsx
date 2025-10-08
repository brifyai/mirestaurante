
import React from 'react';
import { QrCode, Calendar, Phone } from 'lucide-react';

interface MobilePreviewProps {
  restaurantName?: string;
  logo?: string;
  qrBehavior?: 'menu' | 'whatsapp';
  whatsappNumber?: string;
  whatsappMessage?: string;
  primaryButtonText?: string;
  primaryButtonColor?: string;
  secondaryButtonText?: string;
  secondaryButtonColor?: string;
  tertiaryButtonText?: string;
  tertiaryButtonColor?: string;
  template?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  onTertiaryButtonClick?: () => void;
}

export default function MobilePreview({
  restaurantName = 'AI Restaurante',
  logo,
  qrBehavior = 'menu',
  whatsappNumber = '+56912345678',
  whatsappMessage = 'Hola! Vengo del código QR de tu restaurante.',
  primaryButtonText = 'Ver Menú',
  primaryButtonColor = '#8B5CF6',
  secondaryButtonText = 'Hacer Reserva',
  secondaryButtonColor = '#A855F7',
  tertiaryButtonText = 'Contactar',
  tertiaryButtonColor = '#6366F1',
  template = 'default',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  onTertiaryButtonClick,
}: MobilePreviewProps) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative">
        {/* Phone Frame */}
        <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
          <div className="bg-white rounded-2xl overflow-hidden h-[600px] relative">
            {/* Status Bar */}
            <div className="bg-black h-6 flex items-center justify-center rounded-t-2xl">
              <div className="w-20 h-1 bg-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="p-6 h-full bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-center space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    {logo ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                        <img
                          src={logo}
                          alt={restaurantName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-purple-600">
                        {restaurantName.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Restaurant Name */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{restaurantName}</h2>
                  <p className="text-sm text-gray-600 mt-1">Bienvenido</p>
                </div>

                {qrBehavior === 'whatsapp' ? (
                  /* WhatsApp Direct Mode */
                  <div className="space-y-4 pt-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-green-800">WhatsApp Directo</div>
                          <div className="text-sm text-gray-600">Contacta inmediatamente</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-green-400">
                        <strong>Número:</strong> {whatsappNumber}<br />
                        <strong>Mensaje:</strong> "{whatsappMessage}"
                      </div>
                    </div>
                    <div className="text-sm text-green-600 flex items-center justify-center space-x-1">
                      <QrCode className="h-4 w-4" />
                      <span>Al escanear → Abre WhatsApp directamente</span>
                    </div>
                  </div>
                ) : (
                  /* Menu with Buttons Mode */
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={onPrimaryButtonClick}
                      className="w-full py-3 px-4 rounded-lg font-medium text-white shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-105"
                      style={{ backgroundColor: primaryButtonColor }}
                    >
                      <QrCode className="h-5 w-5" />
                      <span>{primaryButtonText}</span>
                    </button>

                    <button
                      onClick={onSecondaryButtonClick}
                      className="w-full py-3 px-4 rounded-lg font-medium text-white shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-105"
                      style={{ backgroundColor: secondaryButtonColor }}
                    >
                      <Calendar className="h-5 w-5" />
                      <span>{secondaryButtonText}</span>
                    </button>

                    <button
                      onClick={onTertiaryButtonClick}
                      className="w-full py-3 px-4 rounded-lg font-medium text-white shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-105"
                      style={{ backgroundColor: tertiaryButtonColor }}
                    >
                      <Phone className="h-5 w-5" />
                      <span>{tertiaryButtonText}</span>
                    </button>

                    <div className="text-sm text-purple-600 flex items-center justify-center space-x-1 pt-2">
                      <QrCode className="h-4 w-4" />
                      <span>Al escanear → Muestra estos 3 botones</span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-8">
                  <p className="text-xs text-gray-500">
                    Generado con AI Restaurante
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
