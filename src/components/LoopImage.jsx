import { useEffect, useRef, useState } from 'react';

/**
 * Анимированный WebP, который живёт только пока виден.
 * Браузер декодирует такие файлы даже за пределами экрана, а их на
 * странице несколько — вместе они и съедали кадры. Источник
 * подставляется заранее, за 500px до появления, поэтому подмены не видно.
 */
export default function LoopImage({ src, className, ...rest }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '500px 0px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span className={`loop-image ${className || ''}`} ref={ref} aria-hidden="true">
      {active ? <img src={src} alt="" {...rest} /> : null}
    </span>
  );
}
