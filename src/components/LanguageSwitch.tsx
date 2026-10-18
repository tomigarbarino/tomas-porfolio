"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { languagePaths } from "@/i18n/routes";
import "./language-switch.css";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => { window.removeEventListener("hashchange", callback); window.removeEventListener("popstate", callback); };
}

export function LanguageSwitch() {
  const pathname = usePathname();
  const fragment = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  const paths = languagePaths(pathname);
  const spanish = pathname === "/es" || pathname.startsWith("/es/");
  return <nav className="language-switch" aria-label={spanish ? "Idioma" : "Language"}>
    {(["en", "es"] as const).map(locale => <a key={locale} href={`${paths[locale]}${fragment}`} hrefLang={locale} lang={locale} aria-current={(spanish ? "es" : "en") === locale ? "page" : undefined} aria-label={locale === "en" ? "Read this page in English" : "Leer esta página en español"}>{locale.toUpperCase()}</a>)}
  </nav>;
}
