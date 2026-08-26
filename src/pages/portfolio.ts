import { layout } from "../templates/layout";
import { portfolios } from "../data/company";

// Two asymmetric rows: first row is full-width feature + side, second row is 2-col
const featured = portfolios[0];
const rest = portfolios.slice(1);

const content = `
  <!-- Header -->
  <section style="padding-top:calc(var(--nav-h) + 5rem);padding-bottom:4rem;background:var(--surface)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:end">
        <h1 class="reveal" style="font-size:clamp(2.2rem,4vw,3rem);font-weight:900;letter-spacing:-0.035em;line-height:1.1">
          Proyek nyata,<br>hasil yang terukur
        </h1>
        <p class="reveal" style="font-size:15px;color:var(--ink-2);line-height:1.7;max-width:400px">
          Bukan mockup atau konsep. Ini proyek yang sudah jalan dan dipakai pengguna sungguhan.
        </p>
      </div>
    </div>
  </section>

  <!-- Featured project (full-width asymmetric) -->
  <section style="background:#fff;border-top:1px solid var(--surface-3);padding:4rem 0">
    <div class="container reveal">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--surface-3);border-radius:var(--radius-lg);overflow:hidden">
        <!-- Visual panel -->
        <div style="background:var(--ink);padding:3.5rem;display:flex;align-items:flex-end;min-height:320px;position:relative">
          <div style="position:absolute;top:2rem;right:2rem;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);font-family:'Geist Mono',monospace;font-size:10.5px;padding:0.3rem 0.6rem;border-radius:4px">${featured.year}</div>
          <div>
            <p style="font-family:'Geist Mono',monospace;font-size:10.5px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.5rem">${featured.category.split(' · ')[0]}</p>
            <h2 style="font-size:1.75rem;color:#fafafa;margin-bottom:0.5rem">${featured.title}</h2>
          </div>
        </div>
        <!-- Content panel -->
        <div style="padding:3.5rem;background:#fff;border-left:1px solid var(--surface-3)">
          <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin-bottom:1.5rem">${featured.description}</p>
          <div style="display:flex;align-items:center;gap:0.6rem;padding:1rem;background:var(--accent-bg);border-radius:var(--radius);border:1px solid rgba(22,163,74,0.15);margin-bottom:1.5rem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 9l3 3 7-7" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p style="font-size:12.5px;font-weight:600;color:var(--accent)">${featured.result}</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem">
            ${featured.tech.map(t => `<span style="background:var(--surface-2);color:var(--ink-2);padding:0.25rem 0.65rem;border-radius:4px;font-size:12px;font-family:'Geist Mono',monospace;border:1px solid var(--surface-3)">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Rest of portfolio: 2-col then 3-col variation -->
  <section style="padding:2rem 0 5rem;background:#fff">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem">
        ${rest.map((p, i) => `
          <div class="card reveal reveal-d${i + 1}" style="overflow:hidden">
            <div style="background:var(--surface-2);padding:2rem;border-bottom:1px solid var(--surface-3);display:flex;align-items:center;justify-content:space-between">
              <p style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink-3)">${p.category.split(' · ')[0]}</p>
              <span style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink-3)">${p.year}</span>
            </div>
            <div style="padding:1.75rem">
              <h3 style="font-size:16px;font-weight:700;margin-bottom:0.5rem">${p.title}</h3>
              <p style="font-size:13px;color:var(--ink-3);line-height:1.6;margin-bottom:1.25rem">${p.description}</p>
              <div style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem;background:var(--accent-bg);border-radius:var(--radius);border:1px solid rgba(22,163,74,0.12);margin-bottom:1.25rem">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 8l2.5 2.5 6.5-7" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <p style="font-size:11.5px;font-weight:600;color:var(--accent)">${p.result}</p>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:0.35rem">
                ${p.tech.map(t => `<span style="background:var(--surface-2);color:var(--ink-3);padding:0.2rem 0.55rem;border-radius:4px;font-size:11px;font-family:'Geist Mono',monospace">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Stats row -->
  <section style="padding:5rem 0;background:var(--ink);border-top:1px solid rgba(255,255,255,0.06)">
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0">
        ${[
          ["500", "+", "Proyek selesai"],
          ["200", "+", "Klien aktif"],
          ["99.94", "%", "Rata-rata uptime"],
          ["4.9", "/5", "Rating klien"],
        ].map(([num, suf, label], i) => `
          <div class="reveal reveal-d${i + 1}" style="padding:2rem;${i < 3 ? 'border-right:1px solid rgba(255,255,255,0.08)' : ''}">
            <p style="font-size:2.4rem;font-weight:900;letter-spacing:-0.04em;color:#fafafa" data-counter data-target="${num}" data-suffix="${suf}">${0}${suf}</p>
            <p style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:0.25rem;font-family:'Geist Mono',monospace">${label}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Industries -->
  <section style="padding:5rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:2.5rem;flex-wrap:wrap">
        <h2 class="reveal" style="font-size:1.5rem">Industri yang pernah kami tangani</h2>
        <p class="reveal" style="font-size:13px;color:var(--ink-3)">Konteks yang sudah ada, bukan harus dipelajari dari nol.</p>
      </div>
      <div class="reveal" style="display:flex;flex-wrap:wrap;gap:0.5rem">
        ${["Fintech", "E-Commerce", "HealthTech", "EdTech", "Logistik", "Retail", "Manufaktur", "FMCG", "Property", "Media", "Perbankan", "Asuransi"].map(ind => `
          <span style="background:#fff;color:var(--ink-2);padding:0.45rem 1rem;border-radius:var(--radius);font-size:13px;font-weight:500;cursor:default;border:1px solid var(--surface-3)">${ind}</span>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container-sm reveal" style="text-align:center">
      <h2 style="font-size:1.75rem;margin-bottom:0.75rem">Proyek Anda bisa jadi yang berikutnya</h2>
      <p style="font-size:14px;color:var(--ink-3);margin-bottom:2rem">Tidak perlu brief sempurna untuk mulai ngobrol.</p>
      <a href="/contact" class="btn btn-dark">Mulai ngobrol &rarr;</a>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:4rem"] { grid-template-columns: 1fr !important; gap: 2rem !important; }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:0"][style*="overflow:hidden"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:repeat(4"] { grid-template-columns: repeat(2,1fr) !important; }
      div[style*="border-right:1px solid rgba(255,255,255,0.08)"] { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
    }
  </style>
`;

export const portfolioPage = () => layout("Portfolio", content, "portfolio");
