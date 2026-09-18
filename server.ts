/**
 * Local dev entry point (Bun native HTTP server).
 * Run with: bun run dev  OR  bun run start
 */
import app from "./src/router";
import { PORT } from "./src/lib/constants";

console.log(`
╔═══════════════════════════════════════════╗
║       Simptecho — Server              ║
╠═══════════════════════════════════════════╣
║  ☀️  http://localhost:${PORT}              ║
║                                           ║
║  GET /              → Beranda             ║
║  GET /services      → Layanan             ║
║  GET /portfolio     → Portfolio           ║
║  GET /about         → Tentang Kami        ║
║  GET /contact       → Kontak              ║
║  POST /api/contact  → Form API            ║
║  GET /health        → Health check        ║
╚═══════════════════════════════════════════╝
`);

export default {
  port: PORT,
  fetch: app.fetch,
};
