
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import { RestaurantProvider } from '@/contexts/RestaurantContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Restaurante - Gestión Inteligente',
  description: 'Plataforma integral para la gestión de restaurantes con IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <RestaurantProvider>
            {children}
          </RestaurantProvider>
        </Providers>
      </body>
    </html>
  );
}
