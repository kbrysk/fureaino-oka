---
description: 次のN件のKWを選定し、調査→構成→執筆→QAまで一括実行して人間承認待ちにする（夜間バッチの主役）
---
件数: $ARGUMENTS（例: 3）。指定がなければ3件。

手順:
1. content-director サブエージェントに、台帳 content/pipeline/keywords.csv の status=backlog から、フェーズ×優先度×striking-distance×カニバリ回避で上位N件を選定させる（logs/gsc/ があれば参照）。専門家未確保ドメイン（相続税・不動産・解体・登記）は監修確保まで控える。
2. 各KWについて順に `/brief <kw_id>` 相当（serp-outliner→expert-angle）→ `/write <kw_id>` 相当（writer→editor→qa-reviewer）を実行。QAがFAILなら最大2回まで差し戻し。
3. 合格した記事は status=human_review に更新。
4. 最後に「承認待ち一覧」を表で出力（kw_id / タイトル / supervisor / QA結果 / 想定文字数）。
5. **公開（microCMS投入）はしない。** 公開は人間承認後に /publish で行う。

注意: 一度に大量公開しない方針（Helpful Content対策）。生成は安全なペースで。
