import { pageTitle } from "../lib/site-brand";
import { getCanonicalUrl } from "../lib/site-url";
import SenryuPageClient from "./SenryuPageClient";

export const metadata = {
  title: pageTitle("実家じまい川柳"),
  description:
    "実家じまい・遺品整理のあるあるや哀愁を、ふれあいの丘のフクロウが川柳で詠みました。共感ボタンで「わかる！」「座布団一枚！」を。みんなの川柳も募集中。",
  alternates: { canonical: getCanonicalUrl("/senryu") },
};

export default function SenryuPage() {
  return <SenryuPageClient />;
}
