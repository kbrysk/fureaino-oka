import { getCanonicalUrl } from "../lib/site-url";

export const metadata = {
  alternates: { canonical: getCanonicalUrl("/settings") },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
