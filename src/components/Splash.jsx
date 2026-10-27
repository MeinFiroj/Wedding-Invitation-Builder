import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const KEY = 'vowcard:splash';
const EASE = [0.22, 1, 0.36, 1];

const seen = () => {
  try {
    return !!sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
};

export default function Splash() {
  const [show, setShow] = useState(() => !seen());

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    const id = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(id);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-canvas"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-gold/30 blur-3xl"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0.6], scale: 1.4 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />
            <motion.img
              src="/favicon.png"
              alt="VowCard"
              className="relative size-24 md:size-28 object-contain"
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </div>

          <motion.div
            className="w-24 h-px mt-8 bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
          />
          <motion.span
            className="mt-4 text-xs font-semibold tracking-[0.4em] uppercase text-ink-dim"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          >
            VowCard
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}