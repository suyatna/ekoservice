import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        latar: '#0A0A0A',
        section: '#161616',
        panel: '#161616',
        panelHover: '#1B1B1B',
        borderHalus: '#262626',
        borderHover: '#333333',
        borderInput: '#383838',
        utama: '#22C55E',
        utamaHover: '#16A34A',
        aksen: '#3B82F6',
        bahaya: '#EF4444',
        sukses: '#22C55E',
        peringatan: '#F59E0B',
        teks: '#FAFAFA',
        teks2: '#D4D4D4',
        redup: '#A1A1AA'
      },
      boxShadow: {
        premium: '0 1px 2px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
