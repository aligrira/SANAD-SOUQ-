import { motion } from 'motion/react';
import { Product } from '../types';
import { MapPin, Heart, Eye, Crown } from 'lucide-react';
import React from 'react';
import { HighlightText } from './HighlightText';

interface ListingCardProps {
  product: Product;
  onClick: () => void;
  searchQuery?: string;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  viewMode?: 'grid' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ product, onClick, searchQuery = '', isFavorite, onToggleFavorite, viewMode = 'grid' }) => {
  const isVip = product.plan === 'vip' || product.isVip;
  const isBronze = product.plan === 'bronze';
  const isList = viewMode === 'list';

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`premium-card overflow-hidden transition-all duration-200 cursor-pointer group w-full bg-white border border-gray-200 rounded-[8px] hover:border-[#c5a059] ${
        isList 
          ? 'flex max-w-full' 
          : 'flex flex-col w-full'
      }`}
    >
      <div 
        className={`relative overflow-hidden shrink-0 flex items-center justify-center p-0 ${
        isList 
          ? 'h-32 w-32' 
          : 'h-48 w-full block'
      }`}>
        <img 
          src={product.imageUrls?.[0] || 'https://via.placeholder.com/400'} 
          alt={product.title} 
          loading="lazy"
          className={`w-full h-full object-cover ${isList ? 'rounded-r-[8px]' : 'rounded-t-[8px]'}`}
          referrerPolicy="no-referrer"
        />
        
        {isVip && (
          <div className="absolute top-2 right-2 flex flex-col items-center gap-0 z-20">
            <Crown className="w-7 h-7 text-[#D4AF37] fill-[#D4AF37] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
            <span className="text-red-500 text-[10px] font-black tracking-tighter drop-shadow-sm shadow-black">
              VIP
            </span>
          </div>
        )}
      </div>

      <div className={`p-3 flex flex-col justify-between flex-1 gap-2`}>
        <div>
          <h3 className="font-bold text-sm text-gray-900 hover:text-[#c5a059] truncate mb-1">
            <HighlightText text={product.title} query={searchQuery} />
          </h3>
          
          <div className="flex items-center gap-1.5 mb-2 mt-1">
            <span className="text-[#c5a059] font-black text-lg">
              {product.price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-xs">د.ت</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-gray-500 text-[10px]">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{product.location}</span>
          </div>
          
          <button 
            onClick={onToggleFavorite}
            className="flex items-center gap-1 group/like"
          >
            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-400'}`} />
            <span className="text-gray-500">{product.likes || 0}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ListingCard);
