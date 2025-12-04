import { NextResponse } from "next/server";
import OpenAI from "openai";
import { randomUUID } from "crypto";
import { saveMessage } from "./store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "Payload invalide" }, { status: 400 });
  }

  const { robotCheck, nom, email, mission, message, amount, recurrence } =
    body as {
      robotCheck?: string;
      nom?: string;
      email?: string;
      mission?: string;
      message?: string;
      amount?: string | number;
      recurrence?: string;
    };

  // Honeypot anti-spam
  if (typeof robotCheck === "string" && robotCheck.trim() !== "") {
    return NextResponse.json({ message: "Spam détecté" }, { status: 400 });
  }

  // Vérification basique des champs requis
  if (!email || !mission || !message) {
    return NextResponse.json(
      { message: "Champs requis manquants" },
      { status: 400 },
    );
  }

  const year = new Date().getFullYear();

  // Vérifier la clé OpenAI
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { message: "Clé OpenAI manquante côté serveur" },
      { status: 500 },
    );
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const iaResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es une IA qui crée un message personnalisé, stylé, chaleureux et inspirant, dans un univers Nexus futuriste.",
        },
        {
          role: "user",
          content: `
Nom: ${nom || "utilisateur inconnu"}
Mission: ${mission}
Message de l'utilisateur: ${message}
Montant: ${amount || "N/A"}
Récurrence: ${recurrence || "N/A"}
Année: ${year}

Génère un message unique en style 'Nexus futuriste', avec :
- salutation personnalisée
- référence claire à la mission (contact, don, bénévole ou info)
- mention de l'année
- remerciement spécial
- ton immersif, positif, et héroïque (Chevalier du Code, Nexus, Bugs Ancestraux…)
        `,
        },
      ],
    });

    const messageIA = iaResponse.choices[0]?.message?.content ?? "";

    const id = randomUUID();
    saveMessage(id, messageIA);

    return NextResponse.json({
      ok: true,
      id,
    });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return NextResponse.json(
      { message: "Erreur lors de la génération IA" },
      { status: 500 },
    );
  }
}