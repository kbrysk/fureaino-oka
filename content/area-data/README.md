# 地域データ（pSEO用）

- **areas.csv** … 本番用市区町村マスタ
- **municipalities-nationwide.json** … 全国市区町村のソース（都道府県別の市区町村名配列）

## 全国CSVの再生成

```bash
node scripts/generate-areas-csv.mjs
```

既存行（東京23区など）は維持され、JSONにあってCSVにない市区町村が追加される。
