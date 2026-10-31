import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll reveal + smooth anchor dari LFS (script inline public/index.html):
 * elemen `.reveal` mendapat class `.in` saat masuk viewport.
 * Juga menggulir ke `#hash` saat halaman dibuka dari link "/#id".
 */
export function useReveal(deps: unknown[] = []) {
  const { hash } = useLocation();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.in)');
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    el?.scrollIntoView?.({ behavior: 'smooth' });
  }, [hash]);
}
