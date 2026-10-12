import type { ReactNode } from "react";

export function CVDownloadLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      className={className}
      href="/documents/tomas-garbarino-cv-en.pdf"
      download="Tomas-Garbarino-CV-EN.pdf"
      aria-label="Download CV in English (PDF)"
      type="application/pdf"
    >
      {children}
    </a>
  );
}
