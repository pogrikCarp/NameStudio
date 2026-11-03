import { servicePool, services, telegramHref } from '../data/content';
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

        <div className="card-grid services__grid">
          {services.items.map((item, index) => (
            <article
              className={`card card--service ${item.featured ? 'card--featured' : ''} ${item.mvp ? 'card--mvp' : ''} ${item.visuals ? 'card--has-showcase' : ''}`}
              data-reveal
              style={{ '--delay': `${0.16 + index * 0.1}s` }}
              key={item.title}
            >
              {item.visuals ? (
                <div className={`card__showcase card__showcase--${item.visuals.length}`} aria-hidden="true">
                  {item.visuals.map((visual) => (
                    <img src={visual} alt="" width="455" height="960" loading="lazy" decoding="async" key={visual} />
                  ))}
                </div>
              ) : null}

              {item.badge ? <p className="card__badge">{item.badge}</p> : null}

              <div className="card__head">
                <span className="card__num">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul className="feature-list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="card__foot">
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

        <div className="service-pool">
          <div className="service-pool__head">
            <div>
              <p className="eyebrow" data-reveal>
                {servicePool.eyebrow}
              </p>
              <h2 data-reveal style={{ '--delay': '0.08s' }}>
                {servicePool.title}
              </h2>
            </div>
            <p className="section__text" data-reveal style={{ '--delay': '0.14s' }}>
              {servicePool.text}
            </p>
          </div>

          <div className="service-pool__grid">
            {servicePool.groups.map((group, groupIndex) => (
              <article
                className="service-pool__group"
                data-reveal
                style={{ '--delay': `${0.12 + groupIndex * 0.06}s` }}
                key={group.title}
              >
                <div className="service-pool__title">
                  <span>0{groupIndex + 1}</span>
                  <h3>{group.title}</h3>
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="service-pool__footer" data-reveal>
            <p>{servicePool.note}</p>
            <a className="button button--primary" href={telegramHref(servicePool.message)} rel="noopener noreferrer">
              {servicePool.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
