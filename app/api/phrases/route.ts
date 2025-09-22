import { NextResponse } from 'next/server';

// Mock data; replace later with DB (Supabase/Prisma)
const phrases = [
  { id: 'p1', text: 'مرحبا', translation: 'Hello', tag: 'Greeting' },   // Arabic
  { id: 'p2', text: 'שלום', translation: 'Hello', tag: 'Greeting' },     // Hebrew
  { id: 'p3', text: 'איך אתה?', translation: 'How are you?', tag: 'SmallTalk' },
  { id: 'p4', text: 'תודה', translation: 'Thank you', tag: 'Politeness' },
  { id: 'p5', text: 'בבקשה', translation: 'Please/You’re welcome', tag: 'Politeness' },
];

export async function GET() {
  return NextResponse.json(phrases);
}
