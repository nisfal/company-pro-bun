import type { CtaProps } from "../lib/types";

/**
 * Full-width CTA section — dark ink background, yellow headline, comic border.
 */
export function ctaSection({
  heading,
  subheading,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaProps): string {
  const secondary = secondaryLabel && secondaryHref
    ? `<a href="${secondaryHref}" style="
        display:inline-block;
        padding:0.75rem 2rem;
        border:3px solid #FED41D;
        border-radius:12px;
        background:transparent;
        color:#FED41D;
        font-family:'Fredoka',sans-serif;
        font-size:1rem;
        font-weight:600;
        text-decoration:none;
        transition:background 0.15s,color 0.15s;
      " onmouseover="this.style.background='#FED41D';this.style.color='#1A1A2E'"
         onmouseout="this.style.background='transparent';this.style.color='#FED41D'"
      >${secondaryLabel}</a>`
    : "";

  return `
  <section style="
    background:#1A1A2E;
    border-top:4px solid #FED41D;
    border-bottom:4px solid #FED41D;
    padding:5rem 1.5rem;
    text-align:center;
  ">
    <div style="max-width:640px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:1.5rem;">
      <h2 style="
        font-family:'Bangers',cursive;
        font-size:clamp(2.2rem,6vw,3.5rem);
        color:#FED41D;
        letter-spacing:0.06em;
        line-height:1.1;
        margin:0;
      ">${heading}</h2>
      <p style="
        font-family:'Fredoka',sans-serif;
        font-size:1.1rem;
        color:#87CEEB;
        line-height:1.6;
        margin:0;
      ">${subheading}</p>
      <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-top:0.5rem;">
        <a href="${primaryHref}" style="
          display:inline-block;
          padding:0.85rem 2.25rem;
          background:#FED41D;
          color:#1A1A2E;
          border:3px solid #1A1A2E;
          border-radius:12px;
          font-family:'Fredoka',sans-serif;
          font-size:1rem;
          font-weight:700;
          text-decoration:none;
          box-shadow:4px 4px 0px #F5C400;
          transition:transform 0.1s,box-shadow 0.1s;
        " onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='6px 6px 0px #F5C400'"
           onmouseout="this.style.transform='';this.style.boxShadow='4px 4px 0px #F5C400'"
        >${primaryLabel}</a>
        ${secondary}
      </div>
    </div>
  </section>`;
}
