import type { Metadata } from "next";
import Link from "next/link";
import { MotionPreference } from "@/components/MotionPreference";
import { PacketRecoveryLoader } from "@/components/PacketRecoveryLoader";
import { SiteHeader } from "@/components/SiteHeader";
import "@/components/secret-404.css";

export const metadata: Metadata = {
  title: "404 — Off the grid",
  description: "This route is missing. Recover four lost signals, or return to the portfolio.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <MotionPreference>
      <a className="skip-link" href="#lost-signals">Skip to packet recovery</a>
      <div className="secret404">
        <SiteHeader context="case" backHref="/#top" />
        <main className="secret404__body" id="missing-page">
          <div className="secret404__intro">
            <p className="secret404__eyebrow">404 / Page not found</p>
            <p className="secret404__number" aria-hidden="true">404</p>
            <h1><span className="sr-only">404. </span><span>Off the </span><span>grid.</span></h1>
            <p className="secret404__lead">This route is missing.<br className="secret404__desktop-break" /> Your curiosity is working.</p>
            <p className="secret404__invite">Recover four lost signals.<br />There is a small secret on the other side.</p>
          </div>
          <section id="lost-signals" className="secret404__activity" aria-label="Lost and found packet game" tabIndex={-1}>
            <PacketRecoveryLoader />
            <noscript><p className="secret404__no-script">The optional packet game needs JavaScript. You can always <Link href="/">return to the portfolio</Link>.</p></noscript>
          </section>
        </main>
        <footer className="secret404__footer"><span>A small detour / Secret 01</span><span className="secret404__signature" aria-hidden="true">TG_</span></footer>
      </div>
    </MotionPreference>
  );
}
