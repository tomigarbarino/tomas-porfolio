"use client";

import { useMotionPreference } from "./MotionPreference";
import "./site-header.css";

type SiteHeaderProps = {
  context?: "home" | "case";
};

const navigation = [
  { label: "Work", hash: "work" },
  { label: "Story", hash: "story" },
  { label: "Contact", hash: "contact" },
] as const;

export function SiteHeader({ context = "home" }: SiteHeaderProps) {
  const { paused, setPaused, reducedMotion } = useMotionPreference();

  return (
    <header className={`site-header site-header--${context}`}>
      <div className="site-header__bar">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Native section navigation avoids the router accumulating hash fragments. */}
        <a className="site-header__identity" href="/#top">
          <span>Tomás Garbarino</span>
          <span>Product Engineer / Applied AI</span>
        </a>
        <nav className="site-header__navigation" aria-label="Main navigation">
          {navigation.map(item => (
            <a key={item.hash} href={`/#${item.hash}`}>
              {item.label}
            </a>
          ))}
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
        // eslint-disable-next-line @next/next/no-html-link-for-pages -- Keep the return-to-section link on the same native fragment path.
        <a className="site-header__back" href="/#trainly">
          ← Back to portfolio
        </a>
      )}
    </header>
  );
}

export default SiteHeader;
