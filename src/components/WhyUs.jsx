import { whyUs } from '../data/content';
import LivingTree from './LivingTree';
import HorizontalVines from './HorizontalVines';

export default function WhyUs() {
  const left = whyUs.items.slice(0, 2);
  const right = whyUs.items.slice(2);

  return (
    <section className="section why section--divided zone zone--verdant" id="why">
      <HorizontalVines className="why__vines" />

      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {whyUs.eyebrow}
        </p>
        <h2 data-reveal style={{ '--delay': '0.08s' }}>
          {whyUs.title}
        </h2>

        {/* Пункты растут от ствола: два слева, два справа */}
        <div className="why__layout">
          <ul className="why__branch why__branch--left">
            {left.map((item, index) => (
              <li className="why__leaf" data-reveal style={{ '--delay': `${0.12 + index * 0.1}s` }} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>

          <LivingTree className="why__trunk" />

          <ul className="why__branch why__branch--right">
            {right.map((item, index) => (
              <li className="why__leaf" data-reveal style={{ '--delay': `${0.12 + index * 0.1}s` }} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
