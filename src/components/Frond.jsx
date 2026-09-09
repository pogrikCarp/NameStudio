/**
 * Ветка папоротника. Тонкая, полупрозрачная — работает как
 * текстура на краю секции, а не как иллюстрация.
 */
export default function Frond({ className = '', leaflets = 12 }) {
  const items = Array.from({ length: leaflets }, (_, index) => {
    const t = index / (leaflets - 1);
    const x = 10 + t * 168;
    const y = 62 - t * 30;
    const len = 8 + 30 * (1 - t * 0.78);
    return { x, y, len, key: index };
  });

  return (
    <svg className={`frond ${className}`} viewBox="0 0 190 100" fill="none" aria-hidden="true">
      <path
        d="M6 64 C 62 60, 122 46, 184 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {items.map(({ x, y, len, key }) => (
        <g key={key} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
          <path d={`M${x} ${y} Q ${x + len * 0.12} ${y - len * 0.62} ${x + len * 0.5} ${y - len}`} />
          <path d={`M${x} ${y} Q ${x + len * 0.12} ${y + len * 0.62} ${x + len * 0.5} ${y + len}`} />
        </g>
      ))}
    </svg>
  );
}
