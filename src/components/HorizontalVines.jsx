import { useEffect, useRef } from 'react';

const VINES = [
  { d: 'M-30 92 C 190 36, 306 148, 524 98 S 902 38, 1230 86', leaves: [0.22, 0.46, 0.7, 0.9] },
  { d: 'M-30 262 C 224 326, 384 188, 622 260 S 984 334, 1230 250', leaves: [0.16, 0.4, 0.64, 0.86] },
  { d: 'M-30 432 C 204 378, 362 484, 604 424 S 962 366, 1230 432', leaves: [0.26, 0.5, 0.74, 0.94] },
];

/**
 * Лианы, которые тянутся слева направо по мере прокрутки секции.
 * Длина считается один раз, при скролле меняется только dashoffset —
 * это одно свойство и браузеру дёшево. Слушатель живёт лишь пока
 * секция в кадре.
 */
export default function HorizontalVines({ className = '' }) {
  const rootRef = useRef(null);
  const pathRefs = useRef([]);
  const leafRefs = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const host = root.closest('section') || root.parentElement;
    const lengths = pathRefs.current.map((path) => {
      if (!path) return 0;
      const total = path.getTotalLength();
      path.style.strokeDasharray = `${total}`;
      path.style.strokeDashoffset = `${total}`;
      return total;
    });

    // Листья садим на линию по касательной — один раз
    VINES.forEach((vine, vineIndex) => {
      const path = pathRefs.current[vineIndex];
      if (!path) return;
      vine.leaves.forEach((at, leafIndex) => {
        const leaf = leafRefs.current[`${vineIndex}-${leafIndex}`];
        if (!leaf) return;
        const point = path.getPointAtLength(lengths[vineIndex] * at);
        const next = path.getPointAtLength(Math.min(lengths[vineIndex], lengths[vineIndex] * at + 8));
        const angle = (Math.atan2(next.y - point.y, next.x - point.x) * 180) / Math.PI;
        const flip = leafIndex % 2 === 0 ? -52 : 52;
        leaf.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle + flip})`);
      });
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pathRefs.current.forEach((path) => {
        if (path) path.style.strokeDashoffset = '0';
      });
      return undefined;
    }

    let ticking = false;
    let listening = false;

    const update = () => {
      ticking = false;
      const rect = host.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      const raw = span > 0 ? (window.innerHeight - rect.top) / span : 0;
      // Лианы дорастают к моменту, когда секция в центре экрана
      const progress = Math.min(1, Math.max(0, (raw - 0.12) / 0.5));

      pathRefs.current.forEach((path, index) => {
        if (!path) return;
        const eased = Math.min(1, progress * (1 + index * 0.12));
        path.style.strokeDashoffset = `${lengths[index] * (1 - eased)}`;
      });

      VINES.forEach((vine, vineIndex) => {
        vine.leaves.forEach((at, leafIndex) => {
          const leaf = leafRefs.current[`${vineIndex}-${leafIndex}`];
          if (leaf) leaf.classList.toggle('is-open', progress > at * 0.92);
        });
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    const gate = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !listening) {
          window.addEventListener('scroll', onScroll, { passive: true });
          listening = true;
          update();
        } else if (!entry.isIntersecting && listening) {
          window.removeEventListener('scroll', onScroll);
          listening = false;
        }
      },
      { rootMargin: '200px 0px' },
    );

    gate.observe(host);
    window.addEventListener('resize', onScroll);

    return () => {
      gate.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <svg
      className={`vines ${className}`}
      ref={rootRef}
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vineRun" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ddc6" stopOpacity="0.312" />
          <stop offset="0.4" stopColor="#00f58a" stopOpacity="0.98" />
          <stop offset="1" stopColor="#00d070" stopOpacity="0.84" />
        </linearGradient>
      </defs>

      {VINES.map((vine, vineIndex) => (
        <g key={vine.d}>
          <path
            className="vines__stem"
            ref={(node) => {
              pathRefs.current[vineIndex] = node;
            }}
            d={vine.d}
          />
          {vine.leaves.map((at, leafIndex) => (
            <g
              className="vines__leaf"
              key={at}
              ref={(node) => {
                leafRefs.current[`${vineIndex}-${leafIndex}`] = node;
              }}
            >
              <path
                d="M0 0 C 8 -6, 21 -5, 27 0 C 21 5, 8 6, 0 0"
                fill="rgba(89, 247, 155, 0.16)"
                stroke="#00f58a"
                strokeWidth="1"
              />
              <path d="M1 0 L 25 0" stroke="rgba(198, 154, 106, 0.84)" strokeWidth="0.8" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
