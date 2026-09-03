import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested Joy Health page does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="page-shell not-found-shell">
      <SiteHeader />
      <main className="not-found content-shell" id="main-content">
        <p className="eyebrow">Error 404</p>
        <h1>We can&apos;t find that page.</h1>
        <p>
          The address may be mistyped, or the page may have moved. The guides
          are one click away.
        </p>
        <div className="not-found-actions">
          <Link className="primary-link" href="/nutrition">
            Browse nutrition guides <span aria-hidden="true">→</span>
          </Link>
          <Link className="text-link" href="/">
            Return home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
