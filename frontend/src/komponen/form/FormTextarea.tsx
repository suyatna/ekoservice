import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export const FormTextarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      'min-h-24 w-full rounded-lg border border-borderHalus bg-panel px-3 py-2 text-sm text-teks focus:border-utama/60 focus:outline-none focus:ring-1 focus:ring-utama/30 transition-colors resize-none',
      className
    )}
    {...props}
  />
);