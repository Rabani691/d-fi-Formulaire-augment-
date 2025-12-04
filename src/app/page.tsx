"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import NexusLogo from "@/components/NexusLogo";

type Mission = "contact" | "don" | "benevole" | "info";

export default function HomePage() {
  const router = useRouter();
  const [mission, setMission] = useState<Mission>("contact");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const portalSound =
      typeof Audio !== "undefined" ? new Audio("/nexus-portal.mp3") : null;

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.ok || !data.id) {
        throw new Error(data?.message ?? "Erreur serveur");
      }

      const name =
        (payload.nom as string | undefined)?.trim() || "Ami(e) du Nexus";
      const missionValue = (payload.mission as string | undefined) ?? "contact";

      if (portalSound) {
        portalSound.currentTime = 0;
        portalSound.play().catch(() => {});
      }

      router.push(
        `/confirmation?id=${encodeURIComponent(
          data.id,
        )}&name=${encodeURIComponent(
          name,
        )}&mission=${encodeURIComponent(missionValue)}`,
      );
    } catch (err: any) {
      setError(err.message ?? "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen text-slate-50">
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* ==== HEADER / NAV ==== */}
        <header className="flex items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <NexusLogo />
            </div>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Nuit de l&apos;Info 2024
              </p>
              <p className="font-semibold text-sm text-emerald-300">
                Le Nexus Connecté
              </p>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-300">
            <a href="#hero" className="hover:text-emerald-300 transition">
              Accueil
            </a>
            <a href="#portal" className="hover:text-emerald-300 transition">
              Portail
            </a>
            <a href="#missions" className="hover:text-emerald-300 transition">
              Missions
            </a>
          </nav>
        </header>

        {/* ==== HERO ==== */}
        <section
          id="hero"
          className="grid md:grid-cols-[1.4fr,1fr] gap-8 items-center pt-4 pb-10 animate-fade"
        >
          <div className="space-y-4">
            <h1 className="title-glow">
              Le Nexus Connecté
              <span className="block text-xl text-slate-200 mt-1">
                L&apos;Écho Personnalisé ✨
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Salutations, voyageur des flux de données ! Les Bugs Ancestraux
              menacent nos liens vitaux avec les{" "}
              <span className="font-semibold text-emerald-300">
                Soutiens Essentiels
              </span>
              . Choisis ta mission et renforce le canal du Nexus 🌐.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Badge>🔒 Sécurisé</Badge>
              <Badge>🌍 Universel</Badge>
              <Badge>⚡ Instantané</Badge>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-200">
            <p className="font-semibold text-emerald-300">
              Assistant IA du Nexus
            </p>
            <p className="text-xs text-slate-300">
              Décris ce que tu souhaites faire, l&apos;IA personnalise le
              message de gratitude et l&apos;écho envoyé à nos serveurs centraux
              📡.
            </p>
            <div className="space-y-2 text-xs">
              <FakeIAChip>Je veux soutenir financièrement</FakeIAChip>
              <FakeIAChip>Comment devenir bénévole ?</FakeIAChip>
              <FakeIAChip>J&apos;ai une question sur vos projets</FakeIAChip>
              <FakeIAChip>Je souhaite vous contacter</FakeIAChip>
            </div>
          </div>
        </section>

        {/* ==== PORTAIL D'INTENTION (formulaire) ==== */}
        <section id="portal" className="pt-4">
          <h2 className="text-lg font-semibold text-slate-100 mb-2">
            Portail d&apos;Intention
          </h2>
          <p className="text-xs text-slate-300 mb-4">
            Choisis ta mission, le portail adaptera les champs selon ton
            intention (contact, don, bénévolat ou demande d&apos;infos).
          </p>

          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              <div className="card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Anti-spam : champ honeypot caché */}
                  <input
                    type="text"
                    name="robotCheck"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="space-y-4 animate-fade">
                    {/* Nom */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium" htmlFor="nom">
                        Nom (optionnel mais recommandé)
                      </label>
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
                        placeholder="Axolotl, Chevalier du Code..."
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
                        placeholder="toi@nexus.dev"
                      />
                    </div>

                    {/* Sélection de la Mission */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-100">
                        Choisis ta Mission 🎯
                      </p>
                      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-2 sm:p-3 space-y-1">
                        <p className="text-xs text-slate-400">
                          Sélectionne la voie que tu souhaites emprunter :
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                          <MissionButton
                            value="contact"
                            current={mission}
                            onChange={setMission}
                          >
                            Établir le Contact 📞
                          </MissionButton>
                          <MissionButton
                            value="don"
                            current={mission}
                            onChange={setMission}
                          >
                            Offrir un Don 💰
                          </MissionButton>
                          <MissionButton
                            value="benevole"
                            current={mission}
                            onChange={setMission}
                          >
                            Rejoindre la Guilde 🛡️
                          </MissionButton>
                          <MissionButton
                            value="info"
                            current={mission}
                            onChange={setMission}
                          >
                            Demander des Infos ❓
                          </MissionButton>
                        </div>
                      </div>
                      <input type="hidden" name="mission" value={mission} />
                    </div>

                    {/* Champs dynamiques selon la mission */}
                    {mission === "don" && <DonationFields />}
                    {mission === "benevole" && <VolunteerFields />}
                    {(mission === "contact" || mission === "info") && (
                      <MessageFields />
                    )}

                    {error && (
                      <p className="text-sm text-red-400">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn w-full mt-2 disabled:opacity-60"
                    >
                      {loading
                        ? "Ouverture du portail..."
                        : "Envoyer ma Mission"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ==== SECTION MISSIONS (cartes explicatives) ==== */}
        <section id="missions" className="mt-10">
          <h2 className="text-lg font-semibold mb-4 text-slate-100">
            Missions du Nexus
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <MissionCard
              title="Établir le Contact"
              icon="📞"
              desc="Envoyer un message pour toute question, partenariat ou idée de projet."
            />
            <MissionCard
              title="Offrir un Don"
              icon="💰"
              desc="Soutenir la cause avec une contribution qui finance les projets de l'année."
            />
            <MissionCard
              title="Rejoindre la Guilde"
              icon="🛡️"
              desc="Devenir bénévole, prêter tes compétences et rejoindre l'équipe des héros du code."
            />
            <MissionCard
              title="Demander des Infos"
              icon="❓"
              desc="Obtenir des détails sur les actions, les projets, les besoins et l'impact."
            />
          </div>
        </section>

        {/* ==== FOOTER ==== */}
        <footer className="mt-12 text-center text-[11px] text-slate-400">
          ⚡ Par les circuits de l&apos;éternité, que la puissance du code te
          guide ! ⚡
          <br />
          © {new Date().getFullYear()} Nexus Connecté • Nuit de l&apos;Info
        </footer>
      </div>
    </main>
  );
}

/* ========= COMPOSANTS ========= */

type MissionButtonProps = {
  value: Mission;
  current: Mission;
  onChange: (m: Mission) => void;
  children: React.ReactNode;
};

function MissionButton({
  value,
  current,
  onChange,
  children,
}: MissionButtonProps) {
  const active = current === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`w-full rounded-lg border px-3 py-2 font-medium text-left transition
        ${
          active
            ? "bg-emerald-400/95 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/40"
            : "bg-slate-900/70 border-slate-700 text-slate-100 hover:bg-slate-800 hover:border-emerald-400/60"
        }`}
    >
      {children}
    </button>
  );
}

function MessageFields() {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium" htmlFor="message">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        required
        rows={4}
        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
        placeholder="Décris ta requête, ton soutien, ou ta question..."
      />
    </div>
  );
}

function DonationFields() {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="amount">
          Montant du Don (€)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min={1}
          required
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
          placeholder="Ex : 10"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="recurrence">
          Récurrence
        </label>
        <select
          id="recurrence"
          name="recurrence"
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
          defaultValue="unique"
        >
          <option value="unique">Don unique</option>
          <option value="mensuel">Mensuel</option>
          <option value="annuel">Annuel</option>
        </select>
      </div>
      <MessageFields />
    </div>
  );
}

function VolunteerFields() {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="skills">
          Compétences / Rôle souhaité
        </label>
        <input
          id="skills"
          name="skills"
          required
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
          placeholder="Dev, communication, logistique..."
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="availability">
          Disponibilités
        </label>
        <input
          id="availability"
          name="availability"
          required
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
          placeholder="Soirs, week-ends, remote..."
        />
      </div>
      <MessageFields />
    </div>
  );
}

type MissionCardProps = {
  title: string;
  icon: string;
  desc: string;
};

function MissionCard({ title, icon, desc }: MissionCardProps) {
  return (
    <div className="mission-card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      </div>
      <p className="text-xs text-slate-300">{desc}</p>
    </div>
  );
}

type BadgeProps = { children: React.ReactNode };

function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-200 backdrop-blur">
      {children}
    </span>
  );
}

type FakeIAChipProps = { children: React.ReactNode };

function FakeIAChip({ children }: FakeIAChipProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
      {children}
    </div>
  );
}
