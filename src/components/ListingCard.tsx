import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { MapPin, Heart, Eye } from 'lucide-react';
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

export default function ListingCard({ product, onClick, searchQuery = '', isFavorite, onToggleFavorite, viewMode = 'grid' }: ListingCardProps) {
  const [showHeart, setShowHeart] = useState(false);
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

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Secondary capture: Use browser native detail if available for desktop reliability
    if (e.detail === 2) {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      setShowHeart(true);
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
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={isVip ? { y: -6, scale: 1.02 } : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={handleCardClick}
      className={`bg-[#050505] rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group relative w-full ${
        isList 
          ? 'flex flex-col sm:flex-row gap-0 max-w-full' 
          : 'flex flex-col max-w-[290px] xs:max-w-xs sm:max-w-sm md:max-w-none mx-auto'
      } ${
        isVip 
          ? 'border-[#D4AF37]/30 bg-gradient-to-b from-[#0a0905] to-[#020202] shadow-[0_0_20px_rgba(212,175,55,0.06)] hover:border-[#D4AF37]/90 hover:shadow-[0_0_40px_rgba(212,175,55,0.22)]' 
          : isBronze 
            ? 'border-[#d97706]/40 hover:border-[#d97706]/80 hover:shadow-[0_0_20px_rgba(217,119,6,0.08)]' 
            : 'border-gray-850 bg-gradient-to-b from-[#050505] to-[#020202] border-[#1f2937]/50 hover:border-gray-700 shadow-lg'
      }`}
    >
      {/* Golden Shimmer Loop for VIP */}
      {isVip && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl z-20">
          <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 group-hover:animate-shine-sweep" />
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

      {/* Product Image */}
      <div 
        className={`relative overflow-hidden bg-gray-900 shrink-0 select-none ${
        isList 
          ? 'h-48 sm:h-full w-full sm:w-64 sm:order-last' 
          : 'h-44 sm:h-56 w-full'
      }`}>
        <img 
          src={product.imageUrls[0]} 
          alt={product.title} 
          className={`w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-110 ${
            isVip ? 'group-hover:contrast-[1.2] group-hover:brightness-[1.12] group-hover:saturate-[1.15]' : ''
          }`}
          referrerPolicy="no-referrer"
        />
        
        {/* Heart Animation Overlay */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, times: [0, 0.4, 1] }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,1)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
        
        <button 
          type="button"
          onClick={onToggleFavorite}
          className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/85 hover:scale-110 transition-all z-10"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white'}`} />
        </button>

        {isVip && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black text-[10px] font-black tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <span>VIP</span>
            <span className="animate-spin text-amber-800">✦</span>
          </div>
        )}

        {isBronze && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full shadow-lg">
            إعلان برونزي
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-3 relative bg-[#050505]">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="font-bold text-lg sm:text-2xl text-white font-display truncate flex-1 group-hover:text-[#D4AF37] transition-colors">
              <HighlightText text={product.title} query={searchQuery} />
            </h3>
            <p className="text-[#10B981] font-bold text-lg sm:text-2xl font-display shrink-0">{product.price} د.ت</p>
          </div>
          
          <p className="text-gray-300 text-sm line-clamp-3 sm:line-clamp-4 leading-relaxed pr-1">
             <HighlightText text={product.description} query={searchQuery} />
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-800/60 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] sm:text-xs">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] sm:text-xs">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              <span>{product.views || 0} مشاهدة</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(e);
              }}
              className="flex items-center gap-1.5 text-red-400/80 hover:text-red-400 transition-colors text-[10px] sm:text-xs cursor-pointer group/like"
            >
              <Heart className={`w-3.5 h-3.5 transition-all ${isFavorite ? 'text-red-500 fill-red-500' : 'text-red-400 fill-red-500/10 group-hover/like:scale-110'}`} />
              <span className="font-medium underline-offset-4 group-hover/like:underline">{product.likes || 0} إعجاب</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-gray-400">{product.sellerName || product.category}</span>
             <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-700 bg-gray-900">
               <img src={product.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt={product.sellerName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#10B981] rounded-full border border-[#0A0A0A]"></div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

