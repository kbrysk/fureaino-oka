/**
 * ふれあいの丘「監修者の見せ方」確認デモ — Google Apps Script Web アプリ版
 *
 * 使い方:
 *  1. https://script.google.com/ で「新しいプロジェクト」を作成
 *  2. 既定の「コード.gs」にこのファイルの内容を貼り付け
 *  3. 「＋」→「HTML」で新規ファイルを作成し、ファイル名を index にする（index.html になる）
 *  4. mockup/murakami-supervisor-demo.html の中身を丸ごと index.html に貼り付け
 *  5. 右上「デプロイ」→「新しいデプロイ」→種類「ウェブアプリ」
 *       - 次のユーザーとして実行: 自分
 *       - アクセスできるユーザー: 全員（リンクを知っている全員に共有したい場合）
 *  6. 発行された https://script.google.com/macros/s/.../exec の URL を村上様へ共有
 *
 *  ※ 共有相手が初回に「このアプリは Google で確認されていません」と出る場合がありますが、
 *     自作スクリプトのため問題ありません（社外共有時の文言が気になる場合は README の代替案を参照）。
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('ふれあいの丘｜監修者の見せ方 確認デモ')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
