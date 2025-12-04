import "./globals.css";
import type { Metadata } from "next";
import NexusParticles from "@/components/NexusParticles";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Le Nexus Connecté – Formulaire augmenté",
  description:
    "Portail d’Intention dynamique pour la Nuit de l’Info : missions, dons, bénévolat, et soutien au Nexus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-slate-50 min-h-screen">
        <NexusParticles />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
