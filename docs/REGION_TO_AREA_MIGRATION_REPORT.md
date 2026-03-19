# /region/ 完全廃止 → /area/ 統一移行 完了報告

PDF 指示書「Cursor 実装指示書 /region/ URL の完全廃止と /area/ への統一移行」に基づく実装の完了報告です。

---

## 調査結果（フェーズ 0）

### /region/ ページの生成元
| 項目 | 内容 |
|------|------|
| ルート定義 | `app/region/[...slug]/page.tsx`（1 ファイルのみ・/region/ 専用） |
| 動的ルート | `app/region/[...slug]/page.tsx` が `getRegionSlugs()` で全組み合わせを静的生成 |
| サイトマップ | `app/sitemap.ts`（id=main 時に `getRegionSlugs()` で region URL を出力）、`scripts/lib/collect-sitemap-urls.ts` |
| 内部リンク | `app/region/[...slug]/page.tsx` 内の「近隣の市区町村」セクションのみ（対応 area がない隣接地域への `/region/` リンク）。他ページに /region/ へのリンクはなし |

### マッピング
- 全 region は `content/area-data/areas.csv` の「都道府県・市区町村」と同一ソース。
- 対応する /area/{prefectureId}/{cityId} は `app/lib/area-id-map.generated.ts`（AREA_ID_MAP）で判定。
- 対応あり → `/area/{prefectureId}/{cityId}` へ 301。
- 対応なし → 都道府県が AREA_ID_MAP に存在すれば `/area/{prefectureId}`、それもなければ `/area` へ 301。

---

## 実施した変更

| ファイル | 変更内容 |
|----------|----------|
| **app/lib/region-redirects.ts** | 新規作成。`getRegionRedirects()` で全 /region/ 用 301 ルールを生成（エンコード・未エンコード・末尾スラッシュ両対応）。 |
| **next.config.ts** | `getRegionRedirects()` を import し、`redirects()` に個別マッピング＋フォールバック 2 件を追加。 |
| **app/region/[...slug]/page.tsx** | 削除（/region/ ルートの無効化）。 |
| **app/sitemap.ts** | `getRegionSlugs` の import と region 用 URL 出力を削除。コメントの「region」表記を修正。 |
| **scripts/lib/collect-sitemap-urls.ts** | region 用 URL 収集ブロックと `getRegionSlugs` の import を削除。 |

---

## 変更後の適用範囲

- **リダイレクト**：約 1,690 地域 × 4（エンコード/未エンコード × 末尾スラッシュ有無）＝ 約 6,760 件の個別 301 ＋ フォールバック 2 件。**合計 3,382 件**（Next の redirects 件数として表示）。
- **サイトマップ**：/region/ 系 URL は 0 件。main サイトマップからは cost/dispose/articles 等のみ出力。
- **内部リンク**：/region/ を指すリンクは削除した region ページ内のみにあったため、該当ファイル削除により 0 件。
- **Canonical**：/area/ 各ページは従来どおり `getCanonicalUrl('/area/...')` で https://www.fureaino-oka.com の正規 URL を指定。変更なし。
- **robots.txt**：/region/ の Disallow はなし。/area/ の不当な Disallow もなし。変更なし。

---

## 実装したリダイレクト件数（総数）

- **3,382 件**（Next.js ビルド時の redirects カウント）。
- 内訳：個別マッピング 約 3,380 件（1,690 地域 × 2 種の path × 2 種の trailing slash）＋ フォールバック 2 件（`/region/:pref/:city` と `/region/:pref/:city/`）。

---

## フォールバック（対応 /area/ なし）となった /region/ URL

- 個別マッピングは `getAreaIds(都道府県, 市区町村)` で判定。
- 対応する /area/ が存在しない場合は `destination` が `/area/{prefectureId}` または `/area` になる。
- 該当するのは、AREA_ID_MAP に市区町村が存在しない region のみ。同一 CSV 由来のため件数は少なく、該当がある場合は都道府県トップまたは `/area` へ 301。
- 一覧が必要な場合は、`getRegionRedirects()` の戻り値のうち `destination === '/area' || destination.startsWith('/area/') && destination.split('/').length === 3` のものを抽出すれば確認可能。

---

## 内部リンクを修正したファイルと件数

- **0 ファイル・0 件**。
- /region/ へのリンクは削除した `app/region/[...slug]/page.tsx` 内のみに存在したため、ファイル削除により解消。他ページに /region/ へのリンクはなかった。

---

## サイトマップから削除した URL の件数

- **getRegionSlugs() の戻り値の件数分**（約 844 件）。main サイトマップの region 用エントリをすべて削除。

---

## curl による動作確認（ローカルで実施する場合）

デプロイ後、本番ドメインで以下を実行してください。

```bash
# 301 と location の確認（日本語 URL はエンコードして指定）
curl -I "https://www.fureaino-oka.com/region/%E6%9D%B1%E4%BA%AC%E9%83%BD/%E4%B8%96%E7%94%B0%E8%B0%B7%E5%8C%BA"
# 期待: HTTP/2 301 および location: https://www.fureaino-oka.com/area/tokyo/setagaya

# 末尾スラッシュ
curl -I "https://www.fureaino-oka.com/region/%E6%9D%B1%E4%BA%AC%E9%83%BD/%E4%B8%96%E7%94%B0%E8%B0%B7%E5%8C%BA/"
# 期待: 同上

# /area/ が 200 であることの確認
curl -I "https://www.fureaino-oka.com/area/tokyo/setagaya"
# 期待: HTTP/2 200
```

---

## 実装中に発見した予期しない問題・懸念事項

1. **リダイレクト件数 1000 超**  
   Next.js の警告「total number of custom routes exceeds 1000」が出力されます。指示書どおり個別 301 で実装したため、パフォーマンス影響は許容範囲として現状のままにしています。

2. **ビルドキャッシュ**  
   `app/region/[...slug]/page.tsx` 削除後、`.next` を削除しないと「module not found」でビルドが失敗しました。クリーンビルド（`.next` 削除後に `npm run build`）で解消済み。

3. **日本語 path のマッチ**  
   next.config の redirects では、エンコード済み・未エンコードの両方の path を個別に登録しており、いずれのアクセスでも 301 がかかるようにしてあります。

---

## Ryosuke が実施する作業（フェーズ 8）

- GSC で新しいサイトマップ URL を送信する。
- URL 検査で主要な /area/ URL の「インデックス登録をリクエスト」を実行（10〜20 件）。
- URL 検査で主要な /region/ URL を入力し、301 が正しく認識されていることを確認する。
- 1〜2 週間後、カバレッジで「代替ページ（canonical あり）」の件数が減っているか確認する。
