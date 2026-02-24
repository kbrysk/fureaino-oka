"use client";

import { useEffect } from "react";
import { useAreaCta } from "./AreaCtaContext";

/** エリアページでレンダーし、フローティング CTA に市区町村名を渡す */
export default function AreaBodyMeta({ cityName }: { cityName: string }) {
  const { setCityName } = useAreaCta();
  useEffect(() => {
    setCityName(cityName);
    return () => setCityName(null);
  }, [cityName, setCityName]);
  return null;
}
