import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );

    nodes.forEach((node) => io.observe(node));

    // Секции с фоновой графикой: подсвечиваем её, когда секция входит в кадр
    const lit = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-lit');
          lit.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );

    document.querySelectorAll('[data-lit]').forEach((node) => lit.observe(node));

    return () => {
      io.disconnect();
      lit.disconnect();
    };
  }, []);
}
