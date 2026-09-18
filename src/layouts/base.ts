import { NAV_LINKS, SEO } from "../lib/constants";
import { company } from "../data/company";

export interface LayoutOptions {
  title: string;
  description?: string;
  activePage: string;
  content: string;
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function navbar(activePage: string): string {
  const links = NAV_LINKS.map(({ href, label }) => {
    const isActive = activePage === href;
    return `
      <a href="${href}" style="
        font-family:'Fredoka',sans-serif;
        font-size:1rem;
        font-weight:600;
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
      onmouseover="if(!this.classList.contains('active')){this.style.background='#FED41D33';this.style.color='#FED41D';}"
      onmouseout="if(!this.classList.contains('active')){this.style.background='transparent';this.style.color='#FFFEF7';}"
      ${isActive ? 'class="active"' : ""}
      >${label}</a>`;
  }).join("");

  const mobileLinks = NAV_LINKS.map(({ href, label }) => {
    const isActive = activePage === href;
    return `
      <a href="${href}" style="
        font-family:'Fredoka',sans-serif;
        font-size:1.1rem;
        font-weight:600;
        text-decoration:none;
        padding:0.75rem 1.25rem;
        border-radius:10px;
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
    <div style="max-width:1200px;margin:0 auto;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;">

      <!-- Logo -->
      <a href="/" style="text-decoration:none;display:flex;align-items:center;gap:0.5rem;">
        <div style="
          width:38px;height:38px;
          background:#FED41D;
          border:3px solid #FED41D;
          border-radius:10px;
          box-shadow:3px 3px 0px #F5C400;
          display:flex;align-items:center;justify-content:center;
          font-family:'Bangers',cursive;
          font-size:1.2rem;
          color:#1A1A2E;
        ">NT</div>
        <span style="
          font-family:'Bangers',cursive;
          font-size:1.4rem;
          letter-spacing:0.06em;
          color:#FFFEF7;
        ">${company.name}</span>
      </a>

      <!-- Desktop links -->
      <div id="nav-links" style="display:flex;align-items:center;gap:0.25rem;">
        ${links}
        <a href="/contact" style="
          margin-left:0.75rem;
          padding:0.4rem 1.25rem;
          background:#FED41D;
          color:#1A1A2E;
          border:2px solid #1A1A2E;
          border-radius:8px;
          font-family:'Fredoka',sans-serif;
          font-size:0.95rem;
          font-weight:700;
          text-decoration:none;
          box-shadow:3px 3px 0px #1A1A2E;
          transition:transform 0.1s,box-shadow 0.1s;
          white-space:nowrap;
        "
        onmouseover="this.style.transform='translate(-1px,-1px)';this.style.boxShadow='4px 4px 0px #1A1A2E'"
        onmouseout="this.style.transform='';this.style.boxShadow='3px 3px 0px #1A1A2E'"
        >Hubungi Kami</a>
      </div>

      <!-- Mobile hamburger -->
      <button id="menu-btn" aria-label="Menu" style="
        display:none;
        background:none;border:2px solid #FED41D;
        border-radius:8px;padding:0.4rem 0.6rem;
        cursor:pointer;color:#FED41D;font-size:1.3rem;
        line-height:1;
      ">☰</button>
    </div>

    <!-- Mobile drawer -->
    <div id="mobile-menu" style="
      display:none;
      flex-direction:column;
      gap:0.5rem;
      padding:1rem 1.5rem 1.5rem;
      border-top:2px solid #FED41D33;
      background:#1A1A2E;
    ">
      ${mobileLinks}
    </div>
  </nav>`;
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function footer(): string {
  const year = new Date().getFullYear();
  const socials = [
    { label: "LinkedIn", href: company.social.linkedin },
    { label: "Twitter",  href: company.social.twitter  },
    { label: "GitHub",   href: company.social.github   },
    { label: "Instagram",href: company.social.instagram},
  ].map(({ label, href }) => `
    <a href="${href}" target="_blank" rel="noopener noreferrer" style="
      font-family:'Fredoka',sans-serif;
      font-size:0.9rem;
      font-weight:500;
      color:#87CEEB;
      text-decoration:none;
      transition:color 0.15s;
    "
    onmouseover="this.style.color='#FED41D'"
    onmouseout="this.style.color='#87CEEB'"
    >${label}</a>`).join("");

  const footerLinks = NAV_LINKS.map(({ href, label }) => `
    <a href="${href}" style="
      font-family:'Fredoka',sans-serif;
      font-size:0.9rem;
      color:#FFFEF799;
      text-decoration:none;
      transition:color 0.15s;
    "
    onmouseover="this.style.color='#FED41D'"
    onmouseout="this.style.color='#FFFEF799'"
    >${label}</a>`).join("");

  return `
  <footer style="
    background:#1A1A2E;
    border-top:4px solid #FED41D;
    padding:3rem 1.5rem 2rem;
    margin-top:auto;
  ">
    <div style="max-width:1200px;margin:0 auto;">
      <div style="
        display:grid;
        grid-template-columns:2fr 1fr 1fr;
        gap:2.5rem;
        padding-bottom:2rem;
        border-bottom:2px solid #FED41D22;
      " class="footer-grid">

        <!-- Brand -->
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <div style="
              width:36px;height:36px;
              background:#FED41D;
              border:3px solid #FED41D;
              border-radius:8px;
              box-shadow:3px 3px 0px #F5C400;
              display:flex;align-items:center;justify-content:center;
              font-family:'Bangers',cursive;font-size:1.1rem;color:#1A1A2E;
            ">NT</div>
            <span style="font-family:'Bangers',cursive;font-size:1.3rem;letter-spacing:0.05em;color:#FFFEF7;">${company.name}</span>
          </div>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;line-height:1.6;margin:0;max-width:280px;">
            ${company.description}
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;">${socials}</div>
        </div>

        <!-- Nav -->
        <div>
          <h4 style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#FED41D;margin:0 0 1rem;">Halaman</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">${footerLinks}</div>
        </div>

        <!-- Contact -->
        <div>
          <h4 style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#FED41D;margin:0 0 1rem;">Kontak</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <span style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;">${company.email}</span>
            <span style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#FFFEF799;">${company.phone}</span>
            <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FFFEF766;line-height:1.5;">${company.address}</span>
          </div>
        </div>
      </div>

      <div style="
        padding-top:1.5rem;
        display:flex;
        justify-content:space-between;
        align-items:center;
        flex-wrap:wrap;
        gap:1rem;
      ">
        <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FFFEF755;">
          © ${year} ${company.name}. All rights reserved.
        </span>
        <span style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FED41D88;">
          Built with ☀️ Bun + Hono
        </span>
      </div>
    </div>
  </footer>`;
}

// ─── Global CSS ────────────────────────────────────────────────────────────────

function globalStyles(): string {
  return `
  <style>
    /* Reset & base */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body {
      background: #FFFEF7;
      color: #1A1A2E;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Comic card hover */
    .comic-card:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0px #1A1A2E !important;
    }

    /* Scroll reveal */
    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-d1 { transition-delay: 0.05s; }
    .reveal-d2 { transition-delay: 0.10s; }
    .reveal-d3 { transition-delay: 0.15s; }
    .reveal-d4 { transition-delay: 0.20s; }
    .reveal-d5 { transition-delay: 0.25s; }
    .reveal-d6 { transition-delay: 0.30s; }

    /* Page main — leave room for fixed navbar */
    main { padding-top: 64px; flex: 1; }

    /* Section spacing */
    .section { padding: 5rem 1.5rem; }
    .section-sm { padding: 3rem 1.5rem; }
    .container { max-width: 1200px; margin: 0 auto; }

    /* Comic separator */
    .comic-divider {
      height: 4px;
      background: repeating-linear-gradient(
        90deg, #FED41D 0px, #FED41D 20px, #1A1A2E 20px, #1A1A2E 24px
      );
    }

    /* Responsive grid helpers */
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }

    /* Responsive navbar & footer */
    @media (max-width: 768px) {
      #nav-links { display: none !important; }
      #menu-btn  { display: flex !important; }
      .footer-grid {
        grid-template-columns: 1fr !important;
      }
      .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr !important;
      }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #1A1A2E; }
    ::-webkit-scrollbar-thumb { background: #FED41D; border-radius: 4px; }
  </style>`;
}

// ─── Global Scripts ─────────────────────────────────────────────────────────────

function globalScripts(): string {
  return `
  <script>
    // ── Navbar scroll shadow
    (function() {
      var nav = document.getElementById('navbar');
      window.addEventListener('scroll', function() {
        nav.style.boxShadow = window.scrollY > 10
          ? '0 4px 24px #00000066'
          : 'none';
      }, { passive: true });
    })();

    // ── Mobile menu toggle
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

    // ── Scroll reveal
    (function() {
      var els = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)) {
        els.forEach(function(el) { el.classList.add('visible'); });
        return;
      }
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(function(el) { obs.observe(el); });
    })();

    // ── Counter animation
    (function() {
      function animateCounter(el) {
        var raw    = el.dataset.target || el.textContent;
        var suffix = el.dataset.suffix || '';
        var num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
        var isFloat = raw.includes('.');
        if (isNaN(num)) return;
        var start    = 0;
        var duration = 1800;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var ease     = 1 - Math.pow(1 - progress, 3);
          var current  = start + (num - start) * ease;
          el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
      var counterEls = document.querySelectorAll('[data-counter]');
      if (!('IntersectionObserver' in window)) {
        counterEls.forEach(animateCounter);
        return;
      }
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

export function baseLayout({ title, description, activePage, content }: LayoutOptions): string {
  const desc = description ?? SEO.defaultDescription;
  const fullTitle = `${title} — ${SEO.siteName}`;

  return `<!DOCTYPE html>
<html lang="id">
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
  <!-- Google Fonts: Bangers (display) + Fredoka (body) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${globalStyles()}
</head>
<body>
  ${navbar(activePage)}
  <main>
    ${content}
  </main>
  ${footer()}
  ${globalScripts()}
</body>
</html>`;
}
