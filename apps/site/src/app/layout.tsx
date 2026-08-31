import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APOTHEM AI — Intelligence at the core",
  description:
    "APOTHEM AI is the Intelligence Layer for Business: connecting company knowledge, systems, people, processes and policies to governed AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
