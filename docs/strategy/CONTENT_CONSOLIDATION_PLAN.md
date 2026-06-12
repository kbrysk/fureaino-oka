# 記事統合（カニバリ解消）計画 — CONTENT_CONSOLIDATION_PLAN

作成: 2026-06-12 ／ 対象: EXIT_ROADMAP_2026H2 レーンA 8月タスク「articles 100本超の品質統合」の実行計画（前倒し設計）
分析ソース: `content/pipeline/keywords.csv`・全 meta.json（116ディレクトリ）・`logs/gsc/gsc_pages_jun01.tsv`・`middleware.ts`・`app/lib/article-situations.ts`・`social/x-queue.json`

---

## 0. 前提と現状ファクト

### 記事インベントリ（実測）

| 区分 | 本数 | 状態 |
|---|---|---|
| keywords.csv 台帳記事（C5〜C11 / P1〜P4） | 45 | microCMS公開済（article_id あり） |
| NEW-001〜057 | 57 | microCMS公開済（台帳未登録。`app/lib/article-situations.ts` 等からリンク済） |
| P3単発バッチ（akiya-kotei-6bai-kaihi 等5本） | 5 | microCMS公開済（台帳未登録） |
| `/articles/master-guide`（静的ルート） | 1 | コード内ページ |
| O1-001〜008（海外調査） | 8 | **microCMS未投入**（--live承認待ち） |
| overseas-*（O1の旧版・slug違い） | 3 | 未公開ドラフト（O1-001/002/003 と内容重複） |
| oya-settoku | 1 | 未公開ドラフト（meta.json に slug なし） |

**公開済み ≒ 108本。GSC（2026-06-01時点）で表示があるのは `/articles/master-guide`（表示8）と `/articles/akiya-kaitai-hojokin`（表示3・301済）の2URLのみ。クリック0。** 残り106本は検索的に存在していない。つまり「統合で失うトラフィック」は実質ゼロであり、URLを動かすコストが最も安い今が統合の好機。

### 台帳ギャップ（統合前に直す）

NEW-001〜057 と P3単発5本は `keywords.csv` に行が存在しない。統合の status 管理（`merged` 遷移。前例: C9-044/045/047/048）ができないため、**着手前に台帳へ行を追加する**（slug・cluster・status=published のみで可）。

---

## 1. カニバリクラスタ一覧表

重複度: **高**=主要クエリがほぼ同一（統合必須）／**中**=部分重複（リライト・差別化で対応）／**低**=設計上の役割分担済み（対応不要）

| # | グループ | 記事 slug（太字=残す軸） | 重複度 |
|---|---|---|---|
| A | 生前整理とは・総論 | **seizenseiri-hub**(C10-008, pillar) ／ seizenseiri-towa(C10-022) | 高 |
| B | 生前整理 進め方・やり方 | **seizenseiri-susumekata**(C10-040, pillar) ／ seizenseiri-yarikata(P1-042) ／ master-guide(静的・URL不変) | 高 |
| C | 遺品整理 費用相場 | **ihin-seiri-hiyou**(C6-035) ／ ihin-hiyou-soba(NEW-054) ※タイトルほぼ同一「遺品整理の費用相場｜間取り別」 | 高 |
| D | 遺品整理 いつから | **ihinseiri-itsukara**(C6-034) ／ ihin-seiri-timing(NEW-029) | 高 |
| E | 遺品整理 自分で | **ihin-seiri-jibun-de**(NEW-023) ／ ihin-seiri-jibunde(NEW-003) ※slugがハイフン1本違いの完全カニバリ | 高 |
| F | デジタル遺品 | **digital-ihin**(C6-020) ／ digital-ihin-seiri(NEW-018) | 高 |
| G | 不用品回収 業者選び | **fuyohin-kaishu**(C8-021) ／ fuyohin-kaishu-gyosha(C8-033) ／ fuyohin-kaishu-souba(C8-043)=中 | 高 |
| H | 親が亡くなったらやること | **shigo-tetsuzuki-checklist**(C11-026, pillar・専用PDF導線あり) ／ oya-nakunattara-tetsuzuki-junban(NEW-038) | 高 |
| I | 実家を相続したら | **jikka-souzoku-tetsuzuki**(C9-046, pillar) ／ akiya-souzoku-4sentakushi(NEW-048) | 高 |
| J | 実家じまい 費用 | **jikka-jimai-hiyou**(P1-025) ／ jikkajimai-hiyou-soba(NEW-043) | 高 |
| K | 実家じまい／家じまい | **jikka-jimai-guide**(P1-004, pillar) ／ iejimai-susumekata(NEW-020) ※「家じまい(720)」はP1-004の副次KWとして台帳登録済 | 高 |
| L | 空き家・実家の固定資産税 | **jikka-kotei-shisanzei-taisaku**(NEW-028) ／ akiya-kotei-6bai-kaihi ※どちらも住宅用地特例＋6倍回避を解説。tokutei-akiya(P3-011)は「特定空き家とは」で別意図=残す | 高 |
| M | 写真・アルバム整理 | **jikka-shashin-seiri**(NEW-021) ／ shashin-album-seiri(NEW-005) | 高 |
| N | 海外シリーズの二重ドラフト | **O1-001/002/003**（death-doula-toha 等） ／ overseas-death-doula・overseas-digital-estate・overseas-swedish-death-cleaning（旧版slug） | 高（未公開・公開事故予防） |
| O | 親への切り出し方 | **oya-no-shukatsu**(P4-031) ／ oya-settoku（未公開ドラフト6.7KB） | 高（未公開のまま吸収） |
| P | 親の認知症 | oya-ninchisho-kaigo-junbi(NEW-017) ／ oya-ninchi-seiri(NEW-004) ※疑い段階の備え vs 発症後の物の整理。クエリ「親 認知症」は重なる | 中 |
| Q | エンディングノート | ending-note-towa(C5-003) ／ ending-note-muryou(C5-019) ※両方が「書き方・遺言書との違い」をタイトルに含む | 中 |
| R | 口座凍結 | ginko-koza-tousai-kaijo(C11-016・死後) ／ ninchisho-yokin-hikidashi(NEW-056・生前認知症) | 中 |
| S | 業者選び4本 | ihin-seiri-gyosha(C6-027) ／ jikka-katazuke-gyosha-erabikata(NEW-015) ／ fuyohin-kaishu(C8-021) ／ ihin-kaitori-gyosha(NEW-006) | 中（CV先別・残す） |
| T | 空き家の選択肢ハブ | akiya-shobun(P3-028) ／ akiya-urenai-taisho ※NEW-020(→K)・NEW-048(→I)統合後はほぼ解消 | 中→解消 |
| U | 終活 とは／いつから | shukatsu-towa(C5-013) ／ shukatsu-itsukara(C5-029) | 低（役割分担・相互リンク済） |
| V | 後見・信託 | nini-koken-keiyaku-toha ／ seinen-kouken-demerit ／ kazoku-shintaku-kihon | 低〜中 |
| W | シニアの住まい | senior-sumikae-timing ／ senior-chintai-hoshou ／ roujin-home-nyukyo-jikka ／ kaigo-shisetsu-shurui-erabikata | 低 |

**高×実害あり（=要301統合）は A〜M の13グループ・統合対象14本**。N・O は未公開のためファイル整理のみで解消できる。

---

## 2. TOP10統合プラン（優先度順）

判断基準: (a) pillar 指定 > (b) 台帳登録・先行インデックスURL・主KW完全一致slug > (c) 本文の厚さ（draft.html サイズ）。**「残すURL」と「本文のベース」は別判断**——薄い既存URLを残し、厚い吸収側の本文を移植するケースが半分ある。

| # | クエリ群（代表Vol/月） | 残す記事 | 消す記事（301元） | 作業内容 |
|---|---|---|---|---|
| 1 | 生前整理 とは（880）＋総論（3,600） | seizenseiri-hub | seizenseiri-towa | towa の「遺品整理・終活・老前整理との違い」「メリデメ」をhubへ移植。hubはpillar・台帳S格 |
| 2 | 生前整理 進め方／やり方／やることリスト（110+50） | seizenseiri-susumekata | seizenseiri-yarikata | yarikata(21KB)の実践パートをsusumekataへ移植。P1-042は台帳上もP1クラスタへの誤配置気味（Vol50）。master-guideは「はじめかた3ステップのCVハブ」として役割分離（タイトル住み分けのみ・URL不変） |
| 3 | 遺品整理 費用／相場（4,400） | ihin-seiri-hiyou | ihin-hiyou-soba | タイトルほぼ同一の完全カニバリ。**本文はNEW-054(25KB)をベース**にC6-035の見積もり読み方の章を残して差し替え |
| 4 | 遺品整理 いつから（720） | ihinseiri-itsukara | ihin-seiri-timing | NEW-029の「四十九日・一周忌」「心と手続きの両立」をH2として移植（ロングテール温存） |
| 5 | 遺品整理 自分で（210） | ihin-seiri-jibun-de | ihin-seiri-jibunde | slugハイフン1本違い・内容同等。**マージ最小（協会5メソッド章の確認のみ）＝最安の1件**。NEW-023はUI（article-situations.ts）からリンク済 |
| 6 | デジタル遺品（390+） | digital-ihin | digital-ihin-seiri | **本文はNEW-018(18.5KB)ベース**（暗号資産・SNS・サブスクまで網羅）に差し替え。digital-ihinは主KW完全一致slug・C11-026と相互リンク済。O1-002（海外7社比較）は別意図で共存可 |
| 7 | 不用品回収／業者（49,500/9,900） | fuyohin-kaishu | fuyohin-kaishu-gyosha | 「許可業者の見分け方」「引越し業者活用」をC8-021へ移植。C8-043（相場）は費用特化で残し、C8-021内の費用章は要約＋C8-043へのリンクに縮約 |
| 8 | 親が亡くなったら やること（2,400） | shigo-tetsuzuki-checklist | oya-nakunattara-tetsuzuki-junban | NEW-038の「今日・明日・今週・今月」タイムライン枠をC11-026冒頭セクションに移植。C11-026はpillar＋専用PDF（/guidebook/shigo-tetsuzuki）導線あり |
| 9 | 実家 相続（1,900） | jikka-souzoku-tetsuzuki | akiya-souzoku-4sentakushi | NEW-048の「4選択肢×4軸判断」フレームをC9-046へ移植。**注意: NEW-048は akiya-urenai-taisho／jikka-baikyaku-timing／souzoku-jikka-sumanai／app/akiya/page.tsx からの被リンクが多い**＝張替え必須 |
| 10 | 実家じまい 費用（1,000） | jikka-jimai-hiyou | jikkajimai-hiyou-soba | **本文はNEW-043(27.7KB)ベース**（補助金回収シミュレーション差別化）にP1-025の「誰が払う」章を統合。P1-004/P1-012との相互リンク維持 |

### 第2弾（8月後半・TOP10完了後）

| クエリ群 | 残す | 消す | 備考 |
|---|---|---|---|
| 家じまい（720） | jikka-jimai-guide (P1-004) | iejimai-susumekata (NEW-020) | NEW-020の「売却・解体・贈与・空き家バンク比較」はP3-028とも重複。比較表のみP3-028へ |
| 空き家 固定資産税 6倍（−） | jikka-kotei-shisanzei-taisaku (NEW-028) | akiya-kotei-6bai-kaihi | 「6倍回避」をNEW-028のH2に。/tools/empty-house-tax 導線維持 |
| 写真 整理／アルバム（−） | jikka-shashin-seiri (NEW-021) | shashin-album-seiri (NEW-005) | 「ベストショットアルバム」章を移植 |
| （未公開）海外シリーズ | O1-001/002/003 | overseas-* 3ディレクトリ | アーカイブ移動のみ（301不要）。**X予約投稿の張替え必須（後述）** |
| （未公開）親への切り出し | oya-no-shukatsu (P4-031) | oya-settoku | 「家族会議5ステップ」をP4-031へ移植し、ディレクトリをアーカイブ。公開しない |

---

## 3. 実装方法

### 3.1 リダイレクト方式の結論

- **microCMS記事は「canonicalタグ」では統合しない。** canonical はGoogleへの「ヒント」であり強制力がなく、重複ページのクロール浪費も続く。**301（middleware.ts）＋旧記事の非公開化**が正。
- middleware.ts には既に前例がある（47〜55行目: `/articles/akiya-kaitai-hojokin` → `/akiya/kaitai-hojokin` の301）。これをマップ化して拡張する:

```ts
// middleware.ts — カニバリ統合 301 マップ
const ARTICLE_301: Record<string, string> = {
  "seizenseiri-towa": "seizenseiri-hub",
  "seizenseiri-yarikata": "seizenseiri-susumekata",
  "ihin-hiyou-soba": "ihin-seiri-hiyou",
  "ihin-seiri-timing": "ihinseiri-itsukara",
  "ihin-seiri-jibunde": "ihin-seiri-jibun-de",
  "digital-ihin-seiri": "digital-ihin",
  "fuyohin-kaishu-gyosha": "fuyohin-kaishu",
  "oya-nakunattara-tetsuzuki-junban": "shigo-tetsuzuki-checklist",
  "akiya-souzoku-4sentakushi": "jikka-souzoku-tetsuzuki",
  "jikkajimai-hiyou-soba": "jikka-jimai-hiyou",
};

// middleware() 冒頭に追加
if (pathname.startsWith("/articles/")) {
  const slug = pathname.replace(/^\/articles\//, "").replace(/\/$/, "");
  const to = ARTICLE_301[slug];
  if (to) return NextResponse.redirect(new URL(`/articles/${to}`, request.url), 301);
}
```

- `config.matcher` に `"/articles/:path*"` を追加（既存の個別2エントリは整理可）。`next.config.ts` の `redirects()` でも実装可能だが、記事301の前例・運用箇所を middleware に一本化する。

### 3.2 1件あたりの作業手順（順序厳守）

| 手順 | 内容 | 目安 |
|---|---|---|
| 1. 本文マージ | 残す記事をベースに、消す記事の独自H2・FAQ・比較表を移植。重複H2削除、リード文再調整（2,000〜3,000字+表）。LINE CTA・tel非露出・非弁ルールはqa-lintで再検査（`node scripts/content/qa-lint.mjs`） | 40〜60分 |
| 2. microCMS更新 | 残す記事へPATCH投入（`scripts/content/microcms-publish.mjs`・PATCH権限付与済）。人間レビュー後に公開反映 | 10分＋レビュー20分 |
| 3. 301デプロイ | ARTICLE_301 にエントリ追加 → push（Vercel）。**非公開化より先にデプロイ**（404期間を作らない） | 5分（バッチ可） |
| 4. 旧記事 非公開化 | microCMS管理画面で下書きに戻す（削除はしない＝復元可能性確保）。sitemap（/sitemaps/articles）から自動除外される | 5分 |
| 5. 内部リンク張替え | 後述3.3の対象を一括grep置換 → ビルド確認（`npm run build`） | 15〜30分（バッチ可） |
| 6. 台帳・通知 | keywords.csv: 消した行 status=merged＋notesに統合先。GSCで旧URL検査（301確認）→残すURLをインデックス登録リクエスト（`npm run index:run`） | 10分 |

**1件 ≒ 1.5〜2時間。TOP10合計 ≒ 15〜18時間（301・リンク張替えをバッチ処理すれば12時間程度。Claude Code併用で実働2〜3日）。第2弾＋未公開整理で +4〜5時間。**

### 3.3 内部リンク張替え対象（grep済みの実在参照）

| 場所 | 対象 |
|---|---|
| `app/lib/article-situations.ts` | シチュエーション別記事リスト（ihin-seiri-jibun-de, ihin-hiyou-soba, oya-nakunattara-tetsuzuki-junban 等を参照） |
| `app/akiya/page.tsx` | akiya-souzoku-4sentakushi 等への直リンク |
| microCMS記事本文 | 旧slugへの本文内リンク（APIで全記事body取得→grepするスクリプトを統合初日に作成。301があるので緊急ではないがリンクジュース直結のため実施） |
| `content/pipeline/*/meta.json` の internalLinks | akiya-urenai-taisho／jikka-baikyaku-timing／souzoku-jikka-sumanai 等が akiya-souzoku-4sentakushi, jikka-kotei-shisanzei-taisaku を参照（再投入時に効くため修正） |
| `social/x-queue.json` | **approved済み・未投稿の予約ポスト18本が統合対象slugへリンク**（6/15〜8/28投稿予定: fuyohin-kaishu-gyosha 6/15, ihin-hiyou-soba 6/27, akiya-souzoku-4sentakushi 6/29, oya-nakunattara… 6/30, jikkajimai-hiyou-soba 7/3, ihin-seiri-timing 7/26 ほか）。**統合と同週に必ずURL張替え**（301でも遷移はするが、計測とCTR劣化を避ける） |

### 3.4 スケジュール案（HCS配慮）

- **週次2〜3件ずつ、4週間で TOP10＋第2弾を消化**（一括で10本非公開化しても「公開」と違いHCSリスクは低いが、GSCの反応を見ながら進める）。
- 開始前: 台帳ギャップ解消（NEW/単発記事の行追加）＋ microCMS本文リンク全文grepスクリプト作成。
- 完了判定: GSCで旧URL「ページにリダイレクトがあります」確認・残すURLのインデックス維持・`npm run gsc:report` で記事系表示回数のベースライン記録（統合効果は8〜10月で判定）。

---

## 4. リスク注記

| リスク | 影響 | 緩和策 |
|---|---|---|
| 個別ロングテールの喪失（例: NEW-029「四十九日 遺品整理」、NEW-038「親が亡くなったら 今日やること」、NEW-043「実家じまい 補助金 シミュレーション」） | 小（現状表示ゼロのため実害は理論値） | 消す記事の独自H2を見出しごと残す記事へ移植。FAQはそのまま移す |
| 301前に非公開化してしまい404期間が発生 | 中 | 手順3→4の順序厳守（301デプロイ確認後に非公開化） |
| X予約投稿のリンク先消滅 | 中 | 3.3のとおり18本特定済み。**特に overseas-digital-estate-services（8/21）・swedish-death-cleaning（8/22）・death-doula（8/17）は「一度も公開されていない旧slug」へのapproved投稿**で、O1版が別slugで公開されると永久404になる。O1公開時に必ず張替え |
| 監修クレジットの誤付与（E-E-A-T） | 中 | C9-046（相続=specialist領域）へNEW-048を統合する際、統合後本文に村上様クレジットが付かないことを確認（`docs/SUPERVISOR_PLACEMENT_AND_PROFILE.md`）。レーンA 8月のE-E-A-T監査と同時実施 |
| microCMS記事の削除による復元不能 | 小 | 削除せず「下書きに戻す」運用。3ヶ月後に問題なければ削除検討 |
| canonicalタグで済ませたくなる誘惑 | 中 | canonicalは強制力なし。本計画では「301＋非公開化」のみを正とする（3.1） |
| 統合中の一時的順位変動 | 小 | もともと表示ゼロのため下げ代がない。8月末KPI「クリック/日≥0.2」（EXIT_ROADMAP）への影響は軽微 |

---

## 5. やらないこと（統合不要と判断）

| 対象 | 理由 |
|---|---|
| `/articles/master-guide` のURL変更・統合 | **記事系で唯一表示が付いているURL**（表示8）。旧 /guide からの301も集約済み。進め方記事（#2）とのタイトル住み分け（「はじめかた3ステップ・CVハブ」）のみ実施 |
| C5系（shukatsu-towa／shukatsu-itsukara、ending-note-towa／ending-note-muryou） | 台帳設計時点で What/When・とは/無料DL の役割分担と相互リンクが済んでいる。Qグループはタイトルから「書き方・遺言書との違い」の重複表現を片方から外すリライトのみ |
| 業者選び4本（遺品整理業者／実家片付け業者／不用品回収業者／遺品買取業者） | CV先（ihin_soukyaku／fuyohin_soukyaku／kaitori_soukyaku）が異なる送客記事。統合するとCV導線が混線する。ハブ側に「あなたに必要な業者はどれか」分岐セクションを置いて回遊で解決 |
| P3系5本（akiya-katsuyou／tokutei-akiya／akiya-kaitai-hiyou／akiya-kaitai-hojokin（301済）／fudosan-satei／akiya-shobun）＋単発4本（akiya-urenai／furuie-tsuki／jikka-baikyaku-timing／souzoku-jikka-sumanai） | 活用/維持/解体/補助金/査定/処分/売れない/タイミングと意図分離が明確で、高単価CV（不動産査定A8）の入口を減らす理由がない。NEW-020・NEW-048の統合でTグループの重複は解消する |
| O1海外シリーズ8本 | 被リンク獲得用の独自リサーチ資産。国内KWと食い合わない（旧版 overseas-* のアーカイブのみ実施） |
| C7品目別（仏壇/骨董/着物/ぬいぐるみ/古着/お焚き上げ） | 品目=クエリが物理的に別 |
| P4感情系（oya-no-kaigo／kyodai-fukohei／katazuke-dekinai-oya／oya-mono-suterenai）・NEW介護系（保険申請/費用/施設/離職） | ペルソナ・ステージ別で意図が独立 |
| NEW-004／NEW-017（親の認知症2本） | ステージ違い（疑い段階の準備 vs 発症後の整理実務）。統合せず、タイトル先頭の差別化（「〜かもしれないと感じたら」vs「〜になったら 物の整理」）と相互リンク強化で対応。GSCで両方に表示が付き食い合いが観測されたら再判断 |
| C11-016／NEW-056（口座凍結2本） | 死後の凍結解除 vs 生前の認知症対策で検索意図・読者が別。相互リンクのみ |
| C8-043（不用品回収の相場） | 費用特化として残す。代わりにC8-021側の費用章を要約化（#7参照） |
| pSEO（/area/...）と記事の関係整理 | 本計画のスコープ外（レーンA 7月の県ハブ統合で対応済み） |

---

### 期待効果（仮説）

- 公開記事 108本 → **94本**（▲14本）＋未公開ドラフト4件の事故芽を除去。
- 「生前整理」「遺品整理 費用」「親が亡くなったら」など サイトの看板クエリ13群で、分散していた内部リンク・品質シグナルが1URLに集約される。
- DD（M&A デューデリジェンス）観点: 「カニバリゼーション管理が台帳で運用されている」こと自体が資産価値の説明材料になる（keywords.csv の merged 遷移ログ＝管理の証跡）。
