import { motion } from 'motion/react';
import { Product } from '../types';
import { MapPin, Heart } from 'lucide-react';
import React, { useState } from 'react';

interface ListingCardProps {
  key?: React.Key;
  product: Product;
  onClick: () => void;
}

export default function ListingCard({ product, onClick }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const isVip = product.plan === 'vip' || product.isVip;
  const isBronze = product.plan === 'bronze';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`bg-[#050505] rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group relative max-w-[290px] xs:max-w-xs sm:max-w-sm md:max-w-none mx-auto w-full ${
        isVip 
          ? 'border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.06)] hover:border-[#D4AF37]/80 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)]' 
          : isBronze 
            ? 'border-[#d97706]/40 hover:border-[#d97706]/80 hover:shadow-[0_0_20px_rgba(217,119,6,0.08)]' 
            : 'border-gray-850 bg-gradient-to-b from-[#050505] to-[#020202] border-[#1f2937]/50 hover:border-gray-700 shadow-lg'
      }`}
    >
      {/* Golden Shimmer Loop for VIP */}
      {isVip && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl z-20">
          <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 group-hover:animate-shine-sweep" />
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-gray-900">
        <img 
          src={product.imageUrls[0]} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
        
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
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
      <div className="p-4 flex flex-col gap-2 relative bg-[#050505]">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-sm sm:text-base text-white font-display truncate flex-1 group-hover:text-[#D4AF37] transition-colors">{product.title}</h3>
          <p className="text-[#10B981] font-bold text-sm sm:text-base font-display shrink-0">{product.price} د.ت</p>
        </div>
        
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 min-h-[36px] leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-800/50">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-gray-400">{product.sellerName || product.category}</span>
             <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-700 bg-gray-900">
               <img src={product.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt={product.sellerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#10B981] rounded-full border border-[#0A0A0A]"></div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
