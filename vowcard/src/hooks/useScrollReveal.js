import { useEffect, useRef } from 'react';

// Attach the returned ref to a container. Its [data-reveal] children fade up in sequence.
export function useScrollReveal(stagger = 0.1) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const items = [...el.querySelectorAll('[data-reveal]')];
    items.forEach((item) => (item.style.opacity = '0')); // hidden only while JS is running

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        items.forEach((item, i) => {
          item.style.opacity = '';
          item.animate(
            [
              { opacity: 0, transform: 'translateY(40px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 700, delay: i * stagger * 1000, easing: 'ease-out', fill: 'backwards' }
          );
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      items.forEach((item) => (item.style.opacity = ''));
    };
  }, [stagger]);

  return ref;
}