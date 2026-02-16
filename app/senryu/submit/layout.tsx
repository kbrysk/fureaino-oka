import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("川柳を投稿する"),
  description: "みんなの実家じまい川柳を募集。採用でAmazonギフト券500円分または特製エンディングノートをプレゼント。",
};

export default function SenryuSubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
