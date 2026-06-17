import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export const ContainerPublik = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-8 lg:px-10 xl:px-12', className)}>{children}</div>
);

export const ContainerDashboard = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('w-full', className)}>{children}</div>
);

export const ContainerForm = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('mx-auto w-full max-w-[460px] px-4 sm:px-5 md:px-6', className)}>{children}</div>
);

export const SectionWrapper = ({ children, className }: { children: ReactNode; className?: string }) => (
  <section className={cn('py-10 md:py-12 lg:py-14', className)}>{children}</section>
);
