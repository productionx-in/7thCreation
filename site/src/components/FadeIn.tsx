import { useEffect, useRef, useState, type ReactNode, type ElementType, type CSSProperties } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementType;
  className?: string;
}

// Reveal-on-scroll via IntersectionObserver + a CSS transition — no
// animation library. Fires once, first time the element enters the viewport.
export function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, as = 'div', className }: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const Tag = as as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'translate3d(0,0,0)' : `translate3d(${x}px, ${y}px, 0)`,
    transition: `opacity ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s`,
  };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
