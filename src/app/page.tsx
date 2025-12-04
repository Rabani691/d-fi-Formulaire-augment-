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
  <main className="min-h-screen flex items-center justify-center p-4">
    {/* wrapper centré et limité en largeur */}
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4">
      <NexusLogo />

      <div className="card w-full">
        <h1 className="title-glow mb-2 text-center">
          Le Nexus Connecté : Portail d’Intention
        </h1>

        {/* 👉 phrase redondante SUPPRIMÉE (on la remplace par une version très courte) */}
        <p className="text-xs sm:text-sm text-slate-300 mb-6 text-center">
          Choisis ta mission et ouvre un canal avec le Nexus 🌐.
        </p>

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

              {/* 🔹 bloc designé pour les missions */}
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-2 sm:p-3 space-y-1">
                <br></br>
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
            {(mission === "contact" || mission === "info") && <MessageFields />}

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn w-full mt-2 disabled:opacity-60"
            >
              {loading ? "Ouverture du portail..." : "Envoyer ma Mission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
);

}

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
