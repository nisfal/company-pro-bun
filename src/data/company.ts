import type {
  CompanyInfo,
  Service,
  TeamMember,
  Testimonial,
  Portfolio,
} from "../lib/types";

export const company: CompanyInfo = {
  name: "NusaTech Solutions",
  tagline: "Solusi Digital Kelas Dunia",
  description:
    "Kami membangun produk digital yang skalabel, cepat, dan berdampak nyata — dari startup hingga enterprise.",
  founded: "2015",
  employees: "150+",
  projects: "500+",
  clients: "200+",
  email: "hello@nusatech.id",
  phone: "+62 21 1234 5678",
  address: "Jl. Sudirman No. 88, Jakarta Selatan, DKI Jakarta 12190",
  social: {
    linkedin: "https://linkedin.com/company/nusatech",
    twitter: "https://twitter.com/nusatech_id",
    instagram: "https://instagram.com/nusatech.id",
    github: "https://github.com/nusatech",
  },
};

export const services: Service[] = [
  {
    id: 1,
    icon: "🚀",
    title: "Product Engineering",
    description:
      "Kami rancang dan bangun produk digital dari nol — arsitektur solid, UX intuitif, dan delivery tepat waktu.",
    detail: "Full-cycle product development",
  },
  {
    id: 2,
    icon: "☁️",
    title: "Cloud & DevOps",
    description:
      "Infrastructure as code, CI/CD pipeline, Kubernetes orchestration, dan observability end-to-end.",
    detail: "AWS · GCP · Azure · K8s",
  },
  {
    id: 3,
    icon: "📱",
    title: "Mobile Development",
    description:
      "Aplikasi native iOS & Android, serta cross-platform React Native untuk reach yang lebih luas.",
    detail: "iOS · Android · React Native",
  },
  {
    id: 4,
    icon: "🤖",
    title: "AI & Data Engineering",
    description:
      "Pipeline data real-time, model ML production-ready, dan integrasi LLM untuk produk cerdas.",
    detail: "ML · LLM · Streaming Data",
  },
  {
    id: 5,
    icon: "🔐",
    title: "Security & Compliance",
    description:
      "Penetration testing, secure SDLC, dan compliance audit untuk produk yang aman dari ground up.",
    detail: "PenTest · OWASP · ISO 27001",
  },
  {
    id: 6,
    icon: "📊",
    title: "Analytics & BI",
    description:
      "Dashboard real-time, data warehouse modern, dan insight actionable dari data bisnis Anda.",
    detail: "dbt · Redshift · Metabase",
  },
];

export const team: TeamMember[] = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "CEO & Co-Founder",
    initials: "BS",
    bio: "10+ tahun di product engineering. Ex-Gojek, ex-Tokopedia. Passionate soal scalable systems.",
    funFact: "Bisa debug production issue sambil makan soto.",
  },
  {
    id: 2,
    name: "Dewi Rahayu",
    role: "CTO & Co-Founder",
    initials: "DR",
    bio: "Distributed systems expert. Speaker di berbagai konferensi teknologi Asia Tenggara.",
    funFact: "Koleksi mechanical keyboard lebih dari 20 unit.",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    role: "Head of Engineering",
    initials: "AF",
    bio: "Platform engineer dengan spesialisasi Kubernetes dan observability. Open source contributor.",
    funFact: "Pernah deploy ke production dari atas gunung.",
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    role: "Head of Design",
    initials: "SN",
    bio: "Design systems practitioner. Percaya bahwa UX yang baik adalah invisible UX.",
    funFact: "Mendesain sambil dengerin jazz — selalu jazz.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rizky Pratama",
    company: "FinPay Indonesia",
    role: "CTO",
    text: "NusaTech transform cara tim kami bekerja. Delivery 3x lebih cepat, bug rate turun drastis. Mereka bukan vendor — mereka partner.",
    rating: 5,
    avatar: "RP",
  },
  {
    id: 2,
    name: "Lisa Hartono",
    company: "RetailGo",
    role: "VP Engineering",
    text: "Migration ke microservices selesai dalam 6 bulan tanpa downtime. Saya tidak pernah lihat eksekusi sekelas ini sebelumnya.",
    rating: 5,
    avatar: "LH",
  },
  {
    id: 3,
    name: "Marco Tanuwijaya",
    company: "EduNusa",
    role: "Founder & CEO",
    text: "Platform kami handle 500k concurrent users saat launch — sesuatu yang kami kira tidak mungkin dalam timeline itu.",
    rating: 5,
    avatar: "MT",
  },
];

export const portfolios: Portfolio[] = [
  {
    id: 1,
    title: "FinPay Super App",
    category: "Fintech · Mobile & Web",
    description:
      "Platform pembayaran digital dengan 2M+ pengguna aktif. Real-time transaction processing, fraud detection ML, dan open banking integration.",
    tech: ["Go", "Kafka", "React Native", "PostgreSQL", "Redis"],
    year: "2023",
    result: "2M+ pengguna aktif",
  },
  {
    id: 2,
    title: "RetailGo Platform",
    category: "E-commerce · Enterprise",
    description:
      "Microservices re-architecture untuk platform retail dengan 50+ brand. Zero-downtime migration dari monolith legacy.",
    tech: ["Node.js", "Kubernetes", "React", "MongoDB", "RabbitMQ"],
    year: "2023",
    result: "Zero-downtime migration",
  },
  {
    id: 3,
    title: "EduNusa LMS",
    category: "EdTech · Platform",
    description:
      "Learning management system untuk 500k+ pelajar. Live streaming, adaptive quiz engine, dan sertifikasi blockchain.",
    tech: ["Next.js", "WebRTC", "Python", "PostgreSQL", "AWS"],
    year: "2022",
    result: "500k+ pelajar aktif",
  },
  {
    id: 4,
    title: "LogiTrack",
    category: "Logistik · IoT",
    description:
      "Fleet management dan real-time cargo tracking untuk 1000+ kendaraan. IoT integration dengan prediksi rute AI.",
    tech: ["Go", "MQTT", "TimescaleDB", "React", "Mapbox"],
    year: "2022",
    result: "1000+ armada terpantau",
  },
];
