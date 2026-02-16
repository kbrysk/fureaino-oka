# ドメイン fureaino-oka.com でサイトを公開する手順

ドメイン取得済み（ネームサーバー: ラッコサーバー `ns1.default.rakko.zone`）を前提に、**ふれあいの丘**（Next.js）を公開するまでの進め方です。

---

## 全体の流れ（3ステップ）

1. **サイトをホスティングする**（Vercel または ラッコサーバーなど）
2. **ドメインをホスティング先に向ける**（ネームサーバー or DNSレコード）
3. **本番用の環境変数を設定する**（`NEXT_PUBLIC_SITE_URL`）

---

## パターンA：Vercel で公開する（Next.js と相性が良い）

### 1. Vercel にデプロイ

1. [Vercel](https://vercel.com) にログイン（GitHub 連携がおすすめ）
2. 「Add New」→「Project」で、このリポジトリ（GitHub に push 済み想定）をインポート
3. Framework は **Next.js** のまま、**Deploy** を実行
4. 完了後、`https://〇〇.vercel.app` のような URL でサイトが開くことを確認

### 2. カスタムドメインを追加

1. Vercel のプロジェクト → **Settings** → **Domains**
2. **Add** に `fureaino-oka.com` を入力して追加
3. **www あり** も使う場合は `www.fureaino-oka.com` も追加し、どちらをメインにするか選択（通常は `fureaino-oka.com` をメイン推奨）

### 3. ドメインの向き先を設定（ラッコサーバー側）

Vercel にドメインを向ける方法は **2通り** です。

#### 方法1：ネームサーバーを Vercel に変更（シンプル）

1. ラッコサーバーのドメイン管理画面で、**ネームサーバー** を変更
2. Vercel の Domains 画面に表示される **ネームサーバー**（例: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`）を登録
3. 反映に数時間〜最大48時間かかることがあります

#### 方法2：ネームサーバーはラッコのまま、DNSレコードだけ設定

1. ラッコサーバー側の **DNS設定**（レコード編集）を開く
2. Vercel の Domains 画面に「レコードをここに設定してください」と出ているので、そのとおりに設定  
   - 例: `A` レコード `76.76.21.21`（Vercel の IP）  
   - または `CNAME` で `cname.vercel-dns.com` など
3. `www` 用に `CNAME` を設定する場合も、Vercel の案内に従う

### 4. 環境変数を設定（重要）

1. Vercel プロジェクト → **Settings** → **Environment Variables**
2. 以下を追加（本番用）  
   - **Name**: `NEXT_PUBLIC_SITE_URL`  
   - **Value**: `https://fureaino-oka.com`  
   - **Environment**: Production（必要なら Preview も）
3. **Save** 後、**Redeploy** を実行（「Deployments」→ 最新のデプロイ → メニューから Redeploy）

これで sitemap.xml・robots.txt・OG などが `https://fureaino-oka.com` で正しく出ます。

### 5. 確認

- `https://fureaino-oka.com` でサイトが開くこと
- ブラウザのアドレスバーが鍵マーク（HTTPS）になっていること（Vercel が自動で SSL 発行）

---

## パターンB：ラッコサーバーでホスティングする

ラッコサーバーの「サーバー」や「サイトマーケット」でサイトを置く場合は、手順がサービスごとに異なります。

1. ラッコサーバーのマニュアルで **「ドメインの紐付け」** または **「独自ドメイン設定」** を確認
2. この Next.js を **静的エクスポート** してアップロードするか、**Node サーバー** が使えるプランならビルドしたものを配置
3. 紐付け用に **DNS レコード**（A または CNAME）を、ラッコの案内どおり設定
4. サーバー側で環境変数や設定画面がある場合は、**本番URL** を `https://fureaino-oka.com` に設定

※ 静的エクスポートする場合は `next.config.ts` に `output: 'export'` を追加し、`npm run build` で `out` フォルダを生成してから、その中身をアップロードする形になります。

---

## 本番で必ず設定する環境変数（共通）

| 変数名 | 値 | 用途 |
|--------|-----|------|
| `NEXT_PUBLIC_SITE_URL` | `https://fureaino-oka.com` | sitemap・robots・OG・canonical・JSON-LD の絶対URL |

末尾のスラッシュは付けません。Vercel では上記のとおり **Environment Variables** で設定してください。

---

## チェックリスト（公開前）

- [ ] ホスティング先（Vercel など）にデプロイできている
- [ ] ドメイン `fureaino-oka.com` をホスティング先に追加し、ネームサーバー or DNS を設定した
- [ ] `NEXT_PUBLIC_SITE_URL=https://fureaino-oka.com` を本番環境に設定し、再デプロイした
- [ ] `https://fureaino-oka.com` でサイトが開く
- [ ] `https://fureaino-oka.com/sitemap.xml` が開き、URL が `https://fureaino-oka.com` 始まりになっている

---

## 困ったとき

- **ドメインがつながらない**  
  - ネームサーバー／DNS の変更後、最大 24〜48 時間かかることがあります。  
  - [DNS の伝播確認](https://dnschecker.org) で `fureaino-oka.com` を検索すると、どの地域まで反映しているか確認できます。
- **HTTPS にならない**  
  - Vercel は自動で SSL を発行するため、ドメインが正しく向いていれば数分〜数十分で HTTPS になります。  
  - ラッコサーバーの場合は、サービス側の「SSL」設定をマニュアルで確認してください。

このリポジトリは Next.js のため、**まずは Vercel でデプロイ → ラッコで取得したドメインを Vercel に向ける**流れが最も手早く公開できます。
