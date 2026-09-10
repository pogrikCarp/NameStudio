import { faq } from '../data/content';

export default function Faq() {
  return (
    <section className="section faq section--divided zone zone--verdant" id="faq">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {faq.eyebrow}
        </p>
        <h2 data-reveal style={{ '--delay': '0.08s' }}>
          {faq.title}
        </h2>
        <div className="faq-list">
          {faq.items.map((item, index) => (
            <article
              className="faq-item"
              data-reveal
              style={{ '--delay': `${0.1 + index * 0.06}s` }}
              key={item.q}
            >
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
