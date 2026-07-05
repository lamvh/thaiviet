import { useState } from 'react';
import { Icon } from '../ui/Icon';

// Drag-to-reveal before/after comparison. Position is React state so it works without
// the design's inline oninput handler. Shared by both service page skins.
export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl select-none">
      <img className="absolute inset-0 w-full h-full object-cover" alt="After" src={after} draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img className="absolute inset-0 w-full h-full object-cover" alt="Before" src={before} draggable={false} />
      </div>
      <span className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Before</span>
      <span className="absolute top-4 right-4 z-20 bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">After</span>
      <div className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]" style={{ left: pos + '%', transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-primary"><Icon name="drag_indicator" /></div>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" aria-label="Reveal before and after" />
    </div>
  );
}
