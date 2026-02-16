import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");
const DONE = "jikka-katazuke-oya-settoku";

const EYECATCH_BY_SLUG = {
  "jikka-katazuke-dokokara": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "seizen-seiri-yarikata-list": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
  "jikka-gyousha-tanomita": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
  "dejitaru-isan-password": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800",
  "kimono-shobun-zaikan": "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=800",
  "kottouhin-kachi-wakaranai": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "akiya-ijihi-simulation": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "jikka-kotei-shisanzei": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
  "seizen-seiri-itsukara": "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800",
};

const IMAGES_BY_SLUG = {
  "jikka-katazuke-dokokara": [
    { afterIndex: 2, src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800", alt: "リストで全体像をつかむ" },
    { afterIndex: 6, src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800", alt: "場所別に少しずつ片付ける" },
    { afterIndex: 12, src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800", alt: "進捗を可視化" },
  ],
  "seizen-seiri-yarikata-list": [
    { afterIndex: 3, src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800", alt: "リスト化でやることを可視化" },
    { afterIndex: 8, src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800", alt: "場所別ロードマップ" },
  ],
  "jikka-gyousha-tanomita": [
    { afterIndex: 3, src: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800", alt: "プロに任せて負担を減らす" },
    { afterIndex: 8, src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800", alt: "一括見積もりで比較" },
  ],
  "dejitaru-isan-password": [
    { afterIndex: 2, src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800", alt: "目録を作る" },
    { afterIndex: 6, src: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800", alt: "パスワード管理アプリの活用" },
  ],
  "kimono-shobun-zaikan": [
    { afterIndex: 2, src: "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=800", alt: "着物のリユース・買取" },
    { afterIndex: 5, src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800", alt: "心の整え方" },
  ],
  "kottouhin-kachi-wakaranai": [
    { afterIndex: 2, src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", alt: "無料査定・鑑定" },
    { afterIndex: 5, src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800", alt: "安心して依頼する" },
  ],
  "akiya-ijihi-simulation": [
    { afterIndex: 2, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", alt: "空き家の維持費の内訳" },
    { afterIndex: 6, src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800", alt: "シミュレーションの考え方" },
  ],
  "jikka-kotei-shisanzei": [
    { afterIndex: 2, src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800", alt: "固定資産税の考え方" },
    { afterIndex: 6, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", alt: "住宅用地の特例" },
  ],
  "seizen-seiri-itsukara": [
    { afterIndex: 2, src: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800", alt: "いつから始めるか" },
    { afterIndex: 6, src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800", alt: "今すぐできること" },
  ],
};

const DEFAULT_OWL = ["うんうん", "なるほど", "そうなんですね", "その通りだホー", "いいですね", "わかります", "まずは一歩からで大丈夫です", "その調子です"];

function countSegments(body) {
  return body.split(/<\/p>\s*/i).map((s) => s.trim()).filter((s) => s.length > 0).length;
}

function generateOwlMessages(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(DEFAULT_OWL[i % DEFAULT_OWL.length]);
  return out;
}

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json") && f !== "index.json");
for (const file of files) {
  const slug = file.replace(".json", "");
  if (slug === DONE) continue;
  const filePath = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  if (data.eyecatch) {
    console.log("Skip (has eyecatch):", slug);
    continue;
  }
  const n = countSegments(data.body || "");
  data.eyecatch = EYECATCH_BY_SLUG[slug] || "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800";
  data.images = IMAGES_BY_SLUG[slug] || [];
  data.owlMessages = generateOwlMessages(n);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log("Updated:", slug, "segments:", n);
}
