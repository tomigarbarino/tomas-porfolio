"use client";

export function QuickProfileButton() {
  return <button type="button" aria-haspopup="dialog" onClick={() => window.dispatchEvent(new CustomEvent("tg-portfolio-dialog", { detail: "profile" }))}>Quick profile</button>;
}
