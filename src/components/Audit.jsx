import { audit, telegramHref } from '../data/content';

export default function Audit() {
  return (
    <section className="section audit section--divided zone zone--verdant" id="audit">
      <div className="wrap audit__grid">
        <div className="audit__copy">
          <p className="eyebrow" data-reveal>
            {audit.eyebrow}
          </p>
          <h2 data-reveal style={{ '--delay': '0.08s' }}>
            {audit.title}
          </h2>
          <p className="section__text" data-reveal style={{ '--delay': '0.14s' }}>
            {audit.text}
          </p>
          <ul className="audit__points">
            {audit.points.map((point, index) => (
              <li data-reveal style={{ '--delay': `${0.18 + index * 0.06}s` }} key={point}>
                <span>0{index + 1}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <aside className="audit__result" data-reveal style={{ '--delay': '0.18s' }}>
          <p className="card__meta">{audit.resultTitle}</p>
          <p className="audit__result-text">{audit.result}</p>
          <a className="button button--primary button--lg" href={telegramHref(audit.message)} rel="noopener noreferrer">
            {audit.cta}
          </a>
          <p className="audit__note">{audit.note}</p>
        </aside>
      </div>
    </section>
  );
}
