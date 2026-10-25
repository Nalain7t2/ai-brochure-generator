"use client";

import { useState } from "react";
import { CropMarks, RegistrationMark } from "./PrintMarks";
import type { Device } from "./ResultToolbar";

const WIDTH: Record<Device, number | null> = { desktop: null, tablet: 768, mobile: 390 };

type Props = {
  html: string;
  companyName: string;
  device: Device;
};

export function ProofPreview({ html, companyName, device }: Props) {
  const [loaded, setLoaded] = useState(false);
  const width = WIDTH[device];

  return (
    <section
      aria-label="Brochure preview"
      className="rounded-[4px] border border-rule bg-table px-3 py-6 sm:px-12 sm:py-14"
    >
      <div
        className="mx-auto transition-[max-width] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
        style={{ maxWidth: width ? `${width}px` : "100%" }}
      >
        <div className="relative animate-sheet-in">
          <CropMarks />
          <RegistrationMark
            size={18}
            className="absolute -top-10 left-1/2 hidden -translate-x-1/2 text-reg sm:block"
          />

          <div className="relative h-[72vh] min-h-[520px] overflow-hidden bg-sheet shadow-sheet lg:h-[780px]">
            {!loaded && (
              <div aria-hidden="true" className="absolute inset-0 space-y-4 p-8">
                <div className="h-40 animate-pulse rounded-sm bg-ink/[0.05]" />
                <div className="h-5 w-2/3 animate-pulse rounded-sm bg-ink/[0.05]" />
                <div className="h-4 w-1/2 animate-pulse rounded-sm bg-ink/[0.04]" />
                <div className="h-4 w-3/5 animate-pulse rounded-sm bg-ink/[0.04]" />
              </div>
            )}
            <iframe
              srcDoc={html}
              title={`Brochure preview for ${companyName}`}
              onLoad={() => setLoaded(true)}
              // No allow-scripts: generated HTML can't run code inside the app.
              // If your brochures need JS, add allow-scripts but never alongside allow-same-origin.
              sandbox="allow-popups allow-popups-to-escape-sandbox"
              className={`h-full w-full border-0 bg-white transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm tabular-nums text-muted sm:mt-10">
        {width ? `Previewing at ${width} px wide` : "Previewing at full width"}
      </p>
    </section>
  );
}
