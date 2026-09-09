import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Трасса процесса: шина с отводами к каждому шагу, как дорожка на плате.
 * Геометрия строится по реальным позициям карточек, поэтому одинаково
 * ложится на четыре колонки, на две (тогда идёт змейкой по рядам) и на
 * вертикальный стек. Длина прочерченного участка — функция от скролла,
 * так что назад трасса отматывается сама.
 */

const JOG = 8; // глубина прямоугольного объезда между узлами
const RAIL_GAP = 20; // насколько шина идёт выше карточек
const TURN_INSET = 52; // отступ разворота змейки от края

function groupRows(cards) {
  const rows = [];
  [...cards]
    .sort((a, b) => a.top - b.top || a.numX - b.numX)
    .forEach((card) => {
      const row = rows.find((items) => Math.abs(items[0].top - card.top) < 8);
      if (row) row.push(card);
      else rows.push([card]);
    });
  return rows.map((row) => [...row].sort((a, b) => a.numX - b.numX));
}

function buildGeometry(flow) {
  const steps = [...flow.querySelectorAll('.step')];
  if (steps.length < 2) return null;

  const box = flow.getBoundingClientRect();
  const width = box.width;
  const height = box.height;

  const cards = steps.map((step, index) => {
    const rect = step.getBoundingClientRect();
    const num = step.querySelector('.step__num') || step;
    const numRect = num.getBoundingClientRect();
    return {
      index,
      left: rect.left - box.left,
      top: rect.top - box.top,
      numX: numRect.left - box.left + numRect.width / 2,
      numY: numRect.top - box.top + numRect.height / 2,
    };
  });

  const rows = groupRows(cards);
  const stacked = rows.every((row) => row.length === 1);
  const nodes = [];
  const stubs = [];
  let d = '';

  if (stacked) {
    // Узкий экран: шина идёт слева вдоль шагов
    const railX = 13;
    d = `M${railX} 0`;

    cards.forEach((card, index) => {
      d += ` V${card.numY}`;
      nodes.push({ index: card.index, x: railX, y: card.numY });
      stubs.push({ index: card.index, d: `M${railX} ${card.numY} H${card.left}` });

      const next = cards[index + 1];
      if (next) {
        const mid = (card.numY + next.numY) / 2;
        d += ` V${mid - JOG} H${railX + JOG} V${mid + JOG} H${railX}`;
      }
    });
    d += ` V${height}`;

    return { d, nodes, stubs, stacked, width, height };
  }

  // Одна или несколько строк: шина над карточками, змейкой
  rows.forEach((row, rowIndex) => {
    const rightward = rowIndex % 2 === 0;
    const railY = Math.max(6, Math.min(...row.map((card) => card.top)) - RAIL_GAP);
    const ordered = rightward ? row : [...row].reverse();
    const entry = rightward ? 0 : width;
    const exit = rowIndex === rows.length - 1 ? (rightward ? width : 0) : null;
    const turn = rightward ? width - TURN_INSET : TURN_INSET;

    d += rowIndex === 0 ? `M${entry} ${railY}` : ` V${railY}`;

    ordered.forEach((card, cardIndex) => {
      d += ` H${card.numX}`;
      nodes.push({ index: card.index, x: card.numX, y: railY });
      stubs.push({ index: card.index, d: `M${card.numX} ${railY} V${card.top}` });

      const next = ordered[cardIndex + 1];
      if (next) {
        const mid = (card.numX + next.numX) / 2;
        const dir = cardIndex % 2 === 0 ? -1 : 1;
        d += ` H${mid - JOG * (rightward ? 1 : -1)} V${railY + JOG * dir} H${mid + JOG * (rightward ? 1 : -1)} V${railY}`;
      }
    });

    d += exit === null ? ` H${turn}` : ` H${exit}`;
  });

  return { d, nodes, stubs, stacked, width, height };
}

/** Доля пути, на которой трасса приходит в узел */
function nodeMarks(path, nodes) {
  const total = path.getTotalLength();
  const samples = 800;
  const points = [];

  for (let i = 0; i <= samples; i += 1) {
    const at = (total * i) / samples;
    const point = path.getPointAtLength(at);
    points.push([point.x, point.y, at]);
  }

  return nodes.map((node) => {
    let best = 0;
    let bestDist = Infinity;
    points.forEach(([x, y, at]) => {
      const dist = (x - node.x) ** 2 + (y - node.y) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        best = at;
      }
    });
    return best / total;
  });
}

export default function ProcessTrace() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const nodeRefs = useRef([]);
  const stubRefs = useRef([]);
  const haloRefs = useRef([]);
  const [geom, setGeom] = useState(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const flow = svg && svg.parentElement;
    if (!flow) return undefined;

    const measure = () => setGeom(buildGeometry(flow));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(flow);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!geom || !path || !svg) return undefined;

    const flow = svg.parentElement;
    const cards = [...flow.querySelectorAll('.step')];
    const total = path.getTotalLength();
    const marks = nodeMarks(path, geom.nodes);

    path.style.strokeDasharray = `${total}`;

    const paint = (grown) => {
      path.style.strokeDashoffset = `${total * (1 - grown)}`;
      geom.nodes.forEach((node, index) => {
        const on = grown >= marks[index];
        nodeRefs.current[index]?.classList.toggle('is-on', on);
        stubRefs.current[index]?.classList.toggle('is-on', on);
        haloRefs.current[index]?.classList.toggle('is-on', on);
        cards[node.index]?.classList.toggle('is-on', on);
      });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(1);
      return undefined;
    }

    let ticking = false;
    let listening = false;

    const update = () => {
      ticking = false;
      const rect = flow.getBoundingClientRect();
      const span = rect.height + window.innerHeight * 0.75;
      const raw = (window.innerHeight - rect.top) / span;
      paint(Math.min(1, Math.max(0, (raw - 0.1) / 0.62)));
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

    gate.observe(flow);
    update();

    return () => {
      gate.disconnect();
      window.removeEventListener('scroll', onScroll);
      cards.forEach((card) => card.classList.remove('is-on'));
    };
  }, [geom]);

  return (
    <svg
      className={`trace ${geom && geom.stacked ? 'trace--stacked' : ''}`}
      ref={svgRef}
      viewBox={geom ? `0 0 ${geom.width} ${geom.height}` : undefined}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {geom ? (
        <>
          {geom.stubs.map((stub, index) => (
            <path
              className="trace__stub"
              key={stub.d}
              d={stub.d}
              ref={(node) => {
                stubRefs.current[index] = node;
              }}
            />
          ))}

          <path className="trace__rail" ref={pathRef} d={geom.d} />

          {geom.nodes.map((node, index) => (
            <g key={`${node.x}-${node.y}`}>
              <circle
                className={`trace__halo ${index === geom.nodes.length - 1 ? 'trace__halo--final' : ''}`}
                cx={node.x}
                cy={node.y}
                r="5"
                ref={(el) => {
                  haloRefs.current[index] = el;
                }}
              />
              <circle
                className="trace__node"
                cx={node.x}
                cy={node.y}
                r="4.5"
                ref={(el) => {
                  nodeRefs.current[index] = el;
                }}
              />
            </g>
          ))}
        </>
      ) : null}
    </svg>
  );
}
