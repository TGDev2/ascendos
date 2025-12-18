import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "@/lib/trpc/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ascendos - Updates sponsor-ready en 2 minutes",
  description: "Transformez vos notes brutes en updates hebdomadaires professionnels pour sponsors non-tech, avec dossier de continuité intégré.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>
          <TRPCProvider>{children}</TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
