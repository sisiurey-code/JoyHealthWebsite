import Link from "next/link";

type SiteHeaderProps = Readonly<{
  active?: "nutrition" | "standards" | "usana";
}>;

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="trust-strip">
        <div className="content-shell">
          <p>Evidence-based health education</p>
        </div>
      </div>
      <div className="site-header-frame">
        <header className="site-header content-shell">
          <Link className="wordmark" href="/" aria-label="Joy Health home">
            <span className="wordmark-mark" aria-hidden="true">
              [<i />]
            </span>
            <span>Joy Health</span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link
              className={active === "nutrition" ? "is-active" : undefined}
              href="/nutrition"
              aria-current={active === "nutrition" ? "page" : undefined}
            >
              Nutrition
            </Link>
            <Link
              className={active === "standards" ? "is-active" : undefined}
              href="/standards"
              aria-current={active === "standards" ? "page" : undefined}
            >
              Standards
            </Link>
            <Link
              className={active === "usana" ? "is-active" : undefined}
              href="/usana"
              aria-current={active === "usana" ? "page" : undefined}
            >
              USANA
            </Link>
          </nav>
        </header>
      </div>
    </>
  );
}
