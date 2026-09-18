/**
 * Comic-style badge / pill tag
 */
export function badge(text: string, variant: "yellow" | "sky" | "ink" | "coral" = "yellow"): string {
  const styles: Record<typeof variant, string> = {
    yellow: "background:#FED41D;color:#1A1A2E;",
    sky:    "background:#87CEEB;color:#1A1A2E;",
    ink:    "background:#1A1A2E;color:#FED41D;",
    coral:  "background:#FF6B6B;color:#fff;",
  };
  return `<span style="
    display:inline-block;
    padding:2px 10px;
    border-radius:999px;
    border:2px solid #1A1A2E;
    font-family:'Fredoka',sans-serif;
    font-size:0.75rem;
    font-weight:600;
    letter-spacing:0.03em;
    ${styles[variant]}
  ">${text}</span>`;
}
