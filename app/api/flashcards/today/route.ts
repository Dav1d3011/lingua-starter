import { NextResponse } from 'next/server';

// Mock cards due today; replace with SRS logic later
const cards = [
  { id: 'c1', front: 'שלום', back: 'Hello' },
  { id: 'c2', front: 'תודה', back: 'Thank you' },
  { id: 'c3', front: 'בבקשה', back: 'Please / You’re welcome' },
];

export async function GET() {
  // In real app, read user, compute due cards by spaced repetition.
  return NextResponse.json(cards);
}
