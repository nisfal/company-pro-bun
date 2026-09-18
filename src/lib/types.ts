// ─── Data Types ───────────────────────────────────────────────────────────────

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  founded: string;
  employees: string;
  projects: string;
  clients: string;
  email: string;
  phone: string;
  address: string;
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
    github: string;
  };
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  detail: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  initials: string;
  bio: string;
  funFact: string;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface Portfolio {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  year: string;
  result: string;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

export type { Locale, Translation } from "../i18n/types";

// ─── Component Props Types ─────────────────────────────────────────────────────

export interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface LayoutOptions {
  title: string;
  description?: string;
  activePage: string;
  locale: import("../i18n/types").Locale;
  content: string;
}

export interface CtaProps {
  heading: string;
  subheading: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface CardProps {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  footer?: string;
}
