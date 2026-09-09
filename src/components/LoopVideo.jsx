import { useEffect, useRef } from 'react';

/**
 * Зацикленное фоновое видео. Против гифки выигрывает дважды: держит
 * исходные 24 кадра в секунду с равномерным шагом и весит втрое меньше.
 * За пределами экрана ставится на паузу, чтобы не греть процессор.
 */
export default function LoopVideo({ src, className, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;

    const kick = () => {
      const started = video.play();
      if (started && typeof started.catch === 'function') started.catch(() => {});
    };

    const reveal = () => video.classList.add('is-live');
    if (video.readyState >= 2) reveal();
    video.addEventListener('loadeddata', reveal);

    if (typeof IntersectionObserver === 'undefined') {
      kick();
      return () => video.removeEventListener('loadeddata', reveal);
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? kick() : video.pause()),
      { rootMargin: '200px 0px' },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', reveal);
    };
  }, []);

  return (
    <video
      className={className}
      ref={ref}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
      {...rest}
    />
  );
}
