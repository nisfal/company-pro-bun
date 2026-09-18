import { baseLayout } from "../layouts/base";
import { card } from "../components/card";
import { statsStrip } from "../components/stats";
import { ctaSection } from "../components/cta";
import { company, services, testimonials } from "../data/company";

function heroSection(): string {
  return `
  <section style="
    background: linear-gradient(160deg, #1A1A2E 0%, #2D2D44 100%);
    padding: 6rem 1.5rem 5rem;
    position: relative;
    overflow: hidden;
  ">
    <!-- Decorative blobs -->
    <div style="position:absolute;top:-80px;right:-80px;width:340px;height:340px;
      background:#FED41D22;border-radius:50%;pointer-events:none;"></div>
    <div style="position:absolute;bottom:-60px;left:-60px;width:260px;height:260px;
      background:#87CEEB18;border-radius:50%;pointer-events:none;"></div>

    <div class="container" style="position:relative;z-index:1;">
      <div style="max-width:720px;">
        <!-- Badge -->
        <div class="reveal" style="margin-bottom:1.25rem;">
          <span style="
            display:inline-flex;align-items:center;gap:0.4rem;
            padding:0.35rem 1rem;
            background:#FED41D22;
            border:2px solid #FED41D44;
            border-radius:999px;
            font-family:'Fredoka',sans-serif;
            font-size:0.85rem;font-weight:600;
            color:#FED41D;
            letter-spacing:0.04em;
          ">☀️ ${company.founded} — Hadir untuk Indonesia</span>
        </div>

        <h1 class="reveal reveal-d1" style="
          font-family:'Bangers',cursive;
          font-size:clamp(3rem,8vw,5.5rem);
          line-height:1.0;
          letter-spacing:0.04em;
          color:#FFFEF7;
          margin-bottom:0.5rem;
        ">
          Digital Solutions<br/>
          <span style="
            color:#FED41D;
            text-shadow:4px 4px 0px #1A1A2E;
          ">Kelas Dunia</span>
        </h1>

        <p class="reveal reveal-d2" style="
          font-family:'Fredoka',sans-serif;
          font-size:1.15rem;
          color:#FFFEF7BB;
          line-height:1.7;
          margin:1.5rem 0 2.5rem;
          max-width:560px;
        ">${company.description}</p>

        <div class="reveal reveal-d3" style="display:flex;flex-wrap:wrap;gap:1rem;">
          <a href="/services" style="
            padding:0.85rem 2.25rem;
            background:#FED41D;
            color:#1A1A2E;
            border:3px solid #1A1A2E;
            border-radius:12px;
            font-family:'Fredoka',sans-serif;
            font-size:1rem;font-weight:700;
            text-decoration:none;
            box-shadow:5px 5px 0px #F5C400;
            transition:transform 0.1s,box-shadow 0.1s;
          "
          onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='7px 7px 0px #F5C400'"
          onmouseout="this.style.transform='';this.style.boxShadow='5px 5px 0px #F5C400'"
          >Lihat Layanan ✦</a>
          <a href="/portfolio" style="
            padding:0.85rem 2.25rem;
            background:transparent;
            color:#FFFEF7;
            border:3px solid #FFFEF755;
            border-radius:12px;
            font-family:'Fredoka',sans-serif;
            font-size:1rem;font-weight:600;
            text-decoration:none;
            transition:border-color 0.15s,color 0.15s;
          "
          onmouseover="this.style.borderColor='#FED41D';this.style.color='#FED41D'"
          onmouseout="this.style.borderColor='#FFFEF755';this.style.color='#FFFEF7'"
          >Lihat Portfolio →</a>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="reveal reveal-d4" style="margin-top:4rem;">
        ${statsStrip([
          { value: company.projects,  label: "Proyek Selesai",   suffix: "" },
          { value: company.clients,   label: "Klien Puas",       suffix: "" },
          { value: company.employees, label: "Profesional",      suffix: "" },
          { value: "9",               label: "Tahun Pengalaman", suffix: " thn" },
        ], true)}
      </div>
    </div>
  </section>`;
}

function servicesPreview(): string {
  const cards = services.slice(0, 4).map((s, i) =>
    `<div class="reveal reveal-d${i + 1}">
      ${card({ title: s.title, body: s.description, icon: s.icon, footer: s.detail })}
    </div>`
  ).join("");

  return `
  <section class="section">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;
          font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;
          color:#1A1A2E;
          margin-bottom:0.75rem;
        ">Apa yang Kami Lakukan</h2>
        <p class="reveal reveal-d1" style="
          font-family:'Fredoka',sans-serif;
          font-size:1rem;color:#2D2D44BB;max-width:480px;margin:0 auto;line-height:1.6;
        ">Dari product engineering sampai cloud infrastructure — kami cover semua kebutuhan digital Anda.</p>
      </div>
      <div class="grid-2" style="gap:1.5rem;">
        ${cards}
      </div>
      <div class="reveal" style="text-align:center;margin-top:2.5rem;">
        <a href="/services" style="
          display:inline-block;
          padding:0.75rem 2rem;
          border:3px solid #1A1A2E;
          border-radius:12px;
          background:#FED41D;
          color:#1A1A2E;
          font-family:'Fredoka',sans-serif;
          font-size:0.95rem;font-weight:700;
          text-decoration:none;
          box-shadow:4px 4px 0px #1A1A2E;
          transition:transform 0.1s,box-shadow 0.1s;
        "
        onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='6px 6px 0px #1A1A2E'"
        onmouseout="this.style.transform='';this.style.boxShadow='4px 4px 0px #1A1A2E'"
        >Semua Layanan →</a>
      </div>
    </div>
  </section>`;
}

function whyUsSection(): string {
  const points = [
    { icon: "⚡", title: "Delivery Cepat",    body: "Metodologi Agile ketat. Sprint dua minggu. Demo tiap akhir sprint — tidak ada surprise di akhir." },
    { icon: "🔒", title: "Security First",    body: "Secure SDLC dari hari pertama. Code review, SAST, dependency audit — bukan afterthought." },
    { icon: "📈", title: "Scalable by Design", body: "Arsitektur dirancang untuk tumbuh. Dari 100 user ke 10 juta user tanpa rearchitecture besar." },
    { icon: "🤝", title: "Partner, Bukan Vendor", body: "Kami duduk di sisi Anda — ikut memikirkan bisnis, bukan hanya mengerjakan tiket." },
  ];

  const items = points.map((p, i) => `
    <div class="reveal reveal-d${i + 1}" style="
      display:flex;gap:1rem;align-items:flex-start;
      padding:1.25rem;
      border:2px solid #1A1A2E22;
      border-radius:14px;
      background:#FFFEF7;
      transition:border-color 0.15s,box-shadow 0.15s;
    "
    onmouseover="this.style.borderColor='#FED41D';this.style.boxShadow='4px 4px 0px #FED41D'"
    onmouseout="this.style.borderColor='#1A1A2E22';this.style.boxShadow='none'"
    >
      <div style="font-size:1.75rem;line-height:1;flex-shrink:0;">${p.icon}</div>
      <div>
        <h3 style="font-family:'Bangers',cursive;font-size:1.2rem;letter-spacing:0.04em;color:#1A1A2E;margin-bottom:0.35rem;">${p.title}</h3>
        <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44;line-height:1.6;margin:0;">${p.body}</p>
      </div>
    </div>`).join("");

  return `
  <section class="section" style="background:#1A1A2E;">
    <div class="container">
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:4rem;
        align-items:center;
      " class="grid-why">
        <div>
          <h2 class="reveal" style="
            font-family:'Bangers',cursive;
            font-size:clamp(2rem,5vw,3rem);
            letter-spacing:0.05em;
            color:#FED41D;
            margin-bottom:1rem;
            line-height:1.1;
          ">Kenapa Pilih<br/>NusaTech?</h2>
          <p class="reveal reveal-d1" style="
            font-family:'Fredoka',sans-serif;
            font-size:1rem;color:#FFFEF799;line-height:1.7;margin-bottom:2rem;
          ">Kami bukan body shop. Kami adalah tim engineering yang peduli dengan outcome bisnis Anda — bukan hanya output teknis.</p>
          <a class="reveal reveal-d2" href="/about" style="
            display:inline-block;
            padding:0.75rem 1.75rem;
            background:#FED41D;
            color:#1A1A2E;
            border:3px solid #FED41D;
            border-radius:12px;
            font-family:'Fredoka',sans-serif;
            font-size:0.95rem;font-weight:700;
            text-decoration:none;
            box-shadow:4px 4px 0px #F5C400;
          ">Tentang Kami →</a>
        </div>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          ${items}
        </div>
      </div>
    </div>
    <style>
      @media(max-width:768px){.grid-why{grid-template-columns:1fr !important;gap:2rem !important;}}
    </style>
  </section>`;
}

function testimonialsSection(): string {
  const cards = testimonials.map((t, i) => `
    <div class="reveal reveal-d${i + 1}" style="
      background:#FFFEF7;
      border:3px solid #1A1A2E;
      border-radius:16px;
      box-shadow:5px 5px 0px #FED41D;
      padding:1.75rem;
      display:flex;flex-direction:column;gap:1rem;
    ">
      <div style="color:#FED41D;font-size:1.1rem;letter-spacing:0.1em;">${"★".repeat(t.rating)}</div>
      <p style="
        font-family:'Fredoka',sans-serif;
        font-size:0.95rem;
        color:#1A1A2E;
        line-height:1.7;
        flex:1;
        font-style:italic;
      ">"${t.text}"</p>
      <div style="display:flex;align-items:center;gap:0.75rem;padding-top:0.75rem;border-top:2px solid #1A1A2E22;">
        <div style="
          width:40px;height:40px;
          background:#FED41D;
          border:2px solid #1A1A2E;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-family:'Bangers',cursive;
          font-size:0.85rem;color:#1A1A2E;
          flex-shrink:0;
        ">${t.avatar}</div>
        <div>
          <div style="font-family:'Fredoka',sans-serif;font-size:0.9rem;font-weight:700;color:#1A1A2E;">${t.name}</div>
          <div style="font-family:'Fredoka',sans-serif;font-size:0.78rem;color:#2D2D44AA;">${t.role}, ${t.company}</div>
        </div>
      </div>
    </div>`).join("");

  return `
  <section class="section" style="background:#F5F5EC;">
    <div class="container">
      <div style="text-align:center;margin-bottom:3rem;">
        <h2 class="reveal" style="
          font-family:'Bangers',cursive;
          font-size:clamp(2rem,5vw,3rem);
          letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.75rem;
        ">Kata Klien Kami</h2>
        <p class="reveal reveal-d1" style="font-family:'Fredoka',sans-serif;font-size:1rem;color:#2D2D44BB;max-width:440px;margin:0 auto;">
          Hasil bicara lebih keras dari janji. Ini yang mereka katakan.
        </p>
      </div>
      <div class="grid-3">${cards}</div>
    </div>
  </section>`;
}

export function homePage(): string {
  const content = `
    ${heroSection()}
    <div class="comic-divider"></div>
    ${servicesPreview()}
    ${whyUsSection()}
    <div class="comic-divider"></div>
    ${testimonialsSection()}
    ${ctaSection({
      heading: "Siap Memulai Proyek?",
      subheading: "Ceritakan tantangan Anda — kami siap duduk bareng dan cari solusinya.",
      primaryLabel: "Hubungi Kami ✦",
      primaryHref: "/contact",
      secondaryLabel: "Lihat Portfolio",
      secondaryHref: "/portfolio",
    })}
  `;

  return baseLayout({
    title: "Beranda",
    description: company.description,
    activePage: "/",
    content,
  });
}
