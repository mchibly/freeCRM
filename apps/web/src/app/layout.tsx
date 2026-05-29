import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'freeCRM',
  description: 'Sistema CRM open-source com design system configurável',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          Pular para conteúdo principal
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
