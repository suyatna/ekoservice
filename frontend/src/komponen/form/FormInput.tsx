import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full bg-transparent px-3 py-2 text-sm text-teks placeholder:text-redup rounded-lg transition-colors focus:outline-none focus:border-utama/60',
          error
            ? 'border-[1px] border-red-400 focus:border-red-400 text-teks placeholder:text-red-400'
            : 'border-[1px] border-[#344246] focus:border-utama/60',
          className
        )}
        {...props}
      />
    );
  }
);
FormInput.displayName = 'FormInput';
