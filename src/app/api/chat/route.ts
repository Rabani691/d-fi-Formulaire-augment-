import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !body.messages) {
    return NextResponse.json(
      { message: "Requête invalide" },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { message: "Clé OpenAI manquante" },
      { status: 500 }
    );
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es l'Assistant IA du Nexus, un chatbot futuriste et chaleureux.

Style de communication :
- Ton immersif et thématique ("Nexus", "Chevalier du Code", "Bugs Ancestraux")
- Utilise des emojis adaptés (🌐, 🛡️, ⚡, 🚀, etc.)
- Reste concis (2-4 phrases max par réponse)
- Sois utile et positif

Tu peux aider avec :
- Questions sur le projet Nexus
- Navigation du site
- Explication des missions (contact, don, bénévolat, info)
- Support général

Contexte : Le Nexus est un projet/organisation futuriste qui cherche à renforcer ses défenses contre les "Bugs Ancestraux" avec l'aide de ses membres.`,
        },
        ...body.messages,
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const message = response.choices[0]?.message?.content ?? "Désolé, je n'ai pas pu générer une réponse.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Erreur OpenAI Chat:", error);
    return NextResponse.json(
      { message: "Erreur lors de la génération de la réponse" },
      { status: 500 }
    );
  }
}