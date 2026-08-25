import { motion } from 'framer-motion';
import { useMemo, type ReactNode, type ElementType } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementType;
  className?: string;
}

// Scroll-triggered reveal, once only.
export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className,
}: FadeInProps) {
  // `motion.create` must be memoized: calling it fresh on every render (e.g.
  // every time a parent re-renders from an unrelated hover state change)
  // produces a new component type each time, so React unmounts and
  // remounts the node instead of updating it — replaying the fade-in from
  // opacity 0 and reading as a flicker on any interaction near this tree.
  const MotionTag = useMemo(() => motion.create(as as ElementType), [as]);
  return (
    <MotionTag
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
