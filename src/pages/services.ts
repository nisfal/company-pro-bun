import { layout } from "../templates/layout";
import { services } from "../data/company";

const svcItems = services.map((s, i) => `
  <div class="reveal" style="padding:2rem 0;border-bottom:1px solid var(--surface-3);display:grid;grid-template-columns:48px 1fr auto;gap:1.5rem;align-items:flex-start">
    <span class="mono" style="font-size:11px;color:var(--ink-3);padding-top:5px">${String(i + 1).padStart(2, '0')}</span>
    <div>
      <h3 style="font-size:18px;font-weight:700;margin-bottom:0.5rem">${s.title}</h3>
      <p style="font-size:14px;color:var(--ink-2);line-height:1.65;max-width:560px">${s.description}</p>
      <a href="/contact" style="display:inline-flex;align-items:center;gap:0.3rem;font-size:13px;font-weight:600;color:var(--accent);text-decoration:none;margin-top:0.75rem">Diskusikan kebutuhan &rarr;</a>
    </div>
    <span class="mono" style="font-size:11px;color:var(--ink-3);white-space:nowrap;padding-top:5px;text-align:right">${s.detail}</span>
  </div>
`).join('');

const techList = [
  { name: "Bun", note: "Runtime utama" },
  { name: "TypeScript", note: "Selalu" },
  { name: "React / Next.js", note: "" },
  { name: "Go", note: "Backend high-load" },
  { name: "Python", note: "AI & data" },
  { name: "PostgreSQL", note: "DB favorit" },
  { name: "Redis", note: "" },
  { name: "AWS", note: "Cloud utama" },
  { name: "Docker + K8s", note: "" },
  { name: "React Native", note: "" },
  { name: "Flutter", note: "" },
  { name: "TensorFlow", note: "" },
  { name: "Kafka", note: "Event streaming" },
  { name: "Vue.js", note: "" },
  { name: "Laravel", note: "PHP legacy" },
];

const processSteps = [
  ["Obrolan awal", "30-60 menit. Kami dengarkan masalah Anda, bukan langsung kasih penawaran. Kalau kami bukan yang tepat, kami bilang jujur."],
  ["Scope & estimasi", "Proposal detail dalam 48 jam: lingkup, timeline, milestone, biaya. Tidak ada angka yang tiba-tiba berubah di tengah jalan."],
  ["Bangun bareng", "Sprint 2 minggu, update rutin. Akses ke repo kapan saja. Tidak perlu nunggu 3 bulan buat lihat progress."],
  ["Launch & lanjut", "Deploy, monitoring 30 hari, handover lengkap ke tim Anda. Garansi bug-fix 3 bulan setelah launch."],
];

const content = `
  <!-- Header -->
  <section style="padding-top:calc(var(--nav-h) + 5rem);padding-bottom:4rem;background:var(--surface)">
    <div class="container">
      <div style="max-width:600px">
        <h1 style="font-size:clamp(2.2rem,4vw,3rem);font-weight:900;letter-spacing:-0.035em;line-height:1.1;margin-bottom:1rem">
          Yang kami kerjakan sehari-hari
        </h1>
        <p style="font-size:16px;color:var(--ink-2);line-height:1.7">
          Kami tidak menawarkan semua hal. Fokus di bidang yang benar-benar kami kuasai, dan hasilnya bisa Anda lihat di portfolio.
        </p>
      </div>
    </div>
  </section>

  <!-- Service list -->
  <section style="background:#fff;border-top:1px solid var(--surface-3);padding:0 0 4rem">
    <div class="container">
      ${svcItems}
    </div>
  </section>

  <!-- Process -->
  <section style="padding:6rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start">
        <div class="reveal" style="position:sticky;top:calc(var(--nav-h) + 2rem)">
          <h2 style="font-size:clamp(1.6rem,2.5vw,2rem);margin-bottom:0.75rem">Proses yang tidak ada yang disembunyikan</h2>
          <p style="font-size:14px;color:var(--ink-3);line-height:1.65">Dari hari pertama sampai launch, ini yang terjadi.</p>
        </div>
        <div>
          ${processSteps.map(([title, desc], i) => `
            <div class="reveal reveal-d${i + 1}" style="display:flex;gap:1.5rem;padding:1.75rem 0;border-bottom:1px solid var(--surface-3)">
              <div style="width:32px;height:32px;border-radius:6px;background:var(--ink);color:#fafafa;display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:11px;font-weight:700;flex-shrink:0">${String(i + 1).padStart(2, '0')}</div>
              <div>
                <p style="font-size:15px;font-weight:700;color:var(--ink);margin-bottom:0.35rem">${title}</p>
                <p style="font-size:13.5px;color:var(--ink-3);line-height:1.65">${desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- Tech -->
  <section style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:2.5rem;flex-wrap:wrap">
        <h2 class="reveal" style="font-size:1.5rem">Tools yang kami pakai, bukan yang kami pelajari bulan lalu</h2>
        <p class="reveal" style="font-size:13px;color:var(--ink-3)">Dipilih berdasarkan stabilitas produksi, bukan hype.</p>
      </div>
      <div class="reveal" style="display:flex;flex-wrap:wrap;gap:0.5rem">
        ${techList.map(({ name, note }) => `
          <span title="${note}" style="background:var(--surface-2);color:var(--ink-2);padding:0.4rem 0.9rem;border-radius:var(--radius);font-size:13px;font-weight:500;cursor:default;border:1px solid var(--surface-3);transition:background 0.15s,color 0.15s" onmouseover="this.style.background='var(--accent-bg)';this.style.color='var(--accent)'" onmouseout="this.style.background='var(--surface-2)';this.style.color='var(--ink-2)'">${name}</span>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Pricing philosophy -->
  <section style="padding:5rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container-sm reveal">
      <div style="background:#fff;border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:3rem">
        <h2 style="font-size:1.5rem;margin-bottom:0.75rem">Soal harga, kami jujur</h2>
        <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin-bottom:2rem">
          Tidak ada daftar harga tetap, setiap proyek berbeda. Tapi kami bisa kasih estimasi jujur dalam 48 jam setelah brief diterima.
        </p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--surface-3);border:1px solid var(--surface-3);border-radius:var(--radius);overflow:hidden;margin-bottom:2rem">
          ${[
            ["Website", "Mulai Rp 25 juta"],
            ["Mobile App", "Mulai Rp 80 juta"],
            ["Enterprise", "Sesuai scope"],
          ].map(([type, price]) => `
            <div style="background:#fff;padding:1.25rem 1.5rem">
              <p style="font-size:11px;color:var(--ink-3);margin-bottom:0.35rem;font-family:'Geist Mono',monospace;text-transform:uppercase;letter-spacing:0.08em">${type}</p>
              <p style="font-size:14px;font-weight:700;color:var(--ink)">${price}</p>
            </div>
          `).join('')}
        </div>
        <a href="/contact" class="btn btn-dark">Minta estimasi gratis &rarr;</a>
      </div>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      div[style*="grid-template-columns:48px 1fr auto"] {
        grid-template-columns: 1fr !important;
        gap: 0.5rem !important;
      }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:5rem"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
      div[style*="grid-template-columns:repeat(3,1fr)"] {
        grid-template-columns: 1fr !important;
      }
    }
  </style>
`;

export const servicesPage = () => layout("Layanan", content, "services");
