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
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      const started = video.play();
      if (started && typeof started.catch === 'function') started.catch(() => {});
    };

    const restart = () => {
      video.currentTime = 0;
      kick();
    };

    const reveal = () => video.classList.add('is-live');
    if (video.readyState >= 2) reveal();
    video.addEventListener('loadeddata', reveal);
    video.addEventListener('ended', restart);

    if (typeof IntersectionObserver === 'undefined') {
      kick();
      return () => {
        video.removeEventListener('loadeddata', reveal);
        video.removeEventListener('ended', restart);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? kick() : video.pause()),
      { rootMargin: '200px 0px' },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', reveal);
      video.removeEventListener('ended', restart);
    };
  }, [src]);

  return (
    <video
      className={className}
      ref={ref}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      {...rest}
    />
  );
}
