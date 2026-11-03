import { contact, telegramHref, telegramUser } from '../data/content';
import BriefForm from './BriefForm';
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
          <BriefForm />
          <p className="contact__meta" data-reveal style={{ '--delay': '0.26s' }}>
            <span>@{telegramUser}</span>
            <span>{contact.hint}</span>
            <a href={telegramHref(contact.message)} rel="noopener noreferrer">
              Написать без брифа
            </a>
          </p>
        </div>

        <div className="contact__orb" aria-hidden="true">
          <LoopVideo className="contact__orb-media" src="/media/planet.mp4" />
        </div>
      </div>
    </section>
  );
}
