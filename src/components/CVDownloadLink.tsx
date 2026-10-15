import type { ReactNode } from "react";

export function CVDownloadLink({ className, children, ariaLabel = "Download CV in English (PDF)" }: { className?: string; children: ReactNode; ariaLabel?: string }) {
  return (
    <a
      className={className}
      href="/documents/tomas-garbarino-cv-en.pdf"
      download="Tomas-Garbarino-CV-EN.pdf"
      aria-label={ariaLabel}
      type="application/pdf"
    >
      {children}
    </a>
  );
}
