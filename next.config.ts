import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
  // SEO: 正規化・重複コンテンツ防止（GSC クロールバジェット回復）
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path+/index.html", destination: "/:path+", permanent: true },
      // トレilingスラッシュ統一（Next デフォルトはスラッシュなし → 一貫性のため明示不要ならコメントアウト可）
    ];
  },
  // GSC 用: generateSitemaps は /sitemap/[id].xml のみ生成するため /sitemap.xml は 404 になる。インデックスを返す API へ転送。
  async rewrites() {
    return [{ source: "/sitemap.xml", destination: "/api/sitemap-index" }];
  },
  // ホストエラー・5xx 抑制: ビルド時エラーを厳格に検出
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
