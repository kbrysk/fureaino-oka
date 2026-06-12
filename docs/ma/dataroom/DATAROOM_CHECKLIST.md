# データルーム整備チェックリスト

> 目的: 買い手のDD要求に「即日開示」できる状態を作る（開示速度＝信頼＝価格防御）。
> 運用: NDA締結後にGoogle Drive共有フォルダで開示。本チェックリストでステータス管理。

| # | 資料 | 状態 | 場所/ToDo |
|---|---|---|---|
| 1 | DB仕様書・更新運用手順書 | ✅完 | docs/ma/dataroom/DB_SPEC_AND_OPERATIONS.md |
| 2 | 引継ぎ30日プラン | ✅完 | docs/ma/dataroom/HANDOVER_PLAN_30D.md |
| 3 | IM（企業概要書） | ✅v1 | docs/ma/IM_V1_DRAFT.md（毎月数値更新） |
| 4 | DB統計サマリー＋サンプル | ✅完 | docs/b2b/assets/（db-stats.json・sample.csv） |
| 5 | GSC生データ（12ヶ月） | ⚠️要更新 | logs/gsc/は3-5月分のみ。**GSC再認証→`npm run gsc:report --days 365`で完全化**（ユーザー操作待ち） |
| 6 | A8成果レポート | ⏳ | A8管理画面からCSVエクスポート（ユーザー操作・5分） |
| 7 | クリーンなトラフィック定義書 | ✅完 | docs/analytics/OVERSEAS_TRAFFIC_INVESTIGATION_2026-06.md（GA4ボット問題の誠実開示） |
| 8 | HCS対応の実施記録 | ✅完 | docs/analytics/PAGE_INVENTORY_DIAGNOSTIC_2026-06.md＋docs/strategy/HCS_TURNAROUND_AND_BASELINE_2026-06.md＋gitコミット履歴 |
| 9 | 監修契約書 | ⏳ | 村上様との契約書（締結済みのものをPDF化して格納） |
| 10 | コンテンツ権利確認書 | ⏳ | 「全記事自社制作・外部ライター不使用・画像はAI生成/自社」の1枚宣誓書を作成 |
| 11 | B2B営業ログ・商談記録 | ✅雛形 | docs/b2b/B2B_SALES_LOG.csv（営業開始後に蓄積） |
| 12 | 法務遵守記録 | ⏳8月 | 非弁・PII・景表法の運用ルール遵守の自己点検書（qa-lint運用実績で代替可） |
| 13 | 環境変数・アカウント一覧 | ⏳クローズ時 | 暗号化別紙（データルームには「一覧の存在」のみ記載） |
| 14 | ドメイン・商標の権利確認 | ⏳ | whois・レジストラ管理画面のスクリーンショット |

## 残タスクの優先順位
1. **#5 GSC 12ヶ月データ**（ユーザーのgcloud再認証が前提・最重要）
2. **#10 権利確認書**（30分で作成可能・次スプリントで起草）
3. **#6 A8レポート**（ユーザー5分）
4. #9・#14（ユーザーの書類整理）
