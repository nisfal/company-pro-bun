import { layout } from "../templates/layout";
import { portfolios } from "../data/company";

const portfolioCards = portfolios
  .map(
    (p) => `
  <div class="card-hover rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white group">
    <div class="bg-gradient-to-br ${p.color} p-10 flex items-center justify-center">
      <span class="text-7xl group-hover:scale-110 transition-transform inline-block">${p.emoji}</span>
    </div>
    <div class="p-6">
      <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">${p.category}</span>
      <h3 class="text-xl font-bold text-gray-900 mt-3 mb-2">${p.title}</h3>
      <p class="text-gray-500 text-sm leading-relaxed mb-4">${p.description}</p>
      <div class="flex flex-wrap gap-2">
        ${p.tech.map((t) => `<span class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">${t}</span>`).join("")}
      </div>
    </div>
  </div>
`
  )
  .join("");

const content = `
  <!-- Header -->
  <section class="hero-bg pt-32 pb-16">
    <div class="max-w-7xl mx-auto px-6 text-center">
      <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Portfolio</span>
      <h1 class="text-5xl font-extrabold text-gray-900 mt-3 mb-5">
        Karya Terbaik <span class="gradient-text">Kami</span>
      </h1>
      <p class="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
        Setiap proyek adalah bukti komitmen kami terhadap kualitas, inovasi, dan kepuasan klien.
      </p>
    </div>
  </section>

  <!-- Portfolio Grid -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${portfolioCards}
      </div>
    </div>
  </section>

  <!-- Stats Banner -->
  <section class="py-20 section-alt">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-gradient-to-br from-blue-600 to-violet-700 rounded-3xl p-12 text-white">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-extrabold mb-2">Angka Bicara Lebih Keras</h2>
          <p class="text-blue-100">Hasil nyata yang kami capai bersama klien</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          ${[
            ["500+", "Proyek Selesai"],
            ["200+", "Klien Puas"],
            ["9+", "Tahun Pengalaman"],
            ["99%", "Uptime Guarantee"],
          ]
            .map(
              ([num, label]) => `
            <div>
              <p class="text-4xl font-extrabold mb-2">${num}</p>
              <p class="text-blue-200 text-sm">${label}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 bg-white">
    <div class="max-w-3xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Proyek Anda Bisa Jadi yang Berikutnya</h2>
      <p class="text-gray-500 mb-8">Bergabunglah dengan ratusan klien yang telah mempercayakan transformasi digital mereka kepada kami.</p>
      <a href="/contact" class="btn-primary text-white px-8 py-4 rounded-xl font-bold inline-block">
        Mulai Proyek Sekarang →
      </a>
    </div>
  </section>
`;

export const portfolioPage = () => layout("Portfolio", content, "portfolio");
