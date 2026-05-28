import { motion } from 'motion/react';
import { Sparkles, Crown } from 'lucide-react';

export default function PremiumBanner({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden bg-[#0a0a0a] border-b border-[#222] p-8 sm:p-10 flex flex-col md:flex-row items-center md:items-start justify-between text-center md:text-right"
    >
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 space-y-4 max-w-xl mx-auto md:mx-0">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#c5a059] uppercase tracking-[0.2em] relative">
            <Sparkles className="w-3.5 h-3.5 opacity-80" />
            تجربة كبار الشخصيات
        </span>
        <h2 className="text-3xl sm:text-4xl font-display text-white">
            انضم إلى عالم <span className="text-[#c5a059] italic font-serif">سند النخبة</span>
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0 font-light">
            استمتع بمميزات حصرية، رؤية أوسع لإعلاناتك، والعديد من الخدمات التي تليق بك كشريك استراتيجي.
        </p>
      </div>
      
      <div className="relative z-10 mt-6 md:mt-0 flex flex-col items-center justify-center">
        <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgradeClick}
            className="group relative bg-[#0f0f0f] border border-[#c5a059]/40 hover:border-[#c5a059] text-white font-medium text-sm py-3 px-8 rounded-full flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <Crown className="w-4 h-4 text-[#c5a059] group-hover:scale-110 transition-transform duration-300" />
            <span className="tracking-wide">ترقية حسابك الآن</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
