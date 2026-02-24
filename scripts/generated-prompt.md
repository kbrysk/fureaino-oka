# 自治体データリサーチ依頼

あなたは優秀な自治体データリサーチャーです。以下の市区町村についてWeb検索（または知識）を行い、指定されたTypeScriptの `MunicipalityData` 型に**完全に合致する**JSON配列を作成してください。

## 対象

- **都道府県:** 北関東・信越
- **市区町村:**
- 宇都宮市
- 前橋市
- 高崎市
- 水戸市
- つくば市
- 長野市
- 松本市
- 新潟市
- 上越市
- 長岡市

## 型定義（厳守）

```typescript
export interface MunicipalityData {
  prefId: string;        // 例: "hokkaido"
  cityId: string;       // 例: "sapporo"
  prefName: string;     // 例: "北海道"
  cityName: string;     // 例: "札幌市"
  mascot: {
    localRiskText: string;  // 例: "積雪による倒壊リスクが高い地域だホー！…"
  };
  subsidy: {
    hasSubsidy: boolean;
    name?: string;      // 例: "札幌市危険空家等除却補助制度"
    maxAmount?: string; // 例: "最大300万円"
    conditions?: string;
    officialUrl?: string;  // 自治体公式案内URL
  };
  garbage: {
    officialUrl: string;   // 粗大ゴミ受付ページの公式URL（必須）
    phone?: string;
  };
}
```

- `prefId` / `cityId` はローマ字のスラッグ（例: hokkaido, sapporo）で統一してください。
- `prefName` / `cityName` は正式名称（例: 北海道, 札幌市）です。

## 厳格なルール

1. **ハルシネーション（嘘の情報）を絶対に避けること。** 実在しない補助金を `hasSubsidy: true` にしないでください。
2. **各自治体の公式ページを検索し、実在する補助金のみを `true` とすること。** 不明な場合は `hasSubsidy: false` にしてください。
3. **URLは必ず自治体の公式サイトのURLとすること。** 粗大ゴミ受付ページ・補助金案内ページの公式URLを取得してください。
4. `mascot.localRiskText` は、その地域の特性（雪害・耐震・空き家リスク等）に合わせた「モグ隊長（フクロウ）のひとこと」として、1〜2文で作成してください。語尾は「だホー」「だホー！」で統一してください。

## 出力形式

- **マークダウンのコードブロックで、純粋なJSON配列のみを出力すること。**
- 説明文は不要です。```json から ``` までのJSON配列だけを出力してください。

```json
[
  { "prefId": "...", "cityId": "...", ... },
  ...
]
```
