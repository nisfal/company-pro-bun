/**
 * Client-side scripts — dikumpulkan di sini agar base.ts tetap bersih.
 * Semua fungsi return string HTML <script> / <style> yang di-inject ke layout.
 */

// ─── Chalkboard Intro Gag (#2) ─────────────────────────────────────────────────
// Muncul hanya saat sesi pertama (localStorage guard).
// 10 pesan orisinal, dipilih random.

export function chalkboardScript(): string {
  const messages = [
    "Saya tidak akan deploy ke production hari Jumat",
    "Stack overflow bukan solusi, tapi kadang membantu",
    "Saya sudah baca dokumentasinya (bohong)",
    "Saya tidak akan commit langsung ke main",
    "Console.log bukan debugging yang proper",
    "Saya akan tulis unit test besok (janji)",
    "Copy-paste dari internet bukan plagiat, itu efisiensi",
    "Saya sudah backup sebelum menghapus ini",
    "Dark mode bukan preferensi, ini kebutuhan medis",
    "Saya tidak akan menyalahkan cache kalau ada bug",
  ];
  const msgsEN = [
    "I will not push to production on Fridays",
    "Stack Overflow is not a crutch (it totally is)",
    "I have read the documentation (I have not)",
    "I will not commit directly to main",
    "console.log is not a debugging strategy",
    "I will write unit tests tomorrow (for real this time)",
    "Copy-pasting from the internet is research, not plagiarism",
    "I backed up before deleting this (I did not)",
    "Dark mode is a medical necessity, not a preference",
    "I will not blame the cache when there is a bug",
  ];

  return `
<script>
(function() {
  var SESSION_KEY = 'spt_chalk_shown';
  if (sessionStorage.getItem(SESSION_KEY)) return;
  sessionStorage.setItem(SESSION_KEY, '1');

  var msgs    = ${JSON.stringify(messages)};
  var msgsEN  = ${JSON.stringify(msgsEN)};
  var isEN    = document.documentElement.lang === 'en';
  var list    = isEN ? msgsEN : msgs;
  var text    = list[Math.floor(Math.random() * list.length)];

  var overlay = document.createElement('div');
  overlay.id  = 'chalk-overlay';
  overlay.innerHTML = \`
    <div style="
      position:fixed;inset:0;z-index:9999;
      background:#1a1a2e;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:2rem;padding:2rem;
    ">
      <div style="
        width:min(680px,90vw);
        background:#2a2a1a;
        border:4px solid #555;
        border-radius:4px;
        padding:2.5rem 3rem 3rem;
        box-shadow:inset 0 0 40px #00000088, 0 8px 32px #00000099;
        position:relative;
      ">
        <!-- chalk tray line -->
        <div style="position:absolute;bottom:0;left:0;right:0;height:18px;background:#3a3828;border-top:3px solid #555;border-radius:0 0 4px 4px;"></div>
        <p id="chalk-text" style="
          font-family:'Bangers',cursive;
          font-size:clamp(1.5rem,4vw,2.2rem);
          color:#f0f0e0;
          letter-spacing:0.06em;
          line-height:1.4;
          text-align:center;
          margin:0;
          text-shadow:0 0 8px #ffffff33;
          opacity:0;
          animation:chalkWrite 0.8s ease forwards 0.3s;
        ">\${text}</p>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <div style="font-family:'Fredoka',sans-serif;font-size:0.85rem;color:#FED41D99;">
          \${isEN ? 'click anywhere to enter Springfield...' : 'klik di mana saja untuk masuk...'}
        </div>
        <div style="
          width:48px;height:48px;
          background:#FED41D;
          border:3px solid #1A1A2E;
          border-radius:50%;
          box-shadow:4px 4px 0 #F5C400;
          display:flex;align-items:center;justify-content:center;
          font-size:1.6rem;
          animation:donutBounce 0.8s ease infinite alternate;
        ">🍩</div>
      </div>
    </div>
  \`;

  var style = document.createElement('style');
  style.textContent = \`
    @keyframes chalkWrite {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes donutBounce {
      from { transform:translateY(0); }
      to   { transform:translateY(-8px); }
    }
    @keyframes fadeOut {
      from { opacity:1; }
      to   { opacity:0; pointer-events:none; }
    }
  \`;
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  function dismiss() {
    overlay.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(function() { overlay.remove(); }, 400);
  }
  overlay.addEventListener('click', dismiss);
  setTimeout(dismiss, 5000);
})();
</script>`;
}

// ─── Day/Night Mode Toggle (#3) ───────────────────────────────────────────────
// "Siang di Springfield" (kuning cerah) vs "Malam di Springfield" (biru gelap).
// Disimpan di cookie `spt_theme`.

export function themeToggleStyles(): string {
  return `
<style>
  /* Night override — applied via [data-theme="night"] on <html> */
  [data-theme="night"] {
    --spt-bg:        #0d0d1a;
    --spt-surface:   #16162a;
    --spt-text:      #e8e8f0;
    --spt-text-muted:#8888aa;
    --spt-yellow:    #FFE566;
    --spt-sky:       #4466cc;
  }
  [data-theme="night"] body { background: var(--spt-bg) !important; }
  [data-theme="night"] .comic-card { background: var(--spt-surface) !important; border-color: #FED41D88 !important; }
  [data-theme="night"] .comic-divider {
    background: repeating-linear-gradient(90deg, #FFE566 0,#FFE566 20px,#0d0d1a 20px,#0d0d1a 24px) !important;
  }
</style>`;
}

export function themeToggleScript(): string {
  return `
<script>
(function() {
  // Read cookie
  function getCookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;max-age=31536000';
  }

  var current = getCookie('spt_theme') || 'day';
  document.documentElement.setAttribute('data-theme', current);

  window.__sptToggleTheme = function() {
    current = current === 'day' ? 'night' : 'day';
    document.documentElement.setAttribute('data-theme', current);
    setCookie('spt_theme', current);
    updateBtn();
  };

  function updateBtn() {
    var btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    var isNight = current === 'night';
    var isEN    = document.documentElement.lang === 'en';
    btn.textContent = isNight
      ? (isEN ? '☀️ Springfield Day'   : '☀️ Siang di Springfield')
      : (isEN ? '🌙 Springfield Night' : '🌙 Malam di Springfield');
  }

  document.addEventListener('DOMContentLoaded', updateBtn);
})();
</script>`;
}

export function themeToggleButton(): string {
  return `
  <button id="theme-toggle-btn" onclick="__sptToggleTheme()" style="
    background:transparent;
    border:2px solid #FED41D55;
    border-radius:8px;
    padding:0.35rem 0.8rem;
    font-family:'Fredoka',sans-serif;
    font-size:0.82rem;font-weight:600;
    color:#FED41DAA;
    cursor:pointer;
    white-space:nowrap;
    transition:border-color 0.15s,color 0.15s;
  "
  onmouseover="this.style.borderColor='#FED41D';this.style.color='#FED41D'"
  onmouseout="this.style.borderColor='#FED41D55';this.style.color='#FED41DAA'"
  >☀️ Siang di Springfield</button>`;
}

// ─── Beer Loading Bar (#4) ────────────────────────────────────────────────────
// Progress bar bergaya gelas bir yang terisi, muncul saat navigasi.

export function beerLoadingBar(): string {
  return `
<style>
  #beer-bar {
    position:fixed;top:0;left:0;right:0;z-index:9998;
    height:4px;
    pointer-events:none;
    overflow:hidden;
    opacity:0;
    transition:opacity 0.2s;
  }
  #beer-bar.active { opacity:1; }
  #beer-bar-fill {
    height:100%;
    width:0%;
    background:linear-gradient(90deg, #F5C400, #FED41D 40%, #ffe566 60%, #FED41D);
    box-shadow:0 0 8px #FED41Daa;
    transition:width 0.3s ease;
    position:relative;
  }
  #beer-bar-fill::after {
    content:'';
    position:absolute;right:0;top:0;bottom:0;width:20px;
    background:linear-gradient(90deg,transparent,#ffffffaa);
  }
  #beer-bar-foam {
    position:absolute;right:-6px;top:-4px;
    width:14px;height:12px;
    background:#fffef7;
    border-radius:50% 50% 30% 30%;
    box-shadow:0 0 4px #ffffffaa;
  }
</style>
<div id="beer-bar"><div id="beer-bar-fill"><div id="beer-bar-foam"></div></div></div>
<script>
(function() {
  var bar   = document.getElementById('beer-bar');
  var fill  = document.getElementById('beer-bar-fill');
  var tid, pct;

  function start() {
    pct = 0;
    bar.classList.add('active');
    clearInterval(tid);
    tid = setInterval(function() {
      pct = Math.min(pct + (Math.random() * 12 + 3), 85);
      fill.style.width = pct + '%';
    }, 180);
  }
  function finish() {
    clearInterval(tid);
    fill.style.width = '100%';
    setTimeout(function() {
      bar.classList.remove('active');
      setTimeout(function() { fill.style.width = '0%'; }, 200);
    }, 300);
  }

  // Trigger on <a> clicks (same origin, non-hash)
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (a.target === '_blank') return;
    try {
      var url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      // Normalize trailing slash before comparing
      var norm = function(p) { return p.replace(/\/$/, '') || '/'; };
      if (norm(url.pathname) === norm(location.pathname)) return;
    } catch(e) { return; }
    start();
  });
  window.addEventListener('pageshow', finish);
  window.addEventListener('load', finish);
})();
</script>`;
}

// ─── Donut Confetti (#5) ──────────────────────────────────────────────────────
// Canvas-based particle confetti, tanpa library eksternal.
// Dipanggil via window.__sptDonutConfetti()

export function donutConfettiScript(): string {
  return `
<canvas id="confetti-canvas" style="
  position:fixed;inset:0;pointer-events:none;z-index:9997;
  width:100%;height:100%;
"></canvas>
<script>
(function() {
  var canvas = document.getElementById('confetti-canvas');
  var ctx    = canvas.getContext('2d');
  var particles = [];
  var raf;

  var EMOJIS = ['🍩','🍩','⭐','✨','🎉','🍺','🌟'];
  var COLORS  = ['#FED41D','#FF6B6B','#87CEEB','#4CAF50','#FFE566','#F5C400'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function spawn(n) {
    for (var i = 0; i < n; i++) {
      particles.push({
        x:   Math.random() * canvas.width,
        y:   -20 - Math.random() * 100,
        vx:  (Math.random() - 0.5) * 5,
        vy:  2 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        rv:  (Math.random() - 0.5) * 0.2,
        size: 18 + Math.random() * 16,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        life: 120 + Math.floor(Math.random() * 80),
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rv;
      p.vy  += 0.08; // gravity
      p.life--;
      if (p.life < 30) p.alpha = p.life / 30;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = p.size + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    }
    if (particles.length > 0) raf = requestAnimationFrame(loop);
    else cancelAnimationFrame(raf);
  }

  window.__sptDonutConfetti = function(n) {
    spawn(n || 60);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  };
})();
</script>`;
}

// ─── Konami Code Easter Egg (#8) ──────────────────────────────────────────────
// Sequence: ↑↑↓↓←→←→BA
// Trigger: confetti + toast Springfield

export function konamiEasterEggScript(): string {
  return `
<script>
(function() {
  var SEQ  = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var idx  = 0;

  document.addEventListener('keydown', function(e) {
    if (e.key === SEQ[idx]) {
      idx++;
      if (idx === SEQ.length) {
        idx = 0;
        triggerEasterEgg();
      }
    } else {
      idx = e.key === SEQ[0] ? 1 : 0;
    }
  });

  function triggerEasterEgg() {
    if (typeof window.__sptDonutConfetti === 'function') window.__sptDonutConfetti(120);

    var isEN   = document.documentElement.lang === 'en';
    var msg    = isEN
      ? "Woo-hoo! You found the secret! D'oh — now everyone knows."
      : "Woo-hoo! Kamu menemukan rahasia Springfield! 🍩";

    var toast = document.createElement('div');
    toast.style.cssText = [
      'position:fixed','bottom:2rem','left:50%',
      'transform:translateX(-50%)',
      'background:#FED41D','color:#1A1A2E',
      'border:3px solid #1A1A2E',
      'border-radius:16px',
      'padding:1rem 2rem',
      'font-family:Fredoka,sans-serif',
      'font-size:1rem','font-weight:700',
      'box-shadow:5px 5px 0 #1A1A2E',
      'z-index:9990',
      'animation:toastIn 0.4s cubic-bezier(.175,.885,.32,1.275) forwards',
      'text-align:center',
      'max-width:90vw',
    ].join(';');
    toast.textContent = msg;

    var s = document.createElement('style');
    s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(s);
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.transition = 'opacity 0.4s';
      toast.style.opacity    = '0';
      setTimeout(function() { toast.remove(); }, 400);
    }, 4000);
  }
})();
</script>`;
}
