import { useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

// Reused from the MotionSites reference pattern: mouse-following magnetic
// hover, active only within `padding` px of the element's edges.
export function Magnet({ children, padding = 100, strength = 4, className }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const withinX = e.clientX > rect.left - padding && e.clientX < rect.right + padding;
    const withinY = e.clientY > rect.top - padding && e.clientY < rect.bottom + padding;
    if (withinX && withinY) {
      setActive(true);
      setOffset({ x: dx / strength, y: dy / strength });
    } else if (active) {
      setActive(false);
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleLeave = () => {
    setActive(false);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: active ? 'transform 0.3s ease-out' : 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
