import { projects, telegramHref } from '../data/content';
import CaseChart from './CaseChart';

/* Вместо макета браузера — то, ради чего сайт заказывали: результат */
function ProjectPreview({ id, index, metrics }) {
  return (
    <div className={`project__preview project__preview--${id}`}>
      <span className="project__index">0{index}</span>
      <CaseChart metrics={metrics} />
    </div>
  );
}

export default function Projects() {
  return (
    <section className="section projects section--divided zone zone--iris" id="projects" data-lit>
      {/* Горизонт событий из кода: фон секции, прозрачность запечена в файл */}
      <div className="projects__horizon" aria-hidden="true">
        <img src="/media/horizon-iris.webp" alt="" loading="lazy" decoding="async" />
      </div>

      <div className="wrap">
        <p className="eyebrow" data-reveal>
          {projects.eyebrow}
        </p>
        <h2 data-reveal style={{ '--delay': '0.08s' }}>
          {projects.title}
        </h2>
        <div className="project-list">
          {projects.items.map((item, index) => (
            <article
              className="project"
              data-reveal
              style={{ '--delay': `${0.1 + index * 0.12}s` }}
              key={item.id}
            >
              <ProjectPreview id={item.id} index={index + 1} metrics={item.metrics} />
              <div className="project__body">
                <p className="card__meta">{item.niche}</p>
                <h3>{item.title}</h3>
                <dl className="project__facts">
                  <div>
                    <dt>Задача</dt>
                    <dd>{item.task}</dd>
                  </div>
                  <div>
                    <dt>Решение</dt>
                    <dd>{item.solution}</dd>
                  </div>
                  <div className="is-result">
                    <dt>Результат</dt>
                    <dd>{item.result}</dd>
                  </div>
                </dl>
                {item.href ? (
                  <a className="text-link" href={item.href} target="_blank" rel="noreferrer">
                    Смотреть сайт
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <a
          className="button button--primary button--lg projects-cta"
          data-reveal
          href={telegramHref(projects.message)}
        >
          {projects.cta}
        </a>
      </div>
    </section>
  );
}
