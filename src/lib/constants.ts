import type { NavLink } from "./types";

// ─── Server ────────────────────────────────────────────────────────────────────

export const PORT = Number(process.env.PORT) || 3000;

// ─── Navigation ────────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Beranda" },
  { href: "/services", label: "Layanan" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
];

// ─── Theme — Simpsons-inspired ─────────────────────────────────────────────────

export const THEME = {
  // Primary palette
  yellow: "#FED41D",
  yellowDeep: "#F5C400",
  sky: "#87CEEB",
  skyDeep: "#5BA8D4",
  ink: "#1A1A2E",
  inkLight: "#2D2D44",
  white: "#FFFEF7",
  // Accent
  coralRed: "#FF6B6B",
  grassGreen: "#4CAF50",
  // Comic outline
  outlineWidth: "3px",
  outlineColor: "#1A1A2E",
  // Shadow (comic style — hard offset)
  shadowSm: "3px 3px 0px #1A1A2E",
  shadowMd: "5px 5px 0px #1A1A2E",
  shadowLg: "8px 8px 0px #1A1A2E",
  shadowYellow: "5px 5px 0px #F5C400",
} as const;

// ─── SEO Defaults ──────────────────────────────────────────────────────────────

export const SEO = {
  siteName: "NusaTech Solutions",
  defaultDescription:
    "Solusi digital kelas dunia — product engineering, cloud/DevOps, mobile, AI, dan security untuk startup hingga enterprise.",
  defaultOgImage: "/og-image.png",
  twitterHandle: "@nusatech_id",
} as const;
