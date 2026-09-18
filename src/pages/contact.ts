import { baseLayout } from "../layouts/base";
import { company } from "../data/company";
import { getTranslation, interpolate, localePath } from "../i18n/index";
import type { Locale } from "../i18n/types";

function contactHero(locale: Locale): string {
  const t = getTranslation(locale);
  const c = t.contact;
  return `
  <section style="
    background:linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%);
    padding:5rem 1.5rem 4rem;text-align:center;
  ">
    <div class="container">
      <div class="reveal" style="margin-bottom:1rem;">
        <span style="
          display:inline-block;padding:0.3rem 1rem;
          background:#FED41D22;border:2px solid #FED41D44;border-radius:999px;
          font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#FED41D;
        ">${c.badge}</span>
      </div>
      <h1 class="reveal reveal-d1" style="
        font-family:'Bangers',cursive;font-size:clamp(2.5rem,7vw,4.5rem);
        letter-spacing:0.05em;color:#FFFEF7;line-height:1.05;margin-bottom:1rem;
      ">${c.heroHeadline1}<br/><span style="color:#FED41D;text-shadow:4px 4px 0 #1A1A2E;">${c.heroHeadline2}</span></h1>
      <p class="reveal reveal-d2" style="
        font-family:'Fredoka',sans-serif;font-size:1.05rem;
        color:#FFFEF7AA;max-width:480px;margin:0 auto;line-height:1.7;
      ">${c.heroDescription}</p>
    </div>
  </section>`;
}

function inputField(id: string, label: string, type: string, placeholder: string): string {
  return `
  <div style="display:flex;flex-direction:column;gap:0.4rem;">
    <label for="${id}" style="font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#1A1A2E;">
      ${label} <span style="color:#FF6B6B;">*</span>
    </label>
    <input type="${type}" id="${id}" name="${id}" placeholder="${placeholder}" required style="
      padding:0.7rem 1rem;border:2.5px solid #1A1A2E;border-radius:10px;
      font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#1A1A2E;
      background:#FFFEF7;outline:none;transition:border-color 0.15s,box-shadow 0.15s;
    "
    onfocus="this.style.borderColor='#FED41D';this.style.boxShadow='0 0 0 3px #FED41D44'"
    onblur="this.style.borderColor='#1A1A2E';this.style.boxShadow='none'"
    />
  </div>`;
}

function selectField(id: string, label: string, placeholder: string, options: string[]): string {
  const opts = options.map(o =>
    `<option value="${o.toLowerCase().replace(/\s+/g, "-")}">${o}</option>`
  ).join("");
  return `
  <div style="display:flex;flex-direction:column;gap:0.4rem;">
    <label for="${id}" style="font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#1A1A2E;">
      ${label} <span style="color:#FF6B6B;">*</span>
    </label>
    <select id="${id}" name="${id}" required style="
      padding:0.7rem 1rem;border:2.5px solid #1A1A2E;border-radius:10px;
      font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#1A1A2E;
      background:#FFFEF7;outline:none;cursor:pointer;transition:border-color 0.15s;
    "
    onfocus="this.style.borderColor='#FED41D'"
    onblur="this.style.borderColor='#1A1A2E'"
    >
      <option value="" disabled selected>${placeholder}</option>
      ${opts}
    </select>
  </div>`;
}

function textareaField(id: string, label: string, placeholder: string): string {
  return `
  <div style="display:flex;flex-direction:column;gap:0.4rem;">
    <label for="${id}" style="font-family:'Fredoka',sans-serif;font-size:0.85rem;font-weight:600;color:#1A1A2E;">
      ${label} <span style="color:#FF6B6B;">*</span>
    </label>
    <textarea id="${id}" name="${id}" placeholder="${placeholder}" required rows="5" style="
      padding:0.7rem 1rem;border:2.5px solid #1A1A2E;border-radius:10px;
      font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#1A1A2E;
      background:#FFFEF7;outline:none;resize:vertical;transition:border-color 0.15s,box-shadow 0.15s;
    "
    onfocus="this.style.borderColor='#FED41D';this.style.boxShadow='0 0 0 3px #FED41D44'"
    onblur="this.style.borderColor='#1A1A2E';this.style.boxShadow='none'"
    ></textarea>
  </div>`;
}

function infoCard(icon: string, title: string, body: string): string {
  return `
  <div class="reveal" style="
    background:#FFFEF7;border:3px solid #1A1A2E;border-radius:14px;
    box-shadow:4px 4px 0 #1A1A2E;padding:1.25rem;
    display:flex;gap:1rem;align-items:flex-start;
  ">
    <div style="font-size:1.5rem;line-height:1;flex-shrink:0;">${icon}</div>
    <div>
      <div style="font-family:'Bangers',cursive;font-size:1rem;letter-spacing:0.04em;color:#1A1A2E;margin-bottom:0.25rem;">${title}</div>
      <div style="font-family:'Fredoka',sans-serif;font-size:0.88rem;color:#2D2D44;line-height:1.5;">${body}</div>
    </div>
  </div>`;
}

function socialLink(code: string, label: string, href: string): string {
  return `
  <a href="${href}" target="_blank" rel="noopener noreferrer" style="
    display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0.75rem;
    border:2px solid #FED41D22;border-radius:8px;
    text-decoration:none;transition:border-color 0.15s,background 0.15s;
  "
  onmouseover="this.style.borderColor='#FED41D';this.style.background='#FED41D11'"
  onmouseout="this.style.borderColor='#FED41D22';this.style.background='transparent'"
  >
    <span style="
      width:28px;height:28px;background:#FED41D22;border:1.5px solid #FED41D44;
      border-radius:6px;display:flex;align-items:center;justify-content:center;
      font-family:'Bangers',cursive;font-size:0.7rem;color:#FED41D;flex-shrink:0;
    ">${code.toUpperCase()}</span>
    <span style="font-family:'Fredoka',sans-serif;font-size:0.88rem;font-weight:500;color:#FFFEF7CC;">${label}</span>
  </a>`;
}

function contactForm(locale: Locale): string {
  const t  = getTranslation(locale);
  const c  = t.contact;
  const f  = c.fields;

  return `
  <section class="section">
    <div class="container">
      <div style="display:grid;grid-template-columns:3fr 2fr;gap:3rem;align-items:start;" class="contact-grid">

        <!-- Form -->
        <div class="reveal" style="
          background:#FFFEF7;border:3px solid #1A1A2E;border-radius:20px;
          box-shadow:8px 8px 0 #FED41D;padding:2.5rem;
        ">
          <h2 style="font-family:'Bangers',cursive;font-size:1.8rem;letter-spacing:0.05em;color:#1A1A2E;margin-bottom:0.5rem;">
            ${c.formHeading}
          </h2>
          <p style="font-family:'Fredoka',sans-serif;font-size:0.9rem;color:#2D2D44AA;margin-bottom:2rem;">
            ${c.formSubheading}
          </p>

          <form id="contact-form" style="display:flex;flex-direction:column;gap:1.25rem;"
            onsubmit="handleContactSubmit(event)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;" class="form-row">
              ${inputField("name",  f.name,  "text",  f.namePlaceholder)}
              ${inputField("email", f.email, "email", f.emailPlaceholder)}
            </div>
            ${inputField("company", f.company, "text", f.companyPlaceholder)}
            ${selectField("service", f.service, f.servicePlaceholder, f.serviceOptions)}
            ${textareaField("message", f.message, f.messagePlaceholder)}

            <button type="submit" id="submit-btn" style="
              padding:0.9rem 2rem;background:#FED41D;color:#1A1A2E;
              border:3px solid #1A1A2E;border-radius:12px;
              font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
              cursor:pointer;box-shadow:5px 5px 0 #1A1A2E;
              transition:transform 0.1s,box-shadow 0.1s;align-self:flex-start;
            "
            onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='7px 7px 0 #1A1A2E'"
            onmouseout="this.style.transform='';this.style.boxShadow='5px 5px 0 #1A1A2E'"
            >${c.submitLabel}</button>
          </form>

          <div id="form-success" style="display:none;
            margin-top:1.5rem;padding:1rem 1.25rem;
            background:#4CAF5018;border:2px solid #4CAF50;border-radius:12px;
            font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2D6A2D;
          ">${c.successMessage}</div>
          <div id="form-error" style="display:none;
            margin-top:1.5rem;padding:1rem 1.25rem;
            background:#FF6B6B18;border:2px solid #FF6B6B;border-radius:12px;
            font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#8B0000;
          ">${c.errorMessage}</div>
        </div>

        <!-- Sidebar -->
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
          ${infoCard("📍", c.infoAddress, company.address)}
          ${infoCard("✉️", c.infoEmail, `<a href="mailto:${company.email}" style="color:#5BA8D4;text-decoration:none;">${company.email}</a>`)}
          ${infoCard("📞", c.infoPhone, `<a href="tel:${company.phone.replace(/\s/g,"")}" style="color:#5BA8D4;text-decoration:none;">${company.phone}</a>`)}

          <div class="reveal" style="
            background:#1A1A2E;border:3px solid #FED41D;border-radius:16px;
            box-shadow:5px 5px 0 #FED41D44;padding:1.5rem;
          ">
            <h3 style="font-family:'Bangers',cursive;font-size:1.1rem;letter-spacing:0.05em;color:#FED41D;margin-bottom:1rem;">
              ${c.socialHeading}
            </h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              ${socialLink("in", "LinkedIn",  company.social.linkedin)}
              ${socialLink("tw", "Twitter / X", company.social.twitter)}
              ${socialLink("gh", "GitHub",    company.social.github)}
              ${socialLink("ig", "Instagram", company.social.instagram)}
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>
      @media(max-width:768px){
        .contact-grid{grid-template-columns:1fr !important;}
        .form-row{grid-template-columns:1fr !important;}
      }
    </style>
  </section>`;
}

function contactScript(locale: Locale): string {
  const t       = getTranslation(locale);
  const apiPath = localePath(locale, "/api/contact");
  const sending = t.ui.sending;
  const submit  = t.contact.submitLabel;

  return `
  <script>
    async function handleContactSubmit(e) {
      e.preventDefault();
      var btn     = document.getElementById('submit-btn');
      var success = document.getElementById('form-success');
      var error   = document.getElementById('form-error');
      var form    = document.getElementById('contact-form');
      btn.disabled    = true;
      btn.textContent = '${sending}';
      success.style.display = 'none';
      error.style.display   = 'none';
      var data = {
        name:    form.name.value,
        email:   form.email.value,
        company: form.company.value,
        service: form.service.value,
        message: form.message.value,
      };
      try {
        var res = await fetch('${apiPath}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) { success.style.display = 'block'; form.reset(); }
        else        { error.style.display   = 'block'; }
      } catch (_) {
        error.style.display = 'block';
      } finally {
        btn.disabled    = false;
        btn.textContent = '${submit}';
      }
    }
  </script>`;
}

export function contactPage(locale: Locale): string {
  const t    = getTranslation(locale);
  const desc = interpolate(t.seo.contactDescription, { name: company.name });

  const content = `
    ${contactHero(locale)}
    <div class="comic-divider"></div>
    ${contactForm(locale)}
    ${contactScript(locale)}
  `;

  return baseLayout({
    title:       t.seo.contactTitle,
    description: desc,
    activePage:  localePath(locale, "/contact"),
    locale,
    content,
  });
}
