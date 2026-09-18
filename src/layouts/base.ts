import { getNavLinks, SEO } from "../lib/constants";
import { company } from "../data/company";
import { getTranslation, localePath, stripLocale } from "../i18n/index";
import type { Locale } from "../i18n/types";
import type { LayoutOptions } from "../lib/types";
import {
  chalkboardScript,
  themeToggleStyles,
  themeToggleScript,
  themeToggleButton,
  beerLoadingBar,
  donutConfettiScript,
  konamiEasterEggScript,
} from "../lib/scripts";

// ─── Language Switcher ─────────────────────────────────────────────────────────

function langSwitcher(locale: Locale, currentPath: string): string {
  const t        = getTranslation(locale);
  const pagePath = stripLocale(currentPath);
  const otherLocale: Locale = locale === "id" ? "en" : "id";
  const switchHref  = localePath(otherLocale, pagePath);
  const flag        = locale === "id" ? "🇮🇩" : "🇺🇸";
  const switchFlag  = locale === "id" ? "🇺🇸" : "🇮🇩";

  return `
  <a href="${switchHref}" title="Switch language" style="
    display:inline-flex;align-items:center;gap:0.35rem;
    padding:0.35rem 0.75rem;
    background:#FED41D22;
    border:2px solid #FED41D66;
    border-radius:8px;
    font-family:'Fredoka',sans-serif;
    font-size:0.85rem;font-weight:700;
    color:#FED41D;
    text-decoration:none;
    transition:background 0.15s,border-color 0.15s;
    white-space:nowrap;
  "
  onmouseover="this.style.background='#FED41D33';this.style.borderColor='#FED41D'"
  onmouseout="this.style.background='#FED41D22';this.style.borderColor='#FED41D66'"
  aria-label="Switch to ${otherLocale === 'en' ? 'English' : 'Bahasa Indonesia'}"
  >
    <span style="font-size:1rem;line-height:1;">${flag}</span>
    <span style="opacity:0.5;font-size:0.7rem;">→</span>
    <span style="font-size:1rem;line-height:1;">${switchFlag}</span>
    <span>${t.nav.switchLang}</span>
  </a>`;
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function navbar(locale: Locale, activePage: string): string {
  const t       = getTranslation(locale);
  const links   = getNavLinks(locale);
  const ctaHref = localePath(locale, "/contact");

  const desktopLinks = links.map(({ href, label }) => {
    const isActive = activePage === href;
    return `
    <a href="${href}" style="
      font-family:'Fredoka',sans-serif;
      font-size:1rem;font-weight:600;
      text-decoration:none;
      padding:0.4rem 1rem;
      border-radius:8px;
      border:2px solid ${isActive ? "#1A1A2E" : "transparent"};
      background:${isActive ? "#FED41D" : "transparent"};
      color:${isActive ? "#1A1A2E" : "#FFFEF7"};
      box-shadow:${isActive ? "3px 3px 0px #1A1A2E" : "none"};
      transition:background 0.15s,color 0.15s,border-color 0.15s,box-shadow 0.15s;
      white-space:nowrap;
    "
    onmouseover="if(!this.dataset.active){this.style.background='#FED41D33';this.style.color='#FED41D';}"
    onmouseout="if(!this.dataset.active){this.style.background='transparent';this.style.color='#FFFEF7';}"
    ${isActive ? 'data-active="true"' : ""}
    >${label}</a>`;
  }).join("");

  const mobileLinks = links.map(({ href, label }) => {
    const isActive = activePage === href;
    return `
    <a href="${href}" style="
      font-family:'Fredoka',sans-serif;font-size:1.1rem;font-weight:600;
      text-decoration:none;padding:0.75rem 1.25rem;border-radius:10px;
      border:2px solid ${isActive ? "#1A1A2E" : "#FED41D33"};
      background:${isActive ? "#FED41D" : "transparent"};
      color:${isActive ? "#1A1A2E" : "#FFFEF7"};
      display:block;
    ">${label}</a>`;
  }).join("");

  return `
  <nav id="navbar" style="
    position:fixed;top:0;left:0;right:0;z-index:1000;
    background:#1A1A2E;
    border-bottom:3px solid #FED41D;
    transition:box-shadow 0.2s;
  ">
    <div style="max-width:1200px;margin:0 auto;padding:0 1.5rem;height:64px;
      display:flex;align-items:center;justify-content:space-between;gap:1rem;">

      <!-- Logo -->
      <a href="${localePath(locale, "/")}" style="text-decoration:none;display:flex;align-items:center;gap:0.5rem;flex-shrink:0;">
        <div style="
          width:38px;height:38px;background:#FED41D;
          border:3px solid #FED41D;border-radius:10px;
          box-shadow:3px 3px 0px #F5C400;
          display:flex;align-items:center;justify-content:center;
          font-family:'Bangers',cursive;font-size:1.2rem;color:#1A1A2E;
        ">ST</div>
        <span style="font-family:'Bangers',cursive;font-size:1.4rem;letter-spacing:0.06em;color:#FFFEF7;">${company.name}</span>
      </a>

      <!-- Desktop links + switcher + CTA -->
      <div id="nav-links" style="display:flex;align-items:center;gap:0.25rem;">
        ${desktopLinks}
        <div style="width:1px;height:24px;background:#FFFEF722;margin:0 0.5rem;"></div>
        ${themeToggleButton()}
        <div style="width:1px;height:24px;background:#FFFEF722;margin:0 0.5rem;"></div>
        ${langSwitcher(locale, activePage)}
        <a href="${ctaHref}" style="
          margin-left:0.5rem;
          padding:0.4rem 1.25rem;
          background:#FED41D;color:#1A1A2E;
          border:2px solid #1A1A2E;border-radius:8px;
          font-family:'Fredoka',sans-serif;font-size:0.95rem;font-weight:700;
          text-decoration:none;box-shadow:3px 3px 0px #1A1A2E;
          transition:transform 0.1s,box-shadow 0.1s;white-space:nowrap;
        "
        onmouseover="this.style.transform='translate(-1px,-1px)';this.style.boxShadow='4px 4px 0px #1A1A2E'"
        onmouseout="this.style.transform='';this.style.boxShadow='3px 3px 0px #1A1A2E'"
        >${t.nav.cta}</a>
      </div>

      <!-- Mobile hamburger -->
      <button id="menu-btn" aria-label="Menu" style="
        display:none;background:none;
        border:2px solid #FED41D;border-radius:8px;
        padding:0.4rem 0.6rem;cursor:pointer;
        color:#FED41D;font-size:1.3rem;line-height:1;
      ">☰</button>
    </div>

    <!-- Mobile drawer -->
    <div id="mobile-menu" style="
      display:none;flex-direction:column;gap:0.5rem;
      padding:1rem 1.5rem 1.5rem;
      border-top:2px solid #FED41D33;background:#1A1A2E;
    ">
      ${mobileLinks}
      <div style="padding-top:0.5rem;display:flex;align-items:center;gap:0.75rem;">
        ${langSwitcher(locale, activePage)}
        <a href="${ctaHref}" style="
          flex:1;text-align:center;
          padding:0.75rem;background:#FED41D;color:#1A1A2E;
          border:2px solid #1A1A2E;border-radius:10px;
          font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
          text-decoration:none;
        ">${t.nav.cta}</a>
      </div>
    </div>
  </nav>`;
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function footer(locale: Locale): string {
  const t     = getTranslation(locale);
  const links = getNavLinks(locale);
  const year  = new Date().getFullYear();

  const socials = [
    { label: "LinkedIn",  href: company.social.linkedin  },
    { label: "Twitter",   href: company.social.twitter   },
    { label: "GitHub",    href: company.social.github    },
    { label: "Instagram", href: company.social.instagram },
  ].map(({ label, href }) => `
    <a href="${href}" target="_blank" rel="noopener noreferrer" style="
      font-family:'Fredoka',sans-serif;font-size:0.9rem;font-weight:500;
      color:#87CEEB;text-decoration:none;transition:color 0.15s;
    "
    onmouseover="this.style.color='#FED41D'"
    onmouseout="this.style.color='#87CEEB'"
    >${label}</a>`).join("");

  const footerLinks = links.map(({ href, label }) => `
    <a href="${href}" style="
      font-family:'Fredoka',sans-serif;font-size:0.9rem;
      color:#FFFEF799;text-decoration:none;transition:color 0.15s;
    "
    onmouseover="this.style.color='#FED41D'"
    onmouseout="this.style.color='#FFFEF799'"
    >${label}</a>`).join("");

  return `
  <footer style="
    background:#1A1A2E;border-top:4px solid #FED41D;
    padding:3rem 1.5rem 2rem;margin-top:auto;
  ">
    <div style="max-width:1200px;margin:0 auto;">
      <div style="
        display:grid;grid-template-columns:2fr 1fr 1fr;gap:2.5rem;
        padding-bottom:2rem;border-bottom:2px solid #FED41D22;
      " class="footer-grid">

        <!-- Brand -->
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <a href="${localePath(locale, "/")}" style="text-decoration:none;display:flex;align-items:center;gap:0.5rem;">
            <div style="
              width:36px;height:36px;background:#FED41D;
              border:3px solid #FED41D;border-radius:8px;
              box-shadow:3px 3px 0px #F5C400;
              display:flex;align-items:center;justify-content:center;
              font-family:'Bangers',cursive;font-size:1.1rem;color:#1A1A2E;
            ">ST</div>
            <span style="font-family:'Bangers',cursive;font-size:1.3rem;letter-spacing:0.05em;color:#FFFEF7;">${company.name}</span>
          </a>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;line-height:1.6;margin:0;max-width:280px;">
            ${company.description}
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;">${socials}</div>
        </div>

        <!-- Nav -->
        <div>
          <h4 style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#FED41D;margin:0 0 1rem;">
            ${t.footer.pagesHeading}
          </h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">${footerLinks}</div>
        </div>

        <!-- Contact -->
        <div>
          <h4 style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#FED41D;margin:0 0 1rem;">
            ${t.footer.contactHeading}
          </h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <span style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;">${company.email}</span>
            <span style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;">${company.phone}</span>
            <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FFFEF766;line-height:1.5;">${company.address}</span>
          </div>
        </div>
      </div>

      <div style="
        padding-top:1.5rem;
        display:flex;justify-content:space-between;align-items:center;
        flex-wrap:wrap;gap:1rem;
      ">
        <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FFFEF755;">
          © ${year} ${company.name}. ${t.footer.rights}
        </span>
        <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FED41D88;">
          ${t.footer.builtWith}
        </span>
      </div>
    </div>
  </footer>`;
}

// ─── Global CSS ────────────────────────────────────────────────────────────────

function globalStyles(): string {
  return `
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body {
      background: #FFFEF7; color: #1A1A2E;
      min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden;
    }
    .comic-card:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0px #1A1A2E !important;
    }
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-d1 { transition-delay: 0.05s; }
    .reveal-d2 { transition-delay: 0.10s; }
    .reveal-d3 { transition-delay: 0.15s; }
    .reveal-d4 { transition-delay: 0.20s; }
    .reveal-d5 { transition-delay: 0.25s; }
    .reveal-d6 { transition-delay: 0.30s; }
    main { padding-top: 64px; flex: 1; }
    .section    { padding: 5rem 1.5rem; }
    .section-sm { padding: 3rem 1.5rem; }
    .container  { max-width: 1200px; margin: 0 auto; }
    .comic-divider {
      height: 4px;
      background: repeating-linear-gradient(
        90deg, #FED41D 0px, #FED41D 20px, #1A1A2E 20px, #1A1A2E 24px
      );
    }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    @media (max-width: 768px) {
      #nav-links { display: none !important; }
      #menu-btn  { display: flex !important; }
      .footer-grid { grid-template-columns: 1fr !important; }
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr !important; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
    }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #1A1A2E; }
    ::-webkit-scrollbar-thumb { background: #FED41D; border-radius: 4px; }
  </style>`;
}

// ─── Global Scripts ─────────────────────────────────────────────────────────────

function globalScripts(): string {
  return `
  <script>
    (function() {
      var nav = document.getElementById('navbar');
      window.addEventListener('scroll', function() {
        nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px #00000066' : 'none';
      }, { passive: true });
    })();
    (function() {
      var btn  = document.getElementById('menu-btn');
      var menu = document.getElementById('mobile-menu');
      if (!btn || !menu) return;
      btn.addEventListener('click', function() {
        var open = menu.style.display === 'flex';
        menu.style.display = open ? 'none' : 'flex';
        btn.textContent = open ? '☰' : '✕';
      });
    })();
    (function() {
      var els = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)) {
        els.forEach(function(el) { el.classList.add('visible'); });
        return;
      }
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function(el) { obs.observe(el); });
    })();
    (function() {
      function animateCounter(el) {
        var raw    = el.dataset.target || el.textContent;
        var suffix = el.dataset.suffix || '';
        var num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
        var isFloat = raw.includes('.');
        if (isNaN(num)) return;
        var duration = 1800, startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var ease     = 1 - Math.pow(1 - progress, 3);
          var current  = num * ease;
          el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
      var counterEls = document.querySelectorAll('[data-counter]');
      if (!('IntersectionObserver' in window)) { counterEls.forEach(animateCounter); return; }
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counterEls.forEach(function(el) { obs.observe(el); });
    })();
  </script>`;
}

// ─── Base Layout ───────────────────────────────────────────────────────────────

export function baseLayout({ title, description, activePage, locale, content }: LayoutOptions): string {
  const t         = getTranslation(locale);
  const desc      = description ?? SEO.defaultDescription;
  const fullTitle = `${title} — ${SEO.siteName}`;
  const htmlLang  = locale === "en" ? "en" : "id";

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${fullTitle}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="${SEO.twitterHandle}" />
  <!-- Alternate language links for SEO -->
  <link rel="alternate" hreflang="id" href="/id${stripLocale(activePage) === "/" ? "" : stripLocale(activePage)}" />
  <link rel="alternate" hreflang="en" href="/en${stripLocale(activePage) === "/" ? "" : stripLocale(activePage)}" />
  <link rel="alternate" hreflang="x-default" href="${stripLocale(activePage)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${themeToggleStyles()}
  <!-- Apply saved theme immediately to prevent flash -->
  <script>(function(){var m=document.cookie.match('(?:^|; )spt_theme=([^;]*)');if(m&&decodeURIComponent(m[1])==='night'){document.documentElement.setAttribute('data-theme','night');}})();</script>
  ${globalStyles()}
</head>
<body>
  ${navbar(locale, activePage)}
  ${beerLoadingBar()}
  <main>
    ${content}
  </main>
  ${footer(locale)}
  ${globalScripts()}
  ${donutConfettiScript()}
  ${konamiEasterEggScript()}
  ${themeToggleScript()}
  ${chalkboardScript()}
</body>
</html>`;
}
