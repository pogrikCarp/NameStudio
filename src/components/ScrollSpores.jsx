import { useEffect, useRef } from 'react';

// Обе зоны сразу: зелёная жизнь и цифровой фиолет
const TINTS = ['0, 245, 138', '0, 221, 198', '107, 43, 255', '15, 153, 255', '234, 247, 239'];

/**
 * Пыльца: медленно поднимается, покачивается, слегка сносится
 * при скролле. Заменяет прежние «метеоры» — то же ощущение
 * живого пространства, но без космического аттракциона.
 */
export default function ScrollSpores() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let running = true;
    let drift = 0;
    let lastScroll = window.scrollY;
    let spores = [];

    const make = () => ({
      x: Math.random() * width,
      y: height + Math.random() * height,
      r: 0.7 + Math.random() * 1.7,
      rise: 0.14 + Math.random() * 0.42,
      sway: 6 + Math.random() * 22,
      speed: 0.4 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.2 + Math.random() * 0.5,
      tint: TINTS[Math.floor(Math.random() * TINTS.length)],
    });

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      spores = Array.from({ length: width < 720 ? 26 : 54 }, make);
    };

    const onScroll = () => {
      const y = window.scrollY;
      drift += (y - lastScroll) * 0.06;
      lastScroll = y;
    };

    const draw = (time) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      drift *= 0.94;

      const tick = time / 1000;
      spores.forEach((spore) => {
        spore.y -= spore.rise;
        const x = spore.x + Math.sin(tick * spore.speed + spore.phase) * spore.sway;
        const y = spore.y + drift;

        if (spore.y < -20) {
          spore.y = height + 20;
          spore.x = Math.random() * width;
        }

        const glow = spore.alpha * (0.6 + 0.4 * Math.sin(tick * 1.4 + spore.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${spore.tint}, ${glow})`;
        ctx.arc(x, y, spore.r, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      running = false;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas className="scroll-spores" ref={canvasRef} aria-hidden="true" />;
}
