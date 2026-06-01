import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPost, getBlogPostIds, getBlogList } from "../../lib/microcms";
import { pageTitle, SITE_NAME_FULL } from "../../lib/site-brand";
import { getCanonicalBase, getCanonicalUrl } from "../../lib/site-url";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import ArticleLineCTABanner from "../../components/articles/ArticleLineCTABanner";
import ArticleEeaatProfile from "../../components/articles/ArticleEeaatProfile";
import ArticleBodyContentMicroCms from "../../components/articles/ArticleBodyContentMicroCms";
import ArticleRelatedPosts from "../../components/articles/ArticleRelatedPosts";
import ArticleInlineAppraisalCTA from "../../components/articles/ArticleInlineAppraisalCTA";
import ArticleContextualLinks from "../../components/articles/ArticleContextualLinks";
import { resolveArticleSupervisor } from "../../lib/supervisors";

/**
 * 記事カテゴリ/タグに応じて、ノムコム査定CTAの文脈バリアントを決定。
 * 例: 「相続」「実家じまい」「空き家」関連は、それぞれ刺さる見出しに差し替える。
 */
function pickAppraisalVariant(
  categoryId?: string,
  tagIds?: string[]
): "default" | "inheritance" | "jikka" | "akiya" {
  const tagSet = new Set(tagIds ?? []);
  const cat = categoryId ?? "";
  if (cat === "inheritance" || tagSet.has("inheritance-deadline")) return "inheritance";
  if (cat === "real-estate" || tagSet.has("akiya-long")) return "akiya";
  if (cat === "guide" || cat === "cleanup" || tagSet.has("hajimete")) return "jikka";
  return "default";
}

interface Props {
  params: Promise<{ id: string }>;
}

// ISR: microCMSの新規記事を10分ごとに自動反映（再デプロイ不要）
export const revalidate = 600;

export async function generateStaticParams() {
  const ids = (await getBlogPostIds()) ?? [];
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) return { title: pageTitle("記事が見つかりません") };

  const title = post.title;
  const bodyText = post.content ?? post.body ?? "";
  const description =
    post.description ?? (bodyText ? bodyText.replace(/<[^>]+>/g, "").slice(0, 160) + "…" : undefined);
  const ogImage = post.ogpImage?.url ?? post.thumbnail?.url;
  const url = getCanonicalUrl(`/articles/${id}`);

  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME_FULL,
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      }),
      publishedTime: post.publishedAt,
      modifiedTime: post.revisedAt ?? post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) notFound();

  // 関連記事の候補プール（最新40件から関連度スコアで3件抽出）
  const relatedCandidates = (await getBlogList(40, 0)).contents;

  const base = getCanonicalBase();
  const dateStr = post.publishedAt
    ? format(new Date(post.publishedAt), "yyyy年M月d日", { locale: ja })
    : "";
  const thumb = post.thumbnail?.url;
  const tags = post.tags ?? [];
  const category = post.category;
  const appraisalVariant = pickAppraisalVariant(
    category?.id,
    (tags ?? []).map((t) => t.id)
  );

  // 【PANEL_03 P0修正】Article schema の著者を Organization → Person に。
  // 監修者(supervisor)が解決できる記事は、その人物を author として渡し、
  // Googleの「Authors」評価・E-E-A-Tに人物の専門性を伝える。
  // supervisor="none"（相続税など専門家領域・総合監修対象外）は人物を出さず法人著者にフォールバック。
  const supervisorPerson = resolveArticleSupervisor(post.supervisor);
  const authorSchema = supervisorPerson
    ? {
        "@type": "Person",
        name: supervisorPerson.name,
        jobTitle: supervisorPerson.badgeTitle,
        url: `${base}${supervisorPerson.profileHref}`,
        "@id": `${base}${supervisorPerson.profileHref}#person`,
        ...(supervisorPerson.credentials.length > 0 && {
          hasCredential: supervisorPerson.credentials.map((c) => ({
            "@type": "EducationalOccupationalCredential",
            name: c,
          })),
        }),
        worksFor: { "@type": "Organization", name: SITE_NAME_FULL },
      }
    : { "@type": "Organization", name: "株式会社Kogera 生前整理支援センター ふれあいの丘" };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? undefined,
    datePublished: post.publishedAt,
    dateModified: post.revisedAt ?? post.publishedAt,
    author: authorSchema,
    ...(supervisorPerson && {
      reviewedBy: {
        "@type": "Person",
        name: supervisorPerson.name,
        url: `${base}${supervisorPerson.profileHref}`,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME_FULL,
      url: base,
    },
    ...(thumb && { image: thumb }),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/articles/${id}` },
  };

  return (
    <article className="max-w-3xl mx-auto py-8 px-4" itemScope itemType="https://schema.org/Article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-foreground/60 mb-6">
        <Link href="/" className="hover:text-primary transition">トップ</Link>
        <span className="mx-2">/</span>
        <Link href="/articles" className="hover:text-primary transition">記事一覧</Link>
        <span className="mx-2">/</span>
        <span className="line-clamp-1">{post.title}</span>
      </nav>

      <header>
        {category?.name && (
          <span className="inline-block text-xs font-medium text-primary bg-primary-light px-2 py-0.5 rounded mb-2">
            {category.name}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-primary mt-1" itemProp="headline">
          {post.title}
        </h1>
        {dateStr && (
          <time
            className="text-sm text-foreground/50 block mt-2"
            dateTime={post.publishedAt}
            itemProp="datePublished"
          >
            {dateStr}
          </time>
        )}
        {(tags?.length ?? 0) > 0 && (
          <ul className="flex flex-wrap gap-2 mt-2" aria-label="タグ">
            {(tags || []).map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/articles/tag/${tag.id}`}
                  className="text-xs font-medium text-primary bg-primary-light/30 hover:bg-primary-light px-2 py-0.5 rounded"
                >
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      {thumb && (
        <figure className="mt-6 rounded-xl overflow-hidden border border-border aspect-video relative w-full">
          <Image
            src={thumb}
            alt={post.title.slice(0, 20)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
            fetchPriority="high"
          />
        </figure>
      )}

      <div className="mt-8">
        <ArticleBodyContentMicroCms body={post.content ?? post.body ?? ""} />
      </div>

      {/* 本文直後：文脈別の不動産査定アフィCTA（ノムコム A8 実証済） */}
      <ArticleInlineAppraisalCTA variant={appraisalVariant} />

      {/* 【収束2：3つの孤立島の結合】記事→/area・/tax-simulator・ツールへの動的内部リンク。
          カテゴリ別に「次の一歩」を提示し、収益ページへPageRankと回遊を流す。 */}
      <ArticleContextualLinks categoryId={category?.id} />

      {/* LINE誘導はガイドラインで本文外固定（ArticleLineCTABannerが担当） */}
      <ArticleLineCTABanner />

      {/* 回遊率3倍化：全記事ページに関連記事3本を固定表示 */}
      <ArticleRelatedPosts
        currentId={id}
        currentCategoryId={category?.id}
        currentTagIds={(tags ?? []).map((t) => t.id)}
        candidates={relatedCandidates}
      />

      <footer className="mt-10">
        <ArticleEeaatProfile supervisor={post.supervisor} />
        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/articles" className="text-primary font-medium hover:underline">
            ← 記事一覧へ戻る
          </Link>
        </div>
      </footer>
    </article>
  );
}
