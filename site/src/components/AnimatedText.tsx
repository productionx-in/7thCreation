import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

// Reused from the MotionSites reference pattern: character-by-character
// scroll-driven opacity reveal, keyed to the paragraph's own scroll progress.
export function AnimatedText({ text, className }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, wi) => {
        const start = wi / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={wi} progress={scrollYProgress} start={start} end={end}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  start,
  end,
}: {
  children: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}
