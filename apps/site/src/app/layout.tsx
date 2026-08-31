import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "APOTHEM AI — Inteligência no centro do negócio",
  description:
    "A APOTHEM conecta o conhecimento, os sistemas, as pessoas, os processos e as políticas da sua empresa a agentes de IA que raciocinam dentro de limites explícitos e executam ações autorizadas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
