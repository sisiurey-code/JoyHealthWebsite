import Link from "next/link";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

export default function NotFound() {
  return (
    <div className="page-shell not-found-shell">
      <SiteHeader />
      <main className="not-found content-shell" id="main-content">
        <p className="eyebrow">Error 404</p>
        <h1>This page wandered off.</h1>
        <p>
          The evidence trail ends here, but the rest of Joy Health is nearby.
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
