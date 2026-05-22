import { motion } from 'motion/react';
import { Story } from '../types';
import { ShoppingBag } from 'lucide-react';

interface VipStoriesRowProps {
  stories: Story[];
  onStoryClick?: (id: string) => void;
}

export default function VipStoriesRow({ stories, onStoryClick }: VipStoriesRowProps) {
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
      
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1.5 pt-1 -mx-4 px-4" style={{ touchAction: 'pan-x' }}>
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            onClick={() => onStoryClick && onStoryClick(story.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0"
          >
            <div className="relative w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-[#D4AF37] via-[#FFD700] to-[#F3E5AB] animate-rainbow-glow">
              <div className="w-full h-full rounded-[14px] border-2 border-[#020806] overflow-hidden bg-gray-900 relative">
                <img 
                  src={story.imageUrl || story.sellerAvatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150'} 
                  alt={story.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {story.isVip && (
                   <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/10 flex flex-col items-center justify-end pb-2">
                       <span className="bg-[#D4AF37] text-[#020806] text-[9px] font-black px-2 py-0.5 rounded-md select-none shadow-[0_0_12px_rgba(212,175,55,0.9)] border border-white/20">VIP</span>
                   </div>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-300 font-medium truncate w-20 text-center" title={story.title || story.sellerName}>
                {story.title || story.sellerName}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
