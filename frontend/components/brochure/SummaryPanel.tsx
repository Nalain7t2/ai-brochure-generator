import { parseSummary, formatBytes } from "@/lib/brochure";

type Props = {
  summary: string;
  host: string;
  fileName: string;
  fileBytes: number;
};

export function SummaryPanel({ summary, host, fileName, fileBytes }: Props) {
  const lines = parseSummary(summary);

  return (
    <aside className="lg:sticky lg:top-24">
      <h2 className="text-[15px] font-semibold text-ink">Summary</h2>
      <p className="mt-1 text-sm text-muted">What we picked up from {host}</p>

      {lines.length > 0 ? (
        <ul className="mt-5 divide-y divide-rule border-y border-rule lg:max-h-[52vh] lg:overflow-y-auto">
          {lines.map((line, i) => (
            <li key={i} className="py-3.5 text-[15px] leading-relaxed text-ink-soft">
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 border-y border-rule py-4 text-sm text-muted">
          The service didn&apos;t return a summary for this site. The brochure is still ready to review.
        </p>
      )}

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-muted">File</dt>
        <dd className="truncate text-ink">{fileName}</dd>
        <dt className="text-muted">Size</dt>
        <dd className="tabular-nums text-ink">{formatBytes(fileBytes)}</dd>
      </dl>

      <p className="mt-6 border-l-2 border-rule-strong pl-3 text-sm leading-relaxed text-muted">
        Check names, numbers and claims against the company&apos;s site before you send it.
      </p>
    </aside>
  );
}
