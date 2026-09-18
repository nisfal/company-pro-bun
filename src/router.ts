import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";

import { homePage } from "./pages/home";
import { servicesPage } from "./pages/services";
import { portfolioPage } from "./pages/portfolio";
import { aboutPage } from "./pages/about";
import { contactPage } from "./pages/contact";

const app = new Hono();

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use("*", logger());
app.use("*", timing());
app.use("*", secureHeaders());

// Cache static HTML pages at CDN edge — 60s stale, 600s revalidate
app.use("*", async (c, next) => {
  await next();
  if (c.req.method === "GET" && c.res.status === 200) {
    c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
  }
});

// ─── Pages ────────────────────────────────────────────────────────────────────

app.get("/",          (c) => c.html(homePage()));
app.get("/services",  (c) => c.html(servicesPage()));
app.get("/portfolio", (c) => c.html(portfolioPage()));
app.get("/about",     (c) => c.html(aboutPage()));
app.get("/contact",   (c) => c.html(contactPage()));

// ─── API ──────────────────────────────────────────────────────────────────────

app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json<{
      name: string;
      email: string;
      company: string;
      service: string;
      message: string;
    }>();

    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return c.json({ success: false, error: "Field name, email, dan message wajib diisi." }, 400);
    }

    // TODO: integrate email provider (Resend / Nodemailer) or save to DB
    console.log("[contact]", {
      name:    body.name,
      email:   body.email,
      company: body.company,
      service: body.service,
      message: body.message.slice(0, 120),
    });

    return c.json({ success: true, message: "Pesan berhasil diterima." }, 200);
  } catch {
    return c.json({ success: false, error: "Request body tidak valid." }, 400);
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────

app.get("/health", (c) => c.json({ status: "ok", ts: Date.now() }));

// ─── 404 ──────────────────────────────────────────────────────────────────────

app.notFound((c) => {
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>404 — Halaman Tidak Ditemukan</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@400;600&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;background:#1A1A2E;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Fredoka',sans-serif;">
  <div style="text-align:center;padding:2rem;">
    <div style="font-size:5rem;margin-bottom:1rem;">🕳️</div>
    <h1 style="font-family:'Bangers',cursive;font-size:6rem;color:#FED41D;letter-spacing:0.1em;margin:0;text-shadow:6px 6px 0 #F5C400;">404</h1>
    <p style="color:#FFFEF7AA;font-size:1.1rem;margin:0.75rem 0 2rem;">Halaman yang kamu cari tidak ada di Springfield ini.</p>
    <a href="/" style="
      display:inline-block;padding:0.85rem 2.25rem;
      background:#FED41D;color:#1A1A2E;
      border:3px solid #FED41D;border-radius:12px;
      font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;
      text-decoration:none;box-shadow:5px 5px 0 #F5C400;
    ">Kembali ke Beranda</a>
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
