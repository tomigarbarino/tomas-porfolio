"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMotionPreference } from "./MotionPreference";
import { CVDownloadLink } from "./CVDownloadLink";
import "./site-header.css";

type SiteHeaderProps = {
  context?: "home" | "case";
  backHref?: string;
};

const navigation = [
  { label: "Case studies", hash: "work" },
  { label: "Story", hash: "story" },
  { label: "Contact", hash: "contact" },
] as const;

function HeaderLink({ context, children, ...props }: { context: "home" | "case"; href: string; className?: string; children: ReactNode }) {
  // Preserve native fragments on home; use the prepared home route from a case.
  return context === "case" ? <Link {...props} prefetch={true}>{children}</Link> : <a {...props}>{children}</a>;
}

export function SiteHeader({ context = "home", backHref = "/#trainly" }: SiteHeaderProps) {
  const { paused, setPaused, reducedMotion } = useMotionPreference();

  return (
    <header className={`site-header site-header--${context}`}>
      <div className="site-header__bar">
        <HeaderLink context={context} className="site-header__identity" href="/#top">
          <span>Tomás Garbarino</span>
          <span>Product Engineer / Applied AI</span>
        </HeaderLink>
        <nav className="site-header__navigation" aria-label="Main navigation">
          {navigation.map(item => (
            <HeaderLink context={context} key={item.hash} href={`/#${item.hash}`} className={item.hash === "work" ? "site-header__cases" : undefined}>
              {item.hash === "work" ? <><span className="site-header__case-label--full">Case studies</span><span className="site-header__case-label--short">Cases</span></> : item.label}
            </HeaderLink>
          ))}
          <CVDownloadLink className="site-header__cv">CV <span aria-hidden="true">↓</span></CVDownloadLink>
        </nav>
        <button
          className="site-header__motion motion-toggle"
          type="button"
          disabled={reducedMotion}
          onClick={() => setPaused(!paused)}
        >
          {reducedMotion ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}
        </button>
      </div>
      {context === "case" && (
        <HeaderLink context={context} className="site-header__back" href={backHref}>
          ← Back to portfolio
        </HeaderLink>
      )}
    </header>
  );
}

export default SiteHeader;
