"use client";

import Link from "next/link";
import { recordMissionEvent } from "@/lib/visitor-missions";

export function SecretArcadeLink() {
  return <Link className="contact-signature" href="/404" prefetch={false} aria-label="TG_ — open the secret 404 game" onClick={event => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) recordMissionEvent("arcade-found");
  }}>TG_</Link>;
}
