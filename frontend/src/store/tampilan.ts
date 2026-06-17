import { create } from 'zustand';

type DensityMode = 'normal' | 'compact';

interface TampilanState {
  density: DensityMode;
  gantiDensity: () => void;
}

export const pakaiTampilanStore = create<TampilanState>((set) => ({
  density: (localStorage.getItem('eko_density') as DensityMode) || 'normal',
  gantiDensity: () =>
    set((s) => {
      const next = s.density === 'normal' ? 'compact' : 'normal';
      localStorage.setItem('eko_density', next);
      return { density: next };
    })
}));
