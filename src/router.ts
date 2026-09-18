import { Hono } from "hono";
import type { Context } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";

import { homePage }      from "./pages/home";
import { servicesPage }  from "./pages/services";
import { portfolioPage } from "./pages/portfolio";
import { aboutPage }     from "./pages/about";
import { contactPage }   from "./pages/contact";

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getTranslation,
} from "./i18n/index";
import type { Locale } from "./i18n/types";

const app = new Hono();

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use("*", logger());
app.use("*", timing());
app.use("*", secureHeaders());

app.use("*", async (c, next) => {
  await next();
  if (c.req.method === "GET" && c.res.status === 200) {
    c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
  }
});

// ─── Root redirect — / → /{default_locale} ────────────────────────────────────

app.get("/", (c) => c.redirect(`/${DEFAULT_LOCALE}`, 302));

// ─── Locale helper ────────────────────────────────────────────────────────────

function getLocaleFromPath(path: string): Locale {
  const seg = path.split("/")[1] ?? "";
  return (SUPPORTED_LOCALES as string[]).includes(seg)
    ? (seg as Locale)
    : DEFAULT_LOCALE;
}

// ─── Contact handler factory ──────────────────────────────────────────────────

async function handleContact(c: Context, loc: Locale): Promise<Response> {
  try {
    const body = await c.req.json<{
      name: string;
      email: string;
      company: string;
      service: string;
      message: string;
    }>();

    if (!body.name || !body.email || !body.message) {
      const msg = loc === "en"
        ? "D'oh! Name, email, and message are required."
        : "Field name, email, dan message wajib diisi.";
      return c.json({ success: false, error: msg }, 400);
    }

    console.log(`[contact:${loc}]`, {
      name:    body.name,
      email:   body.email,
      company: body.company,
      service: body.service,
      message: body.message.slice(0, 120),
    });

    const msg = loc === "en"
      ? "Woo-hoo! Message received."
      : "Pesan berhasil diterima.";
    return c.json({ success: true, message: msg }, 200);
  } catch {
    const msg = loc === "en"
      ? "D'oh! Invalid request body."
      : "Request body tidak valid.";
    return c.json({ success: false, error: msg }, 400);
  }
}

// ─── ID routes ────────────────────────────────────────────────────────────────

app.get("/id",           (c) => c.html(homePage("id")));
app.get("/id/",          (c) => c.html(homePage("id")));
app.get("/id/services",  (c) => c.html(servicesPage("id")));
app.get("/id/portfolio", (c) => c.html(portfolioPage("id")));
app.get("/id/about",     (c) => c.html(aboutPage("id")));
app.get("/id/contact",   (c) => c.html(contactPage("id")));
app.post("/id/api/contact", (c) => handleContact(c, "id"));

// ─── EN routes ────────────────────────────────────────────────────────────────

app.get("/en",           (c) => c.html(homePage("en")));
app.get("/en/",          (c) => c.html(homePage("en")));
app.get("/en/services",  (c) => c.html(servicesPage("en")));
app.get("/en/portfolio", (c) => c.html(portfolioPage("en")));
app.get("/en/about",     (c) => c.html(aboutPage("en")));
app.get("/en/contact",   (c) => c.html(contactPage("en")));
app.post("/en/api/contact", (c) => handleContact(c, "en"));

// ─── Legacy /api/contact — fallback to default locale ─────────────────────────

app.post("/api/contact", (c) => handleContact(c, DEFAULT_LOCALE));

// ─── Health check ─────────────────────────────────────────────────────────────

app.get("/health", (c) => c.json({ status: "ok", ts: Date.now() }));

// ─── 404 ──────────────────────────────────────────────────────────────────────

app.notFound((c) => {
  const loc = getLocaleFromPath(c.req.path);
  const t   = getTranslation(loc);
  const nf  = t.notFound;
  const html = `<!DOCTYPE html>
<html lang="${loc}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${nf.code} — ${loc === "en" ? "Page Not Found" : "Halaman Tidak Ditemukan"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@400;600&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;background:#1A1A2E;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="text-align:center;padding:2rem;">
    <div style="font-size:5rem;margin-bottom:1rem;">🕳️</div>
    <h1 style="font-family:'Bangers',cursive;font-size:6rem;color:#FED41D;letter-spacing:0.1em;margin:0;text-shadow:6px 6px 0 #F5C400;">${nf.code}</h1>
    <p style="color:#FFFEF7AA;font-family:'Fredoka',sans-serif;font-size:1.1rem;margin:0.75rem 0 2rem;">${nf.message}</p>
    <a href="/${loc}" style="
      display:inline-block;padding:0.85rem 2.25rem;
      background:#FED41D;color:#1A1A2E;
      border:3px solid #1A1A2E;border-radius:12px;
      font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
      text-decoration:none;box-shadow:5px 5px 0 #F5C400;
    ">${nf.cta}</a>
  </div>
</body>
</html>`;
  return c.html(html, 404);
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.onError((err, c) => {
  console.error("[error]", err);
  return c.json({ success: false, error: "Internal server error." }, 500);
});

export default app;
