import { en } from './en';
import { es } from './es';

export const translations = {
  en,
  es
};

export const getTranslation = (language) => {
  return translations[language] || translations.en;
};
