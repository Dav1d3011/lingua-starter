// scripts/build-dict.js
// Build data/dict.json from a single TSV: seed/multilang.tsv
// Columns (TAB separated): gloss  pos  en  he  ar  ru
const fs = require('fs');
const path = require('path');

const LANGS = ['en','he','ar','ru'];

function splitList(s) {
  if (!s) return [];
  return s.split('|').map(x => x.trim()).filter(Boolean);
}

function readTSV(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const out = [];
  for (const line of lines) {
    if (line.startsWith('#')) continue;
    const parts = line.split('\t');
    const [gloss='', pos='', en='', he='', ar='', ru=''] = parts.map(x => (x||'').trim());
    out.push({ gloss, pos: pos.toLowerCase(), langs: { en, he, ar, ru } });
  }
  return out;
}

function build() {
  const seedFile = path.join('seed','multilang.tsv');
  const rows = readTSV(seedFile);
  let id = 3000;
  const out = rows.map(r => {
    const aliases = {};
    for (const L of LANGS) {
      aliases[L] = splitList(r.langs[L]).map(lemma => ({ lemma, pos: r.pos }));
    }
    return {
      id: ++id,
      gloss: r.gloss || 'meaning',
      aliases
    };
  });

  // ensure folder + write
  const outDir = path.join('data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outFile = path.join(outDir, 'dict.json');
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} meanings to ${outFile}`);
}

build();
