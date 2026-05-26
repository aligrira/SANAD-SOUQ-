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
}

interface BroadcastMarqueeProps {
  queue: BroadcastMessage[];
  onDismiss: (id: string) => void;
}

export default function BroadcastMarquee({ queue, onDismiss }: BroadcastMarqueeProps) {
  const [current, setCurrent] = useState<BroadcastMessage | null>(null);
  const [repeatCount, setRepeatCount] = useState(0);

  // Pick the next message when the current one is finished, or cancel current and play the newest one
  useEffect(() => {
    if (queue.length > 0) {
      // Always prioritize the most recently added message in the queue
      const latestMessage = queue[queue.length - 1];
      if (current?.id !== latestMessage.id) {
        setCurrent(latestMessage);
        setRepeatCount(0);
      }
    } else {
      setCurrent(null);
    }
  }, [queue, current?.id]);

  // Reset iteration count for each new message
  useEffect(() => {
    if (current) {
      setRepeatCount(0);
    }
  }, [current?.id]);

  const handleNext = () => {
    if (current) {
      onDismiss(current.id);
    }
  };

  const handleAnimationComplete = () => {
    if (repeatCount < 4) { // 0, 1, 2, 3, 4 means exactly 5 times total
      setRepeatCount(prev => prev + 1);
    } else {
      handleNext();
    }
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key="marquee-bar"
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="fixed top-16 inset-x-0 w-full h-14 bg-gradient-to-r from-red-700 via-rose-800 to-red-700 shadow-[0_4px_15px_rgba(0,0,0,0.6),0_0_15px_rgba(244,63,94,0.45)] flex items-center border-b border-rose-500/80 z-[2000] overflow-hidden select-none"
          dir="rtl"
        >
          {/* Animated subtle bottom light beam */}
          <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* Scrolling text wrapper */}
          <div className="relative w-full h-full flex items-center overflow-hidden">
            <motion.div
              key={`${current.id}-${repeatCount}`}
              initial={{ x: '100%' }}
              animate={{ x: '-100%' }}
              transition={{
                ease: 'linear',
                duration: 21, // Much slower scroll speed giving the user comfortable time to read
              }}
              onAnimationComplete={handleAnimationComplete}
              className="absolute whitespace-nowrap text-white font-black text-sm sm:text-base flex items-center gap-3.5 px-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
            >
              <div className="inline-flex items-center gap-1.5 shrink-0">
                {current.plan === 'vip' ? (
                  <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                    <Crown className="w-2.5 h-2.5 fill-black" />
                    VIP ملكي
                  </span>
                ) : current.plan === 'bronze' ? (
                  <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                    <Flame className="w-2.5 h-2.5 fill-white" />
                    متميز ✦
                  </span>
                ) : (
                  <span className="bg-white/20 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    باقة عادية
                  </span>
                )}
              </div>

              <span className="text-white tracking-wide">
                <span className="text-yellow-300 font-extrabold">{current.sellerName}</span> من <span className="text-emerald-300 font-extrabold">{current.location}</span> ؛ أعلن عن: <span className="text-white underline decoration-white/40 underline-offset-4 font-black">{current.title}</span> 👑🔥
              </span>

              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
