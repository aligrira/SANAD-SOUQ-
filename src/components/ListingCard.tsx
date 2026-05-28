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
      className={`premium-card overflow-hidden transition-all duration-300 cursor-pointer group w-full ${
        isList 
          ? 'flex max-w-full' 
          : 'flex flex-col w-full'
      }`}
    >
      <div 
        className={`relative overflow-hidden shrink-0 flex items-center justify-center p-0 bg-[#0c0c0c] ${
        isList 
          ? 'h-32 w-32' 
          : 'w-full aspect-[4/5]'
      }`}>
        <img 
          src={product.imageUrls?.[0] || 'https://via.placeholder.com/400'} 
          alt={product.title} 
          loading="lazy"
          className="w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
        
        {isVip && (
          <div className="absolute top-2 right-2 flex flex-col items-center gap-0 z-20 bg-black/60 backdrop-blur rounded-lg p-1">
            <Crown className="w-5 h-5 text-[#c5a059]" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-1 gap-2">
        <div>
          <h3 className="font-bold text-sm text-gray-100 group-hover:text-[#c5a059] leading-tight line-clamp-2 min-h-[40px] transition-colors">
            <HighlightText text={product.title} query={searchQuery} />
          </h3>
          
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[#c5a059] font-bold text-lg font-display tracking-wide">
              {product.price.toLocaleString()}
            </span>
            <span className="text-gray-400 text-xs font-medium">د.ت</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-gray-500 text-[10px] mt-2 border-t border-gray-800/50 pt-3">
          <div className="flex items-center gap-1.5 opacity-80">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{product.location}</span>
          </div>
          
          <button 
            onClick={onToggleFavorite}
            className="flex items-center gap-1.5 group/like bg-gray-900/50 hover:bg-gray-800/80 px-2 py-1 rounded-full transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform group-hover/like:scale-110 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/like:text-red-400'}`} />
            <span className="text-gray-400 font-medium">{product.likes || 0}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ListingCard);
