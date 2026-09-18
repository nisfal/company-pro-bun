import { baseLayout } from "../layouts/base";
import { statsStrip } from "../components/stats";
import { ctaSection } from "../components/cta";
import { company, team } from "../data/company";

function aboutHero(): string {
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;
  ">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;
          border-radius:999px;font-family:'Fredoka',sans-serif;
          font-size:0.85rem;font-weight:600;color:#FED41D;
        ">🏢 Tentang Kami</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;
        font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">Kami Percaya<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">Teknologi Mengubah Bisnis</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:520px;margin:0 auto;line-height:1.7;
      ">Sejak ${company.founded}, kami membantu ratusan perusahaan Indonesia tumbuh lebih cepat lewat teknologi yang tepat.</p>
    </div>
  </section>`;
}

function storySection(): string {
  return `
  <section class="section">
    <div class="container">
      <div style="
        display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;
      " class="story-grid">
        <div>
          <h2 class="reveal" style="
            font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
            letter-spacing:0.05em;color:#1A1A2E;margin-bottom:1.5rem;line-height:1.1;
          ">Asal Mula<br/>NusaTech</h2>
          <div style="display:flex;flex-direction:column;gap:1rem;">
            <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2D2D44;line-height:1.7;margin:0;">
              Didirikan tahun ${company.founded} oleh dua engineer yang frustrasi melihat banyak proyek teknologi gagal bukan karena masalah teknis, melainkan karena komunikasi yang buruk antara tim bisnis dan tim engineering.
            </p>
            <p class="reveal reveal-d2" style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2D2D44;line-height:1.7;margin:0;">
              Kami membangun NusaTech dengan satu prinsip sederhana: jadi partner, bukan vendor. Ini berarti kami ikut memikirkan bisnis Anda, bukan hanya mengerjakan requirement yang datang.
            </p>
            <p class="reveal reveal-d3" style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2D2D44;line-height:1.7;margin:0;">
              Hari ini kami adalah tim ${company.employees} profesional yang telah menyelesaikan ${company.projects} proyek untuk ${company.clients} klien di berbagai industri.
            </p>
          </div>
        </div>

        <!-- Timeline -->
        <div class="reveal reveal-d2" style="display:flex;flex-direction:column;gap:0;">
          ${[
            { year: "2015", event: "NusaTech didirikan. Tim pertama 5 orang, klien pertama 3 startup." },
            { year: "2017", event: "Ekspansi ke enterprise. Proyek pertama dengan bank nasional." },
            { year: "2019", event: "Buka divisi Cloud & DevOps. Tim tumbuh ke 50 orang." },
            { year: "2021", event: "Luncurkan AI Lab. Mulai bangun produk data-driven untuk klien." },
            { year: "2023", event: "150+ tim, 500+ proyek, hadir di 5 kota Indonesia." },
          ].map((t, i, arr) => `
            <div style="display:flex;gap:1rem;align-items:flex-start;position:relative;">
              <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                <div style="
                  width:44px;height:44px;
                  background:#FED41D;
                  border:3px solid #1A1A2E;
                  border-radius:50%;
                  display:flex;align-items:center;justify-content:center;
                  font-family:'Bangers',cursive;font-size:0.78rem;
                  color:#1A1A2E;letter-spacing:0.02em;
                  flex-shrink:0;
                ">${t.year}</div>
                ${i < arr.length - 1 ? `<div style="width:3px;height:40px;background:#FED41D44;margin:2px 0;"></div>` : ""}
              </div>
              <div style="padding:0.5rem 0 ${i < arr.length - 1 ? "1.5rem" : "0"};">
                <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44;line-height:1.6;margin:0;">${t.event}</p>
              </div>
            </div>`).join("")}
        </div>
      </div>
    </div>
    <style>@media(max-width:768px){.story-grid{grid-template-columns:1fr !important;gap:2.5rem !important;}}</style>
  </section>`;
}

function statsSection(): string {
  return `
  <section class="section-sm" style="background:#FED41D;border-top:4px solid #1A1A2E;border-bottom:4px solid #1A1A2E;">
    <div class="container">
      ${statsStrip([
        { value: company.founded,   label: "Tahun Berdiri", suffix: "" },
        { value: company.employees, label: "Profesional",   suffix: "" },
        { value: company.projects,  label: "Proyek",        suffix: "" },
        { value: company.clients,   label: "Klien",         suffix: "" },
      ], false)}
    </div>
  </section>`;
}

function teamSection(): string {
  const cards = team.map((m, i) => `
    <div class="reveal reveal-d${i + 1} comic-card" style="
      background:#FFFEF7;
      border:3px solid #1A1A2E;
      border-radius:16px;
      box-shadow:5px 5px 0 #1A1A2E;
      padding:1.75rem;
      display:flex;flex-direction:column;gap:1rem;
      transition:transform 0.15s,box-shadow 0.15s;
    ">
      <div style="display:flex;align-items:center;gap:1rem;">
        <div style="
          width:56px;height:56px;
          background:#FED41D;
          border:3px solid #1A1A2E;
          border-radius:14px;
          box-shadow:3px 3px 0 #1A1A2E;
          display:flex;align-items:center;justify-content:center;
          font-family:'Bangers',cursive;font-size:1.2rem;
          color:#1A1A2E;flex-shrink:0;
        ">${m.initials}</div>
        <div>
          <div style="font-family:'Bangers',cursive;font-size:1.2rem;letter-spacing:0.04em;color:#1A1A2E;">${m.name}</div>
          <div style="font-family:'Fredoka',sans-serif;font-size:0.82rem;font-weight:600;color:#5BA8D4;">${m.role}</div>
        </div>
      </div>
      <p style="font-family:'Fredoka',sans-serif;font-size:0.88rem;color:#2D2D44;line-height:1.6;margin:0;flex:1;">${m.bio}</p>
      <div style="
        padding:0.6rem 0.9rem;
        background:#FED41D18;
        border:2px solid #FED41D66;
        border-radius:8px;
        font-family:'Fredoka',sans-serif;
        font-size:0.8rem;font-weight:500;color:#1A1A2E;
      ">💡 ${m.funFact}</div>
    </div>`).join("");

  return `
  <section class="section">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.75rem;
        ">Orang-Orang di Baliknya</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#2D2D44AA;max-width:440px;margin:0 auto;">
          Tim kecil yang dense — sedikit ego, banyak output.
        </p>
      </div>
      <div class="grid-2" style="gap:1.5rem;">${cards}</div>
    </div>
  </section>`;
}

function valuesSection(): string {
  const values = [
    { icon: "🎯", title: "Outcome over Output",   body: "Kami tidak hitung story points. Kami hitung dampak nyata ke bisnis Anda." },
    { icon: "🔍", title: "Radical Transparency",  body: "Kabar buruk disampaikan cepat. Tidak ada happy path reporting." },
    { icon: "🌱", title: "Kaizen",                body: "Setiap sprint lebih baik dari yang sebelumnya. Continuous improvement bukan slogan." },
    { icon: "🤝", title: "Respect & Inclusion",   body: "Tim yang beragam menghasilkan solusi yang lebih kaya. Selalu." },
  ];

  const items = values.map((v, i) => `
    <div class="reveal reveal-d${i + 1}" style="
      text-align:center;
      padding:2rem 1.5rem;
      border:3px solid #FED41D33;
      border-radius:16px;
      background:#FFFEF708;
      transition:border-color 0.15s,background 0.15s;
    "
    onmouseover="this.style.borderColor='#FED41D';this.style.background='#FED41D11'"
    onmouseout="this.style.borderColor='#FED41D33';this.style.background='#FFFEF708'"
    >
      <div style="font-size:2.5rem;margin-bottom:1rem;">${v.icon}</div>
      <h3 style="font-family:'Bangers',cursive;font-size:1.2rem;letter-spacing:0.04em;color:#FED41D;margin-bottom:0.5rem;">${v.title}</h3>
      <p style="font-family:'Fredoka',sans-serif;font-size:0.88rem;color:#FFFEF799;line-height:1.6;margin:0;">${v.body}</p>
    </div>`).join("");

  return `
  <section class="section" style="background:#1A1A2E;">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#FED41D;margin-bottom:0.75rem;
        ">Nilai-Nilai Kami</h2>
      </div>
      <div class="grid-4" style="gap:1.25rem;">${items}</div>
    </div>
  </section>`;
}

export function aboutPage(): string {
  const content = `
    ${aboutHero()}
    <div class="comic-divider"></div>
    ${storySection()}
    ${statsSection()}
    ${teamSection()}
    ${valuesSection()}
    ${ctaSection({
      heading: "Bergabung dengan Kami?",
      subheading: "Kami selalu mencari engineer, designer, dan PM yang passionate. Tidak ada posisi kosong? Kirim saja CV Anda.",
      primaryLabel: "Lihat Karir",
      primaryHref: "/contact",
      secondaryLabel: "Hubungi Kami",
      secondaryHref: "/contact",
    })}
  `;

  return baseLayout({
    title: "Tentang Kami",
    description: `${company.name} — ${company.tagline}. Didirikan ${company.founded}, ${company.employees} profesional, ${company.projects} proyek selesai.`,
    activePage: "/about",
    content,
  });
}
