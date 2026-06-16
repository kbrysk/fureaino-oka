# 🎯 1,000万円EXIT マスター・アクションダッシュボード

> 2026-06-17更新（4専門家パネルの結論を反映）。
> **本セッション最大の発見：「武器庫は満杯だが引き金が一度も引かれていない」。律速は制作でなく"送信/配線"。**
> → 最上位KPIを「GSCクリック」から **「今週、買い手/B2Bへ実際に送信した通数」** に変更。詳細: [EXIT_4EXPERT_SYNTHESIS_2026-06.md](EXIT_4EXPERT_SYNTHESIS_2026-06.md)

---

## 🔴 今すぐ（今週・あなたにしかできない・"作る"でなく"送る/配線する"）

| 優先 | アクション | 所要 | 効果 | 参照 |
|---|---|---|---|---|
| **0** | **リード保存パイプライン復旧**（Supabase+Vercel env） | 30分 | 🚨 現状PDF DL/メール登録が**全件破棄**されている致命バグ。これを直すまで全リード施策が無効 | [LEAD_PIPELINE_SETUP.md](../ops/LEAD_PIPELINE_SETUP.md) |
| 1 | **バリュークリエーションへ第一信送信** | 5分 | E1戦略売却の号砲。年内1000万の本体 | [FIRST_CONTACT_DRAFTS.md](../ma/FIRST_CONTACT_DRAFTS.md) ① |
| 2 | **B2B優先度A 10社へ営業メール送信開始**（週5社） | 継続 | E2の主軸。9月末までに契約1件死守（月3万でも可） | [B2B_PROSPECT_LIST_50.md](../b2b/B2B_PROSPECT_LIST_50.md) |
| 3 | **GA4ボット除外フィルタ設定** | 30分 | DD不意打ち（Direct43%・ボット19%）の解消＝破談リスク低減 | [OVERSEAS_TRAFFIC_INVESTIGATION_2026-06.md](../analytics/OVERSEAS_TRAFFIC_INVESTIGATION_2026-06.md) |
| 4 | **A8「解体の窓口」「イエウール」提携申請** | 10分 | 解体の窓口は買い手接触の布石も兼ねる | [A8_PROGRAM_EXPANSION_PLAN.md](../A8_PROGRAM_EXPANSION_PLAN.md) §7 |
| 5 | **タウンライフ アフィリ審査申請** | 5分 | 査定単価5,000→最大30,558円 | [TOWNLIFE_APPLICATION_PREP.md](../affiliate/TOWNLIFE_APPLICATION_PREP.md) |
| — | X承認済み378投稿の塩漬け解除（着地=読まれている5記事＋PDF登録） | — | 非検索アセットの実数化（下振れ防止の脇役） | — |

> **格下げ（"送信を1通も遅らせない範囲でのみ"）**: GSC再認証（2分のついで作業）／microCMS下書き13記事の公開（HCS逆行回避で小出し・送信完了後の二番手）。

### 二番手タスクのコマンド（PowerShell・1行）
```
gcloud auth application-default login --scopes="openid,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/webmasters.readonly"
```

---

## 🟡 今月（6〜7月・週次運用に乗せる）

| アクション | リズム | 参照 |
|---|---|---|
| B2B営業（優先度A 10社→週5社送信） | 火曜2h | [B2B_PROSPECT_LIST_50.md](../b2b/B2B_PROSPECT_LIST_50.md) ＋ [B2B_SALES_EMAIL_TEMPLATES.md](../b2b/B2B_SALES_EMAIL_TEMPLATES.md)。送信は [B2B_SALES_LOG.csv](../b2b/B2B_SALES_LOG.csv) に記録 |
| 被リンクアウトリーチ（残95件消化） | 木曜1.5h | content/pipeline/outreach.csv（draft59・form_todo30・draft_gmail6） |
| 週次スコアカード記録 | 金曜15分 | `node scripts/scorecard.mjs` → [WEEKLY_SCORECARD.md](WEEKLY_SCORECARD.md) |
| GA4ボット除外フィルタ設定 | 1回・30分 | DD用クリーン数字。OVERSEAS_TRAFFIC_INVESTIGATION参照 |
| A8成果レポートCSVエクスポート | 1回・5分 | データルーム#6 |
| クラッソーネへ第一信（①の実績/温度感を見て7月） | 5分 | [FIRST_CONTACT_DRAFTS.md](../ma/FIRST_CONTACT_DRAFTS.md) ② |

---

## 🟢 構築済み資産の索引（参照用・実行済み）

### 戦略
- **[EXIT_STRATEGY_10M_2026.md](EXIT_STRATEGY_10M_2026.md)** — 検証済み統合戦略（長期/中期/短期/週次・KPIゲート・成功確率30-45%）
- [CONTENT_CONSOLIDATION_PLAN.md](CONTENT_CONSOLIDATION_PLAN.md) — カニバリ統合TOP10
- docs/analytics/ — ページ棚卸し診断・海外トラフィック調査（DD資料）

### M&A（売却プロセス）
- **[IM_V1_DRAFT.md](../ma/IM_V1_DRAFT.md)** — 企業概要書（毎月数値更新）
- [BUYER_RESEARCH_TOP2.md](../ma/BUYER_RESEARCH_TOP2.md) — 買い手2社深掘り＋断り文句切り返し
- [FIRST_CONTACT_DRAFTS.md](../ma/FIRST_CONTACT_DRAFTS.md) — 第一信2社分
- **dataroom/** — DB仕様書・引継ぎ30日プラン・DDチェックリスト・権利確認書

### B2Bデータライセンス（収益エンジンE2）
- [B2B_DATA_LICENSE_ONEPAGER.md](../b2b/B2B_DATA_LICENSE_ONEPAGER.md) — 営業ワンページャー
- [B2B_SALES_EMAIL_TEMPLATES.md](../b2b/B2B_SALES_EMAIL_TEMPLATES.md) — 営業メールA/B
- [B2B_PROSPECT_LIST_50.md](../b2b/B2B_PROSPECT_LIST_50.md) — 見込み客31社
- `node scripts/b2b/export-subsidy-db.mjs` — DB商品化（sample.csv/xlsx・db-stats.json生成済み）

### 本番反映済み（コード）
- HCS清算第2弾: 県別cleanupハブ47枚・補助金薄ページnoindex・tel全廃
- 勝ちクラスタ内部リンク: tax-simulator（平均17位）への文脈リンク最大3,452本
- Indexing API: 県ハブ47/47送信完了

---

## 📊 KPIゲート（このダッシュボードで毎月確認）

| 時点 | 達成基準 | 未達なら |
|---|---|---|
| 7月末 | タウンライフ承認・B2B資料完成✅・GA4クリーン化・GSCクリック週3+ | 8月W1で完遂 |
| 8月末 | B2B商談3件 or アフィリCV月2件・IM完成 | ターゲット業種変更 |
| 9月末 | B2B契約1件 or 買い手面談2件 | 価格800万に調整 |
| 10月末 | **発射判断**: 面談3件＋(契約or月利5万) | 年内断念→2027H1スライド |
| 12月末 | クローズ or 計画的スライド | 投げ売り禁止 |

---

## ひとことで言うと

**「戦略・武器・リストは全部揃った。あとは①送る ②申請する ③公開する だけ。」**
最初の一歩は表の🔴#1（バリュークリエーションへの第一信・5分）。これがEXITの号砲です。
