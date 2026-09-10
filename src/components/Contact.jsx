import { contact, telegramHref, telegramUser } from '../data/content';
import LoopVideo from './LoopVideo';

export default function Contact() {
  return (
    <section className="section contact zone zone--verdant" id="contact">
      <div className="wrap contact__grid">
        <div className="contact__inner">
          <p className="eyebrow" data-reveal>
            {contact.eyebrow}
          </p>
          <h2 data-reveal style={{ '--delay': '0.08s' }}>
            {contact.title}
          </h2>
          <p className="section__text" data-reveal style={{ '--delay': '0.14s' }}>
            {contact.text}
          </p>
          <a
            className="button button--primary button--lg contact-cta"
            data-reveal
            style={{ '--delay': '0.2s' }}
            href={telegramHref(contact.message)}
            rel="noopener noreferrer"
          >
            {contact.cta}
          </a>
          <p className="contact__meta" data-reveal style={{ '--delay': '0.26s' }}>
            <span>@{telegramUser}</span>
            <span>{contact.hint}</span>
          </p>
        </div>

        <div className="contact__orb" aria-hidden="true">
          <LoopVideo className="contact__orb-media" src="/media/planet.mp4" />
        </div>
      </div>
    </section>
  );
}
