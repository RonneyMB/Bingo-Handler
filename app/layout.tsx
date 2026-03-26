import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BINGO PRO | Gestor Profesional de Bolas",
  description: "Gestor profesional de bolas de Bingo con letra y número integrados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
