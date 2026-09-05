import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DINAMIS MONEY — Cari Penjualan Berikutnya',
  description: 'Aplikasi pendongkrak penjualan mobile-first untuk menentukan target, mencari peluang hot, dan aksi nyata hari ini.',
  openGraph: {
    title: 'DINAMIS MONEY — Cari Penjualan Berikutnya',
    description: 'Aplikasi pendongkrak penjualan mobile-first untuk menentukan target, mencari peluang hot, dan aksi nyata hari ini.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="bg-[#121212] text-white antialiased selection:bg-[#10B981] selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
