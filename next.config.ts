import type { NextConfig } from "next";
import { AREA_ID_MAP } from "./app/lib/area-id-map.generated";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
  async redirects() {
    const redirects: { source: string; destination: string; permanent: boolean }[] = [];
    for (const e of AREA_ID_MAP) {
      const p = encodeURIComponent(e.prefecture);
      const c = encodeURIComponent(e.city);
      redirects.push(
        { source: `/area/${p}/${c}`, destination: `/area/${e.prefectureId}/${e.cityId}`, permanent: true },
        { source: `/area/${p}/${c}/subsidy`, destination: `/area/${e.prefectureId}/${e.cityId}/subsidy`, permanent: true },
        { source: `/area/${p}/${c}/cleanup`, destination: `/area/${e.prefectureId}/${e.cityId}/cleanup`, permanent: true },
        { source: `/tax-simulator/${p}/${c}`, destination: `/tax-simulator/${e.prefectureId}/${e.cityId}`, permanent: true },
      );
    }
    return redirects;
  },
};

export default nextConfig;
