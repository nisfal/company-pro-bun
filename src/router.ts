import { Hono } from "hono";
import { homePage } from "./pages/home";
import { servicesPage } from "./pages/services";
import { portfolioPage } from "./pages/portfolio";
import { aboutPage } from "./pages/about";
import { contactPage } from "./pages/contact";

const app = new Hono();

// Home
app.get("/", (c) => c.html(homePage()));

// Services
app.get("/services", (c) => c.html(servicesPage()));

// Portfolio
app.get("/portfolio", (c) => c.html(portfolioPage()));

// About
app.get("/about", (c) => c.html(aboutPage()));

// Contact
app.get("/contact", (c) => c.html(contactPage()));

// Contact form submission (API endpoint)
app.post("/api/contact", async (c) => {
  const body = await c.req.json();
  console.log("📬 New contact form submission:", body);
  return c.json({ success: true, message: "Pesan berhasil diterima!" });
});

// 404 fallback
app.notFound((c) =>
  c.html(
    `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>404 — Halaman Tidak Ditemukan</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>* { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen text-center px-6">
  <div>
    <div class="text-8xl mb-6">🔍</div>
    <h1 class="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
    <p class="text-xl text-gray-500 mb-8">Halaman yang Anda cari tidak ditemukan.</p>
    <a href="/" class="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3.5 rounded-xl font-bold inline-block hover:opacity-90 transition-opacity">
      ← Kembali ke Beranda
    </a>
  </div>
</body>
</html>`,
    404
  )
);

export default app;
