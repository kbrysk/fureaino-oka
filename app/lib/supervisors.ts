/**
 * 監修者（総合監修）の一元管理。
 *
 * 運用方針（2段階）:
 *  1. 立ち上げ期は 大久保亮佑（生前整理アドバイザー2級）が総合監修。
 *  2. 村上充恵 様の許諾取得後、CURRENT_GENERAL_SUPERVISOR を "murakami" に切り替えるだけで、
 *     監修クレジット表示が全面的に村上様へ切り替わる。
 *
 * 重要（評判保護・虚偽資格の禁止）:
 *  - ここに書く資格は実在のもののみ。大久保は「生前整理アドバイザー2級」。
 *  - 相続税・不動産・解体・登記など専門領域は、2級でも村上様でも監修対象外。
 *    該当領域は別途の専門家（税理士/司法書士/宅建士/解体専門家）を確保するまで
 *    「一般情報＋専門家へのご相談案内」に限定し、総合監修者のクレジットを付けない。
 */

export type SupervisorKey = "okubo" | "murakami";

export interface Supervisor {
  key: SupervisorKey;
  /** 表示名 */
  name: string;
  /** 肩書（監修者としての位置づけ） */
  role: string;
  /** 保有資格・肩書（実在のもののみ） */
  credentials: string[];
  /** 監修者プロフィールページのパス */
  profileHref: string;
  /** 記事冒頭バッジ用の短い肩書（資格1つ） */
  badgeTitle: string;
  /** フッター注記 */
  note: string;
}

export const SUPERVISORS: Record<SupervisorKey, Supervisor> = {
  okubo: {
    key: "okubo",
    name: "大久保 亮佑",
    role: "総合監修者（編集方針）",
    credentials: ["生前整理アドバイザー2級", "株式会社Kogera 代表取締役"],
    profileHref: "/supervisor/okubo",
    badgeTitle: "生前整理アドバイザー2級",
    note: "当サイトの編集方針・トーンの総合監修です。個別の法務・税務・不動産・解体に関する内容は、それぞれの分野の専門家が監修します。",
  },
  murakami: {
    key: "murakami",
    name: "村上 充恵",
    role: "総合監修者（編集方針）",
    credentials: [
      "生前整理普及協会 認定指導員",
      "AFP",
      "介護離職防止対策アドバイザー",
      "神奈川大学エクステンション講座 講師",
    ],
    profileHref: "/supervisor/murakami",
    badgeTitle: "生前整理アドバイザー指導員",
    note: "当サイトの編集方針・トーンの総合監修です。個別の法務・税務・不動産・解体に関する内容は、それぞれの分野の専門家が監修します。",
  },
};

/**
 * 現在の総合監修者。
 * 村上充恵 様の許諾が取れたら "murakami" に変更するだけで全表示が切り替わる。
 */
export const CURRENT_GENERAL_SUPERVISOR: SupervisorKey = "okubo";

/** 生前整理・家族・進め方など「総合監修」領域の現監修者を返す。 */
export function getGeneralSupervisor(): Supervisor {
  return SUPERVISORS[CURRENT_GENERAL_SUPERVISOR];
}
