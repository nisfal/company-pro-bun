import { layout } from "../templates/layout";
import { company } from "../data/company";

const content = `
  <!-- Header -->
  <section class="hero-bg pt-32 pb-16">
    <div class="max-w-7xl mx-auto px-6 text-center">
      <span class="text-blue-600 text-sm font-semibold uppercase tracking-widest">Kontak</span>
      <h1 class="text-5xl font-extrabold text-gray-900 mt-3 mb-5">
        Mari <span class="gradient-text">Terhubung</span>
      </h1>
      <p class="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
        Ada proyek yang ingin Anda diskusikan? Kami siap mendengarkan dan membantu mewujudkannya.
      </p>
    </div>
  </section>

  <!-- Contact Content -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14">

      <!-- Contact Form -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-9">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
        <p class="text-gray-500 text-sm mb-7">Isi form berikut dan tim kami akan menghubungi Anda dalam 1×24 jam.</p>
        <form id="contactForm" class="space-y-5" novalidate>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
              <input type="text" name="name" required placeholder="John Doe"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" name="email" required placeholder="john@company.com"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Perusahaan</label>
            <input type="text" name="company" placeholder="PT. Perusahaan Anda"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Layanan yang Dibutuhkan</label>
            <select name="service" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700">
              <option value="">Pilih layanan...</option>
              <option>Web Development</option>
              <option>Mobile Development</option>
              <option>Cloud Solutions</option>
              <option>AI & Machine Learning</option>
              <option>Cybersecurity</option>
              <option>Data Analytics</option>
              <option>Konsultasi Umum</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Budget Estimasi</label>
            <select name="budget" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700">
              <option value="">Pilih range budget...</option>
              <option>< Rp 50 juta</option>
              <option>Rp 50 - 200 juta</option>
              <option>Rp 200 - 500 juta</option>
              <option>Rp 500 juta - 1 miliar</option>
              <option>> Rp 1 miliar</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pesan *</label>
            <textarea name="message" required rows="5" placeholder="Ceritakan lebih lanjut tentang proyek Anda..."
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"></textarea>
          </div>
          <button type="submit" class="btn-primary w-full text-white py-4 rounded-xl font-bold text-sm">
            Kirim Pesan →
          </button>
          <div id="formMsg" class="hidden text-center text-sm py-3 px-4 rounded-xl"></div>
        </form>
      </div>

      <!-- Contact Info -->
      <div class="space-y-7">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Informasi Kontak</h2>
          <p class="text-gray-500 text-sm">Atau hubungi kami langsung melalui channel berikut.</p>
        </div>

        ${[
          ["📍", "Alamat Kantor", company.address, null],
          ["📞", "Telepon", company.phone, `tel:${company.phone.replace(/\s/g, "")}`],
          ["✉️", "Email", company.email, `mailto:${company.email}`],
          ["⏰", "Jam Operasional", "Senin - Jumat, 09:00 - 18:00 WIB", null],
        ]
          .map(
            ([icon, label, value, href]) => `
          <div class="flex items-start gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">${icon}</div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">${label}</p>
              ${href ? `<a href="${href}" class="text-gray-800 font-medium hover:text-blue-600 transition-colors">${value}</a>` : `<p class="text-gray-800 font-medium">${value}</p>`}
            </div>
          </div>
        `
          )
          .join("")}

        <!-- Social Media -->
        <div class="p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Media Sosial</p>
          <div class="flex gap-3">
            ${[
              ["LinkedIn", "bg-blue-600", "in"],
              ["Twitter", "bg-sky-500", "tw"],
              ["Instagram", "bg-gradient-to-br from-pink-500 to-purple-600", "ig"],
              ["GitHub", "bg-gray-800", "gh"],
            ]
              .map(
                ([name, bg, abbr]) => `
              <a href="#" title="${name}" class="${bg} text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm hover:opacity-80 transition-opacity">
                ${abbr}
              </a>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Map Placeholder -->
        <div class="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border border-blue-100 p-8 text-center">
          <div class="text-4xl mb-3">🗺️</div>
          <p class="font-semibold text-gray-700 mb-1">Temukan Kami di Maps</p>
          <p class="text-sm text-gray-500 mb-4">Jl. Sudirman No. 88, Jakarta Selatan</p>
          <a href="https://maps.google.com" target="_blank" class="btn-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold inline-block">
            Buka Google Maps
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section-alt py-20">
    <div class="max-w-3xl mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-3">Pertanyaan <span class="gradient-text">Umum</span></h2>
      </div>
      <div class="space-y-4" id="faqContainer">
        ${[
          ["Berapa lama waktu pengerjaan proyek?", "Waktu pengerjaan bervariasi tergantung kompleksitas. Website sederhana bisa selesai dalam 2-4 minggu, sementara aplikasi kompleks memerlukan 3-6 bulan."],
          ["Apakah ada biaya konsultasi awal?", "Konsultasi awal sepenuhnya gratis. Kami akan mendiskusikan kebutuhan Anda dan memberikan estimasi biaya tanpa kewajiban apapun."],
          ["Bagaimana sistem pembayaran proyek?", "Kami menggunakan sistem milestone: 30% di awal, 40% di tengah proyek, dan 30% setelah proyek selesai dan diterima."],
          ["Apakah ada dukungan setelah proyek selesai?", "Ya, kami menyediakan garansi bug-fix 3 bulan dan paket maintenance bulanan untuk dukungan jangka panjang."],
          ["Apakah NusaTech mengerjakan proyek dari luar Jakarta?", "Tentu! Kami melayani klien dari seluruh Indonesia bahkan mancanegara. Sebagian besar komunikasi dilakukan secara remote."],
        ]
          .map(
            ([q, a], i) => `
          <div class="faq-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button class="faq-btn w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors" data-index="${i}">
              <span class="font-semibold text-gray-900 text-sm pr-4">${q}</span>
              <span class="faq-icon text-blue-600 flex-shrink-0 text-lg font-bold transition-transform">+</span>
            </button>
            <div class="faq-answer hidden px-6 pb-5">
              <p class="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">${a}</p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>

  <script>
    // FAQ accordion
    document.querySelectorAll('.faq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const icon = btn.querySelector('.faq-icon');
        const isOpen = !answer.classList.contains('hidden');
        // Close all
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.textContent = '+');
        // Toggle clicked
        if (!isOpen) {
          answer.classList.remove('hidden');
          icon.textContent = '−';
        }
      });
    });

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      const btn = this.querySelector('button[type="submit"]');
      btn.textContent = 'Mengirim...';
      btn.disabled = true;
      setTimeout(() => {
        msg.className = 'text-center text-sm py-3 px-4 rounded-xl bg-green-50 text-green-700 border border-green-200';
        msg.textContent = '✅ Pesan berhasil dikirim! Tim kami akan menghubungi Anda segera.';
        msg.classList.remove('hidden');
        this.reset();
        btn.textContent = 'Kirim Pesan →';
        btn.disabled = false;
      }, 1500);
    });
  </script>
`;

export const contactPage = () => layout("Kontak", content, "contact");
