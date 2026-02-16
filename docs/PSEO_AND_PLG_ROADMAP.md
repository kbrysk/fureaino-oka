# pSEO × PLG × リードスコアリング ロードマップ

買い手企業（不動産・買取業者）が欲しがるキーワードでの垂直展開と、ノンペイドで広がるループ・M&A評価の根拠となるリードスコアの自動蓄積を設計する。

---

## 1. 大量生成（pSEO）の垂直展開

### 現状
- **地域 × 粗大ゴミ**: `/area/[都道府県]/[市区町村]` で粗大ゴミ・遺品整理を掲載。

### 追加軸

#### A. 地域 × 空き家特例・補助金
- **狙い**: 不動産売却・解体を検討する層が必ず検索する「節税・助成金」を網羅。
- **キーワード例**: [市区町村名] 空き家 解体 補助金、[市区町村名] 相続空き家の3000万円控除 相談
- **URL**: `/area/[都道府県]/[市区町村]/subsidy`
- **PLG導線**: 「あなたの実家が補助金の対象か、モグ隊長が30秒で判定！」→ 診断ツールへ

#### B. 地域 × 遺品整理・片付け相場
- **狙い**: 不用品回収のCPA（送客手数料）を最大化。
- **キーワード例**: [市区町村名] 遺品整理 相場 1K〜4LDK、[市区町村名] 実家 片付け 業者 おすすめ
- **URL**: `/area/[都道府県]/[市区町村]/cleanup`
- **PLG導線**: 「〇〇区の平均より高い？安い？実家の荷物量で片付け費用をシミュレーション」

### データ
- `content/area-data/areas.csv` に optional 列を追加: 補助金備考、片付け相場備考。
- または同一 area マスタを参照し、サブページでテンプレ文言＋地域名を差し込む。

---

## 2. PLG「勝手に広がる」ループ

### A. 実家じまい力診断の深化
- **現状**: 診断結果＋親向けLINEシェア。
- **追加**: 診断完了後、「親御さんにそのまま送れる『実家の未来についてのお手紙』を生成しました」と提示。
- **仕様**: 結果（ランク・タイトル・メッセージ）から「お手紙」テキストを生成し、コピー／LINEで送れるブロックを表示。
- **ループ**: 子供 → 親に送る → 親がアプリ登録 → 親が資産を写真登録 → 親が別の家族を招待。

### B. お宝埋蔵金マップ（資産可視化）
- **トリガー**: 資産を3件以上登録した時点で「実家の推定資産マップ」を表示。
- **内容**: 推定資産総額の可視化＋「うちの実家、実は価値があった！」系のメッセージ。LINE／SNS共有ボタン。
- **ループ**: 共有 → 他ユーザーが「自分も試す」→ 登録・資産登録 → さらに共有。
- **M&A**: 写真・資産データが蓄積されたリスト＝買い手にとってホットリスト。

---

## 3. リード・スコアリングの自動化（1年後の評価根拠）

### ランク定義
| ランク | 条件 | M&Aでの訴求 |
|--------|------|--------------|
| **S** | 空き家シミュで「10年損失100万円以上」と判定され、かつ査定ボタンをクリック | 成約可能性が極めて高いリード |
| **A** | 資産登録で「着物・骨董」カテゴリの写真を3枚以上アップロード | 高単価買取のホットリード |
| **B** | 地域ページの「粗大ゴミURL」をクリック | 片付け・遺品整理のニーズあり |

### 実装方針
- **イベント送信**: クライアントから `POST /api/lead/event` で `event_type` と任意の `payload` を送る。
- **匿名対応**: 未ログインは `anonymous_id`（localStorage）で紐付け。メール登録時に同一化可能。
- **保存**: Supabase に `lead_events` テーブル（下記SQL）。既存 `leads` と email または anonymous_id で紐付け。
- **スコア算出**: 管理画面またはバッチで、イベント履歴から S/A/B タグを付与。「pSEOから毎月Sランク○件」をダッシュボード表示。

### Supabase: lead_events テーブル

```sql
create table if not exists lead_events (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text,
  email text,
  event_type text not null,
  source text,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_lead_events_anonymous_id on lead_events(anonymous_id);
create index if not exists idx_lead_events_email on lead_events(email);
create index if not exists idx_lead_events_event_type on lead_events(event_type);
create index if not exists idx_lead_events_created_at on lead_events(created_at desc);
```

### イベント一覧
- `empty_house_sim_10y_loss_100_plus`: 10年損失100万以上で表示
- `appraisal_button_click`: 査定ボタンクリック（Sは上記とセット）
- `asset_photo_upload_kimono_antique_3`: 着物・骨董系で写真3件以上（A）
- `area_bulky_waste_url_click`: 粗大ゴミURLクリック（B）

---

## ファイル・役割

| 対象 | ファイル／場所 |
|------|----------------|
| 地域データ | `content/area-data/areas.csv`（補助金・相場の備考列） |
| 地域×補助金 | `app/area/[prefecture]/[city]/subsidy/page.tsx` |
| 地域×相場 | `app/area/[prefecture]/[city]/cleanup/page.tsx` |
| 診断お手紙 | `app/tools/jikka-diagnosis/page.tsx` 内ブロック＋ `app/lib/jikka-diagnosis.ts` の letter 生成 |
| 資産マップ | `app/components/TreasureAssetMap.tsx`、`app/assets/page.tsx` で3件以上で表示 |
| リードイベント | `app/api/lead/event/route.ts`、`app/lib/lead-score.ts`（クライアント用送信ヘルパー） |

---

## 実装順序
1. 設計・データ: 本ドキュメント＋area 拡張＋subsidy/cleanup ページ
2. PLG: 診断お手紙、資産マップ（3件でアンロック＋共有）
3. リード: イベントAPI＋フロントでの発火＋スコア算出（管理画面は別フェーズ）
