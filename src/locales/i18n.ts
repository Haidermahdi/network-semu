import arTranslations from './ar.json';
import enTranslations from './en.json';
import { Language } from '../types';

export const TRANSLATIONS = {
  ar: arTranslations,
  en: enTranslations,
};

export type TranslationSchema = typeof arTranslations;

/**
 * Safely retrieve a nested value using a dot-notated key path.
 * e.g., getTranslationValue(lang, 'interactiveLab.title')
 */
export function getTranslationValue(lang: Language, path: string, params?: Record<string, string | number>): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.ar;
  const keys = path.split('.');
  let result: any = dictionary;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      // Fallback to English if missing in current dictionary
      let fallback: any = TRANSLATIONS.en;
      for (const fKey of keys) {
        if (fallback && typeof fallback === 'object' && fKey in fallback) {
          fallback = fallback[fKey];
        } else {
          return path;
        }
      }
      result = fallback;
      break;
    }
  }

  if (typeof result !== 'string') {
    return path;
  }

  if (params) {
    let replaced = result;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      replaced = replaced.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
    }
    return replaced;
  }

  return result;
}

/**
 * Returns the entire translations object for the requested language.
 */
export function getTranslations(lang: Language): TranslationSchema {
  return TRANSLATIONS[lang] || TRANSLATIONS.ar;
}
