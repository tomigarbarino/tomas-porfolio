import { useLanguage } from "../contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import { getPageFromPathname, getPagePath } from "../lib/seo";

export const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const selectLanguage = (option: "es" | "en") => {
    if (option === language) return;
    const target = getPagePath(getPageFromPathname(location.pathname), option);
    setLanguage(option);
    navigate(`${target}${location.hash}`);
  };

  return (
    <div className="language-switch" role="group" aria-label={language === "es" ? "Elegir idioma" : "Choose language"}>
      {(["es", "en"] as const).map((option) => (
        <button
          className={language === option ? "is-active" : ""}
          type="button"
          aria-pressed={language === option}
          aria-label={option === "es" ? "Español rioplatense" : "English"}
          onClick={() => selectLanguage(option)}
          key={option}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
