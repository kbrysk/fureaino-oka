# 補助金・粗大ごみDB 仕様書 兼 更新運用手順書

> 版: v1.0（2026-06-12）／対象: `app/lib/data/municipalities.json`
> 用途: ①B2Bライセンス顧客への仕様提示 ②M&A DDでの「更新運用つきDB」の実体証明 ③引継ぎ資料
> IM_V1_DRAFT.md §2資産① の根拠文書。

---

## 1. データ仕様

### 1-1. 収録規模（2026-06-12時点・実測）

| 項目 | 件数 |
|---|---|
| 収録市区町村 | 1,726（47都道府県） |
| 解体・空き家補助金「制度あり」 | 844自治体 |
| うち上限額情報 | 840件 |
| うち自治体公式URL | 627件 |
| 粗大ごみ・処分窓口 公式URL | 1,490自治体 |

統計の再計測: `node scripts/b2b/export-subsidy-db.mjs` → `b2b-exports/db-stats.json`（都道府県別内訳含む）

### 1-2. スキーマ（TypeScript型定義: `app/lib/data/municipalities.ts`）

| フィールド | 型 | 内容 | 例 |
|---|---|---|---|
| prefId / prefName | string | 都道府県ID（ローマ字）／名称 | hokkaido／北海道 |
| cityId / cityName | string | 市区町村ID（ローマ字）／名称 | sapporo／札幌市 |
| subsidy.hasSubsidy | boolean | 解体・空き家補助金の制度有無 | true |
| subsidy.name | string? | 補助金の正式名称 | 札幌市危険空家等除却補助制度 |
| subsidy.maxAmount | string? | 上限額（原文表記を保持） | 最大300万円／工事費の1/3以内 |
| subsidy.conditions | string \| string[]? | 主な交付条件 | 昭和56年以前の旧耐震基準… |
| subsidy.applicationPeriod | string? | 申請期間 | 4月1日〜（予算上限到達まで） |
| subsidy.windowName / windowPhone | string? | 担当窓口（電話はサイト非表示・データのみ保持） | 建築指導課 |
| subsidy.officialUrl | string? | 自治体公式の案内ページURL（出典） | https://www.city.... |
| subsidy.noSubsidyNote | string? | 制度なし自治体の代替情報 | 解体は対象外だがブロック塀撤去補助あり等 |
| garbage.officialUrl | string | 粗大ごみ受付の公式URL | https://www.city.... |
| garbage.phone | string? | 受付電話（サイト非表示・データのみ保持） | — |
| mascot.localRiskText | string | 地域特性の編集メモ（サイト表示用・ライセンス対象外） | — |

### 1-3. 納品形式（B2B）
- **CSV**: `scripts/b2b/export-subsidy-db.mjs --full` → BOM付きUTF-8・Excel互換（14列フラット）
- **JSON**: 同コマンドで API形ネスト構造（meta.generatedAt＋data[]）を同時出力
- サンプル: `docs/b2b/assets/sample.csv`（広島・愛知77行）

---

## 2. 月次更新の運用手順（所要: 月3〜6時間）

### 2-0. 更新の考え方
- 補助金は**年度単位**で改定される（4〜5月に新年度制度が出揃う）。月次巡回は「差分の検知」が目的で、4〜5月のみ全面改定モードになる。
- 優先順位: ①B2B契約顧客の対象エリア → ②「制度あり」844自治体 → ③政令市・中核市 → ④その他

### 2-1. 通常月の手順（差分更新）

1. **対象選定**: 当月の巡回対象を決める（844自治体÷12ヶ月≒月70自治体が目安。`b2b-exports/db-stats.json` の都道府県別リストから機械的にローテーション）
2. **プロンプト生成**: `node scripts/manage-data.mjs prompt "<都道府県名>" "<市区町村名カンマ区切り>"` → `scripts/generated-prompt.md` が生成される
3. **AI調査**: 生成プロンプトをWeb検索つきAI（ChatGPT/Claude/Gemini）に貼り付け→ 自治体公式を検索させ `MunicipalityData` 型のJSON配列を出力させる
4. **検収**: 出力JSONの officialUrl を**最低3件抜き打ちで開いて実在確認**（制度名・金額が公式ページと一致するか）。年度表記が新年度になっているか確認
5. **マージ**: 出力を `scripts/temp.json` に保存 → `node scripts/manage-data.mjs merge scripts/temp.json`（同一pref+cityは上書き・新規は追加）
6. **ビルド確認**: `npm run build` が通ることを確認（型エラー＝データ不備の検知）
7. **コミット**: `chore(data): <県名>の補助金データ更新（YYYY-MM巡回）` でコミット→push（Vercel自動デプロイ）
8. **記録**: 更新ログを本書末尾の更新履歴表に1行追記

### 2-2. 年度切替期（4〜5月）の手順
- 全47都道府県を6週に分けて全面巡回（県別 `scripts/merge-*-municipalities.mjs` の枠組みを再利用可能）
- 「前年度の制度が掲載されたまま」が最大の品質リスク。officialUrl切れ（404）チェックを併用:
  `node scripts/b2b/export-subsidy-db.mjs --full` 後、URLリストにHEADリクエストを投げる簡易スクリプトで一括検査

### 2-3. B2B顧客向け納品サイクル
1. 毎月第1営業日に §2-1 の当月巡回を完了
2. `node scripts/b2b/export-subsidy-db.mjs --full` で納品ファイル生成
3. 顧客ごとの納品方法（メール添付/共有リンク/API）で送付。納品記録をB2B_SALES_LOG.csvに追記

---

## 3. 品質に関する誠実な開示（DD用）

- **鮮度**: 一括整備は2026年上期に実施。月次巡回ローテーションは本書策定（2026-06）から運用開始のため、自治体によっては最終確認から最大12ヶ月の差がある。買い手/顧客には「最終確認日」フィールドの追加実装（軽微・1日作業）を推奨
- **粒度のばらつき**: 公式URL未取得が補助金あり844件中217件存在（officialUrl 627件）。優先補完リストは db-stats.json から機械抽出可能
- **電話番号**: データとしては保持するがサイトには表示しない方針（運営ポリシー）。B2Bライセンスでは提供可

## 4. 更新履歴

| 日付 | 範囲 | 担当 | 備考 |
|---|---|---|---|
| 2026-06-12 | 本書v1.0策定・統計実測 | 大久保 | エクスポートツール整備 |
| （以後、月次巡回ごとに追記） | | | |
