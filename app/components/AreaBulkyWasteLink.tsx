"use client";

import { trackLeadEvent } from "../lib/lead-score";

/** 地域ページの粗大ゴミURLクリックをBランクリードとして記録 */
export default function AreaBulkyWasteLink({
  href,
  prefecture,
  city,
  children,
}: {
  href: string;
  prefecture: string;
  city: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackLeadEvent("area_bulky_waste_click", { prefecture, city });
      }}
      className="inline-block text-primary font-medium hover:underline break-all"
    >
      {children}
    </a>
  );
}
