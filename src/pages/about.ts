import { layout } from "../templates/layout";
import { team } from "../data/company";

const content = `
  <!-- Header -->
  <section style="padding-top:calc(var(--nav-h) + 5rem);padding-bottom:4rem;background:var(--surface)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:end">
        <h1 class="reveal" style="font-size:clamp(2.2rem,4vw,3rem);font-weight:900;letter-spacing:-0.035em;line-height:1.1">
          Tim di balik NusaTech
        </h1>
        <p class="reveal" style="font-size:15px;color:var(--ink-2);line-height:1.7">
          Mulai dari garasi 4 orang pada 2015. Sekarang 150+, tapi prinsipnya sama: jujur, tepat waktu, dan hasilnya harus bisa diukur.
        </p>
      </div>
    </div>
  </section>

  <!-- Origin story -->
  <section style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start">
        <div class="reveal">
          <h2 style="font-size:1.75rem;margin-bottom:1.25rem;line-height:1.2">Kenapa kami ada</h2>
          <div style="display:flex;flex-direction:column;gap:1rem">
            <p style="font-size:14px;color:var(--ink-2);line-height:1.75">
              Budi dan Sari ketemu waktu kerja di Tokopedia 2014. Keduanya frustrasi melihat proyek teknologi perusahaan Indonesia yang gagal, bukan karena teknologinya jelek, tapi karena vendor tidak mengerti bisnis dan bisnis tidak mengerti teknologi.
            </p>
            <p style="font-size:14px;color:var(--ink-2);line-height:1.75">
              Mereka keluar, sewa ruko kecil di Kebayoran, dan mulai dengan tiga prinsip: tidak ambil proyek yang tidak bisa dikerjakan dengan baik, selalu transparan soal progress, dan tidak menghilang setelah launch.
            </p>
            <p style="font-size:14px;color:var(--ink-2);line-height:1.75">
              Sembilan tahun kemudian, tim bertambah dari 4 jadi 150+, tapi orang yang pertama kali telepon ke nomor kami masih akan dapat respons dari manusia, bukan bot.
            </p>
          </div>
        </div>

        <!-- Timeline -->
        <div class="reveal">
          <div style="display:flex;flex-direction:column;gap:0">
            ${[
              ["2015", "Berdiri", "4 orang, 1 ruko, 3 laptop. Proyek pertama: website company profile Rp 8 juta."],
              ["2017", "Tumbuh", "Tim jadi 20 orang. Mulai ambil proyek mobile app dan klien enterprise pertama."],
              ["2019", "Ekspansi AI", "Buka divisi data & AI. Proyek ML pertama untuk prediksi churn pelanggan telko."],
              ["2021", "150+ Tim", "Buka kantor kedua di Surabaya. Mulai handle proyek lintas negara."],
              ["2024", "Sekarang", "500+ proyek selesai. Masih jalan dengan prinsip yang sama sejak hari pertama."],
            ].map(([year, title, desc], i, arr) => `
              <div style="display:flex;gap:1.25rem;padding-bottom:${i < arr.length - 1 ? '1.75rem' : '0'}">
                <div style="display:flex;flex-direction:column;align-items:center;gap:0">
                  <div style="width:10px;height:10px;border-radius:50%;background:${i === arr.length - 1 ? 'var(--accent)' : 'var(--ink)'};flex-shrink:0;margin-top:4px"></div>
                  ${i < arr.length - 1 ? `<div style="width:1px;flex:1;background:var(--surface-3);margin-top:4px"></div>` : ''}
                </div>
                <div style="padding-bottom:${i < arr.length - 1 ? '0' : '0'}">
                  <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.25rem">
                    <span style="font-size:13px;font-weight:700;color:var(--ink)">${title}</span>
                    <span style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink-3)">${year}</span>
                  </div>
                  <p style="font-size:13px;color:var(--ink-3);line-height:1.6">${desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section style="background:var(--surface);border-top:1px solid var(--surface-3);padding:4rem 0">
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--surface-3);border-radius:var(--radius-lg);overflow:hidden;background:#fff">
        ${[
          ["2015", "", "Tahun berdiri"],
          ["150", "+", "Tim saat ini"],
          ["500", "+", "Proyek"],
          ["200", "+", "Klien"],
        ].map(([num, suf, label], i) => `
          <div class="reveal reveal-d${i + 1}" style="padding:2rem;${i < 3 ? 'border-right:1px solid var(--surface-3)' : ''}">
            <p style="font-size:2.2rem;font-weight:900;letter-spacing:-0.04em;color:var(--ink)" data-counter data-target="${num}" data-suffix="${suf}">${0}${suf}</p>
            <p style="font-size:12px;color:var(--ink-3);margin-top:0.25rem">${label}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Team -->
  <section id="team" style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:3rem;flex-wrap:wrap">
        <h2 class="reveal" style="font-size:1.75rem">Orang sungguhan, bukan foto stock</h2>
        <p class="reveal" style="font-size:13px;color:var(--ink-3)">Ini orang yang Anda ajak meeting, bukan nama di brosur.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem">
        ${team.map((m, i) => `
          <div class="reveal reveal-d${(i % 4) + 1}" style="border:1px solid var(--surface-3);border-radius:var(--radius-lg);overflow:hidden;background:#fff">
            <div style="background:var(--surface-2);padding:1.75rem 1.75rem 1.25rem;border-bottom:1px solid var(--surface-3)">
              <div style="width:44px;height:44px;border-radius:8px;background:var(--ink);color:#fafafa;display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:11px;font-weight:700;margin-bottom:0.75rem">${m.photo}</div>
              <p style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:0.2rem">${m.name}</p>
              <p style="font-size:12px;color:var(--accent);font-weight:500">${m.role}</p>
            </div>
            <div style="padding:1.25rem 1.75rem">
              <p style="font-size:13px;color:var(--ink-3);line-height:1.6;margin-bottom:1rem">${m.bio}</p>
              <div style="display:flex;align-items:center;gap:0.5rem;padding-top:0.75rem;border-top:1px solid var(--surface-3)">
                <span style="font-size:13px">-</span>
                <p style="font-size:12px;color:var(--ink-3);font-style:italic">${m.funFact}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Culture -->
  <section style="padding:5rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="margin-bottom:2.5rem">
        <h2 class="reveal" style="font-size:1.75rem;margin-bottom:0.5rem">Cara kerja kami</h2>
        <p class="reveal" style="font-size:14px;color:var(--ink-3)">Tidak ada lembur paksa. Ada ping-pong (satu meja). Ini yang lebih penting:</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--surface-3);border-radius:var(--radius-lg);overflow:hidden">
        ${[
          ["Tulis dulu, kerjakan kemudian", "Semua keputusan teknis penting kami dokumentasikan. ADR, README, runbook, bukan cuma ada di kepala satu orang."],
          ["Tidak ada lembur paksa", "Deadline ketat? Kami negosiasikan scope, bukan minta tim kerja sampai jam 2 pagi. Burnout itu mahal."],
          ["Feedback loop cepat", "Code review dalam 24 jam, standup 15 menit, retrospective tiap sprint. Masalah ketahuan cepat, selesai juga cepat."],
        ].map(([title, desc], i) => `
          <div class="reveal reveal-d${i + 1}" style="padding:2rem;background:#fff;${i < 2 ? 'border-right:1px solid var(--surface-3)' : ''}">
            <p style="font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--accent);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.1em">${String(i + 1).padStart(2, '0')}</p>
            <p style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:0.5rem">${title}</p>
            <p style="font-size:13px;color:var(--ink-3);line-height:1.65">${desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Hiring CTA -->
  <section style="padding:5rem 0;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container-sm reveal">
      <div style="border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:3rem;background:var(--surface)">
        <h2 style="font-size:1.5rem;margin-bottom:0.75rem">Ingin bergabung?</h2>
        <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin-bottom:1.75rem;max-width:480px">
          Kami cari orang yang bisa berpikir mandiri, nulis kode yang bisa dibaca orang lain, dan tidak takut bilang "saya tidak tahu" lalu langsung cari jawabannya.
        </p>
        <a href="/contact" class="btn btn-dark">Kirim CV dan portfolio &rarr;</a>
      </div>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:5rem"] { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:6rem"] { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
      div[style*="grid-template-columns:repeat(4,1fr)"] { grid-template-columns: 1fr 1fr !important; }
      div[style*="grid-template-columns:repeat(4,1fr)"][style*="border:1px solid var(--surface-3)"] { grid-template-columns: 1fr 1fr !important; }
      div[style*="grid-template-columns:repeat(3,1fr)"][style*="border:1px solid var(--surface-3)"] { grid-template-columns: 1fr !important; }
      div[style*="border-right:1px solid var(--surface-3)"] { border-right: none !important; border-bottom: 1px solid var(--surface-3) !important; }
    }
  </style>
`;

export const aboutPage = () => layout("Tim Kami", content, "about");
