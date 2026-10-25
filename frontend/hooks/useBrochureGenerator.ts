"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const TIMEOUT_MS = 120_000;

export type BrochureResult = {
  company_name: string;
  summary: string;
  html_brochure: string;
};

type ApiErrorBody = {
  error?: string;
  details?: Record<string, string | string[]>;
};

function readError(body: ApiErrorBody | null, status: number): string {
  if (body?.details) {
    const messages = Object.values(body.details).flat().filter(Boolean);
    if (messages.length) return messages.join(" ");
  }
  if (body?.error) return body.error;
  if (status === 429) return "Too many requests right now. Wait a minute, then try again.";
  if (status >= 500) return `The brochure service hit an error (${status}). Try again in a moment.`;
  return `The request was rejected (${status}). Check the company name and website, then try again.`;
}

function isBrochureResult(data: unknown): data is BrochureResult {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.company_name === "string" &&
    typeof d.summary === "string" &&
    typeof d.html_brochure === "string" &&
    d.html_brochure.length > 0
  );
}

export function useBrochureGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrochureResult | null>(null);
  const [error, setError] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  // Abort any in-flight request if the page unmounts
  useEffect(() => () => controllerRef.current?.abort(), []);

  const generateBrochure = useCallback(async (companyName: string, websiteUrl: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, TIMEOUT_MS);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/generate-brochure/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: companyName, website_url: websiteUrl }),
        signal: controller.signal,
      });

      // Some failures (proxy errors, HTML error pages) aren't JSON
      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) throw new Error(readError(data as ApiErrorBody | null, response.status));
      if (!isBrochureResult(data)) {
        throw new Error("The service returned an incomplete brochure. Try generating it again.");
      }

      setResult(data);
    } catch (err) {
      if (timedOut) {
        setError("Generation took longer than 2 minutes and was stopped. Try again, or try a smaller site.");
      } else if (controller.signal.aborted) {
        return; // cancelled by the user or replaced by a newer request
      } else if (err instanceof TypeError) {
        setError(`Couldn't reach the brochure service at ${API_URL}. Check that the backend is running, then try again.`);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      }
    } finally {
      clearTimeout(timer);
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
    setResult(null);
    setError("");
  }, []);

  return { generateBrochure, result, loading, error, reset, cancel };
}
