export const layout = (title: string, content: string, activePage: string = "home") => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — NusaTech Solutions</title>
  <meta name="description" content="NusaTech Solutions - Inovasi Digital untuk Indonesia. Layanan web development, mobile, cloud, AI, dan cybersecurity terpercaya." />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { font-family: 'Inter', sans-serif; }
    html { scroll-behavior: smooth; }
    .gradient-text {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .nav-link {
      position: relative;
      transition: color 0.2s;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 0;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transition: width 0.3s ease;
    }
    .nav-link:hover::after,
    .nav-link.active::after {
      width: 100%;
    }
    .card-hover {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }
    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      transition: opacity 0.2s, transform 0.2s;
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    .float { animation: float 3s ease-in-out infinite; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fadeInUp 0.6s ease forwards; }
    .hero-bg {
      background: radial-gradient(ellipse at 60% 40%, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 50%, transparent 70%),
                  radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.06) 0%, transparent 50%),
                  #ffffff;
    }
    .section-alt { background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); }
  </style>
</head>
<body class="bg-white text-gray-800">

  <!-- Navbar -->
  <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-xl btn-primary flex items-center justify-center text-white font-bold text-lg">N</div>
        <span class="text-xl font-bold">Nusa<span class="gradient-text">Tech</span></span>
      </a>
      
      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <a href="/" class="nav-link text-sm font-medium text-gray-600 hover:text-blue-600 ${activePage === 'home' ? 'active text-blue-600' : ''}">Beranda</a>
        <a href="/services" class="nav-link text-sm font-medium text-gray-600 hover:text-blue-600 ${activePage === 'services' ? 'active text-blue-600' : ''}">Layanan</a>
        <a href="/portfolio" class="nav-link text-sm font-medium text-gray-600 hover:text-blue-600 ${activePage === 'portfolio' ? 'active text-blue-600' : ''}">Portfolio</a>
        <a href="/about" class="nav-link text-sm font-medium text-gray-600 hover:text-blue-600 ${activePage === 'about' ? 'active text-blue-600' : ''}">Tentang</a>
        <a href="/contact" class="nav-link text-sm font-medium text-gray-600 hover:text-blue-600 ${activePage === 'contact' ? 'active text-blue-600' : ''}">Kontak</a>
      </div>

      <a href="/contact" class="hidden md:inline-flex btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
        Mulai Proyek →
      </a>

      <!-- Mobile Hamburger -->
      <button id="menuBtn" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="hidden md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
      <a href="/" class="text-sm font-medium text-gray-600 hover:text-blue-600 py-1">Beranda</a>
      <a href="/services" class="text-sm font-medium text-gray-600 hover:text-blue-600 py-1">Layanan</a>
      <a href="/portfolio" class="text-sm font-medium text-gray-600 hover:text-blue-600 py-1">Portfolio</a>
      <a href="/about" class="text-sm font-medium text-gray-600 hover:text-blue-600 py-1">Tentang</a>
      <a href="/contact" class="text-sm font-medium text-gray-600 hover:text-blue-600 py-1">Kontak</a>
      <a href="/contact" class="btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold text-center mt-2">Mulai Proyek →</a>
    </div>
  </nav>

  <!-- Page Content -->
  <main>
    ${content}
  </main>

  <!-- Footer -->
  <footer class="bg-gray-950 text-gray-400 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-9 h-9 rounded-xl btn-primary flex items-center justify-center text-white font-bold">N</div>
            <span class="text-xl font-bold text-white">Nusa<span class="gradient-text">Tech</span></span>
          </div>
          <p class="text-sm text-gray-500 leading-relaxed mb-5">Inovasi digital untuk bisnis Indonesia yang lebih maju dan kompetitif.</p>
          <div class="flex gap-3">
            <a href="#" class="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors text-sm">in</a>
            <a href="#" class="w-9 h-9 bg-gray-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-colors text-sm">tw</a>
            <a href="#" class="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors text-sm">ig</a>
            <a href="#" class="w-9 h-9 bg-gray-800 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors text-sm">gh</a>
          </div>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Layanan</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/services" class="hover:text-white transition-colors">Web Development</a></li>
            <li><a href="/services" class="hover:text-white transition-colors">Mobile Development</a></li>
            <li><a href="/services" class="hover:text-white transition-colors">Cloud Solutions</a></li>
            <li><a href="/services" class="hover:text-white transition-colors">AI & Machine Learning</a></li>
            <li><a href="/services" class="hover:text-white transition-colors">Cybersecurity</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Perusahaan</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/about" class="hover:text-white transition-colors">Tentang Kami</a></li>
            <li><a href="/portfolio" class="hover:text-white transition-colors">Portfolio</a></li>
            <li><a href="/about#team" class="hover:text-white transition-colors">Tim Kami</a></li>
            <li><a href="/contact" class="hover:text-white transition-colors">Karir</a></li>
            <li><a href="/contact" class="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Kontak</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start gap-2"><span>📍</span><span>Jl. Sudirman No. 88, Jakarta Selatan</span></li>
            <li class="flex items-center gap-2"><span>📞</span><a href="tel:+622112345678" class="hover:text-white transition-colors">+62 21 1234 5678</a></li>
            <li class="flex items-center gap-2"><span>✉️</span><a href="mailto:hello@nusatech.id" class="hover:text-white transition-colors">hello@nusatech.id</a></li>
          </ul>
        </div>
      </div>
      <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-600">© 2024 NusaTech Solutions. All rights reserved.</p>
        <div class="flex gap-6 text-sm">
          <a href="#" class="hover:text-white transition-colors">Kebijakan Privasi</a>
          <a href="#" class="hover:text-white transition-colors">Syarat & Ketentuan</a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  </script>
</body>
</html>
`;
