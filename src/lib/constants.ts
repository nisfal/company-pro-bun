import type { NavLink } from "./types";
import type { Locale } from "../i18n/types";
import { getTranslation, localePath } from "../i18n/index";

// ─── Server ────────────────────────────────────────────────────────────────────

export const PORT = Number(process.env.PORT) || 3000;

// ─── Navigation — locale-aware ─────────────────────────────────────────────────

export function getNavLinks(locale: Locale): NavLink[] {
  const t = getTranslation(locale);
  return [
    { href: localePath(locale, "/"),          label: t.nav.home      },
    { href: localePath(locale, "/services"),  label: t.nav.services  },
    { href: localePath(locale, "/portfolio"), label: t.nav.portfolio },
    { href: localePath(locale, "/about"),     label: t.nav.about     },
    { href: localePath(locale, "/contact"),   label: t.nav.contact   },
    { href: localePath(locale, "/faq"),       label: locale === "en" ? "FAQ" : "FAQ"   },
  ];
}

// ─── Theme — Simpsons-inspired ─────────────────────────────────────────────────

export const THEME = {
  yellow:       "#FED41D",
  yellowDeep:   "#F5C400",
  sky:          "#87CEEB",
  skyDeep:      "#5BA8D4",
  ink:          "#1A1A2E",
  inkLight:     "#2D2D44",
  white:        "#FFFEF7",
  coralRed:     "#FF6B6B",
  grassGreen:   "#4CAF50",
  outlineWidth: "3px",
  outlineColor: "#1A1A2E",
  shadowSm:     "3px 3px 0px #1A1A2E",
  shadowMd:     "5px 5px 0px #1A1A2E",
  shadowLg:     "8px 8px 0px #1A1A2E",
  shadowYellow: "5px 5px 0px #F5C400",
} as const;

// ─── SEO Defaults ──────────────────────────────────────────────────────────────

export const SEO = {
  siteName:           "Simptecho",
  defaultDescription: "Solusi digital kelas Springfield — product engineering, cloud/DevOps, mobile, AI, dan security untuk startup hingga enterprise.",
  defaultOgImage:     "/og-image.png",
  twitterHandle:      "@simptecho_id",
} as const;
