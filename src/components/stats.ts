import type { StatItem } from "../lib/types";

/**
 * Animated stat counter strip.
 * Relies on the global counter JS in the layout.
 */
export function statsStrip(items: StatItem[], dark = false): string {
  const bg    = dark ? "#1A1A2E" : "#FED41D";
  const color = dark ? "#FED41D" : "#1A1A2E";
  const border = dark ? "border:3px solid #FED41D;" : "border:3px solid #1A1A2E;";

  const cells = items
    .map(
      ({ value, label, suffix = "" }) => `
      <div style="text-align:center;padding:1.5rem 1rem;">
        <div style="
          font-family:'Bangers',cursive;
          font-size:clamp(2rem,5vw,3rem);
          color:${color};
          line-height:1;
          letter-spacing:0.05em;
        " data-counter data-target="${value}" data-suffix="${suffix}">${value}${suffix}</div>
        <div style="
          font-family:'Fredoka',sans-serif;
          font-size:0.85rem;
          font-weight:500;
          color:${dark ? "#87CEEB" : "#1A1A2E"};
          margin-top:0.25rem;
          opacity:0.85;
        ">${label}</div>
      </div>`
    )
    .join(`<div style="width:3px;background:${dark ? "#FED41D44" : "#1A1A2E33"};margin:1rem 0;"></div>`);

  return `
  <div style="
    display:grid;
    grid-template-columns:repeat(${items.length},1fr);
    background:${bg};
    ${border}
    border-radius:16px;
    box-shadow:5px 5px 0px ${dark ? "#FED41D44" : "#1A1A2E"};
    overflow:hidden;
  ">
    ${cells}
  </div>`;
}
