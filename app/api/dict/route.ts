// app/api/dict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

type Alias = { lemma: string; pos?: string; note?: string };
type Concept = { id: number; gloss: string; aliases: Record<string, Alias[]> };

const ALL = ['en','he','ar','ru'] as const;
type Lang = typeof ALL[number];

function parseToList(toParam: string | null, from: Lang): Lang[] {
  if (!toParam || !toParam.trim()) return ALL.filter(l => l !== from);
  const wanted = new Set(
    toParam.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  );
  const out: Lang[] = [];
  for (const l of ALL) if (l !== from && wanted.has(l)) out.push(l);
  return out;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').toLowerCase().trim();
  const from = ((url.searchParams.get('from') || 'en').toLowerCase() as Lang);
  const toList = parseToList(url.searchParams.get('to'), from);
  const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200);

  const file = path.join(process.cwd(), 'data', 'dict.json');
  const raw = await fs.readFile(file, 'utf-8');
  const dict: Concept[] = JSON.parse(raw);

  const filtered = !q
    ? dict
    : dict.filter(c =>
        (c.aliases[from] || []).some(a => a.lemma.toLowerCase().includes(q))
      );

  const results = filtered.slice(0, limit).map(c => {
    const targets: Record<string, Alias[]> = {};
    for (const t of toList) targets[t] = c.aliases[t] || [];
    const fromForms = c.aliases[from] || [];
    return { id: c.id, gloss: c.gloss, from, fromForms, targets };
  });

  return NextResponse.json({ count: results.length, results });
}
