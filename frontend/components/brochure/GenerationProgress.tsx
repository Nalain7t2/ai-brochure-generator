"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

// The backend doesn't stream progress yet, so steps advance on a timer
// and hold on the last one until the response arrives.
const STEP_SECONDS = 6;

type Props = {
  companyName: string;
  host: string;
  onCancel: () => void;
};

function formatElapsed(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function GenerationProgress({ companyName, host, onCancel }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const steps = [
    `Reading ${host}`,
    "Picking out what the company does",
    "Writing the brochure copy",
    "Laying out the pages",
  ];
  const current = Math.min(Math.floor(elapsed / STEP_SECONDS), steps.length - 1);

  return (
    <div className="animate-fade-in">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[15px] font-medium text-ink">Making a brochure for {companyName}</p>
        <span className="shrink-0 text-sm tabular-nums text-muted" aria-label={`${elapsed} seconds elapsed`}>
          {formatElapsed(elapsed)}
        </span>
      </div>

      <ol className="mt-6 space-y-0" aria-label="Generation steps">
        {steps.map((label, i) => {
          const state = i < current ? "done" : i === current ? "active" : "pending";
          return (
            <li
              key={label}
              className="relative flex items-start gap-3.5 pb-5 last:pb-0"
              aria-current={state === "active" ? "step" : undefined}
            >
              {/* connector line */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-[9px] top-[22px] w-px ${
                    state === "done" ? "bg-ink/40" : "bg-rule"
                  }`}
                />
              )}

              <span aria-hidden="true" className="relative mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center">
                {state === "done" && (
                  <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-ink text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
                {state === "active" && (
                  <span className="h-[19px] w-[19px] animate-spin rounded-full border-[1.5px] border-reg/25 border-t-reg" />
                )}
                {state === "pending" && (
                  <span className="h-[19px] w-[19px] rounded-full border-[1.5px] border-rule-strong" />
                )}
              </span>

              <span
                className={`text-[15px] leading-6 ${
                  state === "pending" ? "text-muted" : "text-ink"
                } ${state === "active" ? "font-medium" : ""}`}
              >
                {label}
                <span className="sr-only">
                  {state === "done" ? " (done)" : state === "active" ? " (in progress)" : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="sr-only" aria-live="polite">
        {steps[current]}
      </p>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-rule pt-5">
        <p className="text-sm text-muted">This usually takes under a minute.</p>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/[0.05] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
