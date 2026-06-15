import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Crown, ChevronLeft } from "lucide-react";
import { Product } from "../types";

interface VipAdSliderProps {
  vipProducts: Product[];
  onAdClick: (product: Product) => void;
  heightClass?: string;
  isSecondary?: boolean;
}

export default function VipAdSlider({
  vipProducts,
  onAdClick,
  heightClass = "h-[220px] sm:h-[260px]",
  isSecondary = false,
}: VipAdSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesPreloadedRef = useRef<Record<string, boolean>>({});

  // 1. Proactive and persistent preloading of all slide images
  useEffect(() => {
    if (!vipProducts) return;
    vipProducts.forEach((product) => {
      const src = product.imageUrls?.[0] || (product as any).image;
      if (src && !imagesPreloadedRef.current[src]) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          imagesPreloadedRef.current[src] = true;
        };
      }
    });
  }, [vipProducts]);

  // 2. High-performance, clean transition timer
  useEffect(() => {
    if (!vipProducts || vipProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % vipProducts.length);
    }, 6000); // 6-second dynamic rotation
    return () => clearInterval(timer);
  }, [vipProducts?.length]);

  if (!vipProducts || vipProducts.length === 0) return null;

  const currentProduct = vipProducts[currentIndex];
  if (!currentProduct) return null;

  const currentImageUrl = currentProduct.imageUrls?.[0] || (currentProduct as any).image;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[24px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group select-none will-change-transform ${heightClass} ${
        isSecondary 
          ? 'bg-gradient-to-br from-[#121212] via-[#0e0e0e] to-[#080808] border-[3px] border-zinc-400 shadow-[0_8px_25px_rgba(0,0,0,0.85)]' 
          : 'bg-gradient-to-br from-[#141414] via-[#0d0d0d] to-[#050505] border-[3px] border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)]'
      }`}
      onClick={() => onAdClick(currentProduct)}
      style={{ contentVisibility: 'auto', contain: 'paint' }} // Reduce layout shifts and container painting overhead
    >
      {/* 3D Glass Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none z-30 rounded-[24px]" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none z-30 rounded-t-[24px]" />

      {/* Unified High-Performance Transition Engine without wait mode to remove flicker */}
      <AnimatePresence>
        <motion.div
  key={currentProduct.id}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0, zIndex: 0 }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
  className="absolute inset-0 w-full h-full flex items-center overflow-hidden z-10"
  dir="rtl"
  style={{ transformOrigin: "center" }}
>
          {/* Static Ambient Blurred Background (GPU Optimized: No scaling during blur) */}
          <div className="absolute inset-0 w-full h-full opacity-15 blur-lg pointer-events-none z-0">
            {currentImageUrl && (
              <img
                src={currentImageUrl}
                alt=""
                className="w-full h-full object-cover select-none"
                loading="eager"
              />
            )}
          </div>

          <div className="relative w-full h-full flex flex-row-reverse items-center justify-between px-5 sm:px-10 z-10 gap-4">
            {/* Product Image Stage */}
            <div className="w-[55%] h-full flex items-center justify-center relative overflow-hidden py-4 shrink-0">
              <motion.div 
                initial={{ scale: 0.94, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {currentImageUrl && (
                  <img
                    src={currentImageUrl}
                    alt={currentProduct.title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[92%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-105 select-none"
                    loading="eager"
                  />
                )}
              </motion.div>
            </div>

            {/* Structured Content Block */}
            <div className="w-[45%] flex flex-col items-end text-right justify-center pl-1 select-none">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`px-2.5 py-0.5 rounded-full border ${isSecondary ? 'border-zinc-700 text-zinc-300 bg-zinc-900/40' : 'border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5'} text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm`}>
                  {isSecondary ? 'إعلان ملكي فضي' : 'إعلان ملكي ذهبي'}
                  <Crown className={`w-3 h-3 ${isSecondary ? 'text-zinc-400' : 'text-[#D4AF37]'}`} fill="currentColor" />
                </div>
              </div>

              {/* Title */}
              <h3 className={`font-black text-white leading-snug mb-2 line-clamp-2 drop-shadow-md select-text ${isSecondary ? 'text-base sm:text-xl' : 'text-lg sm:text-2xl'}`}>
                {currentProduct.title}
              </h3>

              {/* Price Tag */}
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className={`font-black tracking-tight drop-shadow-sm leading-none ${isSecondary ? 'text-lg text-zinc-300' : 'text-2xl text-[#F5D76E]'}`}>
                  {currentProduct.price?.toLocaleString("en-US")}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase leading-none">د.ت</span>
              </div>

              {/* Elegant Action Button */}
              <button 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all ${
                  isSecondary 
                    ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700/80 text-white hover:bg-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.3)] active:scale-[0.98]' 
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#e4c452] border border-[#fff2ba]/30 text-black shadow-[0_4px_12px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_18px_rgba(212,175,55,0.35)] active:scale-[0.98]'
                }`}
              >
                <span className="drop-shadow-sm select-none">عرض التفاصيل</span>
                <ChevronLeft className="w-3.5 h-3.5 drop-shadow-sm shrink-0" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Minimal Navigation Dots */}
      {vipProducts.length > 1 && (
        <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-40 select-none">
          {vipProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-[4px] rounded-full transition-all duration-400 focus:outline-none ${
                idx === currentIndex
                  ? "w-7 bg-[#D4AF37]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
