import { baseLayout } from "../layouts/base";
import { badge } from "../components/badge";
import { statsStrip } from "../components/stats";
import { ctaSection } from "../components/cta";
import { portfolios } from "../data/company";
import { getTranslation, localePath } from "../i18n/index";
import type { Locale } from "../i18n/types";

function portfolioHero(locale: Locale): string {
  const t = getTranslation(locale);
  const p = t.portfolio;
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
        ">${p.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${p.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${p.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:500px;margin:0 auto;line-height:1.7;
      ">${p.heroDescription}</p>
    </div>
  </section>`;
}

function featuredProject(locale: Locale): string {
  const t        = getTranslation(locale);
  const featured = portfolios[0]!;
  const dp       = t.data.portfolios[0]!;
  const techBadges = featured.tech.map(tech => badge(tech, "sky")).join(" ");

  return `
  <section class="section">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:700;
          color:#FED41D;letter-spacing:0.08em;text-transform:uppercase;
        ">${t.ui.featuredProject}</span>
      </div>
      <div style="
        border:3px solid #1A1A2E;border-radius:20px;
        box-shadow:8px 8px 0 #FED41D;overflow:hidden;
        display:grid;grid-template-columns:1fr 1fr;
      " class="featured-grid">
        <div style="
          background:linear-gradient(135deg,#1A1A2E 0%,#2D2D44 100%);
          padding:3rem 2.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.5rem;
          border-right:3px solid #FED41D;
        ">
          <div style="font-family:'Bangers',cursive;font-size:5rem;line-height:1;">🏦</div>
          <h2 style="font-family:'Bangers',cursive;font-size:2.5rem;letter-spacing:0.05em;color:#FED41D;line-height:1.1;margin:0;">
            ${featured.title}
          </h2>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">${techBadges}</div>
          <div style="
            display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;
            background:#FED41D;border:2px solid #1A1A2E;border-radius:10px;width:fit-content;
          ">
            <span style="font-family:'Bangers',cursive;font-size:1rem;color:#1A1A2E;letter-spacing:0.04em;">
              📊 ${dp.result}
            </span>
          </div>
        </div>
        <div style="padding:3rem 2.5rem;background:#FFFEF7;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;">
          ${badge(featured.category, "yellow")}
          <h3 style="font-family:'Bangers',cursive;font-size:1.5rem;letter-spacing:0.04em;color:#1A1A2E;margin:0;">${featured.title}</h3>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2D2D44;line-height:1.7;margin:0;">${dp.description}</p>
          <div style="padding:1rem;background:#FED41D18;border:2px solid #FED41D;border-radius:12px;">
            <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#1A1A2E;">
              🗓 ${featured.year} · ${dp.result}
            </span>
          </div>
        </div>
      </div>
    </div>
    <style>
      @media(max-width:768px){
        .featured-grid{grid-template-columns:1fr !important;}
        .featured-grid > div:first-child{border-right:none !important;border-bottom:3px solid #FED41D;}
      }
    </style>
  </section>`;
}

function portfolioGrid(locale: Locale): string {
  const t    = getTranslation(locale);
  const rest = portfolios.slice(1);
  const dps  = t.data.portfolios.slice(1);

  const items = rest.map((p, i) => {
    const dp = dps[i]!;
    const techBadges = p.tech.slice(0, 3).map(tech => badge(tech, "ink")).join(" ");
    return `
    <div class="reveal reveal-d${i + 1} comic-card" style="
      background:#FFFEF7;border:3px solid #1A1A2E;border-radius:16px;
      box-shadow:5px 5px 0 #1A1A2E;overflow:hidden;
      display:flex;flex-direction:column;transition:transform 0.15s,box-shadow 0.15s;
    ">
      <div style="
        padding:1.75rem 1.75rem 1.25rem;
        background:linear-gradient(135deg,#1A1A2E,#2D2D44);
        border-bottom:3px solid #FED41D;
      ">
        <div style="font-family:'Fredoka',sans-serif;font-size:0.78rem;font-weight:600;color:#FED41DAA;letter-spacing:0.06em;margin-bottom:0.5rem;">${p.year}</div>
        <h3 style="font-family:'Bangers',cursive;font-size:1.5rem;letter-spacing:0.04em;color:#FED41D;margin-bottom:0.5rem;">${p.title}</h3>
        <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">${techBadges}</div>
      </div>
      <div style="padding:1.25rem 1.75rem 1.5rem;display:flex;flex-direction:column;gap:0.75rem;flex:1;">
        ${badge(p.category, "yellow")}
        <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44;line-height:1.6;margin:0;flex:1;">${dp.description}</p>
        <div style="
          padding:0.6rem 0.9rem;background:#FED41D18;
          border:2px solid #FED41D66;border-radius:8px;
          font-family:'Fredoka',sans-serif;font-size:0.82rem;font-weight:600;color:#1A1A2E;
        ">📊 ${dp.result}</div>
      </div>
    </div>`;
  }).join("");

  return `
  <section class="section" style="background:#F5F5EC;">
    <div class="container">
      <h2 class="reveal" style="
        font-family:'Bangers',cursive;font-size:clamp(1.8rem,4vw,2.5rem);
        letter-spacing:0.05em;color:#1A1A2E;margin-bottom:2rem;
      ">${t.ui.otherProjects}</h2>
      <div class="grid-3" style="gap:1.5rem;">${items}</div>
    </div>
  </section>`;
}

function portfolioStats(locale: Locale): string {
  const t = getTranslation(locale);
  const p = t.portfolio;
  return `
  <section class="section-sm" style="background:#1A1A2E;">
    <div class="container">
      ${statsStrip([
        { value: "500",  label: p.stats[0]!.label, suffix: "+" },
        { value: "200",  label: p.stats[1]!.label, suffix: "+" },
        { value: "99.9", label: p.stats[2]!.label, suffix: "%" },
        { value: "4.9",  label: p.stats[3]!.label, suffix: "/5" },
      ], true)}
    </div>
  </section>`;
}

export function portfolioPage(locale: Locale): string {
  const t = getTranslation(locale);
  const p = t.portfolio;

  const content = `
    ${portfolioHero(locale)}
    <div class="comic-divider"></div>
    ${featuredProject(locale)}
    ${portfolioGrid(locale)}
    ${portfolioStats(locale)}
    ${ctaSection({
      heading:        p.ctaHeading,
      subheading:     p.ctaSubheading,
      primaryLabel:   p.ctaPrimary,
      primaryHref:    localePath(locale, "/contact"),
      secondaryLabel: p.ctaSecondary,
      secondaryHref:  localePath(locale, "/services"),
    })}
  `;

  return baseLayout({
    title:       t.seo.portfolioTitle,
    description: t.seo.portfolioDescription,
    activePage:  localePath(locale, "/portfolio"),
    locale,
    content,
  });
}
