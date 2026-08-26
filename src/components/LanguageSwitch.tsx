import { useLanguage } from "../contexts/LanguageContext";

export const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switch" role="group" aria-label={language === "es" ? "Elegir idioma" : "Choose language"}>
      {(["es", "en"] as const).map((option) => (
        <button
          className={language === option ? "is-active" : ""}
          type="button"
          aria-pressed={language === option}
          aria-label={option === "es" ? "Español rioplatense" : "English"}
          onClick={() => setLanguage(option)}
          key={option}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
