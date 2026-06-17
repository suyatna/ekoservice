import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export const Tombol = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'btn-bounce rounded-full border border-utama/50 bg-utama px-5 py-2 text-sm font-semibold text-black transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60 disabled:opacity-60',
      className
    )}
    {...props}
  />
);

export const TombolKecil = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'btn-bounce rounded-full border border-utama/40 bg-utama/80 px-4 py-1.5 text-xs font-semibold text-black transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60 disabled:opacity-60',
      className
    )}
    {...props}
  />
);

export const TombolOutline = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'btn-bounce rounded-full border border-borderHalus bg-transparent px-5 py-2 text-sm font-semibold text-teks2 transition hover:bg-section/70 focus:outline-none focus:ring-2 focus:ring-utama/60 disabled:opacity-60',
      className
    )}
    {...props}
  />
);

export const TombolDanger = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'btn-bounce rounded-full border border-red-800/50 bg-red-700/80 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-red-700/60 disabled:opacity-60',
      className
    )}
    {...props}
  />
);