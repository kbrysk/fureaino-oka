# subsidy.maxAmount 確認結果

## 1. municipalities.json の該当7市の subsidy.maxAmount 値

| prefId / cityId | 市区町村名 | subsidy.maxAmount（そのまま） |
|-----------------|------------|------------------------------|
| kagoshima / kagoshima | 鹿児島市 | `"最大50万円"` |
| tokyo / hachioji | 八王子市 | `"最大50万円"` |
| hiroshima / hiroshima | 広島市 | `"最大50万円"` |
| toyama / toyama | 富山市 | `"最大50万円"` |
| fukuoka / kitakyushu | 北九州市 | `"最大50万円"` |
| ibaraki / mito | 水戸市 | `"最大50万円"` |
| aomori / aomori | 青森市 | `"最大50万円"` |

※ いずれも **municipalities.json に明示的に記載されている値**です。

---

## 2. デフォルト値の有無

- **municipalities.ts** の `DEFAULT_MUNICIPALITY_TEMPLATE` は次のとおりです。
  ```ts
  subsidy: { hasSubsidy: false as const }
  ```
  **maxAmount は含まれておらず、未登録地域では `data.subsidy.maxAmount` は undefined です。**

- 未登録地域は `getMunicipalityDataOrDefault` で上記テンプレートが使われるため、**「デフォルトの50万円」がコードから入ることはありません。**

- 該当7市はすべて **municipalities.json にエントリがあり、その中の `subsidy.maxAmount` が「最大50万円」** と書かれているだけであり、デフォルト値ではありません。

---

## 3. area-contents による上書き

次の市区町村は **data/area-contents に subsidyInfo.maxAmount が "—" の JSON が存在**します。

- kagoshima/kagoshima
- toyama/toyama
- fukuoka/kitakyushu
- ibaraki/mito
- hiroshima/hiroshima

メタデータでは `areaContent?.subsidyInfo ?? (data.subsidy から構築)` のため、**これらの市では area-contents の `"—"` が採用され、`extractMaxAmount("—")` は null を返します。**  
その結果、**タイトル・description には金額は出ず、「データが存在する場合のみ表示」はすでに満たされています。**

---

## 4. 結論とコード上の扱い

- **結論**: 7市の「最大50万円」はすべて **municipalities.json の実データ**であり、デフォルト値による誤表示はありません。
- **念のため**: 「金額は extractMaxAmount が null でない場合のみ表示」していることを、subsidy ページの generateMetadata 内でコメントで明記しました。
