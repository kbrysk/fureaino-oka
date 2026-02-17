/**
 * 生前整理支援センター ふれあいの丘 - ユーザーテスト用 Googleフォーム 自動作成
 *
 * 使い方:
 * 1. https://script.google.com/ を開く
 * 2. 新しいプロジェクトを作成
 * 3. このファイルの内容を貼り付け
 * 4. 下の CONFIG の SITE_URL と AIKOTOBA を必要に応じて編集
 * 5. 関数 createUserTestForm を選択して「実行」
 * 6. 初回は権限の承認（フォームの作成）を求められるので許可
 * 7. 実行後、ログに表示されるフォームURLを開く
 */

// ========== ここを編集 ==========
var CONFIG = {
  /** 対象サイトのURL（フォームの説明に表示） */
  SITE_URL: 'https://example.com',
  /** サンクスページに表示する合言葉（クラウドワークス登録用） */
  AIKOTOBA: '【 ふれあいテスト2025 】',
};
// ================================

/** 各ツール・コンテンツの表示名（セクションタイトル・設問で使用） */
var CONTENT_ITEMS = [
  { name: 'トップページ（ホーム）' },
  { name: 'ふれあいの丘について（会社・サービス紹介）' },
  { name: '無料ツール一覧ページ' },
  { name: '空き家税金シミュレーター' },
  { name: '実家じまい力診断' },
  { name: '空き家リスク診断' },
  { name: '法定相続分シミュレーター' },
  { name: '相続準備力診断' },
  { name: 'デジタル遺品リスク診断' },
  { name: '法要カレンダー' },
  { name: '資産・査定の目安' },
  { name: 'チェックリスト（生前整理の進捗）' },
  { name: '地域別（粗大ゴミ・遺品整理の地域ページ）' },
  { name: 'はじめかた・進め方（実家じまいの手順）' },
  { name: '費用の目安（cost 関連）' },
  { name: '処分・捨て方（品目別など）' },
  { name: '記事一覧または個別の記事（1本以上）' },
  { name: 'ガイドブック（実家じまい等）' },
  { name: '専門家への無料相談（お問い合わせ・紹介）' },
  { name: '資産・査定の見える化（持ち物登録）' },
  { name: 'エンディングノート' },
  { name: 'その他（フッターのリンク等で閲覧したページ）', helpSuffix: ' 該当するページがない場合は「特になし」と記入してください。' },
];

function createUserTestForm() {
  var title = '生前整理支援センター ふれあいの丘 - サイト利用アンケート（ユーザーテスト）';
  var form = FormApp.create(title);

  var disclaimer = 'サイトを見ていないと判断した場合は、非承認とさせていただきます。\n\n';
  form.setDescription(
    disclaimer +
    '40代〜60代の方を優先して募集しています。\n\n' +
    '【お願い】すべてのコンテンツ・ツールを実際にご利用のうえ、各セクションで「利用した感想」を必ず記入してください。\n' +
    'サイトURL: ' + CONFIG.SITE_URL + '\n' +
    '所要時間の目安：サイトの閲覧 30分〜 + アンケート 約15分'
  );
  form.setConfirmationMessage(buildConfirmationMessage());
  form.setShowLinkToRespondAgain(false);

  // --- 1. 説明・同意（冒頭に注意書き） ---
  form.addSectionHeaderItem()
    .setTitle('【必読】ご確認ください')
    .setHelpText(
      disclaimer +
      'このセクションの内容をじっくりお読みのうえ、同意できる場合のみチェックして次へ進んでください。\n\n' +
      'このアンケートは「生前整理支援センター ふれあいの丘」のサイト改善のため、\n' +
      '実際にサイトのすべてのコンテンツ・ツールをご利用いただいた方の声を集めるものです。\n\n' +
      '【お願い】\n' +
      '・指定のサイトにアクセスし、以下でお尋ねする「すべての」コンテンツ・ツールを実際に操作または閲覧してください。\n' +
      '・無料ツール（診断・シミュレーター等）は質問に答えたり入力して結果を見たりするまで操作してください。\n' +
      '・各セクションでは、そのコンテンツ・ツールを利用したうえで「感想」を必ず記入してください。\n' +
      '・回答完了後、表示される「合言葉」をクラウドワークス上の指定の場所に入力していただくことで報酬（50円程度）をお支払いします。\n\n' +
      'サイトURL: ' + CONFIG.SITE_URL
    );

  var agree = form.addCheckboxItem();
  agree.setTitle('上記の説明をよく読んだうえで、以下の両方に当てはまる場合のみチェックしてください。（必須）');
  agree.setChoiceValues([
    '指定URLのサイトにアクセスし、すべてのコンテンツ・ツールを実際に操作または閲覧する',
    '上記に同意し、各セクションの感想を必ず記入する'
  ]);
  agree.setRequired(true);

  // --- 2. 属性（年齢） ---
  form.addPageBreakItem();
  form.addSectionHeaderItem()
    .setTitle('属性（年齢）')
    .setHelpText('このセクションの質問をよくお読みのうえ、該当するものを1つ選んでください。');
  var age = form.addMultipleChoiceItem();
  age.setTitle('あなたの年齢層を教えてください。（必須）');
  age.setChoiceValues(['30代以下', '40代', '50代', '60代', '70代以上']);
  age.setRequired(true);

  // --- 3. 各ツール・コンテンツごとに「利用した感想」を必須で追加 ---
  for (var i = 0; i < CONTENT_ITEMS.length; i++) {
    var item = CONTENT_ITEMS[i];
    form.addPageBreakItem();
    form.addSectionHeaderItem()
      .setTitle(item.name + ' を利用したうえで回答してください')
      .setHelpText(
        'まずサイトで「' + item.name + '」を実際にご利用ください。\n' +
        '利用したうえで、以下の質問に必ず回答してください。'
      );
    var feedback = form.addParagraphTextItem();
    feedback.setTitle('「' + item.name + '」を利用した感想をお書きください。（必須）');
    var helpText = '例：わかりやすかった点・役に立った点・改善してほしい点・操作で困った点など。利用した実感に基づいて具体的に記入してください。';
    if (item.helpSuffix) {
      helpText = helpText + item.helpSuffix;
    }
    feedback.setHelpText(helpText);
    feedback.setRequired(true);
  }

  // --- 4. 全体の改善提案（必須） ---
  form.addPageBreakItem();
  form.addSectionHeaderItem()
    .setTitle('全体を通しての改善提案')
    .setHelpText(
      'すべてのコンテンツ・ツールを利用したうえで、サイト全体についての改善提案をお聞かせください。\n' +
      'このセクションの質問をよくお読みのうえ、必ず記入してください。'
    );
  var improvement = form.addParagraphTextItem();
  improvement.setTitle('サイト全体を利用したうえで、改善提案をお書きください。（必須）');
  improvement.setHelpText('例：わかりにくかった点、こうしたらよいと思う点、追加してほしい機能や情報、誤字・表示の不具合など。なるべく具体的に記入してください。');
  improvement.setRequired(true);

  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();
  Logger.log('フォームを作成しました。');
  Logger.log('公開URL（回答用）: ' + formUrl);
  Logger.log('編集URL: ' + editUrl);
  return form;
}

function buildConfirmationMessage() {
  return (
    'ご回答ありがとうございました。\n\n' +
    '【報酬受け取りの手順】\n' +
    '1. この画面に表示されている「合言葉」をコピーするか、メモしてください。\n' +
    '2. クラウドワークスの該当タスクページに戻り、指定の入力欄に合言葉をそのまま貼り付けて提出してください。\n' +
    '3. 合言葉が一致した方に、報酬をお支払いします。\n\n' +
    '今回の合言葉はこちらです →\n\n' +
    CONFIG.AIKOTOBA + '\n\n' +
    '（※ カギ括弧も含めてそのまま入力してください。）\n\n' +
    'サイト改善にご協力いただき、ありがとうございました。'
  );
}
