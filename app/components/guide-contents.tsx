export function GuideContents() {
  return (
    <nav className="guide-contents" aria-label="In this guide">
      <p className="guide-contents-label">
        <span aria-hidden="true">[•]</span>
        In this guide
      </p>
      <ol>
        <li>
          <a href="#meaning-title">
            <span>01</span>
            Meaning
          </a>
        </li>
        <li>
          <a href="#evidence-title">
            <span>02</span>
            Evidence and context
          </a>
        </li>
        <li>
          <a href="#use-title">
            <span>03</span>
            Practical use
          </a>
        </li>
        <li>
          <a href="#limits-title">
            <span>04</span>
            Limits
          </a>
        </li>
        <li>
          <a href="#sources-title">
            <span>05</span>
            Sources
          </a>
        </li>
      </ol>
    </nav>
  );
}
