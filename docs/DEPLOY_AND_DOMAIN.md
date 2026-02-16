# 生前整理ナビ：ドメイン取得・デプロイ手順

本番公開までの**最短ルート**。運用コストを抑えつつ、アクセス急増に耐える構成（Vercel + 外部DB）。

---

## 1. 全体フロー（概要）

```
[開発] ローカル → Git push
    ↓
[Vercel] GitHub 連携で自動デプロイ（プレビュー + 本番）
    ↓
[ドメイン] お名前.com 等で取得 → DNS を Vercel 向けに設定
    ↓
[本番] https://seizenseiri-navi.com 等で公開
```

- **ホスティング**: Vercel（無料枠で十分スタート可能、スケール時は Pro）
- **DB**: Vercel Postgres / Supabase / Airtable のいずれか（リード保存用）
- **ドメイン**: 取得のみ。DNS は Vercel に任せる（ネームサーバー変更 or CNAME）。

---

## 2. ドメイン取得（お名前.com の場合）

1. **お名前.com** にログイン → 「ドメイン取得」で希望のドメインを検索（例: `seizenseiri-navi.com`）。  
2. 取得手続き（1年〜複数年）。  
3. 管理画面で「DNS設定」または「ネームサーバー」を開く。  
4. **Vercel 用に以下のいずれかで設定**（Vercel 側でドメイン追加後に表示される値を使用）:
   - **推奨**: ネームサーバーを Vercel のものに変更  
     - Vercel でドメイン追加後、案内される `ns1.vercel-dns.com`, `ns2.vercel-dns.com` を設定。  
   - **サブドメインのみ使う場合**: `www` や `app` 用に CNAME を `cname.vercel-dns.com` に設定。  
5. 反映まで数分〜48時間。`dig` や Vercel の「検証」で確認。

**Xserver で取得した場合**: 同じく「DNS設定」でネームサーバーを Vercel 向けに変更するか、CNAME で `cname.vercel-dns.com` を指定。

---

## 3. Vercel へのデプロイ

### 3.1 前提

- プロジェクトを **GitHub** に push 済みであること。  
- `package.json` の `build` が `next build` であること。

### 3.2 手順

1. [Vercel](https://vercel.com) にログイン（GitHub 連携推奨）。  
2. 「Add New」→「Project」→ 対象リポジトリをインポート。  
3. **Framework Preset**: Next.js が自動検出。**Root Directory** がプロジェクトルートか確認。  
4. **Environment Variables**: 本番用に必要なものだけ設定（例: `DATABASE_URL`, `AIRTABLE_TOKEN` 等）。  
5. 「Deploy」→ ビルドが走り、`.vercel.app` の URL で公開される。  
6. **カスタムドメイン**: Project → Settings → Domains → 「Add」で取得したドメインを入力。  
   - お名前.com 側でネームサーバーを Vercel に変更済みなら、Vercel が自動検証。  
   - 問題なければ「Verified」になり、本番トラフィックはそのドメインで流れる。

### 3.3 本番ビルドの注意

- `next build` が通ること（`npm run build` をローカルで確認）。  
- 記事が SSG の場合、`generateStaticParams` で slug 一覧を返し、必要な記事だけビルド時生成するか、ISR で初回アクセス時に生成するか選ぶ。  
- 環境変数は「Production」にだけ入れ、プレビューは必要に応じて別設定。

---

## 4. 運用コスト・スケール

| 項目 | 目安 | 備考 |
|------|------|------|
| Vercel | 無料〜Pro $20/月 | 無料枠で月 100GB 帯域など。超過やチーム利用で Pro。 |
| ドメイン | 約 1,000〜1,500円/年 | .com 等。 |
| DB（例: Vercel Postgres / Supabase） | 無料枠〜有料 | リード数が増えたら有料プランへ。 |
| メール送信（申込通知等） | Resend / SendGrid 等 | 無料枠あり。 |

**アクセス急増時**: Vercel は Edge/Serverless でオートスケールするため、急増には基本的に耐えられる。DB の接続数・読み書きがボトルネックになったら、接続プールや読み取りレプリカを検討。

---

## 5. チェックリスト（公開前）

- [ ] `npm run build` が成功する  
- [ ] 環境変数（DB、API キー等）を本番のみ設定している  
- [ ] ドメインの DNS が Vercel 向けになっている  
- [ ] Vercel の「Domains」でドメインが Verified になっている  
- [ ] 記事・ツールのメタタグ・OGP が意図どおり出ている  
- [ ] `/api/lead` などが正しく動作する（テスト送信）

以上で、**ドメイン取得 → DNS 設定 → Vercel デプロイ → 本番公開**まで一通り完了する。
