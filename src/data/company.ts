export const company = {
  name: "NusaTech Solutions",
  tagline: "Kita bikin digital, beneran.",
  description:
    "NusaTech bukan agensi biasa. Kita tim kecil yang obsesif soal detail — dari arsitektur backend sampai warna tombol. Sudah 9 tahun kami bantu bisnis Indonesia tumbuh lewat teknologi yang benar-benar bekerja.",
  founded: "2015",
  employees: "150+",
  projects: "500+",
  clients: "200+",
  email: "halo@nusatech.id",
  phone: "+62 21 2788 4491",
  address: "Jl. Wijaya I No. 37, Kebayoran Baru, Jakarta Selatan 12170",
  social: {
    linkedin: "https://linkedin.com/company/nusatech",
    twitter: "https://twitter.com/nusatech_id",
    instagram: "https://instagram.com/nusatech.id",
    github: "https://github.com/nusatech-id",
  },
};

export const services = [
  {
    id: 1,
    icon: "💻",
    title: "Web Development",
    description:
      "Bukan sekadar website cantik — kami bangun yang cepat, aman, dan tahan banting. Stack favorit kami: Bun, React, dan PostgreSQL. Tapi kami fleksibel sesuai kebutuhan Anda.",
    detail: "Mulai dari landing page sampai SaaS kompleks",
  },
  {
    id: 2,
    icon: "📱",
    title: "Mobile App",
    description:
      "iOS & Android, native atau cross-platform. Kami tahu perbedaannya dan kapan harus pakai yang mana — bukan asal pilih yang murah.",
    detail: "React Native · Flutter · Swift · Kotlin",
  },
  {
    id: 3,
    icon: "☁️",
    title: "Cloud & DevOps",
    description:
      "Deploy sekali, jalan terus. Kami setup infrastructure yang bisa tidur nyenyak — monitoring, auto-scaling, backup otomatis. AWS, GCP, atau on-premise.",
    detail: "Uptime rata-rata klien kami: 99.94%",
  },
  {
    id: 4,
    icon: "🤖",
    title: "AI & Otomasi",
    description:
      "AI bukan hype buat kami — kami sudah pakai sejak 2019. Dari chatbot internal sampai sistem rekomendasi produk yang beneran naikkan konversi.",
    detail: "LLM integration · Computer Vision · MLOps",
  },
  {
    id: 5,
    icon: "🔒",
    title: "Security Audit",
    description:
      "Penetration testing, code review, sampai compliance check. Kami temukan celah sebelum orang lain menemukannya — tanpa menghakimi kode lama Anda.",
    detail: "OWASP · ISO 27001 · PCI-DSS",
  },
  {
    id: 6,
    icon: "📊",
    title: "Data & Analytics",
    description:
      "Ribuan baris data Anda tersimpan tapi tidak terpakai? Kami ubah jadi dashboard yang benar-benar dibaca tim Anda setiap pagi.",
    detail: "BI · Data Pipeline · Predictive Analytics",
  },
];

export const team = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Co-founder & CEO",
    photo: "BS",
    bio: "Mantan engineer Tokopedia. Pindah ke dunia konsultan karena capek lihat website perusahaan Indonesia yang lambat.",
    color: "from-blue-500 to-indigo-600",
    funFact: "Koleksi mechanical keyboard: 11 buah",
  },
  {
    id: 2,
    name: "Sari Dewi",
    role: "Co-founder & CTO",
    photo: "SD",
    bio: "Lulusan ITS Surabaya, ex-Google Singapore. Balik ke Indonesia karena kangen soto ayam dan ingin bangun sesuatu yang lebih bermakna.",
    color: "from-violet-500 to-purple-600",
    funFact: "Contribute ke open source tiap Sabtu pagi",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    role: "Head of Product Design",
    photo: "AF",
    bio: "10 tahun desain digital, 3 tahun di Grab. Percaya bahwa UX yang bagus adalah yang pengguna tidak sadari — itu berarti sudah benar.",
    color: "from-emerald-500 to-teal-600",
    funFact: "Masih pakai Figma versi desktop, anti web app",
  },
  {
    id: 4,
    name: "Rina Kusuma",
    role: "Head of Client Success",
    photo: "RK",
    bio: "Bergabung tahun 2017 sebagai staf pertama non-teknis. Sekarang pegang 40+ akun klien dan tidak pernah ada yang complain soal komunikasi.",
    color: "from-rose-500 to-pink-600",
    funFact: "Reply email dalam waktu <15 menit, selalu",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Hendra Wijaya",
    company: "PT Maju Bersama Tbk",
    role: "CEO",
    text: "Jujur, awalnya saya skeptis. Sudah dua vendor sebelumnya menjanjikan hal serupa. NusaTech beda — mereka mau jujur kalau ada masalah, dan itu yang kami butuhkan.",
    rating: 5,
    avatar: "HW",
    color: "from-blue-500 to-cyan-500",
    project: "Sistem ERP & Mobile App",
  },
  {
    id: 2,
    name: "Dewi Rahayu",
    company: "Warung Pintar Digital",
    role: "Founder",
    text: "Kami UMKM, budget terbatas. Mereka tidak meremehkan. Malah kasih rekomendasi yang hemat tapi tetap solid. Platform kami handle 2000 transaksi/hari tanpa masalah.",
    rating: 5,
    avatar: "DR",
    color: "from-emerald-500 to-teal-500",
    project: "Platform E-Commerce B2B",
  },
  {
    id: 3,
    name: "Irfan Mahmud",
    company: "Koin Fintech",
    role: "VP Engineering",
    text: "Yang saya suka: mereka mau bilang 'tidak' kalau request kami tidak masuk akal secara teknis. Vendor yang cuma bilang iya itu bahaya di jangka panjang.",
    rating: 5,
    avatar: "IM",
    color: "from-violet-500 to-purple-500",
    project: "Core Banking System",
  },
];

export const portfolios = [
  {
    id: 1,
    title: "KoinPay — Super App",
    category: "Fintech · Mobile & Web",
    description:
      "Core banking + dompet digital untuk koperasi simpan pinjam. 2,3 juta pengguna aktif, latency rata-rata <120ms. Dibangun dalam 14 bulan.",
    tech: ["React Native", "Go", "PostgreSQL", "Redis"],
    color: "from-blue-600 to-indigo-700",
    emoji: "🏦",
    year: "2023",
    result: "+340% transaksi digital dalam 6 bulan",
  },
  {
    id: 2,
    title: "Warung Connect",
    category: "E-Commerce · B2B",
    description:
      "Marketplace grosir untuk 12.000+ warung di Jabodetabek. Integrasi langsung ke sistem distributor FMCG. Order processing <2 detik.",
    tech: ["Next.js", "Bun", "MySQL", "Kafka"],
    color: "from-emerald-500 to-teal-600",
    emoji: "🛒",
    year: "2023",
    result: "Rp 4,2 miliar GMV di bulan ketiga",
  },
  {
    id: 3,
    title: "CerdasRetail Analytics",
    category: "Data & AI",
    description:
      "Prediksi stok & demand forecasting untuk jaringan minimarket 200+ gerai. Akurasi prediksi 91%, turunkan overstock 28%.",
    tech: ["Python", "FastAPI", "TensorFlow", "Metabase"],
    color: "from-purple-600 to-violet-700",
    emoji: "📊",
    year: "2022",
    result: "Hemat Rp 1,8 miliar/tahun biaya inventory",
  },
  {
    id: 4,
    title: "KlinikKu — Telemedicine",
    category: "HealthTech · SaaS",
    description:
      "Platform konsultasi dokter online dengan rekam medis digital. BPJS-integrated. Sudah dipakai 800+ klinik di 12 provinsi.",
    tech: ["Vue.js", "Laravel", "AWS", "WebRTC"],
    color: "from-rose-500 to-pink-600",
    emoji: "🩺",
    year: "2022",
    result: "4,8/5 rating dari 50.000+ pasien",
  },
];
