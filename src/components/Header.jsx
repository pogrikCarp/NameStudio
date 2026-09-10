import { useEffect, useState } from 'react';
import { brand, hero, navLinks, telegramHref } from '../data/content';

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <a href="#hero" className="brand" onClick={close} aria-label={brand.name}>
          <img className="brand__logo" src={brand.logo} alt="" width="40" height="40" />
          <span className="brand__name">{brand.name}</span>
        </a>

        <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} id="site-nav" aria-label="Навигация">
          <ul className="main-nav__list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="button button--primary button--sm" href={telegramHref(hero.message)} rel="noopener noreferrer">
            Обсудить задачу
          </a>
          <button
            type="button"
            className={`burger ${open ? 'burger--open' : ''}`}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
