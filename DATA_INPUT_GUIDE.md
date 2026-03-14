# 補助金実データ入力ガイド

## 入力優先順位（Search Consoleデータに基づく）

| 優先度 | 市区町村 | 代表クエリ | 現在順位 | 表示回数/週 |
|--------|---------|----------|---------|-----------|
| 1 | 津市（三重） | 津市解体補助金 | 6.4位 | 43回 |
| 2 | 鹿児島市 | 鹿児島市解体補助金 | 8.5位 | 35回 |
| 3 | 西尾市（愛知） | 西尾市解体補助金 | 6.8位 | 33回 |
| 4 | 池田市（大阪） | 池田市解体補助金 | 6.7位 | 33回 |
| 5 | 世田谷区 | 世田谷区空き家補助金 | 6.1位 | 32回 |
| 6 | 八王子市 | 八王子市解体補助金 | 6.4位 | 30回 |
| 7 | 沼津市 | 沼津市粗大ごみ回収 | 15.2位 | 30回 |
| 8 | 高浜市（愛知） | 高浜市解体補助金 | 4.9位 | 27回 |
| 9 | 北九州市 | 北九州市解体補助金 | 9.1位 | 25回 |
| 10 | 菊川市（静岡） | 実家じまい菊川市 | 19.3位 | 25回 |

## 1市区町村あたりの入力所要時間：15〜30分

## データ入力手順

1. **現状確認**
   - `npx tsx scripts/check-default-pages.ts` で優先18市区町村の _isDefault 状態を確認
   - または `/admin/data-status` にアクセスして一覧を確認

2. **テンプレート取得**
   - `npx tsx scripts/generate-input-template.ts > input-template.md` で入力用テンプレートを生成

3. **各市区町村の公式サイトで補助金情報を確認する**
   - 検索例：「津市 空き家 解体 補助金 令和7年」

4. **データを入力する**
   - `app/lib/data/municipalities.json` に、既存エントリと同じ形式で追加する
   - 型定義は `app/lib/data/municipalities.ts` の `MunicipalityData` を参照
   - 必須: prefId, cityId, prefName, cityName, mascot.localRiskText, subsidy（hasSubsidy / name / maxAmount / conditions / officialUrl）, garbage.officialUrl

5. **表示確認**
   - `npm run dev` で該当URL（例: /area/mie/tsu/subsidy）を開き表示を確認

6. **デプロイ**
   - git push してデプロイする

7. **インデックス促し**
   - Search Console で「URL検査」→「インデックス登録をリクエスト」する

## 入力が難しい場合の対応

- **補助金情報が見つからない場合**
  市役所に電話して確認する（建築指導課または空き家対策担当）

- **令和7年度の情報がまだない場合**
  令和6年度のデータを入力し「※令和7年度は変更の可能性あり」と conditions や localRiskText に注記する

## 関連ファイル

- データ格納: `app/lib/data/municipalities.json`
- 型定義: `app/lib/data/municipalities.ts`
- 一括確認: `scripts/check-default-pages.ts`
- テンプレート生成: `scripts/generate-input-template.ts`
- 管理画面: `/admin/data-status`
