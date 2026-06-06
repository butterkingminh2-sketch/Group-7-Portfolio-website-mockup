import type { Metadata } from 'next';
import { CrosshairCursor } from '@/components/cursor/CrosshairCursor';
import { LenisProvider } from '@/components/providers/LenisProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Studio 7 — Group Portfolio',
  description:
    'An immersive group portfolio showcasing business administration projects and data analysis research.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-deep text-text-primary font-body antialiased">
        <LenisProvider>
          <CrosshairCursor />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
