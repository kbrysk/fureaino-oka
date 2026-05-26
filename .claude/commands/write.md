---
description: 指定KWのブリーフから執筆→編集→QAまで実行し、合格なら人間承認待ちにする
---
対象: $ARGUMENTS（kw_id）

手順:
1. article-writer サブエージェントで content/pipeline/<kw_id>/draft.html を執筆。
2. article-editor サブエージェントで推敲。
3. qa-reviewer サブエージェントで `node scripts/content/qa-lint.mjs <draft.html> --meta <meta.json>` ＋LLM検閲を実行し qa-report.json を作成。
4. QAがFAILなら、指摘を踏まえて該当段（writer/editor）へ最大2回まで差し戻して再生成。
5. PASSしたら台帳の status を human_review に更新。
6. QA結果と「承認待ち」である旨を報告。**公開（microCMS投入）はしない。**
