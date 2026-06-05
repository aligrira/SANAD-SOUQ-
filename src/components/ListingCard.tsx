import { motion } from 'motion/react';
import { Product } from '../types';
import { MapPin, Heart, Crown, Award, Clock } from 'lucide-react';
import React from 'react';
import { HighlightText } from './HighlightText';

interface ListingCardProps {
  product: Product;
  onClick: (id: string, product: Product) => void;
  searchQuery?: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  viewMode?: 'grid' | 'list';
}

const getRelativeTime = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'الآن';
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `منذ ${diffMins} د`;
    if (diffHours < 24) return `منذ ${diffHours} س`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 30) return `منذ ${diffDays} ي`;
    return date.toLocaleDateString('ar-TN', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

const ListingCard: React.FC<ListingCardProps> = ({ 
  product, 
  onClick, 
  searchQuery = '', 
  isFavorite, 
  onToggleFavorite, 
  viewMode = 'grid' 
}) => {
  const isVip = product.plan === 'vip' || product.isVip;
  const isBronze = product.plan === 'bronze';
  const isList = viewMode === 'list';

  // Aesthetic adjustments matching each subscription level
  const borderClass = isVip 
    ? 'vip-border' 
    : isBronze 
      ? 'bronze-border' 
      : 'free-border';

  const badgeText = isVip 
    ? '👑 ذهبي VIP' 
    : isBronze 
      ? '🥉 برونزي متميز' 
      : '🟢 إعلان مجاني';

  const badgeBg = isVip 
    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F1D] text-black border border-yellow-200/50 font-black shadow-[0_2px_8px_rgba(212,175,55,0.4)]' 
    : isBronze 
      ? 'bg-gradient-to-r from-gray-400 to-slate-500 text-white border border-slate-300/40 font-bold shadow-[0_2px_6px_rgba(148,163,184,0.3)]' 
      : 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold';

  const priceColor = isVip 
    ? 'text-[#D4AF37]' 
    : isBronze 
      ? 'text-amber-500' 
      : 'text-emerald-400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(product.id, product)}
      className={`premium-card overflow-hidden transition-all duration-300 cursor-pointer group w-full bg-[#0a0a0a] rounded-3xl relative flex flex-col ${borderClass} ${
        isList ? 'flex-row max-w-full' : 'h-full min-h-0 min-w-0'
      }`}
    >
      {/* Dynamic Membership Badge Overlay on Product image */}
      <div className="absolute top-2.5 right-2.5 z-20">
        <span className={`text-[8.5px] sm:text-[9.5px] px-2.5 py-1 rounded-full whitespace-nowrap shadow-md tracking-tight leading-none flex items-center gap-1 font-sans ${badgeBg}`}>
          {badgeText}
        </span>
      </div>

      {/* Image Container - Strictly aspect-square */}
      <div 
        className={`relative overflow-hidden shrink-0 flex items-center justify-center bg-black/50 ${
          isList 
            ? 'w-28 sm:w-32 h-28 sm:h-32' 
            : 'w-full aspect-square'
        }`}
      >
        <img 
          src={product.imageUrls?.[0] || 'https://via.placeholder.com/400'} 
          alt={product.title} 
          loading="lazy"
          className="w-full h-full object-cover object-center select-none group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
      </div>

      {/* Card Details Content */}
      <div className="bg-[#050505] p-3 sm:p-4 flex flex-col justify-between flex-1 gap-2 border-t border-white/[0.05]">
        <div className="space-y-1">
          {/* Ad Title */}
          <h3 className="font-extrabold text-[12px] sm:text-[13px] text-gray-100 group-hover:text-white leading-normal line-clamp-2 transition-colors text-right font-sans">
            <HighlightText text={product.title} query={searchQuery} />
          </h3>
          
          {/* Price Tag with relative currency symbol formatting */}
          <div className="flex items-center justify-end gap-1 pt-1">
            <span className="text-gray-500 text-[10px] font-semibold">د.ت</span>
            <span className={`font-black text-sm sm:text-base font-display tracking-tight text-right ${priceColor}`}>
              {Number(product.price).toLocaleString('en-US')}
            </span>
          </div>
        </div>
        
        {/* Ad Location and Relative Date Display */}
        <div className="flex flex-col gap-1.5 text-gray-400 text-[10px] border-t border-white/[0.04] pt-2 mt-1">
          <div className="flex items-center justify-between gap-1 w-full">
            
            {/* Location */}
            <div className="flex items-center gap-1 opacity-90 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              <span className="font-semibold truncate text-gray-300">{product.location}</span>
            </div>

            {/* Relative Date */}
            {product.createdAt && (
              <div className="flex items-center gap-1 shrink-0 text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="font-medium text-[9px]">{getRelativeTime(product.createdAt)}</span>
              </div>
            )}

          </div>

          {/* Favorites/Likes Count */}
          <div className="flex items-center justify-between pt-1">
            {/* Subcategory Label if available as premium detail */}
            <span className="text-[9px] text-[#D4AF37]/80 font-bold max-w-[65%] truncate bg-yellow-400/5 px-2 py-0.5 rounded-md border border-yellow-200/5">
              {product.subCategory || product.category || 'عرض متميز'}
            </span>

            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id, e); }}
              className="flex items-center gap-1.5 select-none bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/[0.05] h-6 px-2.5 rounded-full transition-colors shrink-0 cursor-pointer"
            >
              <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              <span className="text-gray-300 font-bold text-[10px]">{product.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ListingCard);
