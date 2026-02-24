"use client";

/**
 * 地域の特性（localRiskText のキーワード）に基づき
 * 「よくある相談と回答」を表示。滞在時間・信頼性向上。
 */
interface ConsultationItem {
  theme: string;
  question: string;
  answer: string;
}

const THEME_PATTERNS: { pattern: RegExp; theme: string; question: string; answer: string }[] = [
  {
    pattern: /雪|積雪|豪雪/,
    theme: "豪雪・倒壊",
    question: "{{cityName}}で豪雪による空き家の倒壊が心配です。どうすればよいですか？",
    answer:
      "{{cityName}}のような積雪地域では、雪の重みで屋根が抜けたり倒壊したりするリスクがあります。早めに耐震診断や除雪の有無を確認し、使わない家は解体補助金を活用して除却する選択肢も検討しましょう。自治体の空き家相談窓口や、無料見積もりで業者に相談することをおすすめします。",
  },
  {
    pattern: /密集|延焼|火災|木造/,
    theme: "密集地・火災",
    question: "{{cityName}}は木造密集地と聞きます。空き家の火災対策で気をつけることは？",
    answer:
      "{{cityName}}では木造住宅が密集しているため、一軒の火災が延焼につながりやすい地域があります。空き家を放置すると延焼の原因になり、近隣への賠償リスクも。不燃化特区の助成や老朽建築物除却助成を活用し、早めの解体・整理を検討してください。自治体の「空き家対策」「建築指導」窓口で制度を確認できます。",
  },
  {
    pattern: /坂|傾斜|土砂/,
    theme: "斜面・土砂",
    question: "{{cityName}}で斜面にある実家の空き家が心配です。土砂災害のリスクは？",
    answer:
      "斜面地の空き家は、大雨時に土砂災害の誘因になったり、倒壊で避難路を塞いだりする恐れがあります。{{cityName}}の窓口で「がけ地近接」などの届出や助成の有無を確認し、危険度が高い場合は解体補助金の対象になることも。まずは自治体の防災・建築担当に相談することをおすすめします。",
  },
  {
    pattern: /雷|雨漏り/,
    theme: "雷・雨漏り",
    question: "{{cityName}}は雷が多いと聞きます。空き家の雨漏りや火災が心配です。",
    answer:
      "雷の多い地域では、落雷による火災や雨漏りによる老朽化が進みやすくなります。空き家を放置すると、雨漏りで構造が傷み、倒壊リスクも高まります。早めに屋根や外壁の点検を行い、使わない家は解体補助を検討しましょう。{{cityName}}の空き家除却補助金の要件を窓口で確認してみてください。",
  },
  {
    pattern: /風|台風|飛来/,
    theme: "風害",
    question: "{{cityName}}では台風で屋根や看板が飛ぶと聞きます。空き家の管理で注意すべきことは？",
    answer:
      "強風が多い地域では、老朽化した屋根材や看板が飛散し、近隣に危害を及ぼすリスクがあります。空き家の適正管理が求められるため、放置は避けましょう。補助金を活用した早めの解体や、業者による一時的な養生の相談を。{{cityName}}の空き家対策窓口で助成の有無を確認することをおすすめします。",
  },
  {
    pattern: /水害|浸水/,
    theme: "水害",
    question: "{{cityName}}で水害や浸水のリスクがある空き家をどうすればよいですか？",
    answer:
      "浸水リスクの高い地域では、管理不全な空き家が漂流物になったり、避難の妨げになったりする恐れがあります。早めに解体補助金の対象かどうかを自治体に確認し、除却や移転を検討しましょう。{{cityName}}の「空き家対策」「建築」窓口や、無料見積もりで業者に相談するのがおすすめです。",
  },
  {
    pattern: /景観/,
    theme: "景観・防災",
    question: "{{cityName}}の景観を損なう空き家を、どう整理すればよいですか？",
    answer:
      "歴史ある街並みや景観を守るためにも、老朽化した空き家の適正管理は重要です。景観条例に触れる場合や、倒壊の恐れがある場合は自治体から指導が入ることも。補助金を活用した解体や、売却・利活用の相談を早めに。{{cityName}}の窓口で制度を確認し、専門家の無料見積もりも併せて検討してみてください。",
  },
  {
    pattern: /空き家|管理|放置|老朽/,
    theme: "空き家管理・補助金",
    question: "{{cityName}}で空き家の整理や補助金の相談はどこにすればよいですか？",
    answer:
      "{{cityName}}では、空き家除却や耐震改修に伴う補助金を設けている場合があります。まずは市の「空き家対策」「建築指導」「住宅」などの窓口で、対象条件と申請方法を確認しましょう。併せて、遺品整理や不用品回収は業者の無料見積もりで相場を把握し、補助金とあわせて計画するとスムーズです。",
  },
];

function getConsultations(localRiskText: string, cityName: string): ConsultationItem[] {
  const used = new Set<string>();
  const out: ConsultationItem[] = [];

  for (const { pattern, theme, question, answer } of THEME_PATTERNS) {
    if (out.length >= 3) break;
    if (used.has(theme)) continue;
    if (!pattern.test(localRiskText)) continue;

    used.add(theme);
    out.push({
      theme,
      question: question.replace(/\{\{cityName\}\}/g, cityName),
      answer: answer.replace(/\{\{cityName\}\}/g, cityName),
    });
  }

  if (out.length === 0) {
    out.push({
      theme: "空き家の整理・補助金",
      question: `${cityName}で空き家の整理や補助金の相談はどこにすればよいですか？`,
      answer: `${cityName}では、空き家除却や耐震改修に伴う補助金を設けている場合があります。まずは市の「空き家対策」「建築指導」などの窓口で対象条件を確認しましょう。遺品整理や不用品回収は業者の無料見積もりで相場を把握し、補助金とあわせて計画することをおすすめします。`,
    });
  }

  return out;
}

interface LocalConsultationCardProps {
  cityName: string;
  prefName: string;
  localRiskText: string;
}

export default function LocalConsultationCard({ cityName, prefName, localRiskText }: LocalConsultationCardProps) {
  const items = getConsultations(localRiskText, cityName);

  return (
    <section className="bg-card rounded-2xl border border-border overflow-hidden" aria-labelledby="local-consultation-heading">
      <div className="px-6 py-4 border-b border-border bg-primary-light/30">
        <h2 id="local-consultation-heading" className="font-bold text-primary">
          {cityName}（{prefName}）でよくある相談と回答
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {items.map((item, i) => (
          <div key={i} className="border-b border-border/60 pb-6 last:border-0 last:pb-0 last:mb-0">
            <p className="text-xs font-medium text-primary/80 mb-1">{item.theme}</p>
            <p className="text-sm font-medium text-foreground/90 mb-2">{item.question}</p>
            <p className="text-sm text-foreground/70 leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
