export type Locale = "id" | "en";

/**
 * Master translation interface.
 * Every key must be implemented in BOTH id.ts and en.ts.
 */
export interface Translation {
  locale: Locale;

  // ── Navigation
  nav: {
    home: string;
    services: string;
    portfolio: string;
    about: string;
    contact: string;
    cta: string;         // navbar right-side CTA button
    switchLang: string;  // language switcher label
  };

  // ── Footer
  footer: {
    pagesHeading: string;
    contactHeading: string;
    builtWith: string;
    rights: string;
  };

  // ── Common UI
  ui: {
    learnMore: string;
    viewAll: string;
    sendMessage: string;
    sending: string;
    backHome: string;
    year: string;
    featuredProject: string;
    otherProjects: string;
    readMore: string;
  };

  // ── Home page
  home: {
    heroBadge: string;
    heroHeadline1: string;
    heroHeadline2: string;
    heroDescription: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    servicesHeading: string;
    servicesSubheading: string;
    servicesCtaLabel: string;
    whyHeading: string;
    whySubheading: string;
    whyCtaLabel: string;
    whyPoints: Array<{ icon: string; title: string; body: string }>;
    testimonialsHeading: string;
    testimonialsSubheading: string;
    ctaHeading: string;
    ctaSubheading: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Array<{ label: string }>;
  };

  // ── Services page
  services: {
    badge: string;
    heroHeadline1: string;
    heroHeadline2: string;
    heroDescription: string;
    processHeading: string;
    processSubheading: string;
    steps: Array<{ num: string; title: string; body: string }>;
    techHeading: string;
    techSubheading: string;
    ctaHeading: string;
    ctaSubheading: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };

  // ── Portfolio page
  portfolio: {
    badge: string;
    heroHeadline1: string;
    heroHeadline2: string;
    heroDescription: string;
    ctaHeading: string;
    ctaSubheading: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Array<{ label: string }>;
  };

  // ── About page
  about: {
    badge: string;
    heroHeadline1: string;
    heroHeadline2: string;
    heroDescription: string;
    storyHeading: string;
    timeline: Array<{ year: string; event: string }>;
    storyParagraphs: [string, string, string];
    teamHeading: string;
    teamSubheading: string;
    valuesHeading: string;
    values: Array<{ icon: string; title: string; body: string }>;
    ctaHeading: string;
    ctaSubheading: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Array<{ label: string }>;
  };

  // ── Contact page
  contact: {
    badge: string;
    heroHeadline1: string;
    heroHeadline2: string;
    heroDescription: string;
    formHeading: string;
    formSubheading: string;
    fields: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      company: string;
      companyPlaceholder: string;
      service: string;
      servicePlaceholder: string;
      serviceOptions: string[];
      message: string;
      messagePlaceholder: string;
    };
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
    infoAddress: string;
    infoEmail: string;
    infoPhone: string;
    socialHeading: string;
  };

  // ── 404 page
  notFound: {
    code: string;
    message: string;
    cta: string;
  };

  // ── SEO
  seo: {
    homeTitle: string;
    homeDescription: string;
    servicesTitle: string;
    servicesDescription: string;
    portfolioTitle: string;
    portfolioDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    contactTitle: string;
    contactDescription: string;
  };

  // ── Data overrides — translateable content fields
  data: {
    services: Array<{ title: string; description: string; detail: string }>;
    team: Array<{ bio: string; funFact: string }>;
    testimonials: Array<{ text: string }>;
    portfolios: Array<{ description: string; result: string }>;
  };
}
