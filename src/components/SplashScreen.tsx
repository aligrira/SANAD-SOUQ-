import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Elegant fast boot duration - 1.0 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 500); // Smooth 500ms fade transition
      return () => clearTimeout(finishTimer);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[99999] bg-black flex items-center justify-center m-0 p-0 overflow-hidden select-none w-screen h-screen"
        >
          <img 
            src="/souq_sanad_splash.png" 
            alt="سوق سند" 
            className="w-full h-full object-cover select-none" 
            referrerPolicy="no-referrer"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
