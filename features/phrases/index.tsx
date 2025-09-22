'use client';
import { Feature } from '@/core/feature';
import { useEffect, useState } from 'react';

type Phrase = { id: string; text: string; translation: string; tag?: string };

function PhrasePage() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    fetch('/api/phrases').then(r=>r.json()).then(setPhrases);
  }, []);

  const filtered = phrases.filter(p => (p.text + p.translation + (p.tag ?? '')).toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Popular Phrases</h1>
      <input
        value={q} onChange={e=>setQ(e.target.value)}
        placeholder="Search…"
        className="w-full mb-4 px-3 py-2 border rounded-xl"
      />
      <ul className="space-y-3">
        {filtered.map(p => (
          <li key={p.id} className="p-4 rounded-xl shadow border">
            <div className="font-semibold">{p.text}</div>
            <div className="opacity-75">{p.translation}</div>
            {p.tag && <div className="text-xs mt-1">#{p.tag}</div>}
          </li>
        ))}
        {!filtered.length && <li className="opacity-70">No results</li>}
      </ul>
    </main>
  );
}

export const PhrasesFeature: Feature = {
  id: 'phrases',
  label: 'Phrases',
  route: '/phrases',
  Page: PhrasePage,
};
