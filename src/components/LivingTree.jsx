import LoopImage from './LoopImage';

/** Живое дерево: webp-гифка, всегда крутится, без autoplay-видео. */
export default function LivingTree({ className = '' }) {
  return (
    <div className={`living-tree ${className}`} aria-hidden="true">
      <LoopImage className="living-tree__media" src="/media/tree-verdant.webp" />
    </div>
  );
}
