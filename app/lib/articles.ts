import path from "path";
import fs from "fs";
import { getCategorySlugForArticle } from "./article-categories";

export interface ArticleImage {
  /** 何番目の段落の直後に表示するか（0始まり） */
  afterIndex: number;
  src: string;
  alt: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  keywords?: string[];
  /** 状況別タグ（横軸）。複数可。slug の配列 */
  tags?: string[];
  body?: string;
  /** アイキャッチ画像 URL */
  eyecatch?: string;
  /** 記事中に差し込む画像（段落インデックスの直後） */
  images?: ArticleImage[];
  /** 段落ごとのフクロウの一言（段落数と同数） */
  owlMessages?: string[];
}

let cachedIndex: ArticleMeta[] | null = null;

function getIndexPath(): string {
  return path.join(process.cwd(), "content", "articles", "index.json");
}

export function getArticlesIndex(): ArticleMeta[] {
  // 開発中はキャッシュを使わず毎回読み直す（index.json 追加・変更がすぐ一覧に反映される）
  if (process.env.NODE_ENV === "production" && cachedIndex) return cachedIndex;
  const filePath = getIndexPath();
  const raw = fs.readFileSync(filePath, "utf-8");
  const index = JSON.parse(raw) as ArticleMeta[];
  if (process.env.NODE_ENV === "production") cachedIndex = index;
  return index;
}

export function getArticleSlugs(): string[] {
  return getArticlesIndex().map((a) => a.slug);
}

export function getArticleBySlug(slug: string): ArticleMeta | null {
  const list = getArticlesIndex();
  const meta = list.find((a) => a.slug === slug) ?? null;
  if (!meta) return null;
  const bodyPath = path.join(process.cwd(), "content", "articles", `${slug}.json`);
  try {
    if (fs.existsSync(bodyPath)) {
      const full = JSON.parse(fs.readFileSync(bodyPath, "utf-8")) as ArticleMeta;
      return { ...meta, ...full };
    }
  } catch {
    // use meta only
  }
  return meta;
}

/** カテゴリslugで記事一覧を取得（縦軸）。getCategorySlugForArticle でマッピング */
export function getArticlesByCategorySlug(categorySlug: string): ArticleMeta[] {
  const list = getArticlesIndex();
  return list.filter((a) => getCategorySlugForArticle(a.category) === categorySlug);
}

/** タグslugで記事一覧を取得（横軸）。tags に含まれる記事のみ */
export function getArticlesByTagSlug(tagSlug: string): ArticleMeta[] {
  const list = getArticlesIndex();
  return list.filter((a) => Array.isArray(a.tags) && a.tags.includes(tagSlug));
}
