import { motion } from 'motion/react';
import { Product } from '../types';
import { MapPin, Heart, Crown, Award, Clock } from 'lucide-react';
import React from 'react';
import { HighlightText } from './HighlightText';
import { useInView } from 'react-intersection-observer';
import ListingSkeleton from './ListingSkeleton';

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
  const { ref, inView } = useInView({
    triggerOnce: true, // only render once visible
    rootMargin: '250px 0px', // load a bit before scrolling into view to avoid blanks
  });

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

  const titleColor = isVip 
    ? 'text-[#FFF3C5] drop-shadow-[0_0_2px_rgba(212,175,55,0.8)]' 
    : isBronze 
      ? 'text-white' 
      : 'text-white';

  const priceColor = isVip 
    ? 'text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' 
    : isBronze 
      ? 'text-slate-300 drop-shadow-[0_0_5px_rgba(148,163,184,0.4)]' 
      : 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.4)]';

  const subColor = isVip
    ? 'text-[#D4AF37]/80 bg-yellow-400/10 border-yellow-200/20'
    : isBronze
      ? 'text-slate-300/90 bg-slate-400/10 border-slate-300/20'
      : 'text-emerald-400/80 bg-emerald-400/10 border-emerald-400/20';

  if (!inView) {
    return (
      <div ref={ref} className={isList ? 'w-full' : 'w-full h-full'}>
        <ListingSkeleton viewMode={viewMode} />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      onClick={() => onClick(product.id, product)}
      className={`premium-card overflow-hidden transition-all duration-300 cursor-pointer group w-full bg-[#0a0a0a] rounded-3xl relative flex flex-col ${borderClass} ${
        isList ? 'flex-row max-w-full' : 'h-full min-h-0 min-w-0'
      }`}
    >
      {/* Dynamic Membership Badge Overlay on Product image */}
      <div className="absolute top-2.5 right-2.5 z-20">
        <span className={`text-[8.5px] sm:text-[9.5px] px-2.5 py-1 rounded-full whitespace-nowrap shadow-lg tracking-tight leading-none flex items-center gap-1 font-sans ${badgeBg}`}>
          {badgeText}
        </span>
      </div>

      {/* Image Container */}
      <div 
        className={`relative overflow-hidden shrink-0 flex items-center justify-center bg-black ${
          isList 
            ? 'w-28 sm:w-32 h-28 sm:h-32' 
            : 'w-full aspect-square'
        }`}
      >
        <img 
          src={product.imageUrls?.[0] || 'https://via.placeholder.com/400'} 
          alt={product.title} 
          loading="lazy"
          className="w-full h-full object-contain select-none group-hover:scale-110 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      </div>

      {/* Card Details Content */}
      <div className="bg-gradient-to-b from-[#0a0a0a] to-[#040404] p-2.5 sm:p-3 flex flex-col justify-between flex-1 gap-1 border-t border-white/[0.05] relative z-10">
        <div className="flex flex-col gap-1">
          {/* Ad Title */}
          <h3 className={`font-bold text-[11.5px] sm:text-[13px] leading-[1.3] line-clamp-2 text-right dir-rtl ${titleColor}`}>
            <HighlightText text={product.title} query={searchQuery} />
          </h3>
          
          {/* Price Tag with relative currency symbol formatting */}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className={`${priceColor} opacity-80 text-[9px] font-bold`}>د.ت</span>
            <span className={`font-black text-[14px] sm:text-[16px] font-display tracking-tight text-right ${priceColor}`}>
              {Number(product.price).toLocaleString('en-US')}
            </span>
          </div>
        </div>
        
        {/* Ad Location and Relative Date Display */}
        <div className="flex flex-col gap-1.5 text-gray-400 text-[8.5px] border-t border-white/[0.08] pt-1.5 mt-1.5">
          <div className="flex items-center justify-between gap-1 w-full">
            
            {/* Location */}
            <div className="flex items-center gap-1 opacity-90 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400 group-hover:text-amber-500 transition-colors" />
              <span className="font-semibold truncate text-gray-300 group-hover:text-white transition-colors">{product.location}</span>
            </div>

            {/* Relative Date */}
            {product.createdAt && (
              <div className="flex items-center gap-1 shrink-0 text-gray-500">
                <Clock className="w-3 h-3 group-hover:text-gray-400 transition-colors" />
                <span className="font-medium text-[9px] group-hover:text-gray-300 transition-colors">{getRelativeTime(product.createdAt)}</span>
              </div>
            )}

          </div>

          {/* Favorites/Likes Count */}
          <div className="flex items-center justify-between pt-1">
            {/* Subcategory Label if available as premium detail */}
            <span className={`text-[9px] font-bold max-w-[65%] truncate px-2 py-0.5 rounded-md border ${subColor}`}>
              {product.subCategory || product.category || 'عرض متميز'}
            </span>

            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id, e); }}
              className="flex items-center gap-1.5 select-none bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.1] h-6 px-2.5 rounded-full transition-all shrink-0 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'}`} />
              <span className="text-gray-300 font-bold text-[10px]">{product.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ListingCard);
