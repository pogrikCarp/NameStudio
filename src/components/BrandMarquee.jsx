import { brands } from '../data/content';

function BrandRow({ suffix }) {
  return (
    <ul className="marquee__row" aria-hidden={suffix === 'b'}>
      {brands.items.map((item) => (
        <li className="marquee__item" key={`${suffix}-${item.name}`}>
          <span className="marquee__mark">{item.mark}</span>
          <span className="marquee__name">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default function BrandMarquee() {
  return (
    <section className="marquee" aria-label={brands.label}>
      <div className="marquee__seam" aria-hidden="true">
        <span />
        <span />
      </div>
      <p className="marquee__label">{brands.label}</p>
      <div className="marquee__window">
        <div className="marquee__track">
          <BrandRow suffix="a" />
          <BrandRow suffix="b" />
        </div>
      </div>
    </section>
  );
}
