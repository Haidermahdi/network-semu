import { Language } from '../types';

/**
 * Pick Arabic or English content. When lang is 'en', prefer English and never
 * silently fall back to Arabic if an English value exists (including empty string).
 */
export function pickLocale<T>(lang: Language, ar: T, en?: T | null): T {
  if (lang === 'en') {
    if (en !== undefined && en !== null && en !== ('' as unknown as T)) {
      return en;
    }
  }
  return ar;
}

/**
 * Pick a string; when English is missing, return a safe English placeholder
 * instead of Arabic so the UI never leaks Arabic in EN mode.
 */
export function pickText(
  lang: Language,
  ar: string | undefined | null,
  en?: string | undefined | null,
  fallbackEn = ''
): string {
  if (lang === 'en') {
    if (en && en.trim()) return en;
    if (fallbackEn) return fallbackEn;
    // Last resort: strip Arabic characters from the Arabic source
    if (ar) {
      const cleaned = ar.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, '').replace(/\s{2,}/g, ' ').trim();
      if (cleaned.length > 2) return cleaned;
    }
    return fallbackEn || '—';
  }
  return ar || '';
}

/**
 * Pick a string array with the same English-safe rules.
 */
export function pickTextList(
  lang: Language,
  ar?: string[] | null,
  en?: string[] | null,
  fallbackEn: string[] = []
): string[] {
  if (lang === 'en') {
    if (en && en.length > 0) return en;
    return fallbackEn;
  }
  return ar || [];
}

/**
 * Localize estimated read-time strings like "7 دقائق" / "8 دقيقة".
 */
export function formatReadTime(lang: Language, value?: string | null): string {
  if (!value) return '';
  if (lang === 'ar') return value;
  return value
    .replace(/\s*دقائق?/g, ' min')
    .replace(/\s*د\b/g, ' min')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
