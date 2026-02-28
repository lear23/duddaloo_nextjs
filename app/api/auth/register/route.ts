// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  await connectDB();

  // Kontrollera om det redan finns en admin (endast en tillåten)
  const existingUser = await User.findOne({});
  if (existingUser) {
    return NextResponse.json(
      { error: 'Det finns redan en administratör. Ta bort /register.' },
      { status: 400 }
    );
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'E-post och lösenord krävs' },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await hashPassword(password);
    await User.create({ email, password: hashedPassword });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    // Kontrollera om felet är ett objekt och har egenskapen 'code'
    if (err && typeof err === 'object' && 'code' in err) {
      if (err.code === 11000) {
        return NextResponse.json(
          { error: 'E-postadressen är redan registrerad' },
          { status: 400 }
        );
      }
    }

    // Generellt fel om det inte är kod 11000 eller annan typ av fel
    console.error("Registreringsfel:", err);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}
