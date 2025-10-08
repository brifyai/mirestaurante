
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  QrCode, 
  Calendar, 
  Link as LinkIcon, 
  MessageSquare, 
  ShoppingBag, 
  Mail, 
  Megaphone,
  BarChart3,
  Settings,
  Zap,
  Brain
} from 'lucide-react';

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Portal QR', href: '/portal-qr', icon: QrCode },
  { name: 'Gestión de Reservas', href: '/reservas', icon: Calendar },
  { name: 'Portal de Links', href: '/portal-links', icon: LinkIcon },
  { name: 'Catálogo WhatsApp', href: '/catalogo-whatsapp', icon: MessageSquare },
  { name: 'Configuración WhatsApp', href: '/configuracion/whatsapp', icon: Zap },
  { name: 'Bandeja de Entrada', href: '/bandeja', icon: Mail, badge: 4 },
  { name: 'Campañas', href: '/campanas', icon: Megaphone },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
  { name: 'Análisis de Feedback IA', href: '/analisis-feedback', icon: Brain },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <span className="text-lg font-semibold text-white">AI Restaurante</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors relative',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <IconComponent
                className={cn(
                  'mr-3 flex-shrink-0 h-5 w-5',
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-white'
                )}
              />
              {item.name}
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4">
        <Link
          href="/configuracion"
          className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
          Configuración
        </Link>
      </div>
    </div>
  );
}
