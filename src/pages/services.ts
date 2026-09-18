import { baseLayout } from "../layouts/base";
import { card } from "../components/card";
import { ctaSection } from "../components/cta";
import { services } from "../data/company";
import { getTranslation, localePath } from "../i18n/index";
import type { Locale } from "../i18n/types";

function servicesHero(locale: Locale): string {
  const t = getTranslation(locale);
  const s = t.services;
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;
  ">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;border-radius:999px;
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
        ">${s.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${s.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${s.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:520px;margin:0 auto;line-height:1.7;
      ">${s.heroDescription}</p>
    </div>
  </section>`;
}

function servicesGrid(locale: Locale): string {
  const t  = getTranslation(locale);
  const ds = t.data.services;

  const cards = services.map((s, i) => {
    const d = ds[i]!;
    return `<div class="reveal reveal-d${(i % 3) + 1}">
      ${card({ title: d.title, body: d.description, icon: s.icon, badge: d.detail })}
    </div>`;
  }).join("");

  return `
  <section class="section">
    <div class="container">
      <div class="grid-3">${cards}</div>
    </div>
  </section>`;
}

function processSection(locale: Locale): string {
  const t  = getTranslation(locale);
  const s  = t.services;

  const items = s.steps.map((step, i) => `
    <div class="reveal reveal-d${i + 1}" style="
      display:flex;gap:1.25rem;align-items:flex-start;padding:1.5rem;
      border:3px solid #1A1A2E;border-radius:16px;
      background:#FFFEF7;box-shadow:4px 4px 0 #FED41D;
    ">
      <div style="
        min-width:52px;height:52px;background:#FED41D;
        border:3px solid #1A1A2E;border-radius:12px;
        display:flex;align-items:center;justify-content:center;
        font-family:'Bangers',cursive;font-size:1.3rem;letter-spacing:0.05em;color:#1A1A2E;flex-shrink:0;
      ">${step.num}</div>
      <div>
        <h3 style="font-family:'Bangers',cursive;font-size:1.3rem;letter-spacing:0.04em;color:#1A1A2E;margin-bottom:0.4rem;">${step.title}</h3>
        <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44;line-height:1.6;margin:0;">${step.body}</p>
      </div>
    </div>`).join("");

  return `
  <section class="section" style="background:#1A1A2E;">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#FED41D;margin-bottom:0.75rem;
        ">${s.processHeading}</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#FFFEF799;max-width:440px;margin:0 auto;">
          ${s.processSubheading}
        </p>
      </div>
      <div class="grid-2" style="gap:1.25rem;">${items}</div>
    </div>
  </section>`;
}

function techStackSection(locale: Locale): string {
  const t = getTranslation(locale);
  const s = t.services;

  const stacks = [
    { cat: "Backend",       items: ["Go", "Node.js", "Python", "Rust"] },
    { cat: "Frontend",      items: ["React", "Next.js", "TypeScript", "Tailwind"] },
    { cat: "Mobile",        items: ["React Native", "Swift", "Kotlin", "Flutter"] },
    { cat: "Cloud & Infra", items: ["AWS", "GCP", "Kubernetes", "Terraform"] },
    { cat: "Data",          items: ["PostgreSQL", "MongoDB", "Kafka", "Redis"] },
    { cat: "AI/ML",         items: ["PyTorch", "LangChain", "Hugging Face", "MLflow"] },
  ];

  const groups = stacks.map((st, i) => `
    <div class="reveal reveal-d${(i % 3) + 1}" style="
      padding:1.25rem;border:3px solid #FED41D33;border-radius:14px;background:#FFFEF708;
    ">
      <h4 style="font-family:'Bangers',cursive;font-size:1rem;letter-spacing:0.06em;color:#FED41D;margin-bottom:0.75rem;">${st.cat}</h4>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
        ${st.items.map(it => `
          <span style="
            padding:0.2rem 0.7rem;background:#FED41D18;
            border:1.5px solid #FED41D44;border-radius:999px;
            font-family:'Fredoka',sans-serif;font-size:0.8rem;font-weight:500;color:#FFFEF7CC;
          ">${it}</span>`).join("")}
      </div>
    </div>`).join("");

  return `
  <section class="section">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.75rem;
        ">${s.techHeading}</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#2D2D44AA;max-width:400px;margin:0 auto;">
          ${s.techSubheading}
        </p>
      </div>
      <div class="grid-3" style="gap:1.25rem;">${groups}</div>
    </div>
  </section>`;
}

export function servicesPage(locale: Locale): string {
  const t = getTranslation(locale);
  const s = t.services;

  const content = `
    ${servicesHero(locale)}
    <div class="comic-divider"></div>
    ${servicesGrid(locale)}
    ${processSection(locale)}
    <div class="comic-divider"></div>
    ${techStackSection(locale)}
    ${ctaSection({
      heading:        s.ctaHeading,
      subheading:     s.ctaSubheading,
      primaryLabel:   s.ctaPrimary,
      primaryHref:    localePath(locale, "/contact"),
      secondaryLabel: s.ctaSecondary,
      secondaryHref:  localePath(locale, "/portfolio"),
    })}
  `;

  return baseLayout({
    title:       t.seo.servicesTitle,
    description: t.seo.servicesDescription,
    activePage:  localePath(locale, "/services"),
    locale,
    content,
  });
}
