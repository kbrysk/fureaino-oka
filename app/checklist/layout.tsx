import { getCanonicalUrl } from "../lib/site-url";

export const metadata = {
  alternates: { canonical: getCanonicalUrl("/checklist") },
};

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
