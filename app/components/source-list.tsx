export type Source = Readonly<{
  title: string;
  url: string;
  publisher: string;
  /** What the source was used for, its limits, and when it was read. */
  note: string;
}>;

/** Numbered "Sources we read" entries; `Citation` links to `#source-n`. */
export function SourceList({ sources }: Readonly<{ sources: readonly Source[] }>) {
  return (
    <ol className="source-list">
      {sources.map((source, index) => (
        <li id={`source-${index + 1}`} key={source.url}>
          <a href={source.url}>{source.title}</a>
          <p>
            {source.publisher}. {source.note}
          </p>
        </li>
      ))}
    </ol>
  );
}
