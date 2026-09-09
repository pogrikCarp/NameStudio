import { useEffect, useRef, useState } from 'react';

export default function Atmosphere() {
  const glowRef = useRef(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBooting(false);
      document.body.classList.add('is-ready');
    }, 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const glow = glowRef.current;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!glow || !fine) return undefined;

    // Пишем в стиль не чаще одного кадра: pointermove летит сотнями в секунду
    let frame = 0;
    let next = null;

    const onMove = (event) => {
      next = [event.clientX - 170, event.clientY - 170];
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        glow.style.transform = `translate3d(${next[0]}px, ${next[1]}px, 0)`;
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__grid" />
      <div className="atmosphere__orb atmosphere__orb--neon" />
      <div className="atmosphere__orb atmosphere__orb--teal" />
      <div className="atmosphere__orb atmosphere__orb--iris" />
      <div className="atmosphere__glow" ref={glowRef} />
      {booting ? (
        <div className="boot">
          <img className="boot__logo" src="/logo.svg" alt="" />
          <span className="boot__line" />
        </div>
      ) : null}
    </div>
  );
}
