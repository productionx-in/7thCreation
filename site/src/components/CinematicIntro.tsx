import { useEffect, useRef } from 'react';
import { playCinematicIntro } from '@/lib/cinematicSound';

// Every browser blocks audio-with-sound until the visitor has interacted
// with the page at least once — there is no way to truly play a sound "the
// instant the page loads" with the volume on. This is the closest real
// equivalent: fires on the very first interaction of any kind (click, tap,
// key press, scroll), then never again this page load.
export function CinematicIntro() {
  const firedRef = useRef(false);

  useEffect(() => {
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      playCinematicIntro();
    };
    window.addEventListener('pointerdown', fire, { once: true });
    window.addEventListener('keydown', fire, { once: true });
    window.addEventListener('scroll', fire, { once: true, passive: true });
    window.addEventListener('touchstart', fire, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', fire);
      window.removeEventListener('keydown', fire);
      window.removeEventListener('scroll', fire);
      window.removeEventListener('touchstart', fire);
    };
  }, []);

  return null;
}
