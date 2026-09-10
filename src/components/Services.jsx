import { services, telegramHref } from '../data/content';
import LoopVideo from './LoopVideo';

export default function Services() {
  return (
    <section className="section services section--divided zone zone--iris" id="services">
      <div className="wrap">
        {/* Текст слева, анимация справа — карточки её не перекрывают */}
        <div className="services__head">
          <div className="services__intro">
            <p className="eyebrow" data-reveal>
              {services.eyebrow}
            </p>
            <h2 data-reveal style={{ '--delay': '0.08s' }}>
              {services.title}
            </h2>
            <p className="section__text" data-reveal style={{ '--delay': '0.14s' }}>
              {services.text}
            </p>
          </div>

          <div className="services__anim" aria-hidden="true">
            <LoopVideo className="services__media" src="/media/hands.mp4" />
          </div>
        </div>

        <div className="card-grid card-grid--3">
          {services.items.map((item, index) => (
            <article
              className={`card card--service ${item.featured ? 'card--featured' : ''}`}
              data-reveal
              style={{ '--delay': `${0.16 + index * 0.1}s` }}
              key={item.title}
            >
              {item.badge ? <p className="card__badge">{item.badge}</p> : null}

              <div className="card__head">
                <span className="card__num">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul className="price-list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="card__foot">
                <p className="card__pricerow">
                  <b>{item.price}</b>
                  <span>{item.term}</span>
                </p>
                <a
                  className={`button ${item.featured ? 'button--primary' : 'button--ghost'}`}
                  href={telegramHref(item.message)}
                  rel="noopener noreferrer"
                >
                  {item.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
