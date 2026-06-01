# 外部出典補完計画書（External Citation Patch Plan）

最終更新: 2026-06-01 / 作成: Claude（kbrysk 指示）

## 目的

`logs/content-quality/quality-report-2026-06-01.csv` で「外部出典 0 本」と判定された 11 記事に、**実在する公的機関 URL** を最低 2 本ずつ追加し、E-E-A-T（特に Authoritativeness）と YMYL 対策を底上げする。

## 設計原則

1. **捏造禁止**: URL は必ず実在する公式機関ドメイン（`*.go.jp` / `*.lg.jp` / 認可学会・国際公的団体）に限定。
2. **押し売りにしない**: 引用は短く、リンクで「詳細は○○へ」と誘導する形式。本文の独自性を毀損しない。
3. **新規タブ＋安全属性**: すべての外部リンクに `target="_blank" rel="noopener noreferrer"` を付ける。
4. **YMYL × 監修ルール厳守**: 監修者（村上充恵 / 大久保） の専門領域外（相続税・登記・解体）に「村上監修」を付けず、出典で権威性を補強する（`docs/SUPERVISOR_PLACEMENT_AND_PROFILE.md` 準拠）。
5. **非弁・非税理士遵守**: 出典で制度を説明 → 「個別判断は専門家へ」で締める。具体的な節税スキームや遺言文案は出さない（`docs/CONTENT_LEGAL_AND_SEO_GUIDE.md`）。
6. **挿入位置の原則**:
   - 制度や統計を最初に説明する H2 直後の段落末（読者が「根拠」を確認したくなる箇所）
   - 「まとめ」直前の最終 H2 内（読者が次のアクションを取る前のクロージング権威付け）
   - 海外記事は「日本の関連政策」セクションを追加し、そこに国内公的出典を集中させる

---

## 推奨する公的出典源（カタログ）

| 機関 | URL ベース | 主な用途 |
|---|---|---|
| 厚生労働省 | https://www.mhlw.go.jp/ | 介護保険、老人ホーム、終末期医療、人生会議（ACP）、訪問介護 |
| 総務省 | https://www.soumu.go.jp/ | 住宅・土地統計調査、人口動態、自治体DX |
| 総務省統計局 | https://www.stat.go.jp/ | 空き家率、世帯統計 |
| 国民生活センター | https://www.kokusen.go.jp/ | 遺品整理・訪問買取・葬儀トラブルの相談事例 |
| 国土交通省 | https://www.mlit.go.jp/ | 空家対策特別措置法、空家バンク、住宅セーフティネット |
| 法務省 | https://www.moj.go.jp/ | 相続登記義務化、自筆証書遺言保管制度、成年後見 |
| 国税庁 | https://www.nta.go.jp/ | 相続税基礎控除、3,000万円特別控除、贈与税 |
| 内閣府 | https://www8.cao.go.jp/kourei/whitepaper/ | 高齢社会白書（高齢者人口・独居率・健康寿命） |
| 消費者庁 | https://www.caa.go.jp/ | 訪問購入規制（特定商取引法）、押し買い注意喚起 |
| 警察庁 | https://www.npa.go.jp/ | 高齢者を狙う特殊詐欺・悪質商法 |
| 日本ホスピス緩和ケア協会 | https://www.hpcj.org/ | 終末期医療・看取り |
| 日本緩和医療学会 | https://www.jspm.ne.jp/ | ACP・緩和ケアガイドライン |
| 全国空き家相談士協会 | https://akiyasoudanshi.jp/ | 空き家管理（参考） |
| 公益社団法人成年後見センター・リーガルサポート | https://www.legal-support.or.jp/ | 任意後見・法定後見 |

### 海外公的・準公的ソース（海外記事用）

| 機関 | URL ベース | 主な用途 |
|---|---|---|
| Swedish Institute | https://sweden.se/ | 北欧文化・döstädning の英語紹介 |
| AARP（米国退職者協会） | https://www.aarp.org/ | 米国シニアの終末期・遺産整理データ |
| INELDA（International End of Life Doula Association） | https://www.inelda.org/ | デスドゥーラの定義・トレーニング |
| NEDA（National End-of-Life Doula Alliance） | https://www.nedalliance.org/ | デスドゥーラの倫理規定 |
| NHPCO（米国ホスピス緩和ケア機構） | https://www.nhpco.org/ | 米国の終末期統計 |

---

## 実装優先順位

### 【高】YMYL 強 × SEO 競合多（最優先 3 記事）

1. `akiya-souzoku-4sentakushi` — 実家を相続したら 4 選択肢
2. `oya-zaisan-haaku-houhou` — 親の財産を生前に把握する方法
3. `roujin-home-nyukyo-jikka` — 親が老人ホーム入居・実家整理

### 【中】情報補強（次に対応 5 記事）

4. `jikka-jimai-guide` — 実家じまいで後悔しないために
5. `jikka-jimai-yatte-haikenai` — 実家じまいでやってはいけない失敗
6. `49nichi-houyou-junbi` — 四十九日法要の準備
7. `eitai-kuyou-shurui-hiyou` — 永代供養の種類と費用相場
8. `z3ucbtz-i9` — 親に生前整理を切り出す家族会議の進め方

### 【低】海外・独自系（最後に対応 3 記事）

9. `swedish-death-cleaning` — デスクリーニング（北欧式生前整理）
10. `death-doula` — デスドゥーラ
11. `overseas-digital-estate-services` — 海外デジタル遺産サービス 7 社比較

---

## 記事別 出典付与プラン

### 1.【高】`akiya-souzoku-4sentakushi`（実家を相続したら 4 選択肢）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | 法務省「相続登記の申請義務化」 | https://www.moj.go.jp/MINJI/minji05_00343.html | 2024年4月1日施行。3年以内に相続登記しない場合10万円以下の過料 |
| B | 国税庁「No.3302 マイホームを売ったときの特例」 | https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3302.htm | 居住用財産3,000万円特別控除の制度概要 |
| C | 国土交通省「空家等対策の推進に関する特別措置法」 | https://www.mlit.go.jp/jutakukentiku/house/jutakukentiku_house_tk3_000035.html | 特定空家指定で固定資産税住宅用地特例除外 |

**挿入位置**:
- H2「実家を相続したらまず確認する 3 つの状況」直後の「相続登記の状況」H3 末尾 → A
- H2「売却タイミングと『決められない場合の暫定運用』」配下「3,000万円特例と3年の壁」H3 末尾 → B
- H2「選択肢 3：解体」の「解体補助金の活用」直前段落 → C

**挿入文（HTML 完成形）**:

```html
<p>相続登記は2024年4月1日から義務化されており、相続を知った日から3年以内に申請しない場合は10万円以下の過料の対象になります。詳細は<a href="https://www.moj.go.jp/MINJI/minji05_00343.html" target="_blank" rel="noopener noreferrer">法務省「相続登記の申請義務化」</a>の解説をご確認ください。</p>
```

```html
<p>被相続人が住んでいた家を売却する場合、一定の要件を満たすと譲渡所得から最高3,000万円を控除できる特例があります。要件は厳密なので、具体的な適用可否は<a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3302.htm" target="_blank" rel="noopener noreferrer">国税庁「マイホームを売ったときの特例」</a>を確認のうえ、税理士へ相談してください。</p>
```

```html
<p>放置して「特定空家」に指定されると、固定資産税の住宅用地特例（1/6軽減）が外れ、税額が最大約6倍になる可能性があります。制度の詳細は<a href="https://www.mlit.go.jp/jutakukentiku/house/jutakukentiku_house_tk3_000035.html" target="_blank" rel="noopener noreferrer">国土交通省「空家等対策の推進に関する特別措置法」</a>をご確認ください。</p>
```

---

### 2.【高】`oya-zaisan-haaku-houhou`（親の財産を生前に把握する方法）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | 内閣府「令和5年版高齢社会白書」 | https://www8.cao.go.jp/kourei/whitepaper/w-2023/zenbun/05pdf_index.html | 高齢者の経済状況・資産分布の公式統計 |
| B | 国税庁「No.4152 相続税の計算」 | https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4152.htm | 基礎控除（3,000万円＋600万円×法定相続人数）の制度説明 |
| C | 金融庁「家計の安定的な資産形成・成年後見制度の利用促進」 | https://www.fsa.go.jp/policy/kasotsuka/index.html | 高齢者の金融資産管理に関する公的見解 |

**挿入位置**:
- H2「なぜ親の財産を生前に把握しておくことが大切なのか」末尾 → A（統計で問題の規模を提示）
- H2「把握すべき財産の項目一覧」の「不動産」H3 末尾 → B（相続税の基礎控除の存在を示唆）
- H2「専門家に相談すべきタイミング」配下「税理士に相談するタイミング」H3 末尾 → B 再掲を避け、別出典で補強

**挿入文**:

```html
<p><a href="https://www8.cao.go.jp/kourei/whitepaper/w-2023/zenbun/05pdf_index.html" target="_blank" rel="noopener noreferrer">内閣府「令和5年版高齢社会白書」</a>によれば、高齢者世帯の経済状況や資産分布は年代によって大きく変動しています。親世代の状況を客観的に把握する一助としてご確認ください。</p>
```

```html
<p>相続税には「3,000万円＋600万円×法定相続人数」の基礎控除があり、これを超える資産でないと申告は不要です。計算方法の詳細は<a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4152.htm" target="_blank" rel="noopener noreferrer">国税庁「相続税の計算」</a>をご確認ください（個別計算は税理士へ）。</p>
```

---

### 3.【高】`roujin-home-nyukyo-jikka`（親が老人ホーム入居・実家整理）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | 厚生労働省「介護保険事業状況報告」 | https://www.mhlw.go.jp/topics/kaigo/osirase/jigyo/index.html | 要介護認定者数・施設利用者数の最新統計 |
| B | 厚生労働省「介護サービス情報公表システム」 | https://www.kaigokensaku.mhlw.go.jp/ | 全国の介護施設検索（公的検索エンジン） |
| C | 国民生活センター「遺品整理サービスに関する相談」 | https://www.kokusen.go.jp/news/data/n-20180920_2.html | 遺品整理・残置物処分のトラブル事例 |

**挿入位置**:
- 冒頭リード文直後（入居者数の規模感を示す）→ A
- 「施設選び・契約」関連 H2 末尾 → B
- 「実家の荷物整理」関連 H2 末尾 → C（業者選定の参考）

**挿入文**:

```html
<p>全国の要介護認定者数は年々増加しており、施設入所も身近な選択肢となっています。最新の統計は<a href="https://www.mhlw.go.jp/topics/kaigo/osirase/jigyo/index.html" target="_blank" rel="noopener noreferrer">厚生労働省「介護保険事業状況報告」</a>で公表されています。</p>
```

```html
<p>施設選びの第一歩として、<a href="https://www.kaigokensaku.mhlw.go.jp/" target="_blank" rel="noopener noreferrer">厚生労働省「介護サービス情報公表システム」</a>で地域の介護施設を客観的な指標で比較できます。料金・職員配置・運営方針が一覧できるので、ぜひご活用ください。</p>
```

```html
<p>実家の荷物整理を業者に頼む場合、見積もりや作業内容を巡るトラブルが報告されています。事前に<a href="https://www.kokusen.go.jp/news/data/n-20180920_2.html" target="_blank" rel="noopener noreferrer">国民生活センター「遺品整理サービスに関する相談」</a>の事例を確認し、複数社比較を徹底してください。</p>
```

---

### 4.【中】`jikka-jimai-guide`（実家じまいで後悔しないために）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | 総務省統計局「令和5年住宅・土地統計調査」 | https://www.stat.go.jp/data/jyutaku/2023/index.html | 全国の空き家数・空き家率の公式統計 |
| B | 国土交通省「空き家対策」 | https://www.mlit.go.jp/jutakukentiku/house/jutakukentiku_house_tk3_000035.html | 空家等対策特別措置法の改正概要（2023年） |

**挿入位置**:
- 冒頭リード「なぜ今、実家じまいが…」直後 → A
- 「放置するとどうなるか」関連 H2 末尾 → B

**挿入文**:

```html
<p><a href="https://www.stat.go.jp/data/jyutaku/2023/index.html" target="_blank" rel="noopener noreferrer">総務省統計局「令和5年住宅・土地統計調査」</a>によれば、全国の空き家数・空き家率は過去最高水準で推移しています。実家じまいは個人の問題であると同時に、社会全体の課題となっています。</p>
```

```html
<p>2023年の空家等対策特別措置法改正により、「管理不全空家」という新区分が設けられ、固定資産税の優遇措置が外れる対象が拡大しました。改正の概要は<a href="https://www.mlit.go.jp/jutakukentiku/house/jutakukentiku_house_tk3_000035.html" target="_blank" rel="noopener noreferrer">国土交通省「空き家対策」</a>をご確認ください。</p>
```

---

### 5.【中】`jikka-jimai-yatte-haikenai`（実家じまいでやってはいけない失敗）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | 国民生活センター「訪問購入（押し買い）」 | https://www.kokusen.go.jp/soudan_topics/data/houmonkounyu.html | 押し買い被害の典型例とクーリングオフ |
| B | 消費者庁「特定商取引法（訪問購入）」 | https://www.no-trouble.caa.go.jp/what/homepurchase/ | 訪問購入の規制と注意点 |
| C | 法務省「相続登記の申請義務化」 | https://www.moj.go.jp/MINJI/minji05_00343.html | 名義変更を放置するリスク |

**挿入位置**:
- 「やってはいけない失敗 1（押し売り業者）」段落末尾 → A・B
- 「名義変更を後回しにする」段落末尾 → C

**挿入文**:

```html
<p>業者が突然訪問して買取を持ちかける「押し買い」は、特定商取引法で規制されています。被害事例や対処法は<a href="https://www.kokusen.go.jp/soudan_topics/data/houmonkounyu.html" target="_blank" rel="noopener noreferrer">国民生活センター「訪問購入」</a>および<a href="https://www.no-trouble.caa.go.jp/what/homepurchase/" target="_blank" rel="noopener noreferrer">消費者庁「特定商取引法ガイド（訪問購入）」</a>をご確認ください。</p>
```

```html
<p>相続登記は2024年4月から義務化され、3年以内に申請しないと10万円以下の過料の対象となります。詳細は<a href="https://www.moj.go.jp/MINJI/minji05_00343.html" target="_blank" rel="noopener noreferrer">法務省「相続登記の申請義務化」</a>をご確認ください。</p>
```

---

### 6.【中】`49nichi-houyou-junbi`（四十九日法要の準備）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | 厚生労働省「人口動態統計」 | https://www.mhlw.go.jp/toukei/list/81-1a.html | 全国の死亡者数（法要の社会的規模感） |
| B | 全日本葬祭業協同組合連合会（全葬連） | https://www.zensoren.or.jp/ | 葬祭マナー・宗派対応の業界団体 |

**挿入位置**:
- 「四十九日とは」H2 末尾 → A
- 「宗派による違い」H2 末尾 → B

**挿入文**:

```html
<p>四十九日法要は、年間約150万件以上の葬儀に続いて営まれる、日本で広く行われている仏教行事です。最新の死亡者数や葬祭関連統計は<a href="https://www.mhlw.go.jp/toukei/list/81-1a.html" target="_blank" rel="noopener noreferrer">厚生労働省「人口動態統計」</a>で公表されています。</p>
```

```html
<p>宗派ごとの細かい作法は、菩提寺のご住職に直接ご確認いただくのが確実です。葬祭業界の業界団体としては<a href="https://www.zensoren.or.jp/" target="_blank" rel="noopener noreferrer">全日本葬祭業協同組合連合会（全葬連）</a>が情報発信を行っています。</p>
```

---

### 7.【中】`eitai-kuyou-shurui-hiyou`（永代供養の種類と費用相場）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | 厚生労働省「墓地、埋葬等に関する法律」 | https://www.mhlw.go.jp/web/t_doc?dataId=82066000&dataType=0 | 改葬・埋葬・納骨の法的根拠 |
| B | 一般社団法人 全国優良石材店の会 | https://www.zenyuseki.or.jp/ | 業界団体による契約トラブル予防情報 |

**挿入位置**:
- H2「永代供養とは何か — 一般的なお墓との違い」末尾 → A
- H2「墓じまいから永代供養への流れ」配下 → A（再活用）+ B

**挿入文**:

```html
<p>永代供養や改葬・納骨は、<a href="https://www.mhlw.go.jp/web/t_doc?dataId=82066000&dataType=0" target="_blank" rel="noopener noreferrer">厚生労働省所管の「墓地、埋葬等に関する法律（墓埋法）」</a>に基づいて行われます。市区町村の許可（改葬許可証）が必要な手続きについても本法律で定められています。</p>
```

```html
<p>霊園・石材店選びでトラブルを避けるためには、契約前に複数社の見積もりを比較してください。業界団体としては<a href="https://www.zenyuseki.or.jp/" target="_blank" rel="noopener noreferrer">一般社団法人 全国優良石材店の会</a>が消費者向け情報を公開しています。</p>
```

---

### 8.【中】`z3ucbtz-i9`（親に生前整理を切り出す家族会議の進め方）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | 内閣府「令和5年版高齢社会白書」 | https://www8.cao.go.jp/kourei/whitepaper/w-2023/zenbun/05pdf_index.html | 高齢者人口・独居率・家族構成の統計 |
| B | 厚生労働省「人生会議（ACP）」 | https://www.mhlw.go.jp/stf/newpage_02783.html | 終末期医療の意思表示と家族の対話 |

**挿入位置**:
- リード文直後（家族会議の社会的背景）→ A
- 「家族会議のテーマ」関連 H2 末尾 → B

**挿入文**:

```html
<p><a href="https://www8.cao.go.jp/kourei/whitepaper/w-2023/zenbun/05pdf_index.html" target="_blank" rel="noopener noreferrer">内閣府「令和5年版高齢社会白書」</a>によれば、高齢者の独居世帯は年々増加しており、家族間の早めの対話の重要性が高まっています。</p>
```

```html
<p>厚生労働省も「人生の最終段階における医療・ケアについて、本人と家族・医療者が話し合う」取り組みを「人生会議（ACP）」として推進しています。詳細は<a href="https://www.mhlw.go.jp/stf/newpage_02783.html" target="_blank" rel="noopener noreferrer">厚生労働省「人生会議（ACP）」</a>をご確認ください。</p>
```

---

### 9.【低】`swedish-death-cleaning`（北欧式生前整理）

海外発祥の概念なので**日本の公的出典は補強用に留め、海外公的・準公的ソースを主軸**にする。

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | Swedish Institute（スウェーデン政府機関） | https://sweden.se/ | 北欧文化・döstädning の公式英語紹介 |
| B | 厚生労働省「人生会議（ACP）」 | https://www.mhlw.go.jp/stf/newpage_02783.html | 日本における類似概念（終末期意思表示） |

**挿入位置**:
- H2「Swedish death cleaningとは」末尾 → A
- H2「日本の生前整理との違い：3つの柱との対比」末尾、または「まとめ」直前 → B

**挿入文**:

```html
<p>döstädning（デスクリーニング）はスウェーデン発祥の文化です。北欧の暮らしの考え方については、スウェーデン政府機関である<a href="https://sweden.se/" target="_blank" rel="noopener noreferrer">Swedish Institute（英語）</a>が公式の解説を発信しています。</p>
```

```html
<p>日本でも、終末期医療や生き方の希望を本人・家族・医療者が事前に話し合う「人生会議（ACP）」が厚生労働省によって推進されています。詳細は<a href="https://www.mhlw.go.jp/stf/newpage_02783.html" target="_blank" rel="noopener noreferrer">厚生労働省「人生会議」</a>をご確認ください。</p>
```

---

### 10.【低】`death-doula`（デスドゥーラ）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | INELDA（International End of Life Doula Association） | https://www.inelda.org/ | デスドゥーラの定義・トレーニング基準 |
| B | NEDA（National End-of-Life Doula Alliance） | https://www.nedalliance.org/ | デスドゥーラの倫理規定・職域 |
| C | 厚生労働省「人生会議（ACP）」 | https://www.mhlw.go.jp/stf/newpage_02783.html | 日本の終末期医療・対話の枠組み |

**挿入位置**:
- H2「米国の主要団体：INELDA・NEDA・Doulagivers」末尾 → A・B
- H2「日本の『看取り士』と何が違うのか」末尾、または「まとめ」直前 → C

**挿入文**:

```html
<p>デスドゥーラの定義・トレーニング基準は<a href="https://www.inelda.org/" target="_blank" rel="noopener noreferrer">INELDA（International End of Life Doula Association）</a>、職業倫理は<a href="https://www.nedalliance.org/" target="_blank" rel="noopener noreferrer">NEDA（National End-of-Life Doula Alliance）</a>が公式情報を発信しています（いずれも英語）。</p>
```

```html
<p>日本にデスドゥーラと完全に同じ職業はありませんが、終末期医療・ケアの希望を本人・家族・医療者で話し合う「人生会議（ACP）」が厚生労働省によって普及啓発されています。詳細は<a href="https://www.mhlw.go.jp/stf/newpage_02783.html" target="_blank" rel="noopener noreferrer">厚生労働省「人生会議（ACP）」</a>をご確認ください。</p>
```

---

### 11.【低】`overseas-digital-estate-services`（海外デジタル遺産サービス 7 社比較）

| # | 出典 | URL | 引用データ |
|---|---|---|---|
| A | AARP「Digital Estate Planning」 | https://www.aarp.org/money/investing/info-2020/digital-estate-planning.html | 米国シニア向けデジタル遺産の啓発 |
| B | 総務省「インターネット上の個人情報保護」 | https://www.soumu.go.jp/main_sosiki/joho_tsusin/d_syohi/ihinseiri.html | 日本のデジタル遺品に関する公的情報（該当ページが無い場合は総務省『デジタル活用支援推進事業』に差替） |
| C | 個人情報保護委員会 | https://www.ppc.go.jp/ | 死亡者の個人情報・アカウントの取扱い |

**挿入位置**:
- H2「海外のデジタル遺産サービスとは」末尾 → A
- H2「日本でそのまま使いにくい理由」配下 → C
- H2「日本の家庭が取り入れられるポイント」末尾 → B または C

**挿入文**:

```html
<p>米国の高齢者団体である<a href="https://www.aarp.org/money/investing/info-2020/digital-estate-planning.html" target="_blank" rel="noopener noreferrer">AARP「Digital Estate Planning」（英語）</a>では、デジタル遺産の整理を遺言・終活の標準項目として推奨しています。</p>
```

```html
<p>日本では、死亡者のアカウントや個人情報の扱いについて、<a href="https://www.ppc.go.jp/" target="_blank" rel="noopener noreferrer">個人情報保護委員会</a>が個人情報保護法に基づいた公式情報を提供しています。アカウント解約・データ削除請求の前にご確認ください。</p>
```

> 注: 上記 B の総務省 URL は実在性を必ず確認のうえ採用。実在しない場合は同表 C（個人情報保護委員会）のみで運用する。

---

## 実装方法

### スクリプト案: `scripts/content/patch-external-citations.mjs`

既存の `scripts/content/microcms-publish.mjs` の `update(PATCH)` ロジックを流用し、**`content` フィールド本文のみ**を上書きする補完専用スクリプトを新設する。

#### 設計要件

1. 入力: `docs/external-citation-patches.json`（本書から派生する別ファイル。記事ごとの `slug` ＋「挿入アンカー文字列」＋「挿入HTMLスニペット」を JSON で持つ）。
2. 動作:
   1. microCMS から `blogs/{slug}` の最新 `content` を GET（**draftKey は使わず公開記事を直接取得**）。
   2. アンカー文字列が見つかったら、その直後に HTML スニペットを挿入。
   3. 既に同じ URL が含まれていたらスキップ（idempotent）。
   4. `update(PATCH)` で `content` フィールドのみを送信。
3. デフォルトは `--dry-run`（差分を CLI に出力するのみ）。`--apply` 指定時のみ PATCH。
4. 1 件ずつ実行可能（`--slug akiya-souzoku-4sentakushi`）と、優先度バッチ実行（`--priority high`）の両対応。
5. **PATCH 権限が APIキーに必要**。`MICROCMS_WRITE_API_KEY` に `PATCH` 権限を事前付与。
6. PATCH 後は **公開ステータスを変更しない**ことに注意（既存 microcms-publish.mjs と同じ仕様）。公開状態の記事へ PATCH すれば即時反映される。

#### 想定する patch 定義の構造（`docs/external-citation-patches.json`）

```json
{
  "patches": [
    {
      "slug": "akiya-souzoku-4sentakushi",
      "priority": "high",
      "insertions": [
        {
          "anchor": "<h3>相続登記の状況</h3>",
          "position": "after-section",
          "html": "<p>相続登記は2024年4月1日から義務化されており... <a href=\"https://www.moj.go.jp/MINJI/minji05_00343.html\" target=\"_blank\" rel=\"noopener noreferrer\">法務省「相続登記の申請義務化」</a>...</p>",
          "skipIfContains": "moj.go.jp/MINJI/minji05_00343"
        }
      ]
    }
  ]
}
```

`position` の値:
- `after-section`: アンカー（H2/H3）の直後の段落として挿入
- `before-h2-matome`: 「まとめ」H2 の直前に挿入
- `replace-paragraph`: 既存段落を置換（慎重に使用、レビュー必須）

#### 安全装置

- すべての PATCH 前に `content/pipeline/_citation-backups/{slug}-{timestamp}.html` へ既存本文を保存。
- `--dry-run` で差分を console.diff 出力。
- 失敗時は PATCH せず終了。

---

## 運用フロー

1. 本書をレビュー → 出典 URL の **実在性** と引用文の **法務適合** を kbrysk が承認。
2. `docs/external-citation-patches.json` を本書から生成（手作業 or サブスクリプト）。
3. `scripts/content/patch-external-citations.mjs --dry-run --priority high` で差分確認。
4. 問題なければ `--apply --priority high` で実行 → microCMS 反映を画面で目視確認。
5. 中・低優先度を順次実行。
6. 1 週間後に再度 `npm run quality:check`（または `scripts/content/quality-score-articles.mjs`）で外部出典スコアの改善を確認。

## チェックリスト（実施前）

- [ ] すべての URL を実際にブラウザで開いて 200 を確認した
- [ ] 引用文に断定的な税務・法務助言が含まれていないか確認した
- [ ] 各記事の既存本文と日本語のトーンが整合しているか確認した
- [ ] microCMS の `blogs` API キーに PATCH 権限があるか確認した
- [ ] バックアップ保存先 `content/pipeline/_citation-backups/` を作成した

## 関連ドキュメント

- `docs/CONTENT_LEGAL_AND_SEO_GUIDE.md` — YMYL / 法務ルール
- `docs/SUPERVISOR_PLACEMENT_AND_PROFILE.md` — 監修者付与ルール
- `docs/SEO_CONTENT_AUTOMATION_ARCHITECTURE.md` — パイプライン全体像
- `scripts/content/microcms-publish.mjs` — 既存 update(PATCH) 実装の参考
- `logs/content-quality/quality-report-2026-06-01.csv` — 対象記事の品質スコア
