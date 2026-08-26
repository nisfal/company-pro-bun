import { layout } from "../templates/layout";
import { services, testimonials } from "../data/company";

// Only first 3 services for preview
const svcRows = services.slice(0, 4).map((s, i) => `
  <div style="display:flex;align-items:flex-start;gap:1.5rem;padding:1.5rem 0;border-bottom:1px solid var(--surface-3)" class="reveal reveal-d${(i % 3) + 1}">
    <span class="mono" style="font-size:11px;color:var(--ink-3);padding-top:4px;min-width:24px">${String(i + 1).padStart(2, '0')}</span>
    <div style="flex:1">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:0.35rem">${s.title}</h3>
      <p style="font-size:13.5px;color:var(--ink-3);line-height:1.6;max-width:520px">${s.description}</p>
    </div>
    <span style="font-size:11px;color:var(--ink-3);font-family:'Geist Mono',monospace;white-space:nowrap;padding-top:4px">${s.detail}</span>
  </div>
`).join('');

const tCards = testimonials.map((t, i) => `
  <div class="reveal reveal-d${i + 1}" style="padding:1.75rem;background:#fff;border:1px solid var(--surface-3);border-radius:var(--radius-lg)">
    <p style="font-size:14px;line-height:1.7;color:var(--ink-2);margin-bottom:1.25rem">"${t.text}"</p>
    <hr class="divider" style="margin-bottom:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:0.75rem">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--surface-3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Geist Mono',monospace;color:var(--ink-2);flex-shrink:0">${t.avatar}</div>
        <div>
          <p style="font-size:13px;font-weight:600;color:var(--ink)">${t.name}</p>
          <p style="font-size:12px;color:var(--ink-3)">${t.role}, ${t.company}</p>
        </div>
      </div>
      <span style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink-3);background:var(--surface-2);padding:0.2rem 0.6rem;border-radius:4px">${t.project}</span>
    </div>
  </div>
`).join('');

const techItems = [
  "Bun", "TypeScript", "React", "Next.js", "Go", "Python",
  "PostgreSQL", "Redis", "AWS", "Docker", "Kubernetes",
  "React Native", "Flutter", "TensorFlow", "Kafka",
  "Bun", "TypeScript", "React", "Next.js", "Go", "Python",
  "PostgreSQL", "Redis", "AWS", "Docker", "Kubernetes",
  "React Native", "Flutter", "TensorFlow", "Kafka",
].map(t => `<span class="mono" style="font-size:12px;color:var(--ink-3);white-space:nowrap">${t}</span>`).join('');

const content = `
  <!-- ── HERO ──────────────────────────────────────────── -->
  <section style="min-height:100dvh;display:flex;align-items:center;padding-top:var(--nav-h);background:var(--surface)">
    <div class="container" style="padding-top:5rem;padding-bottom:5rem">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center">

        <!-- Left -->
        <div>
          <h1 style="font-size:clamp(2.4rem,4.5vw,3.5rem);font-weight:900;line-height:1.08;letter-spacing:-0.035em;margin-bottom:1.5rem">
            Software yang<br>benar-benar<br><em style="font-style:italic;color:var(--accent)">berfungsi.</em>
          </h1>
          <p style="font-size:16px;color:var(--ink-2);max-width:420px;line-height:1.7;margin-bottom:2rem">
            Bukan portfolio kosong. Kami sudah 9 tahun bantu startup dan korporat Indonesia tumbuh lewat teknologi. 500+ proyek, 0 klien yang pergi marah.
          </p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            <a href="/contact" class="btn btn-dark">Ceritakan proyek Anda &rarr;</a>
            <a href="/portfolio" class="btn btn-outline">Lihat hasil kerja</a>
          </div>
        </div>

        <!-- Right: asymmetric stats panel -->
        <div style="background:#fff;border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:2.5rem;position:relative">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
            <div style="padding:1.5rem;border-right:1px solid var(--surface-3);border-bottom:1px solid var(--surface-3)">
              <p style="font-size:2.6rem;font-weight:900;letter-spacing:-0.04em;color:var(--ink)" data-counter data-target="500" data-suffix="+">0+</p>
              <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">Proyek selesai</p>
            </div>
            <div style="padding:1.5rem;border-bottom:1px solid var(--surface-3)">
              <p style="font-size:2.6rem;font-weight:900;letter-spacing:-0.04em;color:var(--ink)" data-counter data-target="200" data-suffix="+">0+</p>
              <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">Klien aktif</p>
            </div>
            <div style="padding:1.5rem;border-right:1px solid var(--surface-3)">
              <p style="font-size:2.6rem;font-weight:900;letter-spacing:-0.04em;color:var(--ink)" data-counter data-target="9" data-suffix=" thn">0 thn</p>
              <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">Di industri</p>
            </div>
            <div style="padding:1.5rem">
              <p style="font-size:2.6rem;font-weight:900;letter-spacing:-0.04em;color:var(--accent)" data-counter data-target="99" data-suffix=".9%" data-float="0">0%</p>
              <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">Uptime rata-rata</p>
            </div>
          </div>
          <!-- status badge -->
          <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--surface-3);display:flex;align-items:center;gap:0.6rem">
            <span style="width:7px;height:7px;border-radius:50%;background:var(--accent);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;flex-shrink:0"></span>
            <span style="font-size:12.5px;color:var(--ink-2)">Terbuka untuk proyek baru per Q3 2024</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <style>
    @keyframes ping {
      75%, 100% { transform: scale(1.8); opacity: 0; }
    }
    @media (max-width: 768px) {
      .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
    }
  </style>

  <!-- ── TECH MARQUEE ──────────────────────────────────── -->
  <section style="padding:1.25rem 0;background:#fff;border-top:1px solid var(--surface-3);border-bottom:1px solid var(--surface-3)">
    <div class="marquee-outer">
      <div class="marquee-track">${techItems}</div>
    </div>
  </section>

  <!-- ── SERVICES ──────────────────────────────────────── -->
  <section style="padding:6rem 0;background:var(--surface)">
    <div class="container">
      <div style="display:grid;grid-template-columns:280px 1fr;gap:5rem;align-items:start">

        <!-- Sticky label column -->
        <div style="position:sticky;top:calc(var(--nav-h) + 2rem)">
          <h2 style="font-size:clamp(1.6rem,2.5vw,2rem);margin-bottom:0.75rem">Yang kami kerjakan sehari-hari</h2>
          <p style="font-size:14px;color:var(--ink-3);line-height:1.65;margin-bottom:1.5rem">Bukan semua hal. Hanya yang benar-benar kami kuasai.</p>
          <a href="/services" class="btn btn-outline" style="font-size:13px">Semua layanan &rarr;</a>
        </div>

        <!-- Service rows -->
        <div>
          ${svcRows}
        </div>
      </div>
    </div>
  </section>

  <!-- ── WHY US ─────────────────────────────────────────── -->
  <section style="padding:6rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start">

        <div class="reveal">
          <h2 style="font-size:clamp(1.8rem,3vw,2.4rem);margin-bottom:1rem;line-height:1.15">Kami bukan yang paling murah. Tapi kami <span class="accent-text">worth it.</span></h2>
          <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin-bottom:2rem">
            Ada vendor lebih murah, kami tidak akan bohong soal itu. Tapi kami yang datang ke meeting sudah baca brief, paham konteks bisnis, dan angkat telepon jam 11 malam kalau ada masalah sebelum launch.
          </p>
          <a href="/contact" class="btn btn-dark">Ngobrol gratis &rarr;</a>
        </div>

        <div style="display:flex;flex-direction:column;gap:0">
          ${[
            ["Tidak ada hidden cost", "Scope, timeline, biaya dijelaskan di awal. Perubahan selalu dikomunikasikan sebelum dikerjakan."],
            ["Kode yang bisa Anda baca", "Kami tulis dokumentasi, ikuti standar, dan pastikan tim Anda bisa maintain setelah kami selesai."],
            ["Reply dalam jam kerja", "WA dibalas dalam jam kerja. Darurat? Ada hotline yang beneran diangkat, bukan bot."],
            ["Garansi 3 bulan", "Bug-fix pasca-launch gratis 3 bulan. Tidak ada biaya tersembunyi untuk masalah yang kami buat."],
          ].map(([title, desc], i) => `
            <div class="reveal reveal-d${i + 1}" style="display:flex;gap:1rem;padding:1.25rem 0;border-bottom:1px solid var(--surface-3)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:3px">
                <circle cx="8" cy="8" r="7.5" stroke="var(--accent)" stroke-width="1"/>
                <path d="M5 8l2 2 4-4" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div>
                <p style="font-size:14px;font-weight:600;color:var(--ink);margin-bottom:0.25rem">${title}</p>
                <p style="font-size:13px;color:var(--ink-3);line-height:1.6">${desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  </section>

  <!-- ── TESTIMONIALS ──────────────────────────────────── -->
  <section style="padding:6rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:3rem;flex-wrap:wrap">
        <h2 class="reveal" style="font-size:clamp(1.6rem,2.5vw,2rem)">Kata klien, bukan marketing kami</h2>
        <p class="reveal" style="font-size:13px;color:var(--ink-3)">Kami minta mereka jujur.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem">
        ${tCards}
      </div>
    </div>
  </section>

  <!-- ── CTA ───────────────────────────────────────────── -->
  <section style="padding:6rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container-sm reveal">
      <div style="background:var(--ink);border-radius:var(--radius-lg);padding:4rem;text-align:center">
        <p style="font-family:'Geist Mono',monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:1rem">Mulai dari obrolan</p>
        <h2 style="color:#fafafa;font-size:clamp(1.8rem,3vw,2.4rem);margin-bottom:1rem;line-height:1.15">Punya masalah teknis?<br>Kami dengerin.</h2>
        <p style="font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:2rem;line-height:1.65">Tidak perlu brief sempurna. Cukup ceritakan konteksnya, kita figureout bareng.</p>
        <div style="display:flex;justify-content:center;gap:0.75rem;flex-wrap:wrap">
          <a href="/contact" class="btn" style="background:#fafafa;color:var(--ink)">Hubungi kami</a>
          <a href="/portfolio" class="btn" style="background:transparent;color:rgba(255,255,255,0.7);border:1.5px solid rgba(255,255,255,0.2)">Lihat portfolio dulu</a>
        </div>
      </div>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      section > .container > div[style*="grid-template-columns:1fr 1fr"],
      section > .container > div[style*="grid-template-columns:280px"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
      div[style*="grid-template-columns:repeat(3"] {
        grid-template-columns: 1fr !important;
      }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:0"] {
        grid-template-columns: 1fr 1fr !important;
      }
    }
  </style>
`;

export const homePage = () => layout("Beranda", content, "home");
