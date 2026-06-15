# 統合パイロット#5 実行記録（ほぼ完了・残り2手順はあなた）

> 対象: TOP10統合プラン#5「遺品整理 自分で」— slugハイフン1本違いの完全カニバリ解消
> 残すURL: `ihin-seiri-jibun-de`（NEW-023） / 消すURL: `ihin-seiri-jibunde`（NEW-003）

## ✅ 完了済み（Claude実行・本番反映済み）
1. ✅ NEW-003の「相続放棄を検討している場合は専門家確認を」（YMYL重要章・民法921条）をNEW-023へマージ → qa-lint PASS（pillar:true）
2. ✅ **middleware.tsに301マップ実装**（`ihin-seiri-jibunde` → `ihin-seiri-jibun-de`）→ 本番デプロイ済み・**404期間ゼロを確保**
3. ✅ matcherを`/articles/:path*`に拡張（TOP10展開の基盤・将来はマップ1行追加で統合可能に）
4. ✅ 検証: 旧slug→301→canonical / 残すslug200 / 前例akiya301維持 / 無関係記事影響なし
5. ✅ keywords.csv: NEW-003を`merged`に更新

→ **この時点で「旧URLにアクセスした人・Googleは正しい記事へ301で誘導される」状態。SEO評価の集約は開始済み。**

## 🙋 残り2手順（あなたの操作・microCMS管理画面）

### 手順A: 残す記事の本文を「統合版」に差し替え【推奨・5分】
統合で追加した**相続放棄の法的注意（YMYL上重要）**を、公開中の `ihin-seiri-jibun-de` に反映する。
- 反映元: `content/pipeline/NEW-023-ihin-jibun-de/draft.html`（リポジトリにコミット済み・QA PASS）
- 方法: microCMS管理画面で `ihin-seiri-jibun-de` を開く → 本文を上記draft.htmlの内容に差し替え → 更新
- ※公開中YMYL記事の本文更新のため、自動化ゲートが正しく停止した箇所。あなたの手 or 「本文反映GO」で私がPATCH実行（承認扱い）

### 手順B: 旧記事を非公開化【1クリック】
- microCMS管理画面で `ihin-seiri-jibunde`（NEW-003）を**下書きに戻す**
- 301が先に本番稼働しているので、非公開化しても**404にならない**（middlewareがCMSより先に処理）
- これで重複インデックスが解消し、Googleが残すURLに評価を集約

## TOP10の残り9件
本パイロットで手順が実証できたので、残り9件は「①本文マージ→②マップに1行追加→③旧記事非公開化」の繰り返し。
別セッションでまとめて実行（見積もり12〜18時間）。マップは `middleware.ts` の `ARTICLE_CONSOLIDATION_301` に追記するだけ。
