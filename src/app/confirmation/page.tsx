type Props = {
  searchParams: {
    name?: string;
    mission?: string;
  };
};

export default function ConfirmationPage({ searchParams }: Props) {
  const name = searchParams.name ?? 'Ami(e) du Nexus';
  const mission = searchParams.mission ?? 'soutien';
  const year = new Date().getFullYear();

  const missionLabel: Record<string, string> = {
    contact: "Ton message a bien été acheminé vers nos agents de support.",
    don: "Ton don de ressources est une bénédiction pour notre cause.",
    benevole: "Ta volonté de rejoindre la guilde des bénévoles nous renforce.",
    info: "Ta demande d’information a bien été reçue, nous reviendrons vers toi.",
  };

  const description =
    missionLabel[mission] ??
    "Ta contribution renforce le Nexus et protège nos soutiens essentiels.";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg bg-slate-900/80 rounded-2xl p-6 shadow-lg border border-slate-800">
        <h1 className="text-2xl font-bold mb-2">Salutations, {name} !</h1>
        <p className="text-sm text-slate-200 mb-4">{description}</p>

        <p className="text-sm text-emerald-300 mb-2">
          Ton soutien en <span className="font-semibold">{year}</span> est crucial pour notre
          progression !
        </p>

        <p className="text-sm text-slate-200 mb-2">
          Grâce à toi, nous pouvons avancer sur le projet&nbsp;
          <span className="font-semibold">
            &ldquo;Renforcement du Nexus et protection des soutiens essentiels&rdquo;
          </span>{' '}
          cette année {year}.
        </p>

        <p className="text-sm text-slate-300">
          Reste connecté pour suivre nos exploits tout au long de l&apos;année {year} !
        </p>
      </div>
    </main>
  );
}
