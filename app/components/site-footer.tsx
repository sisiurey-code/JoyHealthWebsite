import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner content-shell">
        <div className="footer-identity">
          <Link className="wordmark" href="/" aria-label="Joy Health home">
            <span className="wordmark-mark" aria-hidden="true">
              [<i />]
            </span>
            <span>Joy Health</span>
          </Link>
          <p>
            Evidence-aware health education, with sources and limits attached.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/nutrition">Nutrition</Link>
          <Link href="/standards">Editorial standards</Link>
          <Link href="/usana">USANA quality &amp; innovation</Link>
        </nav>
        <div className="footer-smallprint">
          <p>General education, not medical advice.</p>
          <p>© {new Date().getFullYear()} Joy Health</p>
        </div>
      </div>
    </footer>
  );
}
