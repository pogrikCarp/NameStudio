import { process } from '../data/content';
import ProcessTrace from './ProcessTrace';

export default function Process() {
  return (
    <section className="section section--divided zone zone--iris" id="process">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {process.eyebrow}
        </p>
        <h2 data-reveal style={{ '--delay': '0.08s' }}>
          {process.title}
        </h2>
        {/* Шина с отводами к шагам: прочерчивается по мере прокрутки */}
        <div className="process__flow">
          <ProcessTrace />
          <ol className="steps">
            {process.steps.map((step) => (
              <li className="step" key={step.num}>
                <span className="step__num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
