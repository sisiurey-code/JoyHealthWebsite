type CitationProps = Readonly<{
  /** Number of the entry in the page's "Sources we read" list. */
  source: number;
}>;

/** Inline numbered reference that jumps to the matching source entry. */
export function Citation({ source }: CitationProps) {
  return (
    <sup className="citation">
      <a href={`#source-${source}`} aria-label={`Source ${source}`}>
        [{source}]
      </a>
    </sup>
  );
}
