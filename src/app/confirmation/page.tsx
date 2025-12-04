import { getMessage } from "../api/submit/store";

export default async function ConfirmationPage({ searchParams }: any) {
  // 👇 OBLIGATOIRE : déstructurer les searchParams en async
  const params = await searchParams;

  const id = params?.id;
  const name = params?.name || "Ami(e) du Nexus";
  const mission = params?.mission || "soutien";
  const year = new Date().getFullYear();

  // Récupération du message IA via l’ID
  const iaMessage = getMessage(id);

  const missionText: Record<string, string> = {
    contact:
      'Ton message a bien été acheminé vers nos serveurs centraux 📡. Nos "Agents de Support" 🕵️ te répondront sous peu.',
    don: `Un immense "GG", ${name} ! 🏆 Ton "Don de Ressources" 💎 est une bénédiction pour notre cause 🙏.`,
    benevole:
      "Ta volonté de rejoindre la Guilde des Bénévoles 🛡️ renforce notre front face aux Bugs Ancestraux 🐛.",
    info: 'Ta demande d’informations a été transmise à nos archivistes du Nexus 📚.',
    soutien:
      "Ta contribution renforce le Nexus et protège nos Soutiens Essentiels ❤️.",
  };

  const missionDescription =
    missionText[mission] ?? missionText["soutien"];

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-50">
      <div className="card max-w-lg w-full space-y-4">
        <h1 className="text-2xl font-bold">Salutations, {name} ! 👋</h1>

        <p className="text-sm text-slate-200">{missionDescription}</p>

        {iaMessage && (
          <div className="mt-3 p-3 rounded-md bg-slate-800 border border-slate-700 text-sm text-slate-100 whitespace-pre-line">
            {iaMessage}
          </div>
        )}

        <div className="space-y-2 text-sm text-slate-200 mt-2">
          <p>
            Ton soutien en <span className="font-semibold">{year}</span> est crucial pour notre progression ! 📈
          </p>
          <p>
            Grâce à toi, nous pouvons avancer sur le projet{" "}
            <span className="font-semibold">
              “Renforcement du Nexus et protection des Soutiens Essentiels”
            </span>{" "}
            cette année {year}.
          </p>
          <p>
            Reste connecté pour suivre nos exploits tout au long de l'année{" "}
            {year} ! 🚀
          </p>
        </div>
      </div>
    </main>
  );
}
