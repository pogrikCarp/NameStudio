import { support, telegramHref } from '../data/content';

export default function Support() {
  return (
    <section className="section support section--tint zone zone--verdant" id="support">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {support.eyebrow}
        </p>
        <h2 data-reveal style={{ '--delay': '0.08s' }}>
          {support.title}
        </h2>
        <p className="section__text" data-reveal style={{ '--delay': '0.14s' }}>
          {support.text}
        </p>

        <div className="card-grid card-grid--3 support__grid">
          {support.items.map((item, index) => (
            <article className="card support__card" data-reveal style={{ '--delay': `${0.16 + index * 0.08}s` }} key={item.name}>
              <span className="card__num">0{index + 1}</span>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="support__footer" data-reveal>
          <p className="section__note">{support.note}</p>
          <a className="button button--primary" href={telegramHref(support.message)} rel="noopener noreferrer">
            {support.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
