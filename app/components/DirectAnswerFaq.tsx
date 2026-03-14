// S5: AI Overview対策・一問一答FAQコンポーネント 2026-03
// 構造：直接回答（40文字以内）→ 補足説明（任意）の2層構造

export type DirectAnswerItem = {
  id: string;
  question: string;
  directAnswer: string;
  supplement?: string;
};

type DirectAnswerFaqProps = {
  items: DirectAnswerItem[];
  sectionTitle?: string;
};

export function DirectAnswerFaq({
  items,
  sectionTitle = "よくある質問",
}: DirectAnswerFaqProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label={sectionTitle} className="py-2">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{sectionTitle}</h2>
      <dl className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <dt className="bg-primary/5 px-4 py-3 font-bold text-gray-800 text-base">
              Q. {item.question}
            </dt>
            <dd className="px-4 pt-3 pb-1">
              <p className="font-bold text-primary text-base">{item.directAnswer}</p>
              {item.supplement && (
                <p className="text-sm text-gray-600 mt-2 pb-2">{item.supplement}</p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
