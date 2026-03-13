import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "www11.a8.net", pathname: "/**" },
      { protocol: "https", hostname: "www14.a8.net", pathname: "/**" },
      { protocol: "https", hostname: "www12.a8.net", pathname: "/**" },
      { protocol: "https", hostname: "www13.a8.net", pathname: "/**" },
      { protocol: "https", hostname: "www17.a8.net", pathname: "/**" },
      { protocol: "https", hostname: "www18.a8.net", pathname: "/**" },
    ],
  },
  // SEO: 正規化・重複コンテンツ防止（GSC クロールバジェット回復）
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path+/index.html", destination: "/:path+", permanent: true },
      // 旧ガイドパス → マスターガイド（404防止・リンクジュース集約）
      { source: "/guide", destination: "/articles/master-guide", permanent: true },
      { source: "/guide/:path*", destination: "/articles/master-guide", permanent: true },
      // トレilingスラッシュ統一（Next デフォルトはスラッシュなし → 一貫性のため明示不要ならコメントアウト可）
    ];
  },
  // GSC 用: generateSitemaps は /sitemap/[id].xml のみ生成するため /sitemap.xml は 404 になる。インデックスを返す API へ転送。
  // 分割サイトマップ: /sitemaps/*/sitemap.xml で配信（Route Handler は .xml なしで応答するため rewrite）
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/sitemap-index" },
      { source: "/sitemaps/static/sitemap.xml", destination: "/sitemaps/static/sitemap" },
      { source: "/sitemaps/area/sitemap.xml", destination: "/sitemaps/area/sitemap" },
      { source: "/sitemaps/tools/sitemap.xml", destination: "/sitemaps/tools/sitemap" },
      { source: "/sitemaps/articles/sitemap.xml", destination: "/sitemaps/articles/sitemap" },
    ];
  },
  // ホストエラー・5xx 抑制: ビルド時エラーを厳格に検出
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
