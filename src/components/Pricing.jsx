import { pricing, telegramHref } from '../data/content';
import useInView from '../hooks/useInView';
import CountUp from './CountUp';

/** Сумма досчитывается ровно там, куда человек смотрит */
function PriceTag({ amount, fallback }) {
  const [ref, seen] = useInView(0.5);

  if (!amount) return <p className="card__price">{fallback}</p>;

  return (
    <p className="card__price" ref={ref}>
      от <CountUp value={amount} active={seen} duration={1300} /> ₽
    </p>
  );
}

export default function Pricing() {
  return (
    <section className="section section--tint zone zone--verdant" id="pricing">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {pricing.eyebrow}
        </p>
        <h2 data-reveal style={{ '--delay': '0.08s' }}>
          {pricing.title}
        </h2>
        <p className="section__text" data-reveal style={{ '--delay': '0.14s' }}>
          {pricing.text}
        </p>
        <div className="card-grid card-grid--3">
          {pricing.items.map((item, index) => (
            <article
              className={`card card--price ${item.featured ? 'card--featured' : ''}`}
              data-reveal
              style={{ '--delay': `${0.12 + index * 0.1}s` }}
              key={item.name}
            >
              {item.badge ? <p className="card__badge">{item.badge}</p> : null}

              <div className="card__head">
                <p className="card__meta">{item.term}</p>
                <h3>{item.name}</h3>
                <PriceTag amount={item.amount} fallback={item.price} />
                <ul className="price-list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <a
                className={`button ${item.featured ? 'button--primary' : 'button--ghost'}`}
                href={telegramHref(item.message)}
              >
                {item.cta}
              </a>
            </article>
          ))}
        </div>
        <p className="section__note" data-reveal>
          {pricing.note}
        </p>
      </div>
    </section>
  );
}
