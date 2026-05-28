import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown } from 'lucide-react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for fade out
    }, 2000); // 2 seconds splash duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-[100px]" />
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#c5a059] blur-2xl opacity-20" />
              <Crown className="w-16 h-16 text-[#c5a059] relative z-10 drop-shadow-2xl" />
            </div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl font-display text-white font-bold tracking-tight"
            >
              سوق <span className="text-[#c5a059] italic font-serif">سند</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent mt-4 relative overflow-hidden"
            >
               <motion.div 
                  className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
                  animate={{ x: ['100%', '-200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
