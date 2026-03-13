import { getCanonicalUrl } from "../lib/site-url";

export const metadata = {
  alternates: { canonical: getCanonicalUrl("/assets") },
};

export default function AssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
