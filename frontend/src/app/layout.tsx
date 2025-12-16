import type { Metadata } from 'next';
import './globals.css';
import { AppWalletProvider } from '@/components/WalletProvider';

export const metadata: Metadata = {
  title: 'exc.fun - Join the Adventure',
  description: 'Connect your wallet and discover your warrior sequence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
