import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { MapPin, Heart, Eye, Sparkles, Flame, Images } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { HighlightText } from './HighlightText';

interface ListingCardProps {
  key?: React.Key;
  product: Product;
  onClick: () => void;
  searchQuery?: string;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  viewMode?: 'grid' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ product, onClick, searchQuery = '', isFavorite, onToggleFavorite, viewMode = 'grid' }) => {
  const [showHeart, setShowHeart] = useState(false);
  const [heartsBurst, setHeartsBurst] = useState<{ id: number; x: number; y: number; scale: number; rotation: number }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const clickBuffer = useRef<number>(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  const isVip = product.plan === 'vip' || product.isVip;
  const isBronze = product.plan === 'bronze';
  const isList = viewMode === 'list';

  const triggerHeartsBurst = () => {
    const bursts = Array.from({ length: 6 }).map((_, i) => ({
      id: Math.random() + i,
      x: (Math.random() - 0.5) * 130, // disperse left/right
      y: -30 - Math.random() * 50,    // float upwards
      scale: 0.6 + Math.random() * 0.6,
      rotation: (Math.random() - 0.5) * 45,
    }));
    setHeartsBurst(bursts);
    setTimeout(() => setHeartsBurst([]), 1200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Secondary capture: Use browser native detail if available for desktop reliability
    if (e.detail === 2) {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      setShowHeart(true);
      triggerHeartsBurst();
      setTimeout(() => setShowHeart(false), 900);
      if (!isFavorite) onToggleFavorite(e);
      clickBuffer.current = 0;
      return;
    }

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 400;

    if (now - clickBuffer.current < DOUBLE_TAP_DELAY) {
      // Double Tap Success
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      
      setShowHeart(true);
      triggerHeartsBurst();
      setTimeout(() => setShowHeart(false), 900);
      
      // Instagram style: double tap always likes
      if (!isFavorite) {
        onToggleFavorite(e);
      }
      
      clickBuffer.current = 0;
    } else {
      // Potential Single Tap
      clickBuffer.current = now;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      
      clickTimer.current = setTimeout(() => {
        onClick(); // Open Details
        clickTimer.current = null;
        clickBuffer.current = 0;
      }, DOUBLE_TAP_DELAY);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={isVip ? { y: -6, scale: 1.02, rotate: -0.5 } : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={handleCardClick}
      className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group relative w-full ${
        isList 
          ? 'flex flex-col sm:flex-row gap-0 max-w-full' 
          : 'flex flex-col w-full aspect-square'
      } ${
        isVip 
          ? 'border-amber-200/85 shadow-[0_4px_24px_rgba(212,175,55,0.08)] hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.22)]' 
          : isBronze 
            ? 'border-amber-600/25 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_25px_rgba(217,119,6,0.12)]' 
            : 'border-slate-100 hover:border-[#F25A24]/30 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_28px_rgba(242,90,36,0.12)]'
      }`}
    >
      {/* Dynamic Cursor Light Spot Tracker - Interactive Client-side Premium Glow */}
      {isHovered && (
        <span 
          className="absolute inset-x-0 inset-y-0 pointer-events-none transition-opacity duration-300 z-10 opacity-100"
          style={{
            background: isVip
              ? `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.12), transparent)`
              : isBronze
                ? `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, rgba(184, 115, 51, 0.08), transparent)`
                : `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, rgba(242, 90, 36, 0.06), transparent)`
          }}
        />
      )}

      {/* Golden Shimmer Loop for VIP */}
      {isVip && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl z-20">
          <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent opacity-40 group-hover:animate-shine-sweep" />
          {/* Magic VIP Particles Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700">
             {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: Math.random() * 50 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    y: [0, -40 - Math.random() * 40],
                    x: Math.random() * 20 - 10,
                    scale: [0, Math.random() + 0.5, 0]
                  }}
                  transition={{ 
                    duration: 1.5 + Math.random(), 
                    repeat: Infinity, 
                    delay: Math.random() * 2 
                  }}
                  className="absolute bottom-4 bg-[#D4AF37] rounded-full blur-[1px]"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    width: 3 + Math.random() * 4,
                    height: 3 + Math.random() * 4
                  }}
                />
             ))}
          </div>
        </div>
      )}

      {/* Product Image Wrapper - Inspired by Jumia white container style */}
      <div 
        className={`relative overflow-hidden bg-[#fafafa] shrink-0 select-none flex items-center justify-center p-2 sm:p-2 border-b border-slate-50 group-hover:bg-[#f6f6f6] transition-colors duration-300 ${
        isList 
          ? 'h-48 sm:h-full w-full sm:w-64 sm:order-last' 
          : 'h-[55%] w-full'
      }`}>
        {/* Placeholder before load for blur-up effect */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center" />
        )}
        <img 
          src={product.imageUrls?.[0] || 'https://via.placeholder.com/400'} 
          alt={product.title} 
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`max-w-[95%] max-h-[92%] object-contain transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:-rotate-1 relative z-10 ${imageLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-90'}`}
          referrerPolicy="no-referrer"
        />

        {/* Indicator for multiple images */}
        {product.imageUrls && product.imageUrls.length > 1 && (
           <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 z-10 select-none border border-white/10" dir="ltr">
              <Images className="w-3 w-3" />
              <span>1/{product.imageUrls.length}</span>
           </div>
        )}
        
        {/* High-Fidelity Conversion Overlay (Glass Peek Hover Effect) */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/95 text-slate-800 text-[10px] sm:text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 select-none">
            <Eye className="w-4 h-4 text-[#F25A24] animate-pulse" />
            <span>عرض تفاصيل الإعلان</span>
          </div>
        </div>

        {/* Double-Tap Multi-Heart Burst Particles */}
        <AnimatePresence>
          {heartsBurst.map((hb) => (
            <motion.div
              key={hb.id}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{ 
                scale: [0, hb.scale, hb.scale * 0.8, 0], 
                opacity: [0, 1, 1, 0],
                x: hb.x,
                y: hb.y,
                rotate: hb.rotation
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute pointer-events-none z-30"
            >
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 fill-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Heart Animation Overlay */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, times: [0, 0.4, 1] }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,1)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button - Floating Heart */}
        <button 
          type="button"
          onClick={onToggleFavorite}
          className={`absolute left-2.5 p-1.5 sm:p-2 rounded-full bg-white/95 shadow-md border border-slate-100 hover:bg-white hover:scale-110 hover:shadow-lg transition-all z-20 ${
            product.imageUrls && product.imageUrls.length > 1 ? 'top-10 sm:top-12' : 'top-2.5'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorite ? 'fill-[#e35914] text-[#e35914]' : 'text-slate-400 hover:text-[#e35914]'}`} />
        </button>

        {/* Floating Glassmorphic Badges */}
        {isVip && (
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 via-[#FFD700] to-amber-600 text-slate-950 border border-amber-300 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg flex items-center gap-1 z-20 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-slate-950 animate-spin fill-slate-950 shrink-0" />
            <span className="tracking-wide font-black">سند VIP ✨</span>
          </div>
        )}

        {isBronze && (
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-white border border-amber-600/30 text-[9px] sm:text-[10px] font-bold px-2.5 py-1 sm:px-3 sm:py-1 rounded-full shadow-md z-20">
            <span>إعلان برونزي 🥉</span>
          </div>
        )}
      </div>

      <div className={`p-2 xs:p-3 flex flex-col justify-between flex-1 gap-1 xs:gap-1.5 bg-white text-right z-10 ${!isList && 'h-[45%] overflow-hidden'}`} dir="rtl">
        <div className="flex flex-col flex-1 shrink min-h-0">
          {/* Main Title & Brand info */}
          <h3 className={`font-bold text-[11px] sm:text-xs text-slate-800 group-hover:text-[#F25A24] transition-colors leading-tight tracking-tight mb-0.5 sm:mb-1 overflow-hidden shrink-0 ${isList ? 'line-clamp-2 h-8 sm:h-10' : 'line-clamp-1 h-4 sm:h-5'}`} dir="auto">
            <HighlightText text={product.title} query={searchQuery} />
          </h3>

          {/* Dynamic Premium Price Tag with hot demand status */}
          <div className="flex items-center justify-between pb-0.5 w-full gap-1 shrink-0">
            <div className="flex items-center gap-0.5">
              <span className="text-[#F25A24] font-black text-sm sm:text-base tracking-tight tabular-nums group-hover:scale-105 transition-transform duration-300 block leading-none">
                {product.price.toLocaleString()}
              </span>
              <span className="text-[#F25A24] text-[9px] font-extrabold font-sans leading-none">د.ت</span>
            </div>
            {(product.views && product.views > 15) ? (
              <span className="flex items-center gap-0.5 bg-red-50 text-red-600 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-100/70 shrink-0">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 fill-red-500 animate-pulse" />
                <span className="hidden sm:inline">مطلوب</span>
              </span>
            ) : isVip ? (
              <span className="flex items-center gap-0.5 bg-amber-50 text-amber-600 text-[8px] font-bold px-1 py-0.5 rounded border border-amber-100/70 shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">مميز</span>
              </span>
            ) : null}
          </div>
          
          {isList && (
            <p className="text-slate-500 text-[10px] sm:text-xs line-clamp-2 leading-relaxed h-7 sm:h-8 overflow-hidden mt-1 shrink-0">
               <HighlightText text={product.description} query={searchQuery} />
            </p>
          )}
        </div>
        
        {/* Footer Meta Alignments */}
        <div className="flex items-center justify-between pt-1 sm:pt-1.5 border-t border-slate-100 mt-0 sm:mt-1 shrink-0">
          <div className="flex flex-col gap-0.5 text-[8px] sm:text-[9px]">
            {/* Location */}
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300" />
              <span className="truncate max-w-[60px] sm:max-w-[70px]">{product.location}</span>
            </div>
            
            {/* Views counter & Quick Like */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-0.5 text-slate-400">
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300" />
                <span>{product.views || 0}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(e);
                }}
                className="flex items-center gap-0.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer group/like"
              >
                <Heart className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-all ${isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-300'}`} />
                <span>{product.likes || 0}</span>
              </button>
            </div>
          </div>

          {/* User Seller Identity Profile Badge */}
          <div className="flex items-center gap-1 sm:gap-1.5">
             <span className="text-[8px] sm:text-[9px] text-slate-500 font-medium truncate max-w-[40px] sm:max-w-[60px]" title={product.sellerName || product.category}>
               {product.sellerName || product.category}
             </span>
             <div className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border bg-slate-50 shrink-0 ${isVip ? 'ring-1 ring-amber-400/80 border-white' : 'border-slate-100'}`}>
               <img 
                 src={product.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                 alt={product.sellerName || ''} 
                 loading="lazy"
                 className="w-full h-full object-cover" 
                 referrerPolicy="no-referrer" 
               />
               <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#10B981] rounded-full border border-white"></div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Use deep comparison for product objects to avoid unnecessary re-renders
export default React.memo(ListingCard, (prevProps, nextProps) => {
  return (
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.views === nextProps.product.views
  );
});
