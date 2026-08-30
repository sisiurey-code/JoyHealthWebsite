import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export default function NutritionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="page-shell nutrition-shell">
      <SiteHeader active="nutrition" />
      <div className="site-shell" id="main-content">
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
