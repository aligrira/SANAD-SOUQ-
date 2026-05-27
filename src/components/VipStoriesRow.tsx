import { motion } from 'motion/react';
import { Story } from '../types';
import { ShoppingBag, User } from 'lucide-react';

interface VipStoriesRowProps {
  stories: Story[];
  currentUserObj?: any;
  onStoryClick?: (id: string) => void;
  onProfileClick?: () => void;
}

export default function VipStoriesRow({ stories, currentUserObj, onStoryClick, onProfileClick }: VipStoriesRowProps) {
  if (!stories.length) return null;

  return (
    <div className="mb-0.5 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-3 mb-1 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-black text-white font-display flex items-center justify-center gap-2.5 w-full sm:w-auto drop-shadow-[0_4px_3px_rgba(212,175,55,0.4)]">
          <ShoppingBag className="w-6.5 h-6.5 text-[#D4AF37]" />
          نخبة <span className="text-gradient-gold">سند</span>
          <ShoppingBag className="w-6.5 h-6.5 text-[#D4AF37]" />
        </h2>
        <span className="text-[11px] text-gray-400 bg-[#050505] px-3.5 py-1 rounded-full border border-gray-800 tracking-wide text-center">حصرية للمشتركين VIP</span>
      </div>
      
      <div className="flex gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 scroll-smooth overscroll-x-contain" style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}>
        
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            onClick={() => onStoryClick && onStoryClick(story.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] vip-image-border">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 bg-red-600/95 text-white text-[8px] font-bold px-1.5 py-[1px] border border-[#D4AF37] shadow-[0_0_5px_rgba(212,175,55,0.8)] rounded-sm whitespace-nowrap">
                الملكي
              </div>
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 relative">
                <img 
                  src={(story as any).imageUrls?.[0] || story.imageUrl || story.sellerAvatar || 'https://via.placeholder.com/150'} 
                  alt={story.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {story.isVip && (
                   <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-end pb-1">
                       <span className="bg-[#c5a059] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">VIP</span>
                   </div>
                )}
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-300 font-medium w-20 sm:w-24 text-center px-0.5 line-clamp-2 leading-[1.2]" dir="auto" style={{ minHeight: '2.4em', wordBreak: 'break-word' }} title={story.title || story.sellerName}>
                {story.title || story.sellerName}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
