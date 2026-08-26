import { layout } from "../templates/layout";
import { services, testimonials, company } from "../data/company";

const serviceCards = services
  .slice(0, 3)
  .map(
    (s) => `
  <div class="card-hover bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
    <div class="text-4xl mb-4">${s.icon}</div>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">${s.title}</h3>
    <p class="text-sm text-gray-500 leading-relaxed">${s.description}</p>
  </div>
`
  )
  .join("");

const testimonialCards = testimonials
  .map(
    (t) => `
  <div class="card-hover bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
    <div class="flex gap-1 mb-4">
      ${"⭐".repeat(t.rating)}
    </div>
    <p class="text-gray-600 text-sm leading-relaxed mb-6 italic">"${t.text}"</p>
    <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm">${t.avatar}</div>
      <div>
        <p class="font-semibold text-gray-900 text-sm">${t.name}</p>
        <p class="text-xs text-gray-500">${t.role} · ${t.company}</p>
      </div>
    </div>
  </div>
`
  )
  .join("");

const content = `
  <!-- Hero Section -->
  <section class="hero-bg min-h-screen flex items-center pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
      <div class="fade-in">
        <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-100">
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Tersedia untuk proyek baru 🚀
        </div>
        <h1 class="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Wujudkan <span class="gradient-text">Visi Digital</span> Bisnis Anda
        </h1>
        <p class="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
          Kami membantu perusahaan Indonesia bertransformasi secara digital dengan solusi teknologi yang inovatif, andal, dan terukur.
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="/contact" class="btn-primary text-white px-8 py-3.5 rounded-xl font-semibold text-sm">
            Konsultasi Gratis →
          </a>
          <a href="/portfolio" class="px-8 py-3.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all">
            Lihat Portfolio
          </a>
        </div>
        <!-- Stats -->
        <div class="flex flex-wrap gap-8 mt-12 pt-12 border-t border-gray-100">
          <div>
            <p class="text-3xl font-extrabold gradient-text">${company.projects}</p>
            <p class="text-sm text-gray-500 mt-1">Proyek Selesai</p>
          </div>
          <div>
            <p class="text-3xl font-extrabold gradient-text">${company.clients}</p>
            <p class="text-sm text-gray-500 mt-1">Klien Puas</p>
          </div>
          <div>
            <p class="text-3xl font-extrabold gradient-text">${company.employees}</p>
            <p class="text-sm text-gray-500 mt-1">Tim Profesional</p>
          </div>
        </div>
      </div>

      <!-- Hero Visual -->
      <div class="flex justify-center lg:justify-end">
        <div class="relative float">
          <div class="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <div class="text-center text-white">
              <div class="text-8xl mb-4">🚀</div>
              <p class="text-xl font-bold">Digital First</p>
              <p class="text-sm opacity-80 mt-1">Innovation & Technology</p>
            </div>
          </div>
          <!-- Floating badges -->
          <div class="absolute -top-4 -left-6 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>✅</span> 500+ Proyek
          </div>
          <div class="absolute -bottom-4 -right-6 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>⭐</span> 4.9 Rating
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Preview -->
  <section class="section-alt py-24">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-14">
        <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Layanan Kami</span>
        <h2 class="text-4xl font-extrabold text-gray-900 mt-3 mb-4">Solusi Teknologi <span class="gradient-text">Lengkap</span></h2>
        <p class="text-gray-500 max-w-xl mx-auto">Dari web development hingga AI, kami hadir dengan solusi digital menyeluruh untuk kebutuhan bisnis Anda.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${serviceCards}
      </div>
      <div class="text-center mt-10">
        <a href="/services" class="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all text-sm">
          Lihat Semua Layanan <span>→</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Why Us -->
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Keunggulan Kami</span>
          <h2 class="text-4xl font-extrabold text-gray-900 mt-3 mb-6">Mengapa Memilih <span class="gradient-text">NusaTech</span>?</h2>
          <div class="space-y-5">
            ${[
              ["🎯", "Berpengalaman", "9+ tahun pengalaman mengerjakan ratusan proyek di berbagai industri."],
              ["⚡", "Cepat & Tepat Waktu", "Metodologi agile memastikan proyek selesai sesuai jadwal tanpa kompromi kualitas."],
              ["🤝", "Dukungan Penuh", "Tim support kami siap 24/7 untuk memastikan sistem Anda berjalan lancar."],
              ["🔧", "Teknologi Terkini", "Selalu menggunakan stack teknologi terbaru dan terpercaya di industri."],
            ]
              .map(
                ([icon, title, desc]) => `
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">${icon}</div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">${title}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed">${desc}</p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-5">
          ${[
            ["🌟", "Award Winning", "Penghargaan terbaik tech company 2023"],
            ["🔐", "ISO Certified", "Standar keamanan internasional"],
            ["🌏", "Global Reach", "Klien dari 5 negara di Asia"],
            ["📈", "Growth Focus", "ROI rata-rata 3x untuk klien kami"],
          ]
            .map(
              ([icon, title, desc]) => `
            <div class="card-hover bg-gray-50 rounded-2xl p-6 text-center">
              <div class="text-4xl mb-3">${icon}</div>
              <h3 class="font-bold text-gray-900 mb-1">${title}</h3>
              <p class="text-xs text-gray-500">${desc}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="section-alt py-24">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-14">
        <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Testimoni</span>
        <h2 class="text-4xl font-extrabold text-gray-900 mt-3 mb-4">Kata Klien <span class="gradient-text">Kami</span></h2>
        <p class="text-gray-500 max-w-xl mx-auto">Kepuasan klien adalah prioritas utama kami. Inilah yang mereka katakan.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${testimonialCards}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-24 bg-white">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <div class="bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 rounded-3xl p-14 text-white shadow-2xl">
        <div class="text-5xl mb-5">🤝</div>
        <h2 class="text-4xl font-extrabold mb-4">Siap Memulai Proyek Anda?</h2>
        <p class="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">Konsultasikan kebutuhan digital bisnis Anda dengan tim ahli kami. Gratis, tanpa komitmen!</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="/contact" class="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
            Mulai Konsultasi Gratis
          </a>
          <a href="/portfolio" class="border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
            Lihat Portfolio
          </a>
        </div>
      </div>
    </div>
  </section>
`;

export const homePage = () => layout("Beranda", content, "home");
