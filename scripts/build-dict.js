// scripts/build-dict.js (robust split for tabs OR multi-spaces, header-friendly)
const fs = require('fs');
const path = require('path');

function splitList(s) {
    if (!s) return [];
    return s.split('|').map(x => x.trim()).filter(Boolean);
}

// split line by tabs OR 2+ spaces; also trim BOM
function smartSplit(line) {
    // remove BOM if present
    if (line.charCodeAt(0) === 0xFEFF) line = line.slice(1);
    const hasTab = line.includes('\t');
    const parts = (hasTab ? line.split('\t') : line.split(/ {2,}/)).map(s => s.trim());
    return parts;
}

function readTSV(filePath, mapper) {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const out = [];
    for (const line of lines) {
        if (!line || line.startsWith('#')) continue;
        const cols = smartSplit(line);
        // skip header rows (first cell equals a known header key)
        const first = (cols[0] || '').toLowerCase();
        if (['id', 'gloss', 'pos'].includes(first)) continue;
        out.push(mapper(cols));
    }
    return out;
}

function buildFromSplit() {
    const seedDir = path.join('seed');
    const meaningsFile = path.join(seedDir, 'meanings.tsv');
    if (!fs.existsSync(meaningsFile)) return null;

    const meanings = readTSV(meaningsFile, (c) => {
        const [idRaw, gloss = '', pos = ''] = c;
        const idNum = Number(String(idRaw).trim());
        if (!Number.isFinite(idNum)) {
            throw new Error(`meanings.tsv: invalid id "${idRaw}"`);
        }
        return { id: idNum, gloss: gloss || 'meaning', pos: (pos || '').toLowerCase() };
    });

    const langsDir = path.join(seedDir, 'langs');
    if (!fs.existsSync(langsDir)) {
        throw new Error('Split format requires seed/langs/ folder with per-language TSV files.');
    }
    const langFiles = fs.readdirSync(langsDir).filter(f => /^[a-z]{2,3}\.tsv$/i.test(f));

    const langData = {};
    for (const file of langFiles) {
        const code = file.replace(/\.tsv$/i, '').toLowerCase();
        const rows = readTSV(path.join(langsDir, file), (c) => {
            const [idRaw, forms = ''] = c;
            const idNum = Number(String(idRaw).trim());
            if (!Number.isFinite(idNum)) {
                throw new Error(`${file}: invalid id "${idRaw}"`);
            }
            return { id: idNum, forms: splitList(forms) };
        });
        langData[code] = rows;
    }

    const out = meanings.map(m => {
        const aliases = {};
        for (const code of Object.keys(langData)) {
            const rows = langData[code].filter(r => r.id === m.id);
            const lemmas = rows.flatMap(r => r.forms);
            aliases[code] = lemmas.map(lemma => ({ lemma, pos: m.pos }));
        }
        return { id: m.id, gloss: m.gloss, aliases };
    });

    return out;
}

function buildFromLegacy() {
    const filePath = path.join('seed', 'multilang.tsv');
    if (!fs.existsSync(filePath)) return null;

    const rows = readTSV(filePath, (c) => {
        // legacy: gloss pos en es he ru (order matters)
        const [gloss = '', pos = '', en = '', es = '', he = '', ru = ''] = c.map(x => (x || '').trim());
        return { gloss, pos: pos.toLowerCase(), langs: { en, es, he, ru } };
    });

    let id = 3000;
    return rows.map(r => {
        const aliases = {};
        for (const code of Object.keys(r.langs)) {
            aliases[code] = splitList(r.langs[code]).map(lemma => ({ lemma, pos: r.pos }));
        }
        return { id: ++id, gloss: r.gloss || 'meaning', aliases };
    });
}

function build() {
    const outDir = path.join('data');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'dict.json');

    let out = buildFromSplit();
    if (!out) out = buildFromLegacy();
    if (!out) {
        console.warn('No dictionary seeds found. Provide seed/meanings.tsv + seed/langs/*.tsv or seed/multilang.tsv');
        fs.writeFileSync(outFile, JSON.stringify([], null, 2), 'utf8');
        return;
    }

    fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');
    console.log(`Wrote ${out.length} meanings to ${outFile} from ${fs.existsSync(path.join('seed', 'meanings.tsv')) ? 'split' : 'legacy'} format.`);
}

build();
