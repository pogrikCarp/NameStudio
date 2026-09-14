import { adapt, telegramHref } from '../data/content';
import LoopVideo from './LoopVideo';

export default function Adapt() {
  return (
    <section className="section adapt section--divided zone zone--iris" id="adapt">
      <div className="wrap adapt__grid">
        <div className="adapt__stage" aria-hidden="true">
          <span className="adapt__glow" />
          <div className="adapt__phone">
            <div className="adapt__screen">
              <LoopVideo className="adapt__video" src={adapt.video} />
            </div>
            <img className="adapt__frame" src={adapt.phone} alt="" width="498" height="974" />
          </div>
        </div>

        <div className="adapt__copy">
          <p className="eyebrow" data-reveal>
            {adapt.eyebrow}
          </p>
          <h2 data-reveal style={{ '--delay': '0.08s' }}>
            {adapt.title}
          </h2>
          <p className="section__text" data-reveal style={{ '--delay': '0.14s' }}>
            {adapt.text}
          </p>
          <ul className="adapt__points">
            {adapt.points.map((point, index) => (
              <li key={point} data-reveal style={{ '--delay': `${0.18 + index * 0.06}s` }}>
                {point}
              </li>
            ))}
          </ul>
          <a
            className="button button--primary"
            data-reveal
            style={{ '--delay': '0.44s' }}
            href={telegramHref(adapt.message)}
            rel="noopener noreferrer"
          >
            {adapt.cta}
          </a>
          <p className="adapt__trust" data-reveal style={{ '--delay': '0.5s' }}>
            {adapt.trust}
          </p>
        </div>
      </div>
    </section>
  );
}
