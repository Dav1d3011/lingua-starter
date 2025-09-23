'use client';
import { useEffect, useMemo, useState } from 'react';

const ALL = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'he', label: 'Hebrew',  dir: 'rtl' },
  { code: 'ar', label: 'Arabic',  dir: 'rtl' },
  { code: 'ru', label: 'Russian', dir: 'ltr' },
] as const;

type Lang = typeof ALL[number]['code'];
type Alias = { lemma: string; pos?: string; note?: string };
type Hit = { id:number; gloss:string; from:Lang; fromForms:Alias[]; targets:Record<string,Alias[]>; };

export default function DictPage() {
  const [q, setQ] = useState('');
  const [from, setFrom] = useState<Lang>('en');
  const [to, setTo] = useState<Lang[]>(['he']);
  const toCSV = useMemo(() => to.join(','), [to]);
  const [data, setData] = useState<{count:number; results:Hit[]}>({count:0, results:[]});
  const [loading, setLoading] = useState(false);

  function toggleTo(code: Lang) {
    setTo(curr => curr.includes(code) ? curr.filter(c => c!==code) : [...curr, code]);
  }

  async function search() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      params.set('from', from);
      if (to.length) params.set('to', toCSV);
      const res = await fetch(`/api/dict?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } finally { setLoading(false); }
  }

  useEffect(() => { if (q.trim()) search(); /* eslint-disable-next-line */ }, [from, toCSV]);

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Dictionary (multi-target)</h1>

      <div className="flex flex-wrap items-center gap-3">
        <input className="border rounded-xl px-3 py-2 min-w-[220px]"
          placeholder="Type a word…" value={q} onChange={e=>setQ(e.target.value)} />

        <label className="text-sm">From:</label>
        <select className="border rounded-xl px-2 py-2"
          value={from}
          onChange={e => {
            const val = e.target.value as Lang;
            setFrom(val);
            setTo(prev => prev.filter(x => x !== val)); // don't allow from in to
          }}>
          {ALL.map(L => <option key={L.code} value={L.code}>{L.label}</option>)}
        </select>

        <div className="text-sm flex items-center gap-2 flex-wrap">
          <span>To:</span>
          {ALL.map(L => (
            <label key={L.code}
              className={`border rounded-xl px-2 py-1 flex items-center gap-1 ${L.code===from?'opacity-40 pointer-events-none':''}`}>
              <input type="checkbox" disabled={L.code===from}
                checked={to.includes(L.code as Lang)}
                onChange={()=>toggleTo(L.code as Lang)} />
              {L.label}
            </label>
          ))}
        </div>

        <button onClick={search} className="border rounded-xl px-3 py-2">
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      <div className="text-sm opacity-70">
        Showing only: {to.map(code => ALL.find(L=>L.code===code)?.label).join(', ') || '—'}
      </div>

      <section className="space-y-3">
        {data.results.map(hit => (
          <article key={hit.id} className="border rounded-2xl p-3">
            <div className="font-semibold">{hit.gloss}</div>
            <div className="text-xs opacity-70 mt-1">
              From {ALL.find(L=>L.code===hit.from)?.label}:{' '}
              {hit.fromForms.map(a=>a.lemma).join(', ')}
            </div>
            <div className="grid md:grid-cols-2 gap-3 mt-2">
              {to.map(code => {
                const forms = hit.targets[code] || [];
                const label = ALL.find(L=>L.code===code)?.label ?? code;
                const dir   = ALL.find(L=>L.code===code)?.dir ?? 'ltr';
                return (
                  <div key={code}>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-sm" dir={dir}>
                      {forms.length ? forms.map(a => a.lemma).join(', ') : <span className="opacity-60">—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
        {!data.results.length && q && !loading && (
          <div className="opacity-70 text-sm">No results.</div>
        )}
      </section>
    </main>
  );
}
