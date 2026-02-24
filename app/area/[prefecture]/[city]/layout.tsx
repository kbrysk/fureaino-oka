import AreaLocalNav from "../../../components/AreaLocalNav";

interface Props {
  children: React.ReactNode;
  params: Promise<{ prefecture: string; city: string }>;
}

/**
 * 地域Hub/Spoke共通レイアウト。追従型ローカルナビを共通ヘッダーとして配置。
 */
export default async function AreaCityLayout({ children, params }: Props) {
  const { prefecture, city } = await params;
  return (
    <div className="min-h-0">
      <AreaLocalNav prefectureId={prefecture} cityId={city} />
      <div className="min-h-0">{children}</div>
    </div>
  );
}
