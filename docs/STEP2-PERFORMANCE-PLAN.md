# Step 2: パフォーマンス改善 修正計画とコード草案

Step 1 で特定したボトルネックに基づく、**具体的な修正方針**と**主要なコード草案**です。  
実装（Step 3）は、本計画の承認後に実行します。

---

## 1. ヒーロー画像の `next/image` 化と UI 維持

### 1.1 修正方針

- **現状**: `app/page.tsx` のヒーローで CSS `background-image: url(/images/hero-couple.png)` を使用。LCP 候補でありながら最適化されていない。
- **対応**: 背景用の `<div>` を「`next/image` を `fill` + `object-cover` で配置するラッパー」に置き換え、既存のレイアウト（左アンカー・最大幅 1400px・`bg-[position:8%_center]` 相当・グラデーションオーバーレイ）を **Tailwind の `relative` / `absolute` / `inset-0` / `object-cover` / `object-position`** で再現する。
- **画像**: `priority={true}` と `fetchPriority="high"` を付与し、LCP を極限まで最適化する。
- **CSS クラス**: `.hero-panorama-bg` は「背景画像用」として廃止し、代わりに Image のラッパーに `absolute left-0 top-0 bottom-0 w-full max-w-[1400px] h-full` を付与。`object-position` は PC で `8% center`、モバイルで `3% center` を維持するため、Tailwind の `object-[8%_50%]` と `max-md:object-[3%_50%]` を使用する（または 1 つの `object-left` 系 + カスタムクラス）。

### 1.2 コード草案（ヒーローセクション部分）

**配置イメージ**: 外側の構造はそのまま。  
「背景画像だった div」を、次のような **Image ラッパー** に差し替える。

```tsx
// app/page.tsx または app/components/HeroSection.tsx 内のヒーロー部分

import Image from "next/image";

const HERO_IMAGE = "/images/hero-couple.png";

// ヒーロー背景：next/image で LCP 最適化（priority + fetchPriority="high"）
<div className="absolute left-0 top-0 bottom-0 w-full max-w-[1400px] h-full overflow-hidden" aria-hidden>
  <Image
    src={HERO_IMAGE}
    alt=""
    fill
    className="object-cover object-[8%_50%] max-md:object-[3%_50%]"
    sizes="(max-width: 767px) 100vw, 1400px"
    priority
    fetchPriority="high"
  />
</div>
<div className="hero-panorama-gradient absolute inset-0 w-full h-full pointer-events-none" aria-hidden />
```

- **レイアウト互換**: 従来の `hero-panorama-bg` は `absolute left-0 top-0 bottom-0 w-full max-w-[1400px] h-full` + `bg-cover` + `bg-[position:8%_center]` だったため、上記の `fill` + `object-cover` + `object-[8%_50%]`（およびモバイル用 `max-md:object-[3%_50%]`）で **1 ミリも崩れず** 再現できる。
- **グラデーション**: 既存の `.hero-panorama-gradient` はそのまま重ねる（変更なし）。

---

## 2. トップページ（`app/page.tsx`）の Server Component 化

### 2.1 修正方針

- **現状**: `app/page.tsx` 全体が `"use client"` のため、ヒーローを含むすべてがクライアントレンダリングとなり、LCP・FID/INP に不利。
- **対応**:
  1. **`app/page.tsx`** から `"use client"` を削除し、**Server Component** にする。
  2. **ヒーロー以上**（ヒーロー画像 + 見出し・サブコピー・チップ・CTA）はサーバーでレンダリングする。インタラクティブな **HeroJikkaCta**（`useRouter` / `useState`）だけ **クライアントコンポーネント** として切り出す。
  3. **ヒーローより下**で、`localStorage` 由来の **stats** に依存するブロック（Review Reminder、KPI Dashboard、DashboardCard の progress/detail）は、1 つの **HomeContentClient** にまとめる。`page.tsx` は「静的セクション（メガボタン・Step カード・ツールカード・Guide Summary・FAQ・About 等）」をサーバーで出力し、**stats 依存部分のみ** HomeContentClient に渡してクライアントで描画する設計とする。

### 2.2 コンポーネント分割案

| コンポーネント | 種別 | 役割 |
|----------------|------|------|
| **HeroJikkaCta** | Client | 間取り select + router.push。既存ロジックをそのまま `app/components/home/HeroJikkaCta.tsx` に移す。 |
| **HeroSection** | Server | ヒーロー用の Image（上記 1.2）+ グラデ + テキスト・チップ + `<HeroJikkaCta />`。`app/components/home/HeroSection.tsx`。 |
| **HomeContentClient** | Client | localStorage から stats を取得し、Review Reminder / KPI Dashboard / DashboardCard 群（progress 等）を描画。EmptyHouseTaxSimulator・UserTestimonialsSlider はこの中で dynamic 読み込み。 |
| **page.tsx** | Server | HeroSection + メガボタン + Step カード + (HomeContentClient 内で dynamic な Simulator/Slider) + ツールカード（ToolCard は静的なので Server で OK）+ HomeContentClient（stats ブロック）+ 以降の静的セクション（Guide Summary, 家族招待, LineCTA, 運営者, 川柳, EmailCTA, FAQ, About）。 |

**注意**: ツールカード 6 本・メガボタン・Step カードは状態に依存しないため、Server のまま `page.tsx` に残す。  
EmptyHouseTaxSimulator と UserTestimonialsSlider は **HomeContentClient 内**で `next/dynamic` して配置する（後述 3.）。

### 2.3 コード草案（ファイル構成と page.tsx 骨子）

**新規ファイル**

- `app/components/home/HeroJikkaCta.tsx` … 既存の `HeroJikkaCta` 関数をそのまま移す（`"use client"` + useRouter + useState）。
- `app/components/home/HeroSection.tsx` … Server Component。ヒーロー Image + オーバーレイ + コピー + `<HeroJikkaCta />`。
- `app/components/home/HomeContentClient.tsx` … Client Component。useEffect で stats 取得、Review Reminder / KPI / DashboardCard / Simulator / UserTestimonialsSlider / ツール見出し〜ツールカード 6 本〜以降の stats 依存ブロックを描画。Simulator と Slider は dynamic import。

**app/page.tsx（Server Component）の骨子**

```tsx
// app/page.tsx（"use client" なし）
import Link from "next/link";
import HeroSection from "./components/home/HeroSection";
import HomeContentClient from "./components/home/HomeContentClient";

export default function Home() {
  return (
    <div className="space-y-8">
      <HeroSection />

      {/* ファーストビュー直下：3つのメガボタン（静的） */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" aria-label="今の悩みに合わせて選ぶ">
        {/* 既存の 3 つの Link をそのまま */}
      </section>

      {/* 3つのサービス領域（Stepカード）：静的 */}
      <section className="w-full rounded-2xl ...">
        {/* 既存の Step 1 / 2 / 3 をそのまま */}
      </section>

      {/* 以下は stats・Simulator・Slider を含むクライアントブロック */}
      <HomeContentClient />

      {/* 以降：Guide Summary, 家族招待, LineCTA, 運営者, 川柳, EmailCTA, FAQ, About は
          HomeContentClient の子としてまとめるか、または page に静的として残す。
          「川柳」は OwlCharacter を使うが状態不要なので、Server に残してよい。
          ただし OwlAizuchi 等も Client のため、Guide Summary 以降をすべて HomeContentClient に入れると
          シンプルになる。ここでは「stats 依存＋Simulator＋Slider」のみ HomeContentClient とし、
          それ以外の静的セクションは page に残す案とする。 */}
      {/* Guide Summary 〜 About は現状どおり page に並べる。その場合、HomeContentClient は
          EmptyHouseTaxSimulator, UserTestimonialsSlider, ツールカード 6 本, Review Reminder,
          KPI Dashboard, 進捗管理 DashboardCard 3 本, 家族招待, LineCTA, 運営者, 川柳, EmailCTA, FAQ, About
          までを含む「下 half」全体にするのが、分割しやすい。 */}
    </div>
  );
}
```

**推奨**: 実装負荷を抑えるため、**HomeContentClient を「ヒーロー・メガボタン・Step カードを除く、現在の Home の残り全体」** とする。  
つまり `page.tsx` は「HeroSection + メガボタン + Step カード + HomeContentClient」の 4 ブロックだけにし、HomeContentClient 内で「Simulator（dynamic）→ OwlAizuchi → UserTestimonialsSlider（dynamic）→ ツールカード〜About まで」をすべて描画する。  
これで `page.tsx` から `"use client"` を削除しつつ、ヒーローと直下 2 セクションはサーバー描画で LCP を改善できる。

### 2.4 HeroSection.tsx 草案（Server Component）

```tsx
// app/components/home/HeroSection.tsx（Server Component、 "use client" なし）
import Image from "next/image";
import Link from "next/link";
import OwlCharacter from "../OwlCharacter";
import HeroJikkaCta from "./HeroJikkaCta";

const HERO_IMAGE = "/images/hero-couple.png";

export default function HeroSection() {
  return (
    <div className="relative left-1/2 -ml-[50vw] w-screen overflow-hidden max-h-[600px] md:max-h-[650px] lg:max-h-[700px] xl:max-h-[800px] bg-[#FFFDF9]">
      <section className="relative w-full min-h-0 md:min-h-[520px] overflow-hidden bg-[#FFFDF9]">
        {/* 背景画像：next/image で LCP 最適化 */}
        <div className="absolute left-0 top-0 bottom-0 w-full max-w-[1400px] h-full overflow-hidden" aria-hidden>
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover object-[8%_50%] max-md:object-[3%_50%]"
            sizes="(max-width: 767px) 100vw, 1400px"
            priority
            fetchPriority="high"
          />
        </div>
        <div className="hero-panorama-gradient absolute inset-0 w-full h-full pointer-events-none" aria-hidden />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:justify-end md:items-center min-h-[380px] md:min-h-[520px] pt-6 md:pt-12 pb-6 md:pb-12">
          <div className="w-full md:max-w-[58%] lg:max-w-[56%] flex flex-col items-start text-left">
            <div className="hero-glass-panorama-v2 w-full max-w-[90%] mx-auto md:max-w-full md:mx-0 bg-white/5 py-4 px-4 sm:px-6 md:py-10 md:px-8 md:pl-12 md:pr-10 flex flex-col items-start text-left">
              <div className="flex flex-row items-center gap-2 md:gap-3 w-full mb-1.5 md:mb-3">
                <OwlCharacter
                  size={42}
                  sizeMobile={32}
                  message={<>今のあなたに必要なサポートを<span className="whitespace-nowrap">無料診断</span></>}
                  tone="calm"
                  bubblePosition="above"
                  softShadow
                  priority
                />
              </div>
              <h1 className="w-full max-w-[18em] min-w-0 text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight tracking-tighter text-balance [filter:drop-shadow(0_1px_1px_rgba(255,255,255,0.9))]">
                <span className="whitespace-nowrap">生前整理のすべてを</span>
                <br />
                これひとつで
              </h1>
              <p className="mt-2 md:mt-5 text-slate-700 text-xs sm:text-sm md:text-base w-full max-w-md font-normal leading-snug md:leading-relaxed text-left">
                実家の片付けから不動産・相続まで。AIと専門家が丸ごと一括サポート。
              </p>
              <ul className="flex flex-wrap gap-1.5 md:gap-3 justify-start mt-3 md:mt-8" aria-label="対応範囲">
                {/* 既存の 6 個の li をそのまま */}
              </ul>
              <HeroJikkaCta />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- **OwlCharacter** に `priority` を渡す設計は、後述「4. その他画像の最適化」で対応する。

---

## 3. `next/dynamic` による遅延読み込み

### 3.1 修正方針

- **EmptyHouseTaxSimulator**: トップページでは FV 直下だが、初期表示の LCP には不要。`next/dynamic` で遅延読み込みし、`loading` でスケルトン（または最小限のプレースホルダー）を表示する。
- **UserTestimonialsSlider**: FV 外。同様に `next/dynamic` で遅延読み込みし、必要ならスケルトンで高さを確保する。
- **recharts**: `app/tools/inheritance-share/page.tsx` は全体が Client。グラフ部分だけ別コンポーネントに切り出し、そのコンポーネントを `next/dynamic` で読み込む。

### 3.2 コード草案

**HomeContentClient 内での dynamic（トップページ）**

```tsx
// app/components/home/HomeContentClient.tsx 内
import dynamic from "next/dynamic";

const EmptyHouseTaxSimulator = dynamic(
  () => import("../EmptyHouseTaxSimulator").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card rounded-2xl border border-border p-6 min-h-[200px] flex items-center justify-center">
        <span className="text-foreground/50 text-sm">読み込み中…</span>
      </div>
    ),
  }
);

const UserTestimonialsSlider = dynamic(
  () => import("../UserTestimonialsSlider").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-border bg-primary-light/10 p-6 min-h-[280px] flex items-center justify-center">
        <span className="text-foreground/50 text-sm">お客様の声を読み込み中…</span>
      </div>
    ),
  }
);
```

- **recharts（inheritance-share）**: ページは `"use client"` のまま、**グラフを描画する部分**だけを別ファイルに切り出し、dynamic で読み込む。

```tsx
// app/tools/inheritance-share/InheritanceShareChart.tsx（新規）
"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
// ... 既存の chartData を使う表示ロジックのみ
export default function InheritanceShareChart({ chartData }: { chartData: Array<{ name: string; value: number; color: string }> }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>...</PieChart>
    </ResponsiveContainer>
  );
}
```

```tsx
// app/tools/inheritance-share/page.tsx 内
import dynamic from "next/dynamic";

const InheritanceShareChart = dynamic(
  () => import("./InheritanceShareChart").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] rounded-xl bg-muted/30 flex items-center justify-center">
        <span className="text-foreground/50">グラフを準備しています…</span>
      </div>
    ),
  }
);
```

- ページ側では `chartData` を計算したうえで `<InheritanceShareChart chartData={chartData} />` をレンダリングする。

---

## 4. その他画像の最適化（OwlCharacter の priority 伝播・FV 外の next/image）

### 4.1 修正方針

- **OwlCharacter**: FV で使う場合は `priority` + `fetchPriority="high"` を付与したい。**Props に `priority?: boolean` を追加**し、`true` のときは `next/image` で `priority` と `fetchPriority="high"` を付与、未指定または `false` のときは従来どおり `<img>`（または `next/image` の通常読み込み）とする。
- **OwlCharacter** は Client コンポーネントのため、`next/image` をその中で使ってよい。Next の Image は Client でも利用可能。

### 4.2 コード草案（OwlCharacter.tsx）

```tsx
// app/components/OwlCharacter.tsx
"use client";

import Image from "next/image";

const OWL_IMAGE = "/images/owl-character.png?v=4";

interface OwlCharacterProps {
  size?: number;
  sizeMobile?: number;
  message?: React.ReactNode;
  tone?: "warning" | "calm";
  sweat?: boolean;
  bubblePosition?: "above" | "right";
  softShadow?: boolean;
  className?: string;
  /** FV で表示する場合は true にし、LCP 用に priority + fetchPriority="high" を付与 */
  priority?: boolean;
}

export default function OwlCharacter({
  size = 120,
  sizeMobile,
  message,
  tone = "calm",
  sweat = false,
  bubblePosition = "above",
  softShadow = false,
  className = "",
  priority = false,
}: OwlCharacterProps) {
  // ... 既存の bubbleClasses, tailColor, tailColorLeft, bubblePadding, bubbleText

  return (
    <div className={...}>
      {/* 吹き出し above 時 */}
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl ${softShadow ? "shadow-[0_2px_12px_rgba(0,0,0,0.1)]" : ""} ${sizeMobile != null ? "max-md:!w-8 max-md:!h-8" : ""}`}
        style={{ width: size, height: size }}
      >
        {priority ? (
          <Image
            src={OWL_IMAGE}
            alt="ふくろう"
            width={size}
            height={size}
            className="h-full w-full object-contain object-center"
            priority
            fetchPriority="high"
            sizes={`${size}px`}
          />
        ) : (
          <img
            src={OWL_IMAGE}
            alt="ふくろう"
            width={size}
            height={size}
            className="h-full w-full object-contain object-center"
            loading="lazy"
            aria-hidden
          />
        )}
        {sweat && (...)}
      </div>
      {/* 吹き出し right 時 */}
    </div>
  );
}
```

- **DashboardCard の OWL_IMAGE**: FV 外のため、`next/image` に差し替え、`priority` は付けない（デフォルトの遅延読み込み）。  
  HomeContentClient 内の DashboardCard では、右端のフクロウ画像を `<Image src={OWL_IMAGE} width={28} height={28} alt="" />` に変更する。

- **UserTestimonialsSlider 内の `<img>`**: 3 枚とも `next/image` に変更。1 枚目のみ `priority` を付けるかは任意（スライダーが FV 直下なら 1 枚目に `priority` を付与してもよい）。

---

## 5. 対象ファイル一覧（実装時の変更リスト）

| ファイル | 変更内容 |
|----------|----------|
| `app/page.tsx` | `"use client"` 削除。HeroSection + メガボタン + Step カードをサーバーでレンダリング。HomeContentClient を 1 つだけ import して残りを委譲。 |
| `app/components/home/HeroSection.tsx` | **新規**。ヒーロー next/image + グラデ + コピー + HeroJikkaCta。Server Component。 |
| `app/components/home/HeroJikkaCta.tsx` | **新規**。既存 HeroJikkaCta を切り出し。Client。 |
| `app/components/home/HomeContentClient.tsx` | **新規**。stats 取得、Simulator（dynamic）、Slider（dynamic）、ツールカード〜About まで。ToolCard / formatAmount / DashboardCard はここに含める。 |
| `app/components/OwlCharacter.tsx` | `priority` prop 追加。priority 時は next/image（priority + fetchPriority="high"）、否則は img または next/image（lazy）。 |
| `app/components/UserTestimonialsSlider.tsx` | 内部の `<img>` 3 箇所を `next/image` に変更。1 枚目は `priority` 可。 |
| `app/components/EmptyHouseTaxSimulator.tsx` | 変更なし（呼び出し側で dynamic にする）。 |
| `app/tools/inheritance-share/page.tsx` | InheritanceShareChart を dynamic import。chartData を渡す。 |
| `app/tools/inheritance-share/InheritanceShareChart.tsx` | **新規**。recharts の PieChart 部分のみ切り出し。 |

---

## 6. 記事詳細ページの fetchPriority 追加（参考）

- `app/articles/[id]/page.tsx` のサムネイル Image に `fetchPriority="high"` を追加するだけの小変更として、Step 3 で実施可能。

---

以上が Step 2 の修正計画と主要なコード草案です。確認・合意いただいたうえで、Step 3 で実際のファイルへの書き込みを行います。
