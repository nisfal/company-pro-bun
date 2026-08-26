import app from "./src/router";

const PORT = Number(process.env.PORT) || 3000;

console.log(`
╔══════════════════════════════════════════╗
║        NusaTech Solutions — Server       ║
╠══════════════════════════════════════════╣
║  🚀 Running at: http://localhost:${PORT}   ║
║  📄 Pages:                              ║
║     /              → Beranda            ║
║     /services      → Layanan            ║
║     /portfolio     → Portfolio          ║
║     /about         → Tentang Kami       ║
║     /contact       → Kontak             ║
╚══════════════════════════════════════════╝
`);

export default {
  port: PORT,
  fetch: app.fetch,
};
