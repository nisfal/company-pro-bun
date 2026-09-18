import { baseLayout } from "../layouts/base";
import { statsStrip } from "../components/stats";
import { ctaSection } from "../components/cta";
import { badge } from "../components/badge";
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

  // Trading card flip style
  const EMOJIS = ["🛒", "📚", "🚛", "💡"];

  const cards = rest.map((p, i) => {
    const dp      = dps[i]!;
    const emoji   = EMOJIS[i] ?? "⭐";
    const techStr = p.tech.join(" · ");
    return `
    <div class="reveal reveal-d${i + 1}" style="perspective:800px;">
      <div class="trade-card" onclick="this.classList.toggle('flipped')" style="
        position:relative;
        width:100%;padding-top:140%;
        transform-style:preserve-3d;
        transition:transform 0.55s cubic-bezier(.4,0,.2,1);
        cursor:pointer;
      ">
        <!-- FRONT -->
        <div style="
          position:absolute;inset:0;
          backface-visibility:hidden;-webkit-backface-visibility:hidden;
          background:linear-gradient(135deg,#1A1A2E,#2D2D44);
          border:3px solid #FED41D;border-radius:16px;
          box-shadow:5px 5px 0 #FED41D44;
          display:flex;flex-direction:column;align-items:center;
          justify-content:center;gap:1rem;padding:1.5rem;
          text-align:center;
        ">
          <div style="
            font-size:3.5rem;line-height:1;
            filter:drop-shadow(0 4px 8px #00000088);
          ">${emoji}</div>
          <h3 style="
            font-family:'Bangers',cursive;font-size:1.5rem;
            letter-spacing:0.05em;color:#FED41D;margin:0;line-height:1.2;
          ">${p.title}</h3>
          <div style="
            padding:0.3rem 0.9rem;
            background:#FED41D22;border:1.5px solid #FED41D44;border-radius:999px;
            font-family:'Fredoka',sans-serif;font-size:0.78rem;color:#FED41DAA;
          ">${p.category}</div>
          <div style="
            margin-top:auto;
            font-family:'Fredoka',sans-serif;font-size:0.75rem;color:#FFFEF755;
            letter-spacing:0.04em;
          ">${locale === "en" ? "tap to flip ↻" : "ketuk untuk balik ↻"}</div>
        </div>

        <!-- BACK -->
        <div style="
          position:absolute;inset:0;
          backface-visibility:hidden;-webkit-backface-visibility:hidden;
          transform:rotateY(180deg);
          background:#FFFEF7;
          border:3px solid #1A1A2E;border-radius:16px;
          box-shadow:5px 5px 0 #1A1A2E;
          display:flex;flex-direction:column;gap:0.75rem;
          padding:1.5rem;
          overflow:hidden;
        ">
          <div style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#1A1A2E;">${p.title}</div>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.82rem;color:#2D2D44;line-height:1.5;margin:0;flex:1;">${dp.description}</p>
          <div style="
            padding:0.5rem 0.75rem;
            background:#1A1A2E;border-radius:8px;
            font-family:'Fredoka',sans-serif;font-size:0.78rem;
            color:#FED41D;font-weight:600;
          ">🛠 ${techStr}</div>
          <div style="
            padding:0.5rem 0.75rem;
            background:#FED41D18;border:2px solid #FED41D66;border-radius:8px;
            font-family:'Fredoka',sans-serif;font-size:0.78rem;
            color:#1A1A2E;font-weight:700;
          ">📊 ${dp.result}</div>
          <div style="
            font-family:'Fredoka',sans-serif;font-size:0.7rem;
            color:#1A1A2E88;text-align:right;
          ">${p.year}</div>
        </div>
      </div>
    </div>`;
  }).join("");

  return `
  <section class="section" style="background:#F5F5EC;">
    <div class="container">
      <h2 class="reveal" style="
        font-family:'Bangers',cursive;font-size:clamp(1.8rem,4vw,2.5rem);
        letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.5rem;
      ">${t.ui.otherProjects}</h2>
      <p class="reveal reveal-d1" style="
        font-family:'Fredoka',sans-serif;font-size:0.88rem;color:#2D2D44AA;margin-bottom:2rem;
      ">${locale === "en" ? "Tap a card to flip and reveal the tech stack." : "Ketuk kartu untuk balik dan lihat tech stack-nya."}</p>
      <div class="grid-3" style="gap:1.5rem;">${cards}</div>
    </div>
  </section>

  <style>
    .trade-card.flipped { transform: rotateY(180deg); }
  </style>`;
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
