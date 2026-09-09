import { brand, footer, navLinks, telegramHref, contact } from '../data/content';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <a href="#hero" className="brand brand--light" aria-label={brand.name}>
          <img className="brand__logo" src={brand.logo} alt="" width="40" height="40" />
          <span className="brand__name">{brand.name}</span>
        </a>
        <nav className="footer-nav" aria-label="Подвал">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href={telegramHref(contact.message)}>{footer.cta}</a>
        </nav>
        <p className="site-footer__copy">{footer.copy}</p>
      </div>
    </footer>
  );
}
