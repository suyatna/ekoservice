import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        latar: '#111719',
        section: '#1D2527',
        panel: '#1D2527',
        panelHover: '#242E31',
        borderHalus: '#2A3639',
        borderHover: '#344246',
        borderInput: '#344246',
        utama: '#3678F4',
        utamaHover: '#2E68D8',
        aksen: '#4A89F6',
        bahaya: '#EF4444',
        sukses: '#2CBF78',
        peringatan: '#F59E0B',
        teks: '#F4F7F8',
        teks2: '#C7D0D3',
        redup: '#8D9AA0'
      },
      boxShadow: {
        premium: '0 1px 2px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
