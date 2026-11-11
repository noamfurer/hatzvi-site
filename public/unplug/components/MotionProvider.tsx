'use client';
import { MotionConfig, motion, type HTMLMotionProps } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

/** כניסה עדינה בגלילה */
export function Reveal({
  delay = 0,
  y = 28,
  children,
  ...rest
}: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ ...spring, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
