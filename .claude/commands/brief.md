---
description: 指定KW(kw_id)のSERP調査→構成→独自視点注入までを行いブリーフを作る
---
対象: $ARGUMENTS（台帳 content/pipeline/keywords.csv の kw_id）

手順:
1. serp-outliner サブエージェントで、上位SERPを調査し content/pipeline/<kw_id>/brief.md と sources.json を作成（差別化スロットは空ける）。
2. expert-angle サブエージェントで、独自切り口（生前整理アドバイザー実務観点・村上様Experienceコーパス・自社データ導線）を brief.md に注入。supervisor 区分を確認。
3. 台帳の status を outlined に更新。
4. ブリーフの要点（タイトル案・構成・独自切り口・想定文字数・supervisor）を報告。
