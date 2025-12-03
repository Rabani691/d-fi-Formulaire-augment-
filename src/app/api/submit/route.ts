import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: 'Payload invalide' }, { status: 400 });
  }

  const {
    robotCheck,
    nom,
    email,
    mission,
    message,
    amount,
    recurrence,
    skills,
    availability,
  } = body as Record<string, unknown>;

  // Anti-spam : si le champ caché est rempli → bot
  if (typeof robotCheck === 'string' && robotCheck.trim().length > 0) {
    return NextResponse.json({ message: 'Spam détecté' }, { status: 400 });
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ message: 'Email obligatoire' }, { status: 400 });
  }

  if (!mission || typeof mission !== 'string') {
    return NextResponse.json({ message: 'Mission obligatoire' }, { status: 400 });
  }

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ message: 'Message obligatoire' }, { status: 400 });
  }

  // Validation spécifique au don
  if (mission === 'don') {
    const amountNumber = Number(amount);
    if (!amountNumber || amountNumber <= 0) {
      return NextResponse.json(
        { message: 'Montant de don invalide' },
        { status: 400 },
      );
    }
  }

  // Ici tu pourrais :
  // - enregistrer dans une base de données
  // - envoyer un email
  // - appeler une API externe, etc.

  return NextResponse.json({ ok: true });
}
