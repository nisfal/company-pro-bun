import { layout } from "../templates/layout";
import { team, company } from "../data/company";

const teamCards = team
  .map(
    (m) => `
  <div class="card-hover text-center bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
    <div class="w-20 h-20 mx-auto bg-gradient-to-br ${m.color} rounded-2xl flex items-center justify-center text-white font-extrabold text-xl mb-4 shadow-lg">
      ${m.photo}
    </div>
    <h3 class="font-bold text-gray-900 text-lg mb-1">${m.name}</h3>
    <p class="text-blue-600 text-sm font-medium mb-3">${m.role}</p>
    <p class="text-gray-500 text-sm leading-relaxed">${m.bio}</p>
  </div>
`
  )
  .join("");

const content = `
  <!-- Header -->
  <section class="hero-bg pt-32 pb-16">
    <div class="max-w-7xl mx-auto px-6 text-center">
      <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Tentang Kami</span>
      <h1 class="text-5xl font-extrabold text-gray-900 mt-3 mb-5">
        Siapa <span class="gradient-text">NusaTech</span>?
      </h1>
      <p class="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
        Kami adalah tim teknolog, desainer, dan konsultan yang bersemangat membantu bisnis Indonesia berkembang melalui inovasi digital.
      </p>
    </div>
  </section>

  <!-- Story Section -->
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Cerita Kami</span>
        <h2 class="text-4xl font-extrabold text-gray-900 mt-3 mb-6">
          Dibangun dengan <span class="gradient-text">Semangat</span> untuk Indonesia
        </h2>
        <p class="text-gray-500 leading-relaxed mb-5">
          Didirikan pada tahun ${company.founded} oleh sekelompok insinyur muda yang percaya bahwa teknologi dapat merubah wajah bisnis Indonesia, NusaTech telah tumbuh dari startup kecil menjadi salah satu perusahaan teknologi terkemuka di tanah air.
        </p>
        <p class="text-gray-500 leading-relaxed mb-5">
          Dengan lebih dari ${company.employees} profesional berbakat, kami telah menyelesaikan ${company.projects} proyek untuk ${company.clients} klien di berbagai industri — mulai dari perbankan, retail, kesehatan, hingga pendidikan.
        </p>
        <p class="text-gray-500 leading-relaxed">
          Misi kami sederhana: menjadi mitra teknologi terpercaya yang membantu bisnis Indonesia bersaing di tingkat global.
        </p>
      </div>
      <div class="grid grid-cols-2 gap-5">
        ${[
          ["🎯", "Misi", "Menjadi katalis transformasi digital bisnis Indonesia."],
          ["👁️", "Visi", "Indonesia yang kompetitif di era digital global."],
          ["💎", "Nilai", "Integritas, inovasi, dan dedikasi pada kualitas."],
          ["🌱", "Dampak", "Menciptakan ekosistem digital yang berkelanjutan."],
        ]
          .map(
            ([icon, title, desc]) => `
          <div class="card-hover bg-gray-50 rounded-2xl p-6">
            <div class="text-3xl mb-3">${icon}</div>
            <h3 class="font-bold text-gray-900 mb-2">${title}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">${desc}</p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="section-alt py-20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        ${[
          [company.founded, "Tahun Berdiri"],
          [company.employees, "Karyawan"],
          [company.projects, "Proyek"],
          [company.clients, "Klien"],
        ]
          .map(
            ([num, label]) => `
          <div class="card-hover bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <p class="text-4xl font-extrabold gradient-text mb-2">${num}</p>
            <p class="text-sm text-gray-500 font-medium">${label}</p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Team Section -->
  <section id="team" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-14">
        <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Tim Kami</span>
        <h2 class="text-4xl font-extrabold text-gray-900 mt-3 mb-4">
          Orang-orang di Balik <span class="gradient-text">NusaTech</span>
        </h2>
        <p class="text-gray-500 max-w-xl mx-auto">Tim multidisiplin kami berpengalaman dalam mengeksekusi proyek dari berbagai skala dan kompleksitas.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${teamCards}
      </div>
    </div>
  </section>

  <!-- Culture -->
  <section class="section-alt py-20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-14">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-3">Budaya Kerja <span class="gradient-text">Kami</span></h2>
        <p class="text-gray-500 max-w-xl mx-auto">Lingkungan yang mendorong kreativitas, kolaborasi, dan pertumbuhan berkelanjutan.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${[
          ["🎓", "Belajar Terus", "Kami menyediakan budget belajar dan akses ke konferensi teknologi global."],
          ["🤝", "Tim Solid", "Budaya saling mendukung dan berkolaborasi untuk mencapai hasil terbaik."],
          ["⚖️", "Work-Life Balance", "Fleksibilitas kerja yang sehat untuk produktivitas dan kreativitas optimal."],
        ]
          .map(
            ([icon, title, desc]) => `
          <div class="card-hover bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center">
            <div class="text-5xl mb-4">${icon}</div>
            <h3 class="font-bold text-gray-900 text-lg mb-2">${title}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">${desc}</p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>
`;

export const aboutPage = () => layout("Tentang Kami", content, "about");
