"use client";

/**
 * 自治体ページ用の動的FAQ（Helpful Content / Doorway 対策・テンプレート完全固定）。
 * UI表示テキストとJSON-LDの name/acceptedAnswer.text を一言一句一致させる。
 */
export interface MunicipalityDataForFaq {
  subsidy?: { name?: string; maxAmount?: string };
  garbage?: { officialUrl?: string; phone?: string };
}

interface DynamicFaqProps {
  prefName: string;
  cityName: string;
  hasData: boolean;
  municipalityData?: MunicipalityDataForFaq | null;
}

function buildFaqItems(
  prefName: string,
  cityName: string,
  hasData: boolean,
  municipalityData?: MunicipalityDataForFaq | null
): { question: string; answer: string }[] {
  const subsidyName = municipalityData?.subsidy?.name ?? "空き家除却等の補助金";
  const subsidyMaxAmount = municipalityData?.subsidy?.maxAmount ?? "補助金";
  const garbageUrl = municipalityData?.garbage?.officialUrl ?? "";
  const garbagePhone = municipalityData?.garbage?.phone;

  const q1 =
    `${prefName}${cityName}で実家を解体・処分する際、補助金や助成金はもらえますか？`;
  const a1WithData = `はい、${cityName}には『${subsidyName}』などの制度があり、条件を満たすと${subsidyMaxAmount}が支給される可能性があります。申請条件や募集枠の最新状況については、本ページに設置している公式窓口へのリンクから${cityName}の担当課へ直接ご確認ください。`;
  const a1WithoutData = `実家の解体に関する補助金（老朽空家等除却補助金など）の有無や予算枠は、${prefName}内の各自治体によって毎年変動します。${cityName}における現在の制度適用については、本ページに設置している『公式窓口で確認する』ボタンから、市の担当窓口（建築指導課など）へ直接お問い合わせいただくのが最も確実です。`;

  const q2 = `${cityName}にある空き家となった実家を売却する場合、税金の優遇措置はありますか？`;
  const a2 = `一定要件を満たせば『被相続人の居住用財産（空き家）に係る譲渡所得の3,000万円特別控除』が適用され、${cityName}の不動産を売却した際の税金が大幅に軽減される可能性があります。ただし、この特例には厳格な適用期限が設けられています。まずは本ページ内の『不動産一括査定』を利用して、現在の適正な売却相場を早急に把握することをお勧めします。`;

  const q3 =
    `${cityName}の通常のゴミ回収に出せない不用品（家電や粗大ゴミ）はどう処分すればよいですか？`;
  const a3WithData = garbagePhone
    ? `${cityName}のルールに従い、粗大ゴミとして処分してください。詳細は市の案内ページ（${garbageUrl}）をご確認いただくか、受付センター（${garbagePhone}）へご相談ください。`
    : `${cityName}のルールに従い、粗大ゴミとして処分してください。詳細は市の案内ページ（${garbageUrl}）をご確認いただくか、市の担当窓口へご相談ください。`;
  const a3WithoutData = `テレビ、冷蔵庫、洗濯機などの家電リサイクル法対象品目や、タイヤ等の処理困難物は、${cityName}の通常のゴミ回収（集積所）には出せません。${cityName}の許可を受けた一般廃棄物収集運搬業者へ依頼するか、本ページ内でご案内している遺品整理・お片付け業者への無料見積もりを活用して、適切かつ安全に処分してください。`;

  return [
    { question: q1, answer: hasData ? a1WithData : a1WithoutData },
    { question: q2, answer: a2 },
    { question: q3, answer: hasData ? a3WithData : a3WithoutData },
  ];
}

export default function DynamicFaq({
  prefName,
  cityName,
  hasData,
  municipalityData,
}: DynamicFaqProps) {
  const faqItems = buildFaqItems(prefName, cityName, hasData, municipalityData);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section
      className="bg-card rounded-2xl border border-border overflow-hidden"
      aria-labelledby="dynamic-faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="px-5 py-4 border-b border-border bg-primary-light/30">
        <h2 id="dynamic-faq-heading" className="font-bold text-primary text-base">
          {cityName}の実家・空き家に関するよくある質問
        </h2>
      </div>
      <div className="divide-y divide-border">
        {faqItems.map((item, index) => (
          <div key={index} className="px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Q. {item.question}
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
