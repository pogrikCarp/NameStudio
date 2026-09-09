import { useEffect, useRef } from 'react';

const STAR_LAYERS = [
  { count: 220, speed: 0.16, size: [0.5, 1.15], alpha: [0.28, 0.72] },
  { count: 120, speed: 0.36, size: [0.85, 1.7], alpha: [0.48, 0.95] },
  { count: 40, speed: 0.68, size: [1.3, 2.5], alpha: [0.7, 1] },
];

function makeSeamless(image) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const blend = Math.floor(width * 0.2);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  const frame = ctx.getImageData(0, 0, width, height);
  const pixels = frame.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < blend; x += 1) {
      const mix = x / blend;
      const dest = (y * width + (width - blend + x)) * 4;
      const src = (y * width + x) * 4;
      pixels[dest] = pixels[dest] * (1 - mix) + pixels[src] * mix;
      pixels[dest + 1] = pixels[dest + 1] * (1 - mix) + pixels[src + 1] * mix;
      pixels[dest + 2] = pixels[dest + 2] * (1 - mix) + pixels[src + 2] * mix;
    }
  }

  ctx.putImageData(frame, 0, 0);
  return canvas;
}

function spawnStars(width, height) {
  const density = width < 720 ? 0.62 : 1;
  return STAR_LAYERS.flatMap((layer, layerIndex) =>
    Array.from({ length: Math.round(layer.count * density) }, () => ({
      layerIndex,
      x: Math.random() * width,
      y: Math.random() * height,
      size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
      alpha: layer.alpha[0] + Math.random() * (layer.alpha[1] - layer.alpha[0]),
      twinkle: 0.4 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      color:
        layerIndex === 2 && Math.random() > 0.5
          ? Math.random() > 0.45
            ? '#00f58a'
            : '#00ddc6'
          : '#eaf7ef',
    })),
  );
}

export default function SpaceBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let plate = null;
    let stars = [];
    let offset = 0;
    let frameId = 0;
    let width = 0;
    let height = 0;
    let running = true;

    const image = new Image();
    image.src = '/media/pano-forest.jpg';
    image.onload = () => {
      plate = makeSeamless(image);
    };

    const resize = () => {
      const bounds = canvas.parentElement.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = spawnStars(width, height);
    };

    const draw = (time) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#050e0c';
      ctx.fillRect(0, 0, width, height);

      if (plate) {
        const plateHeight = height;
        const plateWidth = plate.width * (plateHeight / plate.height);
        if (!reduced) offset = (offset + 0.35) % plateWidth;
        const start = -offset;
        for (let x = start; x < width + plateWidth; x += plateWidth) {
          ctx.drawImage(plate, x, 0, plateWidth, plateHeight);
        }
      }

      const tick = time / 1000;
      stars.forEach((star) => {
        const layer = STAR_LAYERS[star.layerIndex];
        if (!reduced) {
          star.x -= layer.speed;
          if (star.x < -4) star.x = width + 4;
        }
        const glow = star.alpha * (0.55 + 0.45 * Math.sin(tick * star.twinkle + star.phase));
        ctx.fillStyle = star.color;
        ctx.globalAlpha = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    frameId = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement);

    return () => {
      running = false;
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return <canvas className="hero__space" ref={canvasRef} aria-hidden="true" />;
}
