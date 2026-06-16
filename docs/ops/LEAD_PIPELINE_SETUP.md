# 🔴最優先: リード保存パイプライン復旧（30分・あなた作業）

> 4専門家分析がコード検証で発見した致命的バグ。**現状、PDF DL・メール登録のリードは全て破棄されている。**
> 検証: `app/api/lead/route.ts:66-69` — Supabase/Resend のenv未設定時、リードは `console.info` に出力されるだけで消える。`.env.local`・Vercelに該当キーなし。
> **コード変更は不要**（envを設定すれば自動的に永続化に切り替わる設計）。必要なのは①Supabaseテーブル作成 ②Vercel環境変数 だけ。

## なぜ最優先か
- EXIT価値の一部「リード獲得インフラが機能している」がDDで嘘になる（現状0件保存）
- メールリスト・X誘導・記事末尾CTAの全努力が無駄になる前提条件
- 30分・確度高・最大ROI（ただしリスト件数の主役化はしない＝年数百件が現実線・下振れ防止の脇役）

## 手順（30分タイムボックス。超過したら一旦撤退しB2B営業に戻る）

### Step 1: Supabaseでleadsテーブル作成（10分）
1. https://supabase.com でプロジェクト作成（無料枠で可）
2. SQL Editorで以下を実行:
```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  source text,
  source_slug text,
  consented_at timestamptz,
  created_at timestamptz default now()
);
-- service_role からのみ書き込み（公開readは不要）
alter table public.leads enable row level security;
```
3. Settings → API から `Project URL` と `service_role` キーを控える

### Step 2: Vercel環境変数を設定（10分）
Vercel → プロジェクト → Settings → Environment Variables に追加:
```
NEXT_PUBLIC_SUPABASE_URL = <Project URL>
SUPABASE_SERVICE_ROLE_KEY = <service_role キー>
```
（PDF添付メールも送るなら）
```
RESEND_API_KEY = <Resendのキー>
RESEND_FROM_EMAIL = 生前整理支援センター ふれあいの丘 <noreply@kogera.co.jp 等の認証済みドメイン>
```
→ Redeploy（環境変数反映のため）

### Step 3: 動作確認（5分）
1. 本番サイトで無料PDF/チェックリストのメール登録を1件テスト送信
2. Supabase → Table Editor → leads に行が増えていればOK
3. `.env.local` にも同じ3キーを追記（ローカル開発・スクリプトでleads参照する場合）

## 完了後にDD資料へ書けること
- 「リード獲得導線が現に機能し、登録が日次発生している」（件数は数百でも『仕組みが稼働』が重要）
- クリーンダッシュボードの4指標目「メールリスト件数」が埋まる

## ⚠️ 注意（4専門家の合意）
- **リスト件数を年内の主役KPIに据えない。** 終活無料DLの単価は低く、年数百件が天井。150-600万寄与は二重楽観として全員が却下。これは「下振れ防止の床上げ」であって本体（B2B＋資産売却）ではない。
- Supabaseキー取得が30分で済まなければ即タイムボックスして撤退し、B2B営業（本体）に戻ること。
