// U2: ページリード文コンポーネント 2026-03

type PageLeadProps = {
  text: string;
};

export function PageLead({ text }: PageLeadProps) {
  return (
    <p className="text-base text-gray-600 leading-relaxed mt-2 mb-4">
      {text}
    </p>
  );
}
