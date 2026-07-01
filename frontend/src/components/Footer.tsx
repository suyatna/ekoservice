import { useState } from 'react';
import { FacebookLogo, InstagramLogo, TwitterLogo, YoutubeLogo } from '@phosphor-icons/react';

const Footer = () => {
  const [logoError, setLogoError] = useState(false);
  const logoSrc = '/logo-ekoservice.png';

  return (
    <footer className="bg-[#1D2527] text-white">
      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-5 md:px-8 md:py-8 lg:px-10 xl:px-12">
        {/* Row: Logo, Menu, Social */}
        <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:items-center md:gap-8 md:text-left">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {logoError ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-section text-xs font-semibold text-utama">ES</span>
            ) : (
              <img src={logoSrc} alt="Logo Eko Service" className="h-8 w-8 rounded object-contain" onError={() => setLogoError(true)} />
            )}
            <p className="brand-text font-semibold">Eko Service</p>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-teks2 md:gap-5">
            <a href="#fitur" className="hover:text-teks transition-colors duration-200">Beranda</a>
            <a href="#testimoni" className="hover:text-teks transition-colors duration-200">Testimoni</a>
            <a href="#tentang" className="hover:text-teks transition-colors duration-200">Tentang</a>
            <a href="#lokasi" className="hover:text-teks transition-colors duration-200">Lokasi</a>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-5">
            <a href="#" className="text-redup hover:text-teks transition-colors duration-200">
              <FacebookLogo size={22} weight="fill" />
            </a>
            <a href="#" className="text-redup hover:text-teks transition-colors duration-200">
              <InstagramLogo size={22} weight="fill" />
            </a>
            <a href="#" className="text-redup hover:text-teks transition-colors duration-200">
              <TwitterLogo size={22} weight="fill" />
            </a>
            <a href="#" className="text-redup hover:text-teks transition-colors duration-200">
              <YoutubeLogo size={22} weight="fill" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-[#2A3639]"></div>
      </div>
    </footer>
  );
};

export default Footer;
