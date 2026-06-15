import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Flame, Sparkles } from 'lucide-react';

export interface BroadcastMessage {
  id: string;
  sellerName: string;
  location: string;
  title: string;
  plan: 'vip' | 'bronze' | 'free';
  avatar?: string;
  itemImage?: string;
  price?: number | string;
  category?: string;
  createdAt?: string;
}

interface BroadcastMarqueeProps {
  queue: BroadcastMessage[];
  onDismiss: (id: string) => void;
  relative?: boolean;
  onProductClick?: (title: string, sellerName: string) => void;
}

export default function BroadcastMarquee({ queue, onDismiss, relative = false, onProductClick }: BroadcastMarqueeProps) {
  const [current, setCurrent] = useState<BroadcastMessage | null>(null);
  const [subState, setSubState] = useState<'brand' | 'ad'>('brand');
  const [iteration, setIteration] = useState(0);
  const [loopCount, setLoopCount] = useState(0);

  // Sync current message from queue
  useEffect(() => {
    if (queue.length > 0) {
      const pendingMessage = queue[0];
      if (current?.id !== pendingMessage.id) {
        setCurrent(pendingMessage);
        setSubState('brand');
        setLoopCount(0);
      }
    } else {
      setCurrent(null);
    }
  }, [queue, current?.id]);

  // Timed transition for "brand" screen -> "ad" screen
  useEffect(() => {
    if (!current) return;
    
    if (subState === 'brand') {
      const timer = setTimeout(() => {
        setSubState('ad');
      }, 3000); // Display branding message for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [subState, current, iteration]);

  const handleNext = () => {
    if (current) {
      const nextCount = loopCount + 1;
      if (nextCount >= 3) {
        const idToDismiss = current.id;
        setCurrent(null); // Instantly hide
        onDismiss(idToDismiss);
      } else {
        setLoopCount(nextCount);
        // Go back to the brand transition, repeating
        setSubState('brand');
        setIteration(prev => prev + 1);
      }
    }
  };

  const handleAdFinished = () => {
    handleNext();
  };

  return (
    <AnimatePresence mode="wait">
      {current && (
        <motion.div
          key={`stadium-board-${current.id}`}
          initial={{ opacity: 0, y: -15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`h-[40px] bg-gradient-to-r from-[#1a0508] via-[#3d0814] to-[#1a0508] rounded-2xl flex items-center overflow-hidden select-none border border-[#D4AF37]/60 ${
            relative 
              ? "relative w-full my-2 shadow-[0_4px_15px_rgba(0,0,0,0.5),0_0_15px_rgba(212,175,55,0.25),inset_0_0_10px_rgba(155,17,30,0.4)] z-10" 
              : "fixed top-[15px] left-0 right-0 z-[99999] w-[94%] max-w-[440px] mx-auto shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.25),inset_0_0_10px_rgba(155,17,30,0.4)]"
          }`}
          dir="rtl"
        >
          {/* Golden Shimmer Effect */}
          <motion.div
            animate={{ x: ['-200%', '200%'] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', repeatDelay: 3 }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent -skew-x-12 pointer-events-none z-0"
          />

          {/* Subtle Royal Glass Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(155,17,30,0.3)_0%,transparent_80%)] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent pointer-events-none" />
          
          {/* Dynamic Content Controller */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden z-10 px-2 sm:px-3">
            <AnimatePresence mode="wait">
              {subState === 'brand' ? (
                /* SCREEN 1: BRAND SWEEP */
                <motion.div
                  key="stadium-brand"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-full flex items-center justify-center gap-2.5"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <Crown className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  </motion.div>
                  <span className="text-[13px] sm:text-[14px] font-bold tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4D0] via-[#F5D76E] to-[#D4AF37]">
                    إعلان ملكـي
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
                  >
                    <Crown className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  </motion.div>
                </motion.div>
              ) : (
                /* SCREEN 2: SCROLLING AD CONTENT */
                <motion.div
                  key={`stadium-ad-${iteration}`}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="w-full h-full flex items-center relative overflow-hidden"
                >
                  {/* Scrolling Belt */}
                  <div
                    onAnimationEnd={handleAdFinished}
                    className="absolute whitespace-nowrap text-white text-[12px] sm:text-[13px] flex items-center gap-3 pr-1 pl-10 cursor-default animate-broadcast-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] select-none font-sans font-bold"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="shrink-0 flex items-center justify-center bg-[#D4AF37]/10 w-6 h-6 rounded-full border border-[#D4AF37]/30 shadow-[0_0_8px_rgba(212,175,55,0.2)] ml-1"
                    >
                      <Crown className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                    </motion.div>

                    {(current.itemImage || current.avatar) && (
                      <div className="w-6 h-6 rounded-[6px] border border-[#D4AF37]/40 overflow-hidden shrink-0 shadow-md">
                        <img 
                          src={current.itemImage || current.avatar} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <span className="text-white brightness-125 font-bold tracking-tight">
                      {current.title}
                    </span>

                    {current.price && (
                      <span className="text-[#D4AF37] font-black text-[12px] px-1.5 py-[1px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-md shrink-0">
                        {current.price} د.ت
                      </span>
                    )}

                    <span className="text-gray-400 font-medium text-[11px] shrink-0 flex items-center gap-1 border-r border-[#D4AF37]/20 pr-3">
                      📍 {current.location}
                    </span>

                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/80 animate-pulse shrink-0 drop-shadow-sm ml-2" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
