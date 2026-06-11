import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cinematic boot duration - 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 800); // Smooth 800ms fade transition
      return () => clearTimeout(finishTimer);
    }, 2500);

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
