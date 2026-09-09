import { useEffect, useRef } from 'react';
import { hero, telegramHref } from '../data/content';
import SpaceBackdrop from './SpaceBackdrop';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reveal = () => video.classList.add('is-live');
    if (video.readyState >= 2) reveal();
    video.addEventListener('loadeddata', reveal);

    // Часть браузеров блокирует autoplay даже без звука
    const kick = video.play();
    if (kick && typeof kick.catch === 'function') kick.catch(() => {});

    return () => video.removeEventListener('loadeddata', reveal);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero__stage" aria-hidden="true">
        <div className="hero__cosmos">
          <SpaceBackdrop />
        </div>
        <video
          className="hero__media"
          ref={videoRef}
          src="/media/hero-loop.mp4"
          poster="/media/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
        <div className="hero__veil" />
      </div>

      <div className="wrap hero__inner">
        <div className="hero__copy">
          <p className="eyebrow hero-enter" style={{ '--d': '0.1s' }}>
            {hero.eyebrow}
          </p>
          <h1 className="hero-enter" style={{ '--d': '0.22s' }}>
            {hero.titleStart} <span className="accent">{hero.titleAccent}</span>
          </h1>
          <p className="lead hero-enter" style={{ '--d': '0.36s' }}>
            {hero.text}
          </p>
          <ul className="proofs">
            {hero.proofs.map((item, index) => (
              <li className="hero-enter" style={{ '--d': `${0.48 + index * 0.07}s` }} key={item}>
                {item}
              </li>
            ))}
          </ul>
          <div className="hero__actions">
            <a
              className="button button--primary button--lg hero-enter"
              style={{ '--d': '0.72s' }}
              href={telegramHref(hero.message)}
            >
              {hero.cta}
            </a>
            <a className="button button--ghost button--lg hero-enter" style={{ '--d': '0.8s' }} href="#projects">
              {hero.ctaSecondary}
            </a>
          </div>
        </div>

        <aside className="hero__brief hero-enter" style={{ '--d': '0.5s' }} aria-label="Что написать в первом сообщении">
          <p className="card__meta">Первое сообщение</p>
          <h2>{hero.briefTitle}</h2>
          <ol className="brief-list">
            {hero.brief.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
