import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export default function SupplementsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="page-shell nutrition-shell">
      <SiteHeader active="usana" />
      <div className="site-shell">
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
