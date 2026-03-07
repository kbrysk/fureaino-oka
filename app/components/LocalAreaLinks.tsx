import fs from "fs";
import path from "path";
import Link from "next/link";
import type { AreaContentData } from "@/types/areaContent";

const prefMap: Record<string, string> = {
  tokyo: "東京都",
  osaka: "大阪府",
  hiroshima: "広島県",
  fukuoka: "福岡県",
  kanagawa: "神奈川県",
  saitama: "埼玉県",
};

interface LocalAreaLinksProps {
  prefecture: string;
  currentCity: string;
}

/**
 * 同じ都道府県内の他市区町村への内部リンクブロック（Server Component）。
 * data/area-contents/[prefecture]/ のJSONから cityName を取得し、currentCity を除外して表示する。
 */
export default async function LocalAreaLinks({ prefecture, currentCity }: LocalAreaLinksProps) {
  const prefName = prefMap[prefecture] ?? "";

  let items: { slug: string; cityName: string }[] = [];

  try {
    const dir = path.join(process.cwd(), "data", "area-contents", prefecture);
    const files = await fs.promises.readdir(dir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const results = await Promise.all(
      jsonFiles.map(async (file) => {
        const slug = file.replace(/\.json$/, "");
        if (slug === currentCity) return null;
        try {
          const filePath = path.join(dir, file);
          const raw = await fs.promises.readFile(filePath, "utf-8");
          const data = JSON.parse(raw) as AreaContentData;
          return { slug, cityName: data.cityName };
        } catch {
          return null;
        }
      })
    );

    items = results.filter((r): r is { slug: string; cityName: string } => r !== null);
    items.sort((a, b) => a.cityName.localeCompare(b.cityName, "ja"));
  } catch {
    return null;
  }

  if (items.length === 0) return null;

  return (
    <nav aria-label="近隣エリアの実家片付け・粗大ゴミ情報" className="mt-16 mb-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 border-b-2 border-green-500 pb-2 mb-4">
        {prefName ? `${prefName}の他の市区町村から探す` : "同じ都道府県の他の市区町村から探す"}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-6">
        ※ご実家や別の物件が近隣にある場合は、以下の地域情報もご活用ください。
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map(({ slug, cityName }) => (
          <li key={slug}>
            <Link
              href={`/area/${prefecture}/${slug}`}
              className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-green-400 transition-all group min-h-[72px]"
            >
              <span className="font-bold text-gray-900 group-hover:text-green-600 text-lg mr-1">
                {cityName}
              </span>
              <span className="text-sm text-gray-500 mt-0.5">の片付け・粗大ゴミ</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
