const sections = [
  { id: "meaning-title", label: "Meaning" },
  { id: "evidence-title", label: "Evidence and context" },
  { id: "use-title", label: "Practical use" },
  { id: "limits-title", label: "Limits" },
  { id: "sources-title", label: "Sources" },
] as const;

type ContentsSection = Readonly<{ id: string; label: string }>;

/** In-page table of contents; guides share the default section set. */
export function GuideContents({
  sections: entries = sections,
}: Readonly<{ sections?: readonly ContentsSection[] }>) {
  return (
    <nav className="guide-contents" aria-labelledby="guide-contents-label">
      <p className="guide-contents-label" id="guide-contents-label">
        <span aria-hidden="true">[•]</span>
        In this guide
      </p>
      <ol>
        {entries.map((section, index) => (
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
