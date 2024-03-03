import type { Metadata } from "next";
import { ColorModeScript } from '@chakra-ui/react'
import { Inter } from "next/font/google";
import { Providers } from './providers'
import Header from '@/components/Header';
import theme from '@/theme'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "melodari",
  description: "melody app by ari",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased overflow-hidden`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

//<ColorModeScript initialColorMode={theme.config.initialColorMode} />