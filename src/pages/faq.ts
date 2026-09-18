import { baseLayout } from "../layouts/base";
import { ctaSection } from "../components/cta";
import { getTranslation, localePath } from "../i18n/index";
import type { Locale } from "../i18n/types";

function faqHero(locale: Locale): string {
  const t = getTranslation(locale);
  const f = t.faq;
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;overflow:hidden;position:relative;
  ">
    <!-- Decorative beer mug SVG (100% generic, no IP) -->
    <div style="
      position:absolute;right:5%;top:50%;transform:translateY(-50%);
      font-size:clamp(4rem,10vw,8rem);opacity:0.08;pointer-events:none;
      line-height:1;
    ">🍺</div>
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;border-radius:999px;
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
        ">${f.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${f.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${f.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:500px;margin:0 auto;line-height:1.7;
      ">${f.heroDescription}</p>
    </div>
  </section>`;
}

function faqAccordion(locale: Locale): string {
  const t     = getTranslation(locale);
  const items = t.faq.items;

  const entries = items.map((item, i) => `
    <!-- FAQ item ${i} -->
    <div class="faq-item reveal reveal-d${(i % 4) + 1}" style="
      border:3px solid #1A1A2E;
      border-radius:16px;
      overflow:hidden;
      box-shadow:4px 4px 0 #1A1A2E;
      transition:box-shadow 0.15s;
    ">
      <!-- Question bubble (Moe asking) -->
      <button onclick="toggleFaq(${i})" style="
        width:100%;
        background:#FED41D;
        border:none;cursor:pointer;
        padding:1.25rem 1.5rem;
        display:flex;align-items:center;gap:1rem;
        text-align:left;
      ">
        <div style="
          width:38px;height:38px;flex-shrink:0;
          background:#1A1A2E;
          border:2px solid #1A1A2E;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:1.2rem;
        ">🙋</div>
        <span style="
          font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
          color:#1A1A2E;flex:1;line-height:1.4;
        ">${item.q}</span>
        <span id="faq-icon-${i}" style="
          font-size:1.4rem;color:#1A1A2E;transition:transform 0.25s;
          flex-shrink:0;font-weight:700;
        ">+</span>
      </button>

      <!-- Answer bubble (Moe answering) -->
      <div id="faq-answer-${i}" style="
        display:none;
        background:#FFFEF7;
        border-top:3px solid #1A1A2E;
        padding:0;
        overflow:hidden;
      ">
        <div style="display:flex;gap:1rem;align-items:flex-start;padding:1.25rem 1.5rem;">
          <div style="
            width:38px;height:38px;flex-shrink:0;
            background:#87CEEB;
            border:2px solid #1A1A2E;
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:1.2rem;margin-top:0.15rem;
          ">🍺</div>
          <div style="
            background:#F0F8FF;
            border:2px solid #87CEEB;
            border-radius:0 14px 14px 14px;
            padding:0.9rem 1.1rem;
            flex:1;
          ">
            <p style="
              font-family:'Fredoka',sans-serif;font-size:0.95rem;
              color:#1A1A2E;line-height:1.7;margin:0;
            ">${item.a}</p>
          </div>
        </div>
      </div>
    </div>`).join("");

  return `
  <section class="section">
    <div class="container" style="max-width:800px;">
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${entries}
      </div>
    </div>
  </section>

  <script>
    function toggleFaq(idx) {
      var ans  = document.getElementById('faq-answer-' + idx);
      var icon = document.getElementById('faq-icon-' + idx);
      var open = ans.style.display === 'block';
      ans.style.display  = open ? 'none' : 'block';
      icon.textContent   = open ? '+' : '−';
      icon.style.transform = open ? '' : 'rotate(45deg)';
    }
  </script>`;
}

export function faqPage(locale: Locale): string {
  const t = getTranslation(locale);

  const content = `
    ${faqHero(locale)}
    <div class="comic-divider"></div>
    ${faqAccordion(locale)}
    ${ctaSection({
      heading:        locale === "en" ? "Still Got Questions?" : "Masih Ada Pertanyaan?",
      subheading:     locale === "en"
        ? "Don't have a cow — just send us a message and we'll get back to you. Woo-hoo!"
        : "Jangan sungkan — kirimi kami pesan dan kami akan segera membalas.",
      primaryLabel:   locale === "en" ? "Contact Us ✦" : "Hubungi Kami ✦",
      primaryHref:    localePath(locale, "/contact"),
      secondaryLabel: locale === "en" ? "View Services" : "Lihat Layanan",
      secondaryHref:  localePath(locale, "/services"),
    })}
  `;

  return baseLayout({
    title:       t.seo.faqTitle,
    description: t.seo.faqDescription,
    activePage:  localePath(locale, "/faq"),
    locale,
    content,
  });
}
