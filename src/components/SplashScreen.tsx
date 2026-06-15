import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
  isReady: boolean;
}

export default function SplashScreen({ onComplete, isReady }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Enforce a minimum splash duration for consistent branding
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimeElapsed && isReady) {
      setIsVisible(false);
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 500); // 500ms fade transition
      return () => clearTimeout(finishTimer);
    }
  }, [minTimeElapsed, isReady, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div

          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[99999] bg-black flex items-center justify-center m-0 p-0 overflow-hidden select-none w-screen h-screen"
        >
          <motion.img 
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="/souq_sanad_splash.png" 
            alt="سوق سند" 
            className="w-full h-full object-contain select-none" 
            referrerPolicy="no-referrer"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
