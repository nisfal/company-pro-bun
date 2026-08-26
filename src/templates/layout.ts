export const layout = (title: string, content: string, activePage: string = "home") => `
<!DOCTYPE html>
<html lang="id" class="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — NusaTech</title>
  <meta name="description" content="NusaTech — tim teknologi Jakarta yang obsesif soal kualitas. Web, mobile, cloud, AI. 9 tahun, 500+ proyek." />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    /* ── Reset & Base ─────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
      background: #fafafa;
      color: #111;
      -webkit-font-smoothing: antialiased;
    }
    code, .mono { font-family: 'Geist Mono', ui-monospace, monospace; }

    /* ── Design tokens ────────────────────────────── */
    :root {
      --ink:       #0f0f0f;
      --ink-2:     #3a3a3a;
      --ink-3:     #717171;
      --surface:   #fafafa;
      --surface-2: #f3f3f0;
      --surface-3: #e8e8e4;
      --accent:    #16a34a;        /* single accent: forest green */
      --accent-dk: #15803d;
      --accent-bg: #f0fdf4;
      --radius:    6px;            /* one radius system */
      --radius-lg: 12px;
      --nav-h:     64px;
    }

    /* ── Typography ───────────────────────────────── */
    h1, h2, h3, h4 { color: var(--ink); letter-spacing: -0.025em; line-height: 1.1; font-weight: 800; }
    p { color: var(--ink-2); line-height: 1.65; }

    /* ── Utility classes ──────────────────────────── */
    .container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
    .container-sm { max-width: 860px; margin: 0 auto; padding: 0 2rem; }

    .accent-text { color: var(--accent); }

    /* single inline label — small mono caps, rationed: max 1 per 3 sections */
    .label {
      font-family: 'Geist Mono', monospace;
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink-3);
    }

    /* ── Navbar ───────────────────────────────────── */
    #nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: var(--nav-h);
      display: flex; align-items: center;
      transition: background 0.25s, border-color 0.25s, box-shadow 0.2s;
      border-bottom: 1px solid transparent;
    }
    #nav.scrolled {
      background: rgba(250,250,250,0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom-color: var(--surface-3);
      box-shadow: 0 1px 0 rgba(0,0,0,0.04);
    }
    #nav .inner {
      max-width: 1280px; margin: 0 auto; padding: 0 2rem;
      width: 100%;
      display: flex; align-items: center; justify-content: space-between; gap: 2rem;
    }
    .nav-logo {
      display: flex; align-items: center; gap: 0.5rem;
      font-weight: 800; font-size: 17px; letter-spacing: -0.03em;
      color: var(--ink); text-decoration: none;
    }
    .nav-logo-mark {
      width: 28px; height: 28px; border-radius: var(--radius);
      background: var(--ink); display: flex; align-items: center; justify-content: center;
      color: #fafafa; font-size: 13px; font-weight: 900; font-family: 'Geist Mono', monospace;
      flex-shrink: 0;
    }
    .nav-links {
      display: flex; align-items: center; gap: 0.25rem; list-style: none;
    }
    .nav-links a {
      font-size: 13.5px; font-weight: 500; color: var(--ink-3);
      text-decoration: none; padding: 0.4rem 0.75rem; border-radius: var(--radius);
      transition: color 0.15s, background 0.15s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--ink); background: var(--surface-2);
    }
    .nav-cta {
      font-size: 13px; font-weight: 600;
      background: var(--ink); color: #fafafa;
      padding: 0.5rem 1.1rem; border-radius: var(--radius);
      text-decoration: none;
      transition: opacity 0.15s, transform 0.15s;
      white-space: nowrap;
    }
    .nav-cta:hover { opacity: 0.85; transform: translateY(-1px); }
    .nav-mobile-btn {
      display: none; background: none; border: none; cursor: pointer;
      width: 36px; height: 36px; align-items: center; justify-content: center;
      border-radius: var(--radius); transition: background 0.15s; color: var(--ink);
    }
    .nav-mobile-btn:hover { background: var(--surface-2); }
    #mobile-menu {
      display: none; position: fixed; top: var(--nav-h); left: 0; right: 0;
      background: rgba(250,250,250,0.98); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--surface-3);
      padding: 1rem 2rem 1.5rem; z-index: 99;
      flex-direction: column; gap: 0.25rem;
    }
    #mobile-menu.open { display: flex; }
    #mobile-menu a {
      font-size: 14px; font-weight: 500; color: var(--ink-2);
      text-decoration: none; padding: 0.6rem 0; border-bottom: 1px solid var(--surface-2);
      transition: color 0.15s;
    }
    #mobile-menu a:last-child { border-bottom: none; margin-top: 0.5rem; }
    #mobile-menu a.cta-mobile {
      background: var(--ink); color: #fafafa; text-align: center;
      padding: 0.7rem; border-radius: var(--radius); border: none; margin-top: 0.5rem;
    }

    /* ── Buttons ──────────────────────────────────── */
    .btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 13.5px; font-weight: 600;
      padding: 0.6rem 1.25rem; border-radius: var(--radius);
      text-decoration: none; transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
      white-space: nowrap; cursor: pointer; border: none;
    }
    .btn:active { transform: translateY(1px) scale(0.99); }
    .btn-dark { background: var(--ink); color: #fafafa; }
    .btn-dark:hover { opacity: 0.85; transform: translateY(-1px); }
    .btn-outline {
      background: transparent; color: var(--ink);
      border: 1.5px solid var(--surface-3);
    }
    .btn-outline:hover { border-color: var(--ink-3); background: var(--surface-2); }
    .btn-accent { background: var(--accent); color: #fff; }
    .btn-accent:hover { background: var(--accent-dk); transform: translateY(-1px); }

    /* ── Cards ────────────────────────────────────── */
    .card {
      background: #fff; border: 1px solid var(--surface-3);
      border-radius: var(--radius-lg); overflow: hidden;
      transition: box-shadow 0.22s, transform 0.22s;
    }
    .card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.07);
      transform: translateY(-3px);
    }

    /* ── Scroll reveal ────────────────────────────── */
    .reveal {
      opacity: 0; transform: translateY(20px);
      transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1);
    }
    .reveal.visible { opacity: 1; transform: none; }
    .reveal-d1 { transition-delay: 0.08s; }
    .reveal-d2 { transition-delay: 0.16s; }
    .reveal-d3 { transition-delay: 0.24s; }

    /* ── Marquee ──────────────────────────────────── */
    .marquee-outer { overflow: hidden; }
    .marquee-track {
      display: flex; gap: 3.5rem;
      animation: marquee 28s linear infinite;
      width: max-content;
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    /* ── Divider ──────────────────────────────────── */
    .divider { border: none; border-top: 1px solid var(--surface-3); }

    /* ── Footer ───────────────────────────────────── */
    footer {
      background: var(--ink); color: rgba(255,255,255,0.5);
      padding: 4rem 0 2.5rem;
    }
    footer h4 { color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600; margin-bottom: 1rem; }
    footer a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; transition: color 0.15s; }
    footer a:hover { color: rgba(255,255,255,0.9); }
    footer ul { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }

    /* ── Responsive ───────────────────────────────── */
    @media (max-width: 768px) {
      .nav-links, .nav-cta { display: none; }
      .nav-mobile-btn { display: flex; }
      .container, .container-sm { padding: 0 1.25rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1; transform: none; transition: none; }
      .marquee-track { animation: none; }
      .card { transition: none; }
      .btn { transition: none; }
    }
  </style>
</head>
<body>

  <nav id="nav">
    <div class="inner">
      <a href="/" class="nav-logo">
        <div class="nav-logo-mark">N</div>
        NusaTech
      </a>
      <ul class="nav-links">
        <li><a href="/" class="${activePage === "home" ? "active" : ""}">Beranda</a></li>
        <li><a href="/services" class="${activePage === "services" ? "active" : ""}">Layanan</a></li>
        <li><a href="/portfolio" class="${activePage === "portfolio" ? "active" : ""}">Portfolio</a></li>
        <li><a href="/about" class="${activePage === "about" ? "active" : ""}">Tim</a></li>
        <li><a href="/contact" class="${activePage === "contact" ? "active" : ""}">Kontak</a></li>
      </ul>
      <a href="/contact" class="nav-cta">Hubungi kami</a>
      <button class="nav-mobile-btn" id="hamburger" aria-label="Menu">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect id="bar1" y="2" width="18" height="1.8" rx="0.9" fill="currentColor"/>
          <rect id="bar2" y="8.1" width="18" height="1.8" rx="0.9" fill="currentColor"/>
          <rect id="bar3" y="14.2" width="18" height="1.8" rx="0.9" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </nav>

  <div id="mobile-menu">
    <a href="/">Beranda</a>
    <a href="/services">Layanan</a>
    <a href="/portfolio">Portfolio</a>
    <a href="/about">Tim</a>
    <a href="/contact">Kontak</a>
    <a href="/contact" class="cta-mobile">Hubungi kami</a>
  </div>

  <main>
    ${content}
  </main>

  <footer>
    <div class="container">
      <div style="display:grid; grid-template-columns: 1.8fr 1fr 1fr 1.4fr; gap:3rem; padding-bottom:3rem; border-bottom:1px solid rgba(255,255,255,0.1)">
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
            <div style="width:28px;height:28px;border-radius:6px;background:#fafafa;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;font-family:'Geist Mono',monospace;color:#111;flex-shrink:0">N</div>
            <span style="font-weight:800;font-size:16px;color:#fafafa;letter-spacing:-0.02em">NusaTech</span>
          </div>
          <p style="font-size:13px;line-height:1.65;max-width:240px;margin-bottom:1.5rem">Tim teknologi Jakarta. 9 tahun, 500+ proyek, prinsip yang sama sejak hari pertama.</p>
          <div style="display:flex;gap:0.5rem">
            <a href="#" aria-label="LinkedIn" style="width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Geist Mono',monospace">in</a>
            <a href="#" aria-label="Twitter/X" style="width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Geist Mono',monospace">x</a>
            <a href="#" aria-label="GitHub" style="width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Geist Mono',monospace">gh</a>
          </div>
        </div>
        <div>
          <h4>Layanan</h4>
          <ul>
            <li><a href="/services">Web Development</a></li>
            <li><a href="/services">Mobile App</a></li>
            <li><a href="/services">Cloud & DevOps</a></li>
            <li><a href="/services">AI & Otomasi</a></li>
            <li><a href="/services">Security Audit</a></li>
          </ul>
        </div>
        <div>
          <h4>Perusahaan</h4>
          <ul>
            <li><a href="/about">Tim kami</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/contact">Karir</a></li>
            <li><a href="/contact">Blog teknis</a></li>
          </ul>
        </div>
        <div>
          <h4>Kantor</h4>
          <ul>
            <li><a href="#">Jl. Wijaya I No. 37, Kebayoran Baru, Jakarta Selatan 12170</a></li>
            <li><a href="tel:+622127884491">+62 21 2788 4491</a></li>
            <li><a href="mailto:halo@nusatech.id">halo@nusatech.id</a></li>
            <li style="color:rgba(255,255,255,0.3);font-size:12px">Sen-Jum, 09.00-18.00 WIB</li>
          </ul>
        </div>
      </div>
      <div style="padding-top:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <p style="font-size:12px;color:rgba(255,255,255,0.3)">© 2024 NusaTech Solutions. Dibuat di Jakarta.</p>
        <div style="display:flex;gap:1.5rem">
          <a href="#" style="font-size:12px">Privasi</a>
          <a href="#" style="font-size:12px">Syarat</a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Navbar scroll
    const nav = document.getElementById('nav');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Mobile menu
    const ham = document.getElementById('hamburger');
    const mob = document.getElementById('mobile-menu');
    let open = false;
    ham.addEventListener('click', () => {
      open = !open;
      mob.classList.toggle('open', open);
    });

    // Scroll reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Counter
    function runCounter(el) {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const isFloat = el.dataset.float === '1';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        const val = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(el => cio.observe(el));
  </script>
</body>
</html>
`;
