"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import { normalizeUrl } from "@/lib/brochure";

type Props = {
  companyName: string;
  website: string;
  onCompanyNameChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onSubmit: (companyName: string, websiteUrl: string) => void;
  serverError?: string;
};

type FieldErrors = { company?: string; website?: string };

const inputBase =
  "h-12 w-full bg-white text-[15px] text-ink placeholder:text-muted/70 outline-none";

export function GeneratorForm({
  companyName,
  website,
  onCompanyNameChange,
  onWebsiteChange,
  onSubmit,
  serverError,
}: Props) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [ready, setReady] = useState(false);
  const companyRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  // Only enable the button once React has loaded, so the browser can't
  // fall back to a native form submit (values ending up in the URL).
  useEffect(() => setReady(true), []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready) return;

    const next: FieldErrors = {};
    const url = normalizeUrl(website);

    if (!companyName.trim()) next.company = "Enter the company's name.";
    if (!url) next.website = "Enter a website address, like acme.com.";

    setErrors(next);

    if (next.company) {
      companyRef.current?.focus();
      return;
    }
    if (next.website || !url) {
      websiteRef.current?.focus();
      return;
    }

    onSubmit(companyName.trim(), url);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Company name */}
      <div>
        <label htmlFor="company" className="mb-2 block text-sm font-medium text-ink">
          Company name
        </label>
        <input
          ref={companyRef}
          id="company"
          type="text"
          autoComplete="organization"
          placeholder="Acme Corporation"
          value={companyName}
          onChange={(e) => {
            onCompanyNameChange(e.target.value);
            if (errors.company) setErrors((p) => ({ ...p, company: undefined }));
          }}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? "company-error" : undefined}
          className={`${inputBase} rounded-md border px-3.5 transition-[border-color,box-shadow] hover:border-ink/40 focus:border-ink focus:ring-4 focus:ring-ink/[0.07] ${
            errors.company ? "border-reg" : "border-rule-strong"
          }`}
        />
        {errors.company && (
          <p id="company-error" className="mt-2 text-sm text-reg">
            {errors.company}
          </p>
        )}
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="mb-2 block text-sm font-medium text-ink">
          Website
        </label>
        <div
          className={`flex items-center overflow-hidden rounded-md border bg-white transition-[border-color,box-shadow] hover:border-ink/40 focus-within:border-ink focus-within:ring-4 focus-within:ring-ink/[0.07] ${
            errors.website ? "border-reg" : "border-rule-strong"
          }`}
        >
          <span aria-hidden="true" className="select-none pl-3.5 text-[15px] text-muted">
            https://
          </span>
          <input
            ref={websiteRef}
            id="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="acme.com"
            value={website}
            onChange={(e) => {
              onWebsiteChange(e.target.value.replace(/^https?:\/\//i, ""));
              if (errors.website) setErrors((p) => ({ ...p, website: undefined }));
            }}
            aria-invalid={!!errors.website}
            aria-describedby={errors.website ? "website-error" : "website-hint"}
            className={`${inputBase} pl-0.5 pr-3.5`}
          />
        </div>
        {errors.website ? (
          <p id="website-error" className="mt-2 text-sm text-reg">
            {errors.website}
          </p>
        ) : (
          <p id="website-hint" className="mt-2 text-sm text-muted">
            The homepage works best. We read the public pages from there.
          </p>
        )}
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex gap-3 border-l-2 border-reg bg-reg/[0.05] px-4 py-3.5 animate-fade-in"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-reg" aria-hidden="true" />
          <div className="text-sm leading-relaxed">
            <p className="font-medium text-ink">Brochure not generated</p>
            <p className="mt-0.5 text-ink-soft">{serverError}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!ready}
        className="h-12 w-full rounded-md bg-ink text-[15px] font-medium text-white transition-[background-color,transform] hover:bg-ink-soft active:translate-y-px disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {ready ? "Generate brochure" : "Loading…"}
      </button>
    </form>
  );
}