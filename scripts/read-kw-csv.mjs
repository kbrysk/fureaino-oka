import fs from 'fs';
const path = 'c:\\Users\\Ryosuke\\Downloads\\rakkokeyword_suggestKeywords_生前整理_2026-02-14_03-14-53.csv';
const buf = fs.readFileSync(path);
const text = buf.toString('utf16le');
const lines = text.split(/[\r\n]+/).filter(Boolean);
const rows = lines.slice(1).map(line => {
  const parts = line.split('\t');
  const kw = (parts[3] || '').replace(/^"|"$/g, '').trim();
  return { no: parts[0], kw, vol: parts[5] || '', cpc: parts[6] || '', comp: parts[7] || '' };
});
const seen = new Set();
const unique = rows.filter(r => {
  if (!r.kw || r.kw.length < 2 || seen.has(r.kw)) return false;
  seen.add(r.kw);
  return true;
});
console.log(JSON.stringify(unique, null, 2));
