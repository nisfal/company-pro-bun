# NusaTech Solutions — Company Profile

Website company profile untuk **NusaTech Solutions**, dibangun dengan [Bun](https://bun.sh) dan [Hono](https://hono.dev). Server-side rendering murni, tanpa framework frontend, tampil cepat dan ringan.

## Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Language:** TypeScript
- **Styling:** Tailwind CSS (via CDN)

## Struktur Proyek

```
company-pro-bun/
├── index.ts              # Entry point & konfigurasi server
├── src/
│   ├── router.ts         # Routing semua halaman
│   ├── data/
│   │   └── company.ts    # Data perusahaan, layanan, tim, portofolio
│   ├── pages/
│   │   ├── home.ts       # Halaman Beranda
│   │   ├── services.ts   # Halaman Layanan
│   │   ├── portfolio.ts  # Halaman Portofolio
│   │   ├── about.ts      # Halaman Tentang Kami
│   │   └── contact.ts    # Halaman Kontak
│   └── templates/
│       └── layout.ts     # Layout HTML dasar
└── package.json
```

## Halaman

| Route        | Keterangan         |
|--------------|--------------------|
| `/`          | Beranda            |
| `/services`  | Layanan            |
| `/portfolio` | Portofolio         |
| `/about`     | Tentang Kami       |
| `/contact`   | Kontak             |

API endpoint tersedia di `POST /api/contact` untuk pengiriman form kontak.

## Instalasi & Menjalankan

Install dependencies:

```bash
bun install
```

Jalankan server (development dengan hot reload):

```bash
bun run dev
```

Atau jalankan langsung:

```bash
bun run start
```

Server berjalan di `http://localhost:3000` secara default. Port bisa diubah lewat environment variable `PORT`.

## Kustomisasi

Semua data konten (nama perusahaan, layanan, tim, portofolio, testimoni) ada di satu file:

```
src/data/company.ts
```

Ubah file tersebut untuk menyesuaikan konten dengan kebutuhan.
