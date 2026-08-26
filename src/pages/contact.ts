import { layout } from "../templates/layout";
import { company } from "../data/company";

const faqItems = [
  ["Apakah konsultasi pertama benar-benar gratis?", "Ya, benar-benar gratis. Kami dengarkan kebutuhan Anda, kasih opini teknis, dan kalau kami bukan yang tepat, kami bilang jujur."],
  ["Berapa lama dari brief sampai proposal?", "Maksimal 48 jam kerja setelah brief lengkap kami terima. Proyek sederhana biasanya lebih cepat."],
  ["Bisakah kami lihat source code di tengah pengerjaan?", "Tentu. Kami pakai private Git repo yang bisa Anda akses kapan saja. Tidak ada kode yang disembunyikan."],
  ["Bagaimana kalau proyek meleset dari timeline?", "Kami komunikasikan di awal, bukan di hari deadline. Dan kami jelaskan penyebabnya."],
  ["Apakah ada kontrak kerjanya?", "Ya, selalu. NDA dan perjanjian kerja yang mengatur scope, timeline, pembayaran, dan kepemilikan kode."],
  ["Kami startup kecil, apakah bisa bekerja sama?", "Bisa. Beberapa klien terbaik kami dimulai dari startup dengan budget terbatas. Kami bantu prioritisasi agar budget dipakai seefektif mungkin."],
];

const content = `
  <!-- Header -->
  <section style="padding-top:calc(var(--nav-h) + 5rem);padding-bottom:4rem;background:var(--surface)">
    <div class="container">
      <div style="max-width:560px">
        <h1 class="reveal" style="font-size:clamp(2.2rem,4vw,3rem);font-weight:900;letter-spacing:-0.035em;line-height:1.1;margin-bottom:1rem">
          Ngobrol dulu,<br>gratis dan tanpa<br><em style="color:var(--accent);font-style:italic">komitmen</em>
        </h1>
        <p class="reveal" style="font-size:15px;color:var(--ink-2);line-height:1.7">
          Isi form atau langsung WhatsApp kami. Biasanya kami balas dalam 2-3 jam di hari kerja.
        </p>
      </div>
    </div>
  </section>

  <!-- Contact content -->
  <section style="padding:2rem 0 5rem;background:#fff;border-top:1px solid var(--surface-3)">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 380px;gap:4rem;align-items:start">

        <!-- Form -->
        <div class="reveal">
          <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:0.4rem">Ceritakan proyek Anda</h2>
          <p style="font-size:13px;color:var(--ink-3);margin-bottom:2rem">Tidak perlu brief sempurna. Kita figureout bareng.</p>

          <form id="contactForm" novalidate style="display:flex;flex-direction:column;gap:1.25rem">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Nama *</label>
                <input type="text" name="name" required placeholder="Nama Anda"
                  style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink)"
                  onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                  onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"/>
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Email *</label>
                <input type="email" name="email" required placeholder="nama@perusahaan.com"
                  style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink)"
                  onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                  onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"/>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Perusahaan</label>
                <input type="text" name="company" placeholder="Opsional"
                  style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink)"
                  onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                  onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"/>
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">No. WA</label>
                <input type="tel" name="phone" placeholder="08xx"
                  style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink)"
                  onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                  onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"/>
              </div>
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Jenis proyek</label>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.4rem">
                ${["Web Development", "Mobile App", "Cloud & DevOps", "AI & Otomasi", "Security Audit", "Konsultasi"].map(s => `
                  <label style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem 0.75rem;border:1.5px solid var(--surface-3);border-radius:var(--radius);cursor:pointer;font-size:12.5px;font-weight:500;color:var(--ink-2);transition:border-color 0.15s,background 0.15s">
                    <input type="checkbox" name="services" value="${s}" style="accent-color:var(--ink);width:13px;height:13px">
                    ${s}
                  </label>
                `).join('')}
              </div>
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Budget estimasi</label>
              <select name="budget" style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;background:#fff;color:var(--ink-2);transition:border-color 0.15s"
                onfocus="this.style.borderColor='var(--ink)'" onblur="this.style.borderColor='var(--surface-3)'">
                <option value="">Pilih range (opsional)</option>
                <option>Di bawah Rp 30 juta</option>
                <option>Rp 30 - 100 juta</option>
                <option>Rp 100 - 300 juta</option>
                <option>Rp 300 juta - 1 miliar</option>
                <option>Di atas Rp 1 miliar</option>
                <option>Belum tahu, perlu diskusi</option>
              </select>
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.06em;font-family:'Geist Mono',monospace">Ceritakan masalah Anda *</label>
              <textarea name="message" required rows="5"
                placeholder="Misalnya: kami punya toko offline 10 cabang dan ingin sistem kasir terintegrasi..."
                style="width:100%;border:1.5px solid var(--surface-3);border-radius:var(--radius);padding:0.65rem 0.9rem;font-size:14px;font-family:'Geist',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;background:#fff;color:var(--ink);resize:vertical;line-height:1.65"
                onfocus="this.style.borderColor='var(--ink)';this.style.boxShadow='0 0 0 3px rgba(15,15,15,0.06)'"
                onblur="this.style.borderColor='var(--surface-3)';this.style.boxShadow='none'"></textarea>
            </div>

            <div>
              <button type="submit" id="submitBtn" class="btn btn-dark" style="width:100%;justify-content:center;padding:0.8rem">
                <span id="btnText">Kirim pesan</span>
                <span id="btnArrow">&rarr;</span>
              </button>
            </div>

            <div id="formMsg" style="display:none;font-size:13.5px;padding:0.9rem 1rem;border-radius:var(--radius)"></div>
          </form>
        </div>

        <!-- Sidebar -->
        <div style="display:flex;flex-direction:column;gap:1rem" class="reveal">
          <div style="background:var(--ink);border-radius:var(--radius-lg);padding:1.75rem">
            <p style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);margin-bottom:1rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Geist Mono',monospace">Kontak langsung</p>
            <a href="https://wa.me/622127884491" style="display:flex;align-items:center;gap:0.75rem;background:rgba(255,255,255,0.08);border-radius:var(--radius);padding:0.9rem 1rem;text-decoration:none;margin-bottom:0.5rem;transition:background 0.15s" onmouseover="this.style.background='rgba(255,255,255,0.14)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5a6 6 0 0 0-5.19 9.02L1.5 13.5l3.07-.8A6 6 0 1 0 7.5 1.5zm0 10.8a4.8 4.8 0 0 1-2.45-.67l-.18-.1-1.82.48.49-1.78-.12-.19A4.8 4.8 0 1 1 7.5 12.3z" fill="rgba(255,255,255,0.6)"/></svg>
              <div>
                <p style="font-size:13px;font-weight:600;color:#fafafa">WhatsApp</p>
                <p style="font-size:12px;color:rgba(255,255,255,0.4)">${company.phone}</p>
              </div>
            </a>
            <a href="mailto:${company.email}" style="display:flex;align-items:center;gap:0.75rem;background:rgba(255,255,255,0.08);border-radius:var(--radius);padding:0.9rem 1rem;text-decoration:none;transition:background 0.15s" onmouseover="this.style.background='rgba(255,255,255,0.14)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 3.5h12v8a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-8zm0 0 6 5 6-5" stroke="rgba(255,255,255,0.6)" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <div>
                <p style="font-size:13px;font-weight:600;color:#fafafa">Email</p>
                <p style="font-size:12px;color:rgba(255,255,255,0.4)">${company.email}</p>
              </div>
            </a>
          </div>

          <div style="background:var(--surface-2);border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:1.5rem">
            <p style="font-size:12px;font-weight:600;color:var(--ink-3);margin-bottom:1rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Geist Mono',monospace">Waktu respons</p>
            <div style="display:flex;flex-direction:column;gap:0.6rem">
              ${[
                ["Form ini", "2-4 jam"],
                ["WhatsApp", "< 1 jam"],
                ["Email", "Hari yang sama"],
                ["Darurat produksi", "< 30 menit"],
              ].map(([ch, t]) => `
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <span style="font-size:12.5px;color:var(--ink-2)">${ch}</span>
                  <span style="font-size:12px;font-weight:600;color:var(--ink);font-family:'Geist Mono',monospace">${t}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="background:#fff;border:1px solid var(--surface-3);border-radius:var(--radius-lg);padding:1.5rem">
            <p style="font-size:12px;font-weight:600;color:var(--ink-3);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Geist Mono',monospace">Kantor</p>
            <p style="font-size:13px;color:var(--ink-2);line-height:1.65;margin-bottom:0.5rem">${company.address}</p>
            <p style="font-size:12px;color:var(--ink-3)">Sen-Jum, 09.00-18.00 WIB</p>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section style="padding:5rem 0;background:var(--surface);border-top:1px solid var(--surface-3)">
    <div class="container-sm">
      <h2 class="reveal" style="font-size:1.5rem;margin-bottom:2rem">Pertanyaan yang sering masuk</h2>
      <div style="display:flex;flex-direction:column;gap:0" class="reveal">
        ${faqItems.map(([q, a], i) => `
          <div style="border-bottom:1px solid var(--surface-3)">
            <button onclick="toggleFaq(this)" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:1.1rem 0;background:none;border:none;cursor:pointer;text-align:left;gap:1rem">
              <span style="font-size:14px;font-weight:600;color:var(--ink)">${q}</span>
              <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;transition:transform 0.2s"><path d="M4 6l4 4 4-4" stroke="var(--ink-3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="faq-body" style="display:none;padding-bottom:1.1rem">
              <p style="font-size:13.5px;color:var(--ink-3);line-height:1.7">${a}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <script>
    function toggleFaq(btn) {
      const body = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const open = body.style.display === 'block';
      document.querySelectorAll('.faq-body').forEach(b => b.style.display = 'none');
      document.querySelectorAll('.faq-icon').forEach(ic => ic.style.transform = '');
      if (!open) {
        body.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
      }
    }

    const form = document.getElementById('contactForm');
    const btnText = document.getElementById('btnText');
    const btnArrow = document.getElementById('btnArrow');
    const submitBtn = document.getElementById('submitBtn');
    const formMsg = document.getElementById('formMsg');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      btnText.textContent = 'Mengirim...';
      btnArrow.textContent = '';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      setTimeout(() => {
        formMsg.style.display = 'block';
        formMsg.style.background = 'var(--accent-bg)';
        formMsg.style.border = '1px solid rgba(22,163,74,0.2)';
        formMsg.style.color = 'var(--accent)';
        formMsg.innerHTML = '<strong>Pesan terkirim.</strong> Kami akan balas dalam 2-4 jam di hari kerja.';
        form.reset();
        btnText.textContent = 'Kirim pesan';
        btnArrow.innerHTML = '&rarr;';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 1400);
    });
  </script>

  <style>
    @media (max-width: 768px) {
      div[style*="grid-template-columns:1fr 380px"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:1fr 1fr"][style*="gap:1rem"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:repeat(3,1fr)"][style*="gap:0.4rem"] { grid-template-columns: 1fr 1fr !important; }
    }
  </style>
`;

export const contactPage = () => layout("Kontak", content, "contact");
