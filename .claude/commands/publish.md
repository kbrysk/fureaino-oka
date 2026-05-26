---
description: 人間承認後にmicroCMSへ投入する（既定は下書き。--liveで公開）
---
対象: $ARGUMENTS（kw_id。末尾に --live を付けると公開、なければ下書き投入）

前提（必ず確認）:
- 台帳の status が human_review で、**あなた（運営者）が内容を承認済み**であること。
- supervisor=murakami の記事は、村上様の最終確認が記録されていること（未確認なら --live しない）。
- qa-report.json が PASS であること（FAILなら投入しない）。

手順:
1. qa-report.json を確認。FAILなら中止。
2. `node scripts/content/microcms-publish.mjs <kw_id> [--live]` を実行（このスクリプトは category/tag slug を getCategories()/getTags() で実IDにマッピングし、既定は status:draft で投入。MICROCMS_WRITE_API_KEY が必要）。
3. 投入結果（article_id）を台帳に記録し、status を published（または下書きなら ready）に更新。
4. 結果（microCMS上のID・下書き/公開の別・記事URL）を報告。

注意: 完全自動公開はしない設計。最終公開フラグは microCMS 上での最終プレビュー後、または --live 明示時のみ。
