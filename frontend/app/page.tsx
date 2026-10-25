"use client";

import { useEffect, useMemo, useState } from "react";
import { useBrochureGenerator } from "@/hooks/useBrochureGenerator";
import { displayHost, downloadHtml, openHtmlInNewTab, slugify } from "@/lib/brochure";
import { SiteHeader } from "@/components/brochure/SiteHeader";
import { CropMarks } from "@/components/brochure/PrintMarks";
import { GeneratorForm } from "@/components/brochure/GeneratorForm";
import { GenerationProgress } from "@/components/brochure/GenerationProgress";
import { ResultToolbar, type Device } from "@/components/brochure/ResultToolbar";
import { SummaryPanel } from "@/components/brochure/SummaryPanel";
import { ProofPreview } from "@/components/brochure/ProofPreview";

const DELIVERABLES = [
  "A plain-language summary of what the company does",
  "Brochure copy written from the site's own content",
  "A responsive HTML file you can download and send",
];

function Deliverables({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-sm font-semibold text-ink">What you get</h2>
      <ul className="mt-3 divide-y divide-rule border-y border-rule">
        {DELIVERABLES.map((item) => (
          <li key={item} className="py-3 text-[15px] text-ink-soft">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const { generateBrochure, result, loading, error, reset, cancel } = useBrochureGenerator();

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [device, setDevice] = useState<Device>("desktop");

  const host = displayHost(submittedUrl);

  const file = useMemo(() => {
    if (!result) return null;
    return {
      name: `${slugify(result.company_name)}-brochure.html`,
      bytes: new Blob([result.html_brochure]).size,
    };
  }, [result]);

  useEffect(() => {
    if (result) window.scrollTo({ top: 0 });
  }, [result]);

  const handleGenerate = (name: string, url: string) => {
    setSubmittedUrl(url);
    generateBrochure(name, url);
  };

  const handleNew = () => {
    reset();
    setCompanyName("");
    setWebsite("");
    setDevice("desktop");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <SiteHeader />

      <main className="flex-1 overflow-x-clip">
        {result && file ? (
          /* ---------------- Result ---------------- */
          <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-8 sm:px-8 sm:pt-10">
            <ResultToolbar
              companyName={result.company_name}
              host={host}
              device={device}
              onDeviceChange={setDevice}
              onNew={handleNew}
              onDownload={() => downloadHtml(result.html_brochure, file.name)}
              onOpen={() => openHtmlInNewTab(result.html_brochure)}
            />

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[340px_minmax(0,1fr)]">
              <div className="order-2 lg:order-1">
                <SummaryPanel summary={result.summary} host={host} fileName={file.name} fileBytes={file.bytes} />
              </div>
              <div className="order-1 min-w-0 lg:order-2">
                <ProofPreview html={result.html_brochure} companyName={result.company_name} device={device} />
              </div>
            </div>
          </div>
        ) : (
          /* ---------------- Start ---------------- */
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8 sm:pt-20 lg:pt-28">
            <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-20">
              <div className="max-w-xl">
                <h1 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.022em] text-ink">
                  Any company website, set as a brochure you can send.
                </h1>
                <p className="mt-6 max-w-[34rem] text-[17px] leading-[1.6] text-ink-soft">
                  Enter a company and its website. AutoBrochure reads the site, writes the copy and lays out a
                  responsive brochure you can preview and download.
                </p>
                <Deliverables className="mt-12 hidden lg:block" />
              </div>

              {/* The proof sheet */}
              <div className="relative">
                <CropMarks />
                <div className="relative rounded-[3px] border border-rule bg-sheet p-6 shadow-sheet sm:p-9">
                  {loading ? (
                    <GenerationProgress companyName={companyName.trim()} host={host} onCancel={cancel} />
                  ) : (
                    <>
                      <h2 className="mb-6 text-[15px] font-semibold text-ink">New brochure</h2>
                      <GeneratorForm
                        companyName={companyName}
                        website={website}
                        onCompanyNameChange={setCompanyName}
                        onWebsiteChange={setWebsite}
                        onSubmit={handleGenerate}
                        serverError={error}
                      />
                    </>
                  )}
                </div>
              </div>

              <Deliverables className="lg:hidden" />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-4 py-6 text-sm text-muted sm:px-8">
          Brochures are generated from public website content. Review them before sending.
        </div>
      </footer>
    </div>
  );
}
