"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useMotionPreference } from "./MotionPreference";
import { CVDownloadLink } from "./CVDownloadLink";
import { LanguageSwitch } from "./LanguageSwitch";
import "./site-header.css";

type SiteHeaderProps = {
  context?: "home" | "case" | "writing";
  backHref?: string;
  backLabel?: string;
};

const navigation = [
  { label: "Work", href: "/#work", hash: "work" },
  { label: "Writing & Research", href: "/writing", hash: "writing" },
  { label: "Story", href: "/#story", hash: "story" },
  { label: "Contact", href: "/#contact", hash: "contact" },
] as const;

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => { window.removeEventListener("hashchange", callback); window.removeEventListener("popstate", callback); };
}

export function SiteHeader({ context = "home", backHref = "/#work", backLabel = "Back to portfolio" }: SiteHeaderProps) {
  const { paused, setPaused, reducedMotion } = useMotionPreference();
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1), () => "");
  const active = pathname.startsWith("/writing") ? "writing" : context === "case" ? "work" : hash;

  return (
    <header className={`site-header site-header--${context}`}>
      <div className="site-header__bar">
        <Link className="site-header__identity" href="/#top">
          <span>Tomás Garbarino</span>
          <span>Product Engineer / Applied AI</span>
        </Link>
        <nav className="site-header__navigation" aria-label="Main navigation">
          {navigation.map(item => {
            const content = item.hash === "writing" ? <span className="site-header__writing-label"><span>Writing &amp;</span>{" "}<span>Research</span></span> : item.label;
            const current = active === item.hash ? (item.hash === "writing" ? "page" : "location") : undefined;
            return context === "home" && item.hash !== "writing" ? <a key={item.hash} href={item.href} aria-current={current}>{content}</a> : <Link key={item.hash} href={item.href} aria-current={current}>{content}</Link>;
          })}
          <CVDownloadLink className="site-header__cv">CV <span aria-hidden="true">↓</span></CVDownloadLink>
        </nav>
        <div className="site-header__tools"><LanguageSwitch /><button
          className="site-header__motion motion-toggle"
          type="button"
          disabled={reducedMotion}
          onClick={() => setPaused(!paused)}
        >
          {reducedMotion ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}
        </button></div>
      </div>
      {context !== "home" && (
        <Link className="site-header__back" href={backHref}>
          ← {backLabel}
        </Link>
      )}
    </header>
  );
}

export default SiteHeader;
