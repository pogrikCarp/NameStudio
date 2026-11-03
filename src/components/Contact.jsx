import { contact, telegramChannelHandle, telegramChannelUrl, telegramHref, telegramUser } from '../data/content';
import BriefForm from './BriefForm';

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

        <aside className="contact__social" data-reveal aria-label="Telegram-канал Name Studio">
          <p className="card__meta">Разборы и процесс</p>
          <h3>Подписывайтесь на Telegram-канал</h3>
          <p>Показываем разборы сайтов, рабочий процесс и новые кейсы.</p>
          <a href={telegramChannelUrl} target="_blank" rel="noopener noreferrer" aria-label={`Telegram ${telegramChannelHandle}`}>
            <img src="/telegram-channel-qr.png" alt={`QR-код Telegram ${telegramChannelHandle}`} width="512" height="512" loading="lazy" />
            <span>{telegramChannelHandle}</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
