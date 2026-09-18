import { baseLayout } from "../layouts/base";
import { card } from "../components/card";
import { ctaSection } from "../components/cta";
import { services } from "../data/company";

function servicesHero(): string {
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;
    text-align:center;
  ">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;
          border-radius:999px;font-family:'Fredoka',sans-serif;
          font-size:0.85rem;font-weight:600;color:#FED41D;
        ">🛠 Layanan Kami</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;
        font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;
        line-height:1.05;margin-bottom:1rem;
      ">Solusi Lengkap<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">untuk Tim Anda</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:520px;margin:0 auto;line-height:1.7;
      ">Dari ideasi produk hingga infrastruktur skala enterprise — satu partner untuk semua kebutuhan digital Anda.</p>
    </div>
  </section>`;
}

function servicesGrid(): string {
  const cards = services.map((s, i) =>
    `<div class="reveal reveal-d${(i % 3) + 1}">
      ${card({ title: s.title, body: s.description, icon: s.icon, badge: s.detail })}
    </div>`
  ).join("");

  return `
  <section class="section">
    <div class="container">
      <div class="grid-3">${cards}</div>
    </div>
  </section>`;
}

function processSection(): string {
  const steps = [
    { num: "01", title: "Discovery",      body: "Workshop intensif untuk memahami bisnis, pain point, dan target outcome. Kita align sebelum satu baris kode pun ditulis." },
    { num: "02", title: "Architecture",   body: "Technical design, ADR, dan pemilihan stack yang tepat. Dokumen arsitektur jadi living document sepanjang proyek." },
    { num: "03", title: "Build",          body: "Sprint dua minggu. Demo tiap akhir sprint. Continuous integration dari hari pertama — tidak ada big bang release." },
    { num: "04", title: "Deploy & Scale", body: "Zero-downtime deployment, monitoring end-to-end, dan post-launch support untuk pastikan sistem stabil di production." },
  ];

  const items = steps.map((s, i) => `
    <div class="reveal reveal-d${i + 1}" style="
      display:flex;gap:1.25rem;align-items:flex-start;
      padding:1.5rem;
      border:3px solid #1A1A2E;
      border-radius:16px;
      background:#FFFEF7;
      box-shadow:4px 4px 0 #FED41D;
    ">
      <div style="
        min-width:52px;height:52px;
        background:#FED41D;
        border:3px solid #1A1A2E;
        border-radius:12px;
        display:flex;align-items:center;justify-content:center;
        font-family:'Bangers',cursive;
        font-size:1.3rem;letter-spacing:0.05em;color:#1A1A2E;
        flex-shrink:0;
      ">${s.num}</div>
      <div>
        <h3 style="font-family:'Bangers',cursive;font-size:1.3rem;letter-spacing:0.04em;color:#1A1A2E;margin-bottom:0.4rem;">${s.title}</h3>
        <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44;line-height:1.6;margin:0;">${s.body}</p>
      </div>
    </div>`).join("");

  return `
  <section class="section" style="background:#1A1A2E;">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#FED41D;margin-bottom:0.75rem;
        ">Cara Kami Bekerja</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#FFFEF799;max-width:440px;margin:0 auto;">
          Proses yang terstruktur, komunikasi yang transparan.
        </p>
      </div>
      <div class="grid-2" style="gap:1.25rem;">${items}</div>
    </div>
  </section>`;
}

function techStackSection(): string {
  const stacks = [
    { cat: "Backend",      items: ["Go", "Node.js", "Python", "Rust"] },
    { cat: "Frontend",     items: ["React", "Next.js", "TypeScript", "Tailwind"] },
    { cat: "Mobile",       items: ["React Native", "Swift", "Kotlin", "Flutter"] },
    { cat: "Cloud & Infra",items: ["AWS", "GCP", "Kubernetes", "Terraform"] },
    { cat: "Data",         items: ["PostgreSQL", "MongoDB", "Kafka", "Redis"] },
    { cat: "AI/ML",        items: ["PyTorch", "LangChain", "Hugging Face", "MLflow"] },
  ];

  const groups = stacks.map((s, i) => `
    <div class="reveal reveal-d${(i % 3) + 1}" style="
      padding:1.25rem;
      border:3px solid #FED41D33;
      border-radius:14px;
      background:#FFFEF708;
    ">
      <h4 style="
        font-family:'Bangers',cursive;font-size:1rem;
        letter-spacing:0.06em;color:#FED41D;margin-bottom:0.75rem;
      ">${s.cat}</h4>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
        ${s.items.map(it => `
          <span style="
            padding:0.2rem 0.7rem;
            background:#FED41D18;
            border:1.5px solid #FED41D44;
            border-radius:999px;
            font-family:'Fredoka',sans-serif;
            font-size:0.8rem;font-weight:500;
            color:#FFFEF7CC;
          ">${it}</span>`).join("")}
      </div>
    </div>`).join("");

  return `
  <section class="section">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.75rem;
        ">Tech Stack</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#2D2D44AA;max-width:400px;margin:0 auto;">
          Kami pilih tools yang tepat untuk masalah yang tepat — bukan yang lagi hype.
        </p>
      </div>
      <div class="grid-3" style="gap:1.25rem;">
        ${groups}
      </div>
    </div>
  </section>`;
}

export function servicesPage(): string {
  const content = `
    ${servicesHero()}
    <div class="comic-divider"></div>
    ${servicesGrid()}
    ${processSection()}
    <div class="comic-divider"></div>
    ${techStackSection()}
    ${ctaSection({
      heading: "Butuh Konsultasi Teknis?",
      subheading: "Gratis 60 menit — kami review arsitektur atau stack Anda dan kasih feedback jujur.",
      primaryLabel: "Jadwalkan Konsultasi",
      primaryHref: "/contact",
      secondaryLabel: "Lihat Portfolio",
      secondaryHref: "/portfolio",
    })}
  `;

  return baseLayout({
    title: "Layanan",
    description: "Product engineering, cloud/DevOps, mobile, AI, security, dan analytics — solusi lengkap untuk startup hingga enterprise.",
    activePage: "/services",
    content,
  });
}
