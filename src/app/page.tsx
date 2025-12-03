'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Mission = 'contact' | 'don' | 'benevole' | 'info';

export default function HomePage() {
  const router = useRouter();
  const [mission, setMission] = useState<Mission>('contact');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? 'Erreur serveur');
      }

      const name = (payload.nom as string) || 'Ami(e) du Nexus';
      const mission = payload.mission as string;

      // Redirection vers la page de confirmation avec query params
      router.push(
        `/confirmation?name=${encodeURIComponent(name)}&mission=${encodeURIComponent(
          mission,
        )}`,
      );
    } catch (err: any) {
      setError(err.message ?? 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900/80 rounded-2xl p-6 shadow-lg border border-slate-800">
        <h1 className="text-2xl font-bold mb-2">
          Le Nexus Connecté : Formulaire d’Interaction Dynamique
        </h1>
        <p className="text-sm text-slate-300 mb-6">
          Choisis ta <span className="font-semibold text-emerald-300">mission</span> et ouvre le
          portail de soutien.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anti-spam : champ honeypot caché */}
          <input type="text" name="robotCheck" className="hidden" tabIndex={-1} autoComplete="off" />

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

          {/* Sélection de la mission */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Choisis ta mission</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <MissionButton value="contact" current={mission} onChange={setMission}>
                Établir le contact
              </MissionButton>
              <MissionButton value="don" current={mission} onChange={setMission}>
                Offrir un don
              </MissionButton>
              <MissionButton value="benevole" current={mission} onChange={setMission}>
                Rejoindre les bénévoles
              </MissionButton>
              <MissionButton value="info" current={mission} onChange={setMission}>
                Demander des infos
              </MissionButton>
            </div>
            <input type="hidden" name="mission" value={mission} />
          </div>

          {/* Champs dynamiques selon la mission */}
          {mission === 'don' && <DonationFields />}
          {mission === 'benevole' && <VolunteerFields />}
          {(mission === 'contact' || mission === 'info') && <MessageFields />}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2 text-sm disabled:opacity-60"
          >
            {loading ? 'Ouverture du portail...' : 'Envoyer ma mission'}
          </button>
        </form>
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

function MissionButton({ value, current, onChange, children }: MissionButtonProps) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`rounded-md border px-2 py-2 ${
        active
          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
          : 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700'
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
          Montant du don (€)
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
