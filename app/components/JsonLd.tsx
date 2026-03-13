/**
 * 構造化データ（JSON-LD）出力専用コンポーネント。
 * Server Component として動作し、FAQ / Article / Breadcrumb 等のスキーマを
 * 安全に <script type="application/ld+json"> として出力する。
 *
 * 方針:
 * - 関心の分離: ページ内に生の <script> を書かず、本コンポーネント経由に統一。
 * - XSS・パースエラー防止: 文字列内の < > & を Unicode エスケープしてから出力。
 */

interface JsonLdProps {
  /** 出力する構造化データ。オブジェクトまたは配列。React Element は不可。 */
  data: object | object[];
}

/**
 * JSON 文字列を HTML の script 内に埋め込む際に安全にする。
 * - </script> によるタグの早期終了を防ぐため < を \u003c に置換（Next.js 推奨）。
 * - 同様に > を \u003e、& を \u0026 に置換し、パースエラー・XSS の余地をなくす。
 */
function sanitizeJsonLdString(jsonString: string): string {
  return jsonString
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default function JsonLd({ data }: JsonLdProps) {
  const jsonString = JSON.stringify(data);
  const safeHtml = sanitizeJsonLdString(jsonString);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
