"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft, Check, Download, ExternalLink, Monitor, Smartphone, Tablet, type LucideIcon,
} from "lucide-react";

export type Device = "desktop" | "tablet" | "mobile";

const DEVICES: { id: Device; label: string; Icon: LucideIcon }[] = [
  { id: "desktop", label: "Desktop", Icon: Monitor },
  { id: "tablet", label: "Tablet", Icon: Tablet },
  { id: "mobile", label: "Mobile", Icon: Smartphone },
];

type Props = {
  companyName: string;
  host: string;
  device: Device;
  onDeviceChange: (device: Device) => void;
  onNew: () => void;
  onDownload: () => void;
  onOpen: () => void;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function ResultToolbar({ companyName, host, device, onDeviceChange, onNew, onDownload, onOpen }: Props) {
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!downloaded) return;
    const t = setTimeout(() => setDownloaded(false), 2200);
    return () => clearTimeout(t);
  }, [downloaded]);

  return (
    <div className="flex flex-col gap-6 border-b border-rule pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <button
          type="button"
          onClick={onNew}
          className={`-ml-2 mb-5 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:text-ink ${focusRing}`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          New brochure
        </button>
        <h1 className="truncate font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-ink">
          {companyName}
        </h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5 font-medium text-ok">
            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Brochure ready
          </span>
          <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
          Generated from {host}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Preview width */}
        <div
          role="group"
          aria-label="Preview width"
          className="inline-flex rounded-md border border-rule-strong bg-white p-0.5"
        >
          {DEVICES.map(({ id, label, Icon }) => {
            const active = device === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onDeviceChange(id)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-[5px] px-3 text-sm font-medium transition-colors ${focusRing} ${
                  active ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/[0.05] hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sr-only sm:hidden">{label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpen}
          className={`inline-flex h-10 items-center gap-2 rounded-md border border-rule-strong bg-white px-4 text-sm font-medium text-ink transition-colors hover:border-ink/40 ${focusRing}`}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Open in new tab
        </button>

        <button
          type="button"
          onClick={() => {
            onDownload();
            setDownloaded(true);
          }}
          className={`inline-flex h-10 min-w-[10.5rem] items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-white transition-[background-color,transform] hover:bg-ink-soft active:translate-y-px ${focusRing}`}
        >
          {downloaded ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Downloaded
            </>
          ) : (
            <>
              <Download className="h-4 w-4" aria-hidden="true" />
              Download HTML
            </>
          )}
        </button>
        <span className="sr-only" aria-live="polite">
          {downloaded ? "Brochure downloaded" : ""}
        </span>
      </div>
    </div>
  );
}
