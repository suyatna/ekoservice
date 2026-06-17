import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '@/rute';
import './styles.css';

const queryClient = new QueryClient();

const GlobalRevealManager = () => {
  useEffect(() => {
    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    const register = () => {
      const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-auto]'));
      targets.forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };

    const markAutoReveal = () => {
      const autoTargets = document.querySelectorAll<HTMLElement>('.kartu, .panel-kompak');
      autoTargets.forEach((el) => {
        if (!el.hasAttribute('data-reveal') && !el.hasAttribute('data-reveal-auto') && !el.closest('.galeri-item')) {
          el.setAttribute('data-reveal-auto', '');
        }
      });
    };

    markAutoReveal();
    register();

    const mo = new MutationObserver(() => {
      markAutoReveal();
      register();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <GlobalRevealManager />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
