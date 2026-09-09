import { audience, telegramHref } from '../data/content';

export default function Audience() {
  return (
    <section className="section audience section--divided zone" id="audience" data-lit>
      <div className="wrap audience__grid">
        {/* Знак студии слева: прозрачность запечена в файл, рамки нет */}
        <div className="audience__art" aria-hidden="true">
          <img src="/media/brand-art.webp" alt="" loading="lazy" decoding="async" />
        </div>

        <div className="audience__body">
          <p className="eyebrow" data-reveal>
            {audience.eyebrow}
          </p>
          <h2 data-reveal style={{ '--delay': '0.08s' }}>
            {audience.title}
          </h2>
          <div className="card-grid audience__cards">
            {audience.items.map((item, index) => (
              <article
                className="card card--audience"
                data-reveal
                style={{ '--delay': `${0.12 + index * 0.1}s` }}
                key={item.title}
              >
                <span className="card__num">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <a className="text-link section__hint" data-reveal href={telegramHref(audience.message)}>
            {audience.hint}
          </a>
        </div>
      </div>
    </section>
  );
}
