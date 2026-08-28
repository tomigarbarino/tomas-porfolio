import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getLanguageFromPathname } from "../lib/seo";

export type Language = "es" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isEnglish: boolean;
  isSpanish: boolean;
};

const STORAGE_KEY = "portfolio-language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "es";
  return getLanguageFromPathname(window.location.pathname);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

export const LanguageProvider = ({ children, initialLanguage }: { children: ReactNode; initialLanguage?: Language }) => {
  const [language, setLanguage] = useState<Language>(() => initialLanguage ?? getInitialLanguage());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "es" ? "es-AR" : "en";
  }, [language]);

  useEffect(() => {
    const syncLanguageWithUrl = () => setLanguage(getLanguageFromPathname(window.location.pathname));
    window.addEventListener("popstate", syncLanguageWithUrl);
    return () => window.removeEventListener("popstate", syncLanguageWithUrl);
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === "es" ? "en" : "es"),
    isEnglish: language === "en",
    isSpanish: language === "es",
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
