import React, { useState, useEffect } from 'react';
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

  // Pick the next message when the current one is finished, or cancel current and play the newest one
  useEffect(() => {
    if (queue.length > 0) {
      // Always prioritize the most recently added message in the queue (first in the array because of descending order)
      const latestMessage = queue[0];
      if (current?.id !== latestMessage.id) {
        setCurrent(latestMessage);
      }
    } else {
      setCurrent(null);
    }
  }, [queue, current?.id]);

  const handleNext = () => {
    if (current) {
      onDismiss(current.id);
    }
  };

  const handleAnimationComplete = () => {
    handleNext();
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key="marquee-bar"
          initial={{ y: '-100%', opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{
            y: { type: 'spring', stiffness: 100, damping: 15 },
          }}
          className="fixed top-[84px] inset-x-2 w-[calc(100%-16px)] h-9 bg-gradient-to-r from-stone-900 via-red-950/60 to-stone-900 border border-amber-900/30 rounded-full flex items-center z-[2000] overflow-hidden select-none shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          dir="rtl"
        >
          {/* Animated subtle bottom light beam */}
          <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-black/20 to-transparent" />

          {/* Scrolling text wrapper */}
          <div className="relative w-full h-full flex items-center overflow-hidden">
            <motion.div
              key={current.id}
              initial={{ x: '100%' }}
              animate={{ x: '-100%' }}
              transition={{
                ease: 'linear',
                duration: 10, // Reduced speed giving the user enough time to see once and then auto-dismiss
              }}
              onAnimationComplete={handleAnimationComplete}
              className="absolute whitespace-nowrap text-white font-bold text-sm sm:text-base flex items-center gap-3.5 px-6"
            >
              <div className="inline-flex items-center gap-1.5 shrink-0">
                {current.plan === 'vip' ? (
                  <span className="bg-white text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                    <Crown className="w-2.5 h-2.5 fill-red-600" />
                    VIP ملكي
                  </span>
                ) : current.plan === 'bronze' ? (
                  <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                    <Flame className="w-2.5 h-2.5 fill-amber-900" />
                    متميز ✦
                  </span>
                ) : (
                  <span className="bg-white/20 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    باقة عادية
                  </span>
                )}
              </div>

              <span className="text-white tracking-wide">
                <span className="text-yellow-200 font-extrabold">{current.sellerName}</span> من <span className="text-white font-extrabold">{current.location}</span> ؛ أعلن عن: <span className="text-white underline decoration-white/40 underline-offset-4 font-black">{current.title}</span> 👑🔥
              </span>

              <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse shrink-0" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
