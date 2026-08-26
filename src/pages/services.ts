import { layout } from "../templates/layout";
import { services } from "../data/company";

const serviceCards = services
  .map(
    (s) => `
  <div class="card-hover bg-white rounded-2xl p-8 border border-gray-100 shadow-sm group">
    <div class="text-5xl mb-5 group-hover:scale-110 transition-transform inline-block">${s.icon}</div>
    <h3 class="text-xl font-bold text-gray-900 mb-3">${s.title}</h3>
    <p class="text-gray-500 text-sm leading-relaxed mb-5">${s.description}</p>
    <a href="/contact" class="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold hover:gap-2 transition-all">
      Konsultasi Sekarang →
    </a>
  </div>
`
  )
  .join("");

const content = `
  <!-- Page Header -->
  <section class="hero-bg pt-32 pb-16">
    <div class="max-w-7xl mx-auto px-6 text-center">
      <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Layanan Kami</span>
      <h1 class="text-5xl font-extrabold text-gray-900 mt-3 mb-5">
        Solusi Digital <span class="gradient-text">Terlengkap</span>
      </h1>
      <p class="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
        Kami menyediakan berbagai layanan teknologi untuk membantu bisnis Anda tumbuh dan berkembang di era digital.
      </p>
    </div>
  </section>

  <!-- Services Grid -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        ${serviceCards}
      </div>
    </div>
  </section>

  <!-- Process Section -->
  <section class="section-alt py-24">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-14">
        <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Proses Kerja</span>
        <h2 class="text-4xl font-extrabold text-gray-900 mt-3 mb-4">Bagaimana Kami <span class="gradient-text">Bekerja</span></h2>
        <p class="text-gray-500 max-w-xl mx-auto">Proses terstruktur kami memastikan setiap proyek berjalan lancar dari awal hingga akhir.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        ${[
          ["01", "Konsultasi", "Diskusi mendalam tentang kebutuhan dan tujuan bisnis Anda.", "💬"],
          ["02", "Perencanaan", "Menyusun strategi, timeline, dan spesifikasi teknis yang detail.", "📋"],
          ["03", "Pengembangan", "Membangun solusi dengan standar kode tertinggi dan best practices.", "⚙️"],
          ["04", "Peluncuran", "Testing menyeluruh, deployment, dan dukungan pasca-launch.", "🚀"],
        ]
          .map(
            ([num, title, desc, icon]) => `
          <div class="text-center relative">
            <div class="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-4 shadow-lg">
              ${num}
            </div>
            <div class="text-2xl mb-2">${icon}</div>
            <h3 class="font-bold text-gray-900 mb-2">${title}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">${desc}</p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Tech Stack -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-3">Teknologi yang <span class="gradient-text">Kami Gunakan</span></h2>
        <p class="text-gray-500">Stack terkini untuk solusi yang handal dan scalable.</p>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        ${["React", "Next.js", "Bun", "TypeScript", "Node.js", "Go", "Python", "PostgreSQL", "Redis", "AWS", "Docker", "Kubernetes", "TensorFlow", "React Native", "Vue.js"]
          .map(
            (tech) => `
          <span class="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default">${tech}</span>
        `
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 section-alt">
    <div class="max-w-3xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Butuh Layanan Khusus?</h2>
      <p class="text-gray-500 mb-8">Ceritakan kebutuhan Anda dan kami akan merancang solusi yang tepat.</p>
      <a href="/contact" class="btn-primary text-white px-8 py-4 rounded-xl font-bold inline-block">
        Diskusi Sekarang →
      </a>
    </div>
  </section>
`;

export const servicesPage = () => layout("Layanan", content, "services");
