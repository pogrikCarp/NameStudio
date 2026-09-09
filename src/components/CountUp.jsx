import { useEffect, useState } from 'react';

const ease = (t) => 1 - (1 - t) ** 3;

/**
 * Число, которое досчитывается до значения, когда блок показался.
 * Останавливается ровно на цели, чтобы в вёрстке не «дрожала» ширина.
 */
export default function CountUp({ value, decimals = 0, duration = 1100, active, format }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return undefined;
    }

    let frame = 0;
    const started = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - started) / duration);
      setShown(value * ease(t));
      if (t < 1) frame = window.requestAnimationFrame(tick);
      else setShown(value);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, value, duration]);

  const rounded = decimals ? Number(shown.toFixed(decimals)) : Math.round(shown);
  return <>{format ? format(rounded) : rounded.toLocaleString('ru-RU')}</>;
}
