import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIRA | Sprint 3",
  description: "API base del MVP para reservas academicas con Prisma, Zod y bcrypt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
