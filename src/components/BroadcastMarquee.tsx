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
  category?: string;
  createdAt?: string;
}

interface BroadcastMarqueeProps {
  queue: BroadcastMessage[];
  onDismiss: (id: string) => void;
}

export default function BroadcastMarquee({ queue, onDismiss }: BroadcastMarqueeProps) {
  const [current, setCurrent] = useState<BroadcastMessage | null>(null);
  const [subState, setSubState] = useState<'brand' | 'ad'>('brand');
  const [iteration, setIteration] = useState(0);

  // Load the view counts from localStorage to persist them across sessions
  const [viewCounts, setViewCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('sanad_broadcast_views');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync current message from queue
  useEffect(() => {
    if (queue.length > 0) {
      // Find the first message that hasn't reached its max views (e.g., 10)
      const pendingMessage = queue.find(msg => (viewCounts[msg.id] || 0) < 10);
      if (pendingMessage) {
        if (current?.id !== pendingMessage.id) {
          setCurrent(pendingMessage);
          setSubState('brand');
        }
      } else {
        setCurrent(null);
      }
    } else {
      setCurrent(null);
    }
  }, [queue, current?.id, viewCounts]);

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
      const newCount = (viewCounts[current.id] || 0) + 1;
      const updatedCounts = { ...viewCounts, [current.id]: newCount };
      
      setViewCounts(updatedCounts);
      try {
        localStorage.setItem('sanad_broadcast_views', JSON.stringify(updatedCounts));
      } catch (e) {
        console.error('Failed to save broadcast view count', e);
      }

      if (newCount >= 10) {
        setCurrent(null); // Instantly hide
        onDismiss(current.id);
      } else {
        // Go back to the brand transition, loading the next or repeating
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
          key={`stadium-board-${current.id}-${iteration}`}
          initial={{ opacity: 0, y: -25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-[94%] sm:w-[92%] max-w-5xl mx-auto h-[50px] bg-gradient-to-r from-[#4a0000] via-[#9e0505] to-[#4a0000] rounded-full flex items-center overflow-hidden select-none fixed top-[28px] sm:top-[36px] left-0 right-0 z-[99999] shadow-[0_15px_45px_rgba(239,68,68,0.3),0_0_30px_rgba(251,191,36,0.25)] border-2 border-transparent backdrop-blur-xl"
          dir="rtl"
        >
          {/* LED Stadium Board Screen Overlay & Pixels */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(254,240,138,0.15)_0%,transparent_75%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] opacity-35 pointer-events-none" />
          
          {/* Rotating Laser Gold Border Mechanism */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            {/* Smooth glowing golden conic circle element rotating 360deg */}
            <div className="absolute top-[-100%] left-[-50%] w-[200%] h-[300%] animate-[spin_3.5s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#FCD34D_15%,transparent_30%,#F59E0B_50%,transparent_65%,#FCD34D_80%,transparent_100%)] opacity-100 filter drop-shadow-[0_0_12px_rgba(245,158,11,1)]" />
            
            {/* Inner mask cut to render the precise glowing laser border. Background matches primary luxury red. */}
            <div className="absolute inset-[2.5px] rounded-full bg-gradient-to-r from-[#500000] via-[#a30808] to-[#500000]" />
          </div>

          {/* Running Metallic Bright Edge Light / Shine & Flash Sweep */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/70 rounded-full pointer-events-none" />
          <div className="absolute inset-[3.5px] rounded-full border border-yellow-400/30 pointer-events-none" />

          {/* Continuous premium golden light streak scanning horizontally */}
          <div className="absolute top-0 bottom-0 left-[-50%] w-[30%] bg-gradient-to-r from-transparent via-yellow-250/30 to-transparent skew-x-20 animate-shine-sweep pointer-events-none" />

          {/* Dynamic Content Controller */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden z-10 px-4">
            <AnimatePresence mode="wait">
              {subState === 'brand' ? (
                /* SCREEN 1: BRAND SWEEP (سوق سند - الملتقى الملكي) */
                <motion.div
                  key="stadium-brand"
                  initial={{ opacity: 0, scale: 0.85, rotateX: 65 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotateX: -65 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 12 }}
                  className="w-full h-full flex items-center justify-center gap-2"
                  style={{ perspective: '800px' }}
                >
                  <motion.div
                    animate={{ scale: [0.97, 1.03, 0.97] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex items-center gap-2.5"
                  >
                    <Crown className="w-5.5 h-5.5 text-yellow-350 fill-yellow-400 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse" />
                    <span className="text-[14px] sm:text-[16px] font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-amber-305 font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      ★ سُوق سَنَد الملكي ★
                    </span>
                    <Sparkles className="w-4.5 h-4.5 text-yellow-350 animate-spin-slow filter drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                  </motion.div>
                </motion.div>
              ) : (
                /* SCREEN 2: THE CURRENT COMPONENT ADVERTISEMENT TICKER */
                <motion.div
                  key="stadium-ad"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex items-center relative overflow-hidden"
                >
                  {/* Scrolling belt optimized for beautiful premium stadium speeds */}
                  <motion.div
                    initial={{ x: '100vw' }}
                    animate={{ x: '-110%' }}
                    transition={{
                      ease: 'linear',
                      duration: 11, // Extremely smooth reading speed
                    }}
                    onAnimationComplete={handleAdFinished}
                    className="absolute whitespace-nowrap text-white text-xs sm:text-xs md:text-sm flex items-center gap-4 pr-3 pl-12"
                  >
                    {/* High-Contrast Luxury Planet Badge */}
                    <div className="inline-flex items-center gap-1 shrink-0">
                      {current.plan === 'vip' ? (
                        <span className="bg-gradient-to-r from-yellow-300 to-amber-500 text-black text-[9.5px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-[0_2px_10px_rgba(251,191,36,0.6)] border border-yellow-250">
                          <Crown className="w-2.5 h-2.5 fill-black" />
                          عضوية VIP
                        </span>
                      ) : current.plan === 'bronze' ? (
                        <span className="bg-amber-600/40 text-amber-200 text-[9.5px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-amber-400/40">
                          <Flame className="w-2.5 h-2.5 fill-amber-300" />
                          متميز
                        </span>
                      ) : (
                        <span className="bg-white/15 text-white text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                          إعلان نشط
                        </span>
                      )}
                    </div>

                    {/* Highly polished neon golden typography & content */}
                    <span className="font-sans font-bold tracking-wide">
                      <span className="text-yellow-300 font-black text-xs sm:text-[14px] drop-shadow-[0_1px_4px_rgba(251,191,36,0.4)] hover:underline select-none">
                        {current.sellerName}
                      </span>
                      <span className="text-red-200 mx-1.5 font-extrabold text-xs">من</span>
                      <span className="text-amber-100 font-extrabold text-xs sm:text-[14px] drop-shadow-[0_1px_4px_rgba(251,191,36,0.3)]">
                        {current.location}
                      </span>
                      <span className="text-red-300/65 mx-2 font-black select-none">•</span>
                      <span className="text-white/90 font-medium">أعلن الآن:</span>
                      <span className="text-yellow-100 font-black mr-2 text-xs sm:text-[14px] drop-shadow-[0_0_8px_rgba(254,240,138,0.5)]">
                        {current.title}
                      </span>
                    </span>

                    {/* Ending crown sparkle */}
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
