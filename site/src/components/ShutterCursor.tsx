import { useEffect, useRef } from 'react';
import { Aperture } from 'lucide-react';
import { playShutterSound } from '@/lib/shutterSound';

// Replaces the system cursor with a camera aperture on fine-pointer devices
// (mouse/trackpad) — every click snaps the blades shut and fires a synthetic
// shutter sound. Touch devices are untouched: no matching media query, no listeners.
export function ShutterCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;

    document.documentElement.classList.add('shutter-cursor-active');

    const move = (e: MouseEvent) => {
      el.style.opacity = '1';
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    const hide = () => {
      el.style.opacity = '0';
    };
    const down = () => {
      playShutterSound();
      el.classList.add('is-clicking');
      window.setTimeout(() => el.classList.remove('is-clicking'), 160);
    };

    window.addEventListener('mousemove', move);
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', move);
    window.addEventListener('mousedown', down);

    return () => {
      document.documentElement.classList.remove('shutter-cursor-active');
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.documentElement.removeEventListener('mouseenter', move);
      window.removeEventListener('mousedown', down);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="shutter-cursor pointer-events-none fixed left-0 top-0 z-[999] opacity-0 transition-opacity duration-150"
    >
      <Aperture
        className="h-6 w-6 text-[#C6A15B] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
        strokeWidth={1.5}
      />
    </div>
  );
}
