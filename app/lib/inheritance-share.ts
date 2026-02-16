/**
 * 民法に基づく法定相続分計算（入力パターンは分析用に保持）
 */

export interface InheritanceInputPattern {
  step: number;
  hasSpouse: boolean;
  childrenCount: number;
  hasDirectAscendants: boolean;
  siblingsCount: number;
  submittedAt?: string;
}

export interface ShareItem {
  label: string;
  share: number;
  percent: number;
}

export function calculateInheritanceShares(input: InheritanceInputPattern): ShareItem[] {
  const { hasSpouse, childrenCount, hasDirectAscendants, siblingsCount } = input;

  if (hasSpouse && childrenCount === 0 && !hasDirectAscendants && siblingsCount === 0) {
    return [{ label: "配偶者", share: 1, percent: 100 }];
  }

  if (hasSpouse && childrenCount > 0) {
    const childShare = 1 / 2 / childrenCount;
    const items: ShareItem[] = [
      { label: "配偶者", share: 1 / 2, percent: 50 },
      ...Array.from({ length: childrenCount }, (_, i) => ({
        label: `子${i + 1}`,
        share: childShare,
        percent: Math.round(100 * childShare * 10) / 10,
      })),
    ];
    return items;
  }

  if (hasSpouse && childrenCount === 0 && hasDirectAscendants) {
    return [
      { label: "配偶者", share: 2 / 3, percent: Math.round((100 * 2) / 3 * 10) / 10 },
      { label: "直系尊属（父母等）", share: 1 / 3, percent: Math.round((100 / 3) * 10) / 10 },
    ];
  }

  if (hasSpouse && childrenCount === 0 && !hasDirectAscendants && siblingsCount > 0) {
    const sibShare = (1 / 4) / siblingsCount;
    const items: ShareItem[] = [
      { label: "配偶者", share: 3 / 4, percent: 75 },
      ...Array.from({ length: siblingsCount }, (_, i) => ({
        label: `兄弟姉妹${i + 1}`,
        share: sibShare,
        percent: Math.round(100 * sibShare * 10) / 10,
      })),
    ];
    return items;
  }

  if (!hasSpouse && childrenCount > 0) {
    const share = 1 / childrenCount;
    return Array.from({ length: childrenCount }, (_, i) => ({
      label: `子${i + 1}`,
      share,
      percent: Math.round((100 / childrenCount) * 10) / 10,
    }));
  }

  if (!hasSpouse && hasDirectAscendants && childrenCount === 0) {
    return [{ label: "直系尊属（父母等）", share: 1, percent: 100 }];
  }

  if (!hasSpouse && !hasDirectAscendants && siblingsCount > 0) {
    const share = 1 / siblingsCount;
    return Array.from({ length: siblingsCount }, (_, i) => ({
      label: `兄弟姉妹${i + 1}`,
      share,
      percent: Math.round((100 / siblingsCount) * 10) / 10,
    }));
  }

  return [{ label: "該当なし", share: 1, percent: 100 }];
}

export function isComplexPattern(input: InheritanceInputPattern): boolean {
  return input.siblingsCount > 0 || (input.childrenCount > 1 && !input.hasSpouse);
}

/** 相続トラブル危険度: 入力パターンに応じた判定 */
export type InheritanceRiskLevel = "high" | "medium" | "low";

export function getInheritanceRiskLevel(input: InheritanceInputPattern): InheritanceRiskLevel {
  const { hasSpouse, childrenCount, hasDirectAscendants, siblingsCount } = input;

  // 高: 兄弟姉妹が相続人、または子が複数で配偶者なし
  if (siblingsCount > 0) return "high";
  if (childrenCount > 1 && !hasSpouse) return "high";

  // 中: 配偶者＋直系尊属、または配偶者＋子複数
  if (hasSpouse && childrenCount === 0 && hasDirectAscendants) return "medium";
  if (hasSpouse && childrenCount > 1) return "medium";
  if (!hasSpouse && childrenCount > 1) return "medium";

  // 低: 単独相続人、配偶者のみ、配偶者＋子1人 等
  return "low";
}
