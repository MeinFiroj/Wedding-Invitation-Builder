import { useEffect, useState } from 'react';

const calc = (target) => {
  const t = new Date(target).getTime();
  const diff = Number.isNaN(t) ? 0 : Math.max(0, t - Date.now());
  return {
    days: Math.floor(diff / 864e5),
    hours: Math.floor(diff / 36e5) % 24,
    minutes: Math.floor(diff / 6e4) % 60,
    seconds: Math.floor(diff / 1e3) % 60,
  };
};

const same = (a, b) => Object.keys(a).every((k) => a[k] === b[k]);

export function useCountdown(target) {
  const [left, setLeft] = useState(() => calc(target));

  useEffect(() => {
    const tick = () => setLeft((prev) => {
      const next = calc(target);
      return same(prev, next) ? prev : next;
    });
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return left;
}