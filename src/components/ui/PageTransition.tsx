import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps a page with a smooth, subtle fade + slight upward slide transition.
 * Intentionally very gentle to avoid discomfort.
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // smooth ease-out cubic
      }}
    >
      {children}
    </motion.div>
  );
};
