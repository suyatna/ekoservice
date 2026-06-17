import { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export const FormSelect = ({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className={cn('relative', className)}>
    <select
      className="w-full bg-panel px-3 py-2 text-sm text-teks focus:outline-none appearance-none cursor-pointer pr-8 rounded-lg"
      {...props}
    />
    <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-redup" />
  </div>
);