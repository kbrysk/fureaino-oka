# 本番サイトに運営者情報を反映する手順

## 状況
- ローカルには「運営者情報」ブロックが正しく実装されています（`/about` の最下部）。
- ローカルが **origin/main より 3 コミット進んだまま** で、これらが GitHub にプッシュされていません。
- 本番（Vercel 等）は **GitHub の main をビルド** するため、古い状態のままです。

## やること（1つだけ）

**お使いの PC のターミナル（PowerShell や CMD）で、以下を実行してください。**

```powershell
cd "c:\Users\Ryosuke\Desktop\seizenseiri"
git push origin main
```

- GitHub にログイン済みの環境で実行すると、3 コミットが `kbrysk/fureaino-oka` の `main` に送られます。
- Vercel 連携していれば、プッシュ後に自動で本番が再デプロイされ、数分で「運営者情報」が表示されます。

## プッシュできない場合

- **認証エラー**（`SEC_E_NO_CREDENTIALS` 等）が出る場合  
  - GitHub Desktop を使っている場合は、そこから「Push origin」を実行。  
  - または [GitHub CLI](https://cli.github.com/) で `gh auth login` を実行してから、再度 `git push origin main`。
- **ブランチが違う**  
  - `git branch` で現在のブランチを確認し、本番でビルドしているブランチ（多くの場合 `main`）にプッシュする。

## 確認方法

1. GitHub のリポジトリ `kbrysk/fureaino-oka` を開く。
2. 最新コミットに「about: 運営者の思いを先に…」「feat: add custom 404 page」などが含まれているか確認。
3. Vercel のダッシュボードで、そのコミットから「Production」がデプロイされたか確認。
4. 本番の `/about` を開き、ページ最下部に「運営会社」（会社名・住所・お問い合わせ）が表示されるか確認。

---

このファイルは手順用です。反映後は削除して構いません。
