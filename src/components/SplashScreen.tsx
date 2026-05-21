import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  show: boolean;
}

export default function SplashScreen({ onFinish, show }: SplashScreenProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onFinish, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 bg-[#020806] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#D4AF37] blur-[60px] opacity-20 rounded-full" />
            <ShoppingBag className="w-24 h-24 text-[#D4AF37] mb-6 relative z-10" strokeWidth={1} />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-widest text-[#fff] font-display">
              سوق <span className="text-gradient-gold">سند</span>
            </h1>
            <p className="text-[#10B981] mt-3 tracking-widest uppercase text-sm font-medium">تجربة التسوق الفاخرة</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
