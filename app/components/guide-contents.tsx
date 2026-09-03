const sections = [
  { id: "meaning-title", label: "Meaning" },
  { id: "evidence-title", label: "Evidence and context" },
  { id: "use-title", label: "Practical use" },
  { id: "limits-title", label: "Limits" },
  { id: "sources-title", label: "Sources" },
] as const;

/** In-page table of contents shared by every nutrition guide. */
export function GuideContents() {
  return (
    <nav className="guide-contents" aria-labelledby="guide-contents-label">
      <p className="guide-contents-label" id="guide-contents-label">
        <span aria-hidden="true">[•]</span>
        In this guide
      </p>
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>
              <span aria-hidden="true">0{index + 1}</span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
