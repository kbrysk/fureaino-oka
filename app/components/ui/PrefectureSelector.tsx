"use client";

// U5: 都道府県選択 プルダウンUI 2026-03

import { useRouter } from "next/navigation";
import { useState } from "react";

type PrefectureSelectorProps = {
  prefectures: Array<{ id: string; name: string }>;
  placeholder?: string;
  targetPath?: "area" | "subsidy";
};

export function PrefectureSelector({
  prefectures,
  placeholder = "都道府県を選んでください",
  targetPath = "area",
}: PrefectureSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    if (value) {
      router.push(`/area/${value}`);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <label
        htmlFor="prefecture-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        お住まいの都道府県を選んでください
      </label>
      <div className="relative">
        <select
          id="prefecture-select"
          value={selected}
          onChange={handleChange}
          className={[
            "w-full",
            "min-h-[48px]",
            "px-4 py-3 pr-10",
            "rounded-lg",
            "border border-gray-300",
            "bg-white",
            "text-base",
            "text-gray-700",
            "cursor-pointer",
            "hover:border-primary",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "appearance-none",
          ].join(" ")}
          aria-label="都道府県を選択して地域ページへ移動する"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {prefectures.map((pref) => (
            <option key={pref.id} value={pref.id}>
              {pref.name}
            </option>
          ))}
        </select>
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-500 flex items-center justify-center"
          aria-hidden
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  );
}
