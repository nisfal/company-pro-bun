import type { Locale, Translation } from "./types";
import { id } from "./id";
import { en } from "./en";

// ─── Registry ─────────────────────────────────────────────────────────────────

const translations: Record<Locale, Translation> = { id, en };

export const SUPPORTED_LOCALES: Locale[] = ["id", "en"];
export const DEFAULT_LOCALE: Locale = "id";

// ─── Core helpers ─────────────────────────────────────────────────────────────

export function getTranslation(locale: Locale): Translation {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}

/**
 * Detect locale from URL path prefix: /en/... → "en", /id/... → "id".
 * Falls back to DEFAULT_LOCALE.
 */
export function detectLocale(path: string): Locale {
  const segment = path.split("/")[1] as string;
  if ((SUPPORTED_LOCALES as string[]).includes(segment)) {
    return segment as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Strip locale prefix from path.
 * "/en/services" → "/services", "/services" → "/services"
 */
export function stripLocale(path: string): string {
  const segment = path.split("/")[1] as string;
  if ((SUPPORTED_LOCALES as string[]).includes(segment)) {
    return path.slice(segment.length + 1) || "/";
  }
  return path;
}

/**
 * Prefix path with locale. Does not double-prefix.
 * localePath("en", "/services") → "/en/services"
 * localePath("id", "/")        → "/"
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  const clean = stripLocale(path);
  return `/${locale}${clean === "/" ? "" : clean}`;
}

/**
 * Simple interpolation: replace {key} tokens in a string.
 * t("Since {founded}", { founded: "2015" }) → "Since 2015"
 */
export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

export type { Locale, Translation };
