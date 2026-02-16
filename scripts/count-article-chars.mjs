import fs from 'fs';
const slugs = [
  'seizen-seiri-towa-itsukara', 'seizen-seiri-yarikata-checklist', 'seizen-seiri-merit-demerit',
  'seizen-seiri-gyousha-ryoukin', 'seizen-seiri-baikyuu-fuyouhin', 'seizen-seiri-nendaibetsu-itsukara',
  'seizen-seiri-app-note', 'seizen-seiri-shukatsu-digital'
];
for (const s of slugs) {
  const j = JSON.parse(fs.readFileSync(`content/articles/${s}.json`, 'utf-8'));
  const body = (j.body || '').replace(/<[^>]+>/g, '');
  const len = body.replace(/\s/g, '').length;
  console.log(`${s}: ${len} 文字`);
}
