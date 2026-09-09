import useInView from '../hooks/useInView';
import CountUp from './CountUp';

const W = 264;
const H = 108;
const PAD = 10;
const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

/**
 * Результат кейса как панель приборов: заголовок с приростом, поле
 * графика по сетке и две плитки с фактами. У трёх кейсов три разных
 * виджета — так это читается как аналитика, а не как повторённый шаблон.
 * Сравнение «было → стало» честнее процента из воздуха: его можно
 * назвать в переписке и подтвердить.
 */

function Grid() {
  return (
    <g className="chart__grid">
      {[0.25, 0.5, 0.75].map((at) => (
        <line key={at} x1={PAD} x2={W - PAD} y1={PAD + (H - PAD * 2) * at} y2={PAD + (H - PAD * 2) * at} />
      ))}
    </g>
  );
}

function AreaPlot({ trend }) {
  const min = Math.min(...trend);
  const span = Math.max(...trend) - min || 1;
  const points = trend.map((value, index) => [
    PAD + (index * (W - PAD * 2)) / (trend.length - 1),
    H - PAD - ((value - min) / span) * (H - PAD * 2),
  ]);

  const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const [lastX, lastY] = points[points.length - 1];

  return (
    <>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--mood-a))" stopOpacity="0.54" />
          <stop offset="1" stopColor="rgb(var(--mood-a))" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <Grid />
      <path
        className="chart__area"
        fill="url(#chartFill)"
        d={`${line} L${lastX.toFixed(1)} ${H} L${points[0][0].toFixed(1)} ${H} Z`}
      />
      <path className="chart__line" d={line} />
      <circle className="chart__tip" cx={lastX} cy={lastY} r="3.6" />
    </>
  );
}

function BarsPlot({ trend }) {
  const max = Math.max(...trend);
  const slot = (W - PAD * 2) / trend.length;
  const width = Math.min(18, slot * 0.56);

  return (
    <>
      <Grid />
      {trend.map((value, index) => {
        const height = Math.max(3, ((H - PAD * 2) * value) / max);
        return (
          <rect
            className="chart__bar"
            key={`${index}-${value}`}
            style={{ '--i': index }}
            x={PAD + slot * index + (slot - width) / 2}
            y={H - PAD - height}
            width={width}
            height={height}
            rx="3"
          />
        );
      })}
    </>
  );
}

function RingPlot({ share, active }) {
  return (
    <g transform={`translate(${W / 2 - 52} 2)`}>
      <circle className="chart__ring-track" cx="52" cy="52" r={RING_R} />
      <circle
        className="chart__ring-value"
        cx="52"
        cy="52"
        r={RING_R}
        strokeDasharray={RING_C}
        strokeDashoffset={active ? RING_C * (1 - share.after / 100) : RING_C}
      />
      <text className="chart__ring-text" x="52" y="52">
        <tspan>
          <CountUp value={share.after} active={active} />%
        </tspan>
      </text>
    </g>
  );
}

export default function CaseChart({ metrics }) {
  const [ref, seen] = useInView(0.4);
  const { kind = 'area', label, unit, delta, trend, share, facts } = metrics;

  const from = kind === 'ring' ? `${share.before}%` : Math.min(...trend);
  const to = kind === 'ring' ? `${share.after}%` : `${Math.max(...trend)} ${unit}`.trim();

  return (
    <figure className={`chart chart--${kind} ${seen ? 'is-on' : ''}`} ref={ref}>
      <div className="chart__head">
        <figcaption className="chart__label">{label}</figcaption>
        <span className="chart__delta">{delta}</span>
      </div>

      <svg
        className="chart__plot"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${label}: было ${from}, стало ${to}`}
      >
        {kind === 'area' ? <AreaPlot trend={trend} /> : null}
        {kind === 'bars' ? <BarsPlot trend={trend} /> : null}
        {kind === 'ring' ? <RingPlot share={share} active={seen} /> : null}
      </svg>

      <div className="chart__ends">
        <span className="chart__end">
          было <b>{from}</b>
        </span>
        <span className="chart__end chart__end--now">
          стало <b>{to}</b>
        </span>
      </div>

      <dl className="chart__facts">
        {facts.map((fact) => (
          <div className="chart__tile" key={fact.label}>
            <dt>
              <CountUp value={fact.value} decimals={fact.decimals} active={seen} />
              {fact.suffix}
            </dt>
            <dd>{fact.label}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
