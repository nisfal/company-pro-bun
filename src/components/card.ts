import type { CardProps } from "../lib/types";

/**
 * Generic comic-style card.
 * Thick border, hard shadow, yellow hover lift via CSS class `comic-card`.
 */
export function card({ title, body, icon, badge: badgeText, footer }: CardProps): string {
  return `
  <div class="comic-card" style="
    background:#FFFEF7;
    border:3px solid #1A1A2E;
    border-radius:16px;
    box-shadow:5px 5px 0px #1A1A2E;
    padding:1.5rem;
    display:flex;
    flex-direction:column;
    gap:0.75rem;
    transition:transform 0.15s ease,box-shadow 0.15s ease;
    cursor:default;
  ">
    ${icon ? `<div style="font-size:2rem;line-height:1;">${icon}</div>` : ""}
    ${
      badgeText
        ? `<span style="
            display:inline-block;width:fit-content;
            padding:2px 10px;border-radius:999px;
            border:2px solid #1A1A2E;
            background:#FED41D;color:#1A1A2E;
            font-family:'Fredoka',sans-serif;font-size:0.72rem;font-weight:600;
          ">${badgeText}</span>`
        : ""
    }
    <h3 style="
      font-family:'Bangers',cursive;
      font-size:1.4rem;
      letter-spacing:0.04em;
      color:#1A1A2E;
      margin:0;
      line-height:1.2;
    ">${title}</h3>
    <p style="
      font-family:'Fredoka',sans-serif;
      font-size:0.95rem;
      color:#2D2D44;
      line-height:1.6;
      margin:0;
      flex:1;
    ">${body}</p>
    ${
      footer
        ? `<div style="
            padding-top:0.75rem;
            border-top:2px solid #1A1A2E22;
            font-family:'Fredoka',sans-serif;
            font-size:0.8rem;
            font-weight:600;
            color:#5BA8D4;
          ">${footer}</div>`
        : ""
    }
  </div>`;
}
