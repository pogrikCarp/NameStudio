import { useEffect, useRef } from 'react';

const VINE =
  'M38 0 C 12 92, 64 176, 30 268 C 4 352, 60 438, 34 526 C 10 614, 62 700, 32 790 C 8 878, 54 946, 40 1000';

const LEAF_AT = [0.14, 0.31, 0.48, 0.65, 0.82];

/**
 * Лоза в левом поле страницы: прорастает по мере скролла,
 * листья раскрываются, когда линия до них доходит.
 * Только на широких экранах — на узких это шум.
 */
export default function RootLine() {
  const pathRef = useRef(null);
  const leafRefs = useRef([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return undefined;

    const total = path.getTotalLength();
    path.style.strokeDasharray = `${total}`;

    // Ставим листья точно на линию, по касательной
    leafRefs.current.forEach((leaf, index) => {
      if (!leaf) return;
      const at = total * LEAF_AT[index];
      const point = path.getPointAtLength(at);
      const next = path.getPointAtLength(Math.min(total, at + 6));
      const angle = (Math.atan2(next.y - point.y, next.x - point.x) * 180) / Math.PI;
      const flip = index % 2 === 0 ? -58 : 58;
      leaf.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle + flip})`);
    });

    let ticking = false;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const grown = 0.06 + progress * 0.94;

      path.style.strokeDashoffset = `${total * (1 - grown)}`;
      leafRefs.current.forEach((leaf, index) => {
        if (leaf) leaf.classList.toggle('is-grown', grown > LEAF_AT[index] + 0.02);
      });
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <svg className="rootline" viewBox="0 0 74 1000" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs>
        <linearGradient id="vineGradient" x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00f58a" />
          <stop offset="0.5" stopColor="#00ddc6" />
          <stop offset="1" stopColor="#6b2bff" />
        </linearGradient>
      </defs>

      <path className="rootline__vine" ref={pathRef} d={VINE} />

      {LEAF_AT.map((_, index) => (
        <g
          className="rootline__leaf"
          key={index}
          ref={(node) => {
            leafRefs.current[index] = node;
          }}
        >
          <path
            d="M0 0 C 9 -7, 24 -6, 31 0 C 24 6, 9 7, 0 0"
            fill="rgba(89, 247, 155, 0.18)"
            stroke="#00f58a"
            strokeWidth="1"
          />
          <path d="M1 0 L 29 0" stroke="rgba(198, 154, 106, 0.9)" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}
