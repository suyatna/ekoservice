import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  X,
  Snowflake,
  Refrigerator,
  WashingMachine,
  Tv,
  Wallet,
  BadgeCheck,
  ShieldCheck,
  Zap,
  Menu as MenuIcon
} from 'lucide-react';
import { Tombol } from '@/komponen/ui/tombol';
import { ContainerPublik, SectionWrapper } from '@/komponen/layout/Container';
import { PetaPreviewLokasi } from '@/komponen/peta/PetaPreviewLokasi';
import Footer from '@/components/Footer';

const testimoni = [
  {
    nama: 'Nurul Qomariah',
    peran: 'Reviewer di Google Maps',
    isi: 'Pelayanannya cepat, rapih dan ramah. Alhamdulillah mesin cucinya kembali normal, jadi batal beli mesin cuci baru',
    foto: '/img/avatar.png'
  },
  {
    nama: 'Ghassani Hashifah',
    peran: 'Reviewer di Google Maps',
    isi: 'Fast respon, pengerjaan rapih cepat dan bersih. Harga service termurah dr yang saya cari2. Terima kasih banyak pak eko!',
    foto: '/img/avatar.png'
  },
  {
    nama: 'Nur Rachim',
    peran: 'Reviewer di Google Maps',
    isi: 'Teknisi ramah, jujur, dan baik membagikan pengalaman terkait masalah mesin cuci. Sukses selalu untuk pak eko🙏',
    foto: '/img/avatar.png'
  },
  {
    nama: 'Muhammad Taufiq Hidayat',
    peran: 'Reviewer di Google Maps',
    isi: 'Orang nya ramah.. dan berpengalaman... Tidak asal tebak2an.. di benerin dulu dari awal.. seringkasih pak... Mantap',
    foto: '/img/avatar.png'
  },
  {
    nama: 'Nadhiroh Rahma',
    peran: 'Reviewer di Google Maps',
    isi: 'sangat recommended. mengerti kerusakan dan solusi nya,kerja nya juga cepat. inshaAllah amanah👍🏼 …',
    foto: '/img/avatar.png'
  },
  {
    nama: 'Lissa Handayani',
    peran: 'Reviewer di Google Maps',
    isi: 'Alhamdulillah kulkas sy sdh kembali normal. Pengerjaan cepat sat set langsung tau problemny dmn.. terima kasih pak eko..',
    foto: '/img/avatar.png'
  }
];

const gambarTemplate = [
  { judul: 'Foto 1', src: '/img/dokumentasi-1.webp' },
  { judul: 'Foto 2', src: '/img/dokumentasi-2.webp' },
  { judul: 'Foto 3', src: '/img/dokumentasi-3.webp' },
  { judul: 'Foto 4', src: '/img/dokumentasi-4.webp' },
  { judul: 'Foto 5', src: '/img/dokumentasi-5.webp' },
  { judul: 'Foto 6', src: '/img/dokumentasi-6.webp' },
  { judul: 'Foto 7', src: '/img/dokumentasi-7.webp' },
  { judul: 'Foto 8', src: '/img/dokumentasi-8.webp' }
];

const gambarSertifikat = [
  { judul: 'Sertifikat 1', src: '/img/certificate-1.jpeg' },
  { judul: 'Sertifikat 2', src: '/img/certificate-2.jpeg' },
  { judul: 'Sertifikat 3', src: '/img/certificate-3.jpeg' }
];

const tombolLanding = 'inline-flex w-full justify-center sm:w-auto sm:min-w-[140px] md:min-w-[180px]';
const lokasiEkoService = { lat: -6.2028941, lng: 106.9399847 };
const linkMaps =
  'https://www.google.com/maps/place/Eko+Service+Kulkas+Mesincuci+AC/@-6.2413982,106.7633447,12z/data=!4m8!3m7!1s0x21c16483fa5e98eb:0x7de77a808f02e099!8m2!3d-6.2028941!4d106.9399847!9m1!1b1!16s%2Fg%2F11stpjqjpf?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D';

export const Landing = () => {
  const [preview, setPreview] = useState<{ src: string; judul: string } | null>(
    null
  );
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoSrc = '/logo-ekoservice.png';

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-latar text-teks">
      <nav className="sticky top-0 z-20 border-b border-borderHalus bg-latar">
        <ContainerPublik className="flex h-14 items-center justify-between gap-3 md:h-16 md:gap-4">
          <div className="flex items-center gap-6 md:gap-8">
            <div className="flex min-w-0 items-center gap-2 md:gap-3">
              {logoError ? (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-section text-xs font-semibold text-utama">
                  ES
                </span>
              ) : (
                <img
                  src={logoSrc}
                  alt="Logo Eko Service"
                  className="h-8 w-8 rounded object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
              <p className="brand-text font-semibold">Eko Service</p>
            </div>
            <div className="hidden gap-5 text-sm text-teks2 md:flex">
              <a href="#fitur" className="hover:text-teks transition">Beranda</a>
              <a href="#testimoni" className="hover:text-teks transition">Testimoni</a>
              <a href="#tentang" className="hover:text-teks transition">Tentang</a>
              <a href="#lokasi" className="hover:text-teks transition">Lokasi</a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="btn-bounce flex h-9 w-9 items-center justify-center rounded-full bg-section text-teks transition hover:bg-panelHover md:hidden"
          >
            <MenuIcon size={20} />
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/masuk">
              <Tombol
                className={`btn-bounce bg-section text-white ${tombolLanding}`}
              >
                Login Admin
              </Tombol>
            </Link>
            <Link to="/booking">
              <Tombol className={`btn-bounce ${tombolLanding}`}>
                Booking Sekarang
              </Tombol>
            </Link>
          </div>
        </ContainerPublik>
      </nav>

      {/* Backdrop mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu slide-in */}
      <aside className={`fixed left-0 top-0 z-40 h-full w-60 flex-col bg-panel border-r border-borderHalus transition-transform duration-200 ease-in-out lg:hidden ${mobileMenuOpen ? 'flex' : 'hidden'}`}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="brand-text font-semibold text-sm">Menu</p>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-redup hover:bg-section transition"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          <a
            href="#fitur"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-redup hover:bg-section/70 hover:text-teks2 transition"
          >
            Beranda
          </a>
          <a
            href="#testimoni"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-redup hover:bg-section/70 hover:text-teks2 transition"
          >
            Testimoni
          </a>
          <a
            href="#tentang"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-redup hover:bg-section/70 hover:text-teks2 transition"
          >
            Tentang
          </a>
          <a
            href="#lokasi"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-redup hover:bg-section/70 hover:text-teks2 transition"
          >
            Lokasi
          </a>
        </nav>
        <div className="px-3 pb-4 space-y-2">
          <Link to="/masuk" onClick={() => setMobileMenuOpen(false)}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-bounce flex w-full items-center justify-center gap-2 rounded-full border border-borderHalus bg-latar px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60"
            >
              Login Admin
            </button>
          </Link>
          <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
            <Tombol className="btn-bounce w-full justify-center">Booking Sekarang</Tombol>
          </Link>
        </div>
      </aside>

      <section
        id="fitur"
        className="relative min-h-[68vh] overflow-hidden bg-cover bg-center md:min-h-[75vh]"
        style={{ backgroundImage: "url('/img/bg-hero.webp')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090c]/80 via-[#0A0A0A]/72 via-58% to-[#0A0A0A]/90" />
        <div className="absolute inset-x-0 bottom-0 h-[18rem] bg-gradient-to-b from-transparent via-[#07090c]/90 to-[#0A0A0A]" />
        <ContainerPublik className="relative z-10 flex min-h-[68vh] items-center justify-center pb-5 pt-5 md:min-h-[75vh] md:pb-4 md:pt-6">
          <div className="w-full space-y-5 text-center md:space-y-6">
            <h1
              data-hero-motion
              className="hero-title-utama mx-auto max-w-5xl font-semibold"
            >
              Spesialis Service
              <br />
              Kulkas, Mesin Cuci, dan AC
            </h1>
            <div
              data-hero-motion="3"
              className="flex justify-center gap-3 pt-1"
            >
              <Link to="/booking" className="w-full sm:w-auto">
                <Tombol className={`btn-bounce ${tombolLanding}`}>
                  Booking Sekarang
                </Tombol>
              </Link>
            </div>
          </div>
        </ContainerPublik>
      </section>

      <SectionWrapper>
        <ContainerPublik>
          <section className="space-y-6" id="ringkasan" data-reveal>
            <div className="kartu rounded-none p-4 md:p-6">
              <h3 className="ringkasan-title text-center">
                Mengapa Memilih Kami
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-px bg-[#2D2D2D] text-center text-sm md:grid-cols-4">
                <div className="bg-panel flex flex-col items-center gap-2 p-4">
                  <BadgeCheck size={20} className="text-utama" />
                  <p className="text-lg font-semibold">Teknisi Terpercaya</p>
                </div>
                <div className="bg-panel flex flex-col items-center gap-2 p-4">
                  <Wallet size={20} className="text-utama" />
                  <p className="text-lg font-semibold">Harga Terjangkau</p>
                </div>
                <div className="bg-panel flex flex-col items-center gap-2 p-4">
                  <ShieldCheck size={20} className="text-utama" />
                  <p className="text-lg font-semibold">Service Bergaransi</p>
                </div>
                <div className="bg-panel flex flex-col items-center gap-2 p-4">
                  <Zap size={20} className="text-utama" />
                  <p className="text-lg font-semibold">Admin Responsif</p>
                </div>
              </div>
            </div>
          </section>
        </ContainerPublik>
      </SectionWrapper>

      <SectionWrapper>
        <ContainerPublik>
          <section className="space-y-6" id="jenis-servis" data-reveal>
            <h2 className="text-xl font-semibold">Layanan yang Tersedia</h2>
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="kartu h-full overflow-hidden p-0">
                <img
                  src="/img/service-ac.png"
                  alt="Service AC"
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <Snowflake size={20} className="text-utama" /> Service AC
                  </p>
                </div>
              </div>
              <div className="kartu h-full overflow-hidden p-0">
                <img
                  src="/img/service-kulkas.png"
                  alt="Service Kulkas"
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <Refrigerator size={20} className="text-utama" /> Service
                    Kulkas
                  </p>
                </div>
              </div>
              <div className="kartu h-full overflow-hidden p-0">
                <img
                  src="/img/service-chiller.png"
                  alt="Service Chiller"
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <Snowflake size={20} className="text-utama" /> Service
                    Chiller
                  </p>
                </div>
              </div>
              <div className="kartu h-full overflow-hidden p-0">
                <img
                  src="/img/service-showcase.png"
                  alt="Service Showcase"
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <Refrigerator size={20} className="text-utama" /> Service
                    Showcase
                  </p>
                </div>
              </div>
              <div className="kartu h-full overflow-hidden p-0">
                <img
                  src="/img/service-mesincuci.png"
                  alt="Service Mesin Cuci"
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <WashingMachine size={20} className="text-utama" /> Service
                    Mesin Cuci
                  </p>
                </div>
              </div>
              <div className="kartu h-full overflow-hidden p-0">
                <img
                  src="/img/service-tv.png"
                  alt="Service TV"
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <Tv size={20} className="text-utama" /> Service TV
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ContainerPublik>
      </SectionWrapper>

      <SectionWrapper>
        <ContainerPublik>
          <section className="space-y-6" id="testimoni" data-reveal>
            <h2 className="text-xl font-semibold">Testimoni Pengguna</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimoni.map((item) => (
                <div key={item.nama} className="kartu rounded-none p-4 md:p-6">
                  <p className="text-sm text-teks2">"{item.isi}"</p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{item.nama}</p>
                      <p
                        className="mt-1"
                        style={{
                          fontSize: '0.75rem',
                          color: '#A1A1AA',
                          fontFamily: "'Farro', sans-serif"
                        }}
                      >
                        {item.peran}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <a
                href="https://www.google.com/maps/place/Eko+Service+Kulkas+Mesincuci+AC/@-6.2413982,106.7633447,12z/data=!4m8!3m7!1s0x21c16483fa5e98eb:0x7de77a808f02e099!8m2!3d-6.2028941!4d106.9399847!9m1!1b1!16s%2Fg%2F11stpjqjpf?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Tombol
                  className={`btn-bounce bg-section text-white ${tombolLanding}`}
                >
                  Lihat Semua Testimoni
                </Tombol>
              </a>
            </div>
          </section>
        </ContainerPublik>
      </SectionWrapper>

      <SectionWrapper>
        <ContainerPublik>
          <section className="space-y-6" id="tentang" data-reveal>
            <h2 className="text-xl font-semibold">Tentang Perusahaan</h2>
            <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
              <div className="kartu rounded-none p-4 md:p-6">
                <p className="text-sm text-teks2">
                  Eko Service adalah usaha jasa service elektronik panggilan di
                  Jakarta yang sudah berpengalaman dalam menangani berbagai
                  perbaikan elektronik. Pengerjaan dilakukan dengan cepat dan
                  rapi sehingga perangkat dapat kembali digunakan dengan normal.
                </p>
                <p className="mt-4 text-sm text-teks2">
                  Kami melayani service kulkas, mesin cuci, AC, chiller,
                  showcase, dan TV untuk berbagai merek dan tipe. Eko Service
                  juga sudah dipercaya oleh masyarakat Jakarta dan sekitarnya
                  serta melayani konsumen dari berbagai kalangan.
                </p>
              </div>
              <div className="kartu rounded-none p-4 text-sm space-y-1 md:p-6">
                <div className="panel-kompak p-4 space-y-0.5">
                  <p className="text-teks2">Sudah Tanggani</p>
                  <p
                    className="text-lg font-semibold"
                    style={{
                      fontFamily: "'Koulen', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.01em'
                    }}
                  >
                    100+ Pelanggan
                  </p>
                </div>
                <div className="h-px w-full bg-[#2D2D2D]"></div>
                <div className="panel-kompak p-4 space-y-0.5">
                  <p className="text-teks2">Rating Google</p>
                  <p className="text-lg font-semibold">4.9 / 5.0</p>
                </div>
                <div className="h-px w-full bg-[#2D2D2D]"></div>
                <div className="panel-kompak p-4 space-y-0.5">
                  <p className="text-teks2">Cakupan Kota</p>
                  <p className="text-lg font-semibold">Jakarta dan Sekitar</p>
                </div>
              </div>
            </div>
          </section>
        </ContainerPublik>
      </SectionWrapper>

      <SectionWrapper>
        <ContainerPublik>
          <section className="space-y-6" id="sertifikat" data-reveal>
            <h2 className="text-xl font-semibold">Sertifikat</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {gambarSertifikat.map((img) => (
                <button
                  key={img.judul}
                  className="galeri-item overflow-hidden kartu rounded-none bg-panel p-0 text-left"
                  onClick={() => setPreview({ src: img.src, judul: img.judul })}
                >
                  <img
                    src={img.src}
                    alt={img.judul}
                    className="h-48 w-full object-cover md:h-64"
                  />
                  <span className="galeri-overlay">
                    <span className="galeri-cta">Lihat Gambar</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </ContainerPublik>
      </SectionWrapper>

      <SectionWrapper>
        <ContainerPublik>
          <section className="space-y-6" id="lokasi" data-reveal>
            <h2 className="text-xl font-semibold">Lokasi Kami</h2>
            <div className="space-y-4">
              <PetaPreviewLokasi
                lat={lokasiEkoService.lat}
                lng={lokasiEkoService.lng}
                withCard={false}
              />
              <div className="flex justify-end">
                <a href={linkMaps} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                  <Tombol
                    className={`btn-bounce bg-section text-white ${tombolLanding}`}
                  >
                    Buka di Google Maps
                  </Tombol>
                </a>
              </div>
            </div>
          </section>
        </ContainerPublik>
      </SectionWrapper>

      <SectionWrapper>
        <ContainerPublik>
          <section className="space-y-8 pb-6" data-reveal>
            <div className="kartu rounded-none p-5 text-center md:p-7">
              <h3 className="cta-title">Butuh Service Cepat dan Murah?</h3>
              <p className="mt-3 text-sm text-teks2">
                Solusi cepat dan hemat untuk service Anda. Hanya dengan harga
                jasa mulai dari Rp 70 ribu hingga Rp 150 ribu, <br className="hidden md:block" />
                teknisi kami siap melayani langsung ke lokasi Anda!
              </p>
              <div className="mt-5 flex justify-center gap-3 flex-wrap">
                <Link to="/booking" className="w-full sm:w-auto">
                  <Tombol className={`btn-bounce ${tombolLanding}`}>
                    Mulai Booking
                  </Tombol>
                </Link>
              </div>
            </div>
          </section>
        </ContainerPublik>
      </SectionWrapper>

      <SectionWrapper>
        <ContainerPublik>
          <section className="space-y-6" id="galeri-template" data-reveal>
            <h2 className="text-xl font-semibold">Galeri Pekerjaan</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {gambarTemplate.map((img) => (
                <button
                  key={img.judul}
                  className="galeri-item overflow-hidden kartu rounded-none bg-panel p-0 text-left"
                  onClick={() => setPreview({ src: img.src, judul: img.judul })}
                >
                  <img
                    src={img.src}
                    alt={img.judul}
                    className="aspect-square w-full object-cover"
                  />
                  <span className="galeri-overlay">
                    <span className="galeri-cta">Lihat Gambar</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <a
                href="https://www.google.com/maps/place/Eko+Service+Kulkas+Mesincuci+AC/@-6.2413982,106.7633447,12z/data=!4m8!3m7!1s0x21c16483fa5e98eb:0x7de77a808f02e099!8m2!3d-6.2028941!4d106.9399847!9m1!1b1!16s%2Fg%2F11stpjqjpf?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Tombol
                  className={`btn-bounce bg-section text-white ${tombolLanding}`}
                >
                  Lihat Semua Gambar
                </Tombol>
              </a>
            </div>
          </section>
        </ContainerPublik>
      </SectionWrapper>

      <Footer />

      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-2 top-2 rounded-md bg-panel p-2 text-white"
              onClick={() => setPreview(null)}
            >
              <X size={20} />
            </button>
            <img
              src={preview.src}
              alt={preview.judul}
              className="max-h-[80vh] w-full rounded-md object-cover"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
