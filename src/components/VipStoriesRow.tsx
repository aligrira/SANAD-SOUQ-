import React from 'react';
import { motion } from 'motion/react';
import { Story } from '../types';
import { Sparkles } from 'lucide-react';

interface VipStoriesRowProps {
  stories: Story[];
  currentUserObj?: any;
  onStoryClick?: (id: string) => void;
  onProfileClick?: () => void;
}

const VipStoriesRow: React.FC<VipStoriesRowProps> = ({ stories, onStoryClick }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      setTimeout(() => {
         scrollRef.current?.children[0]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }, 300);
    }
  }, []);

  if (!stories.length) return null;

  return (
    <div className="w-full relative bg-black/30 border border-white/5 rounded-3xl py-4 mb-4 select-none">
      {/* Small elegant title header */}
      <div className="px-4.5 sm:px-6 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span className="text-xs sm:text-xs font-black text-gray-100 font-display">قصص النخبة VIP</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">اسحب لليسار للمزيد ✦</span>
      </div>

      {/* Stories Horizontal Viewport - Added pb-6 padding to ensure text titles are never cutoff */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar px-4.5 sm:px-6 scroll-smooth overscroll-x-contain items-start pb-6" 
        style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}
      >
        {stories.map((story, index) => {
          const isFirst = index === 0;
          return (
            <motion.div
              key={story.id}
              onClick={() => onStoryClick && onStoryClick(story.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 snap-start w-[84px]"
            >
              <div className="relative flex flex-col items-center">
                {/* Crown Emoji Icon above frame */}
                <div className="absolute -top-3.5 z-30 flex items-center justify-center drop-shadow-lg">
                   <span className="text-lg filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">👑</span>
                </div>

                {/* Outer majestic border container */}
                <div className={`relative w-[84px] h-[120px] rounded-[18px] p-[2.5px] transition-all duration-300 mt-2 ${
                  isFirst 
                    ? 'bg-gradient-to-tr from-[#D4AF37] via-yellow-200 to-[#8B6508] shadow-[0_0_15px_rgba(212,175,55,0.4)] ring-2 ring-[#D4AF37]/40 text-black' 
                    : story.isVip 
                      ? 'bg-gradient-to-tr from-[#D4AF37] via-yellow-300 to-[#997300] shadow-[0_0_8px_rgba(212,175,55,0.25)] text-black' 
                      : 'bg-gradient-to-tr from-gray-300 via-gray-100 to-gray-400 shadow-[0_0_8px_rgba(255,255,255,0.15)] text-black'
                }`}>
                  
                  {/* Image container */}
                  <div className="w-full h-full rounded-[15px] overflow-hidden bg-[#0a0a0a] border border-[#050505] relative z-10">
                    <img 
                      src={(story as any).imageUrls?.[0] || story.imageUrl || story.sellerAvatar || 'https://via.placeholder.com/150'} 
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 opacity-90 hover:opacity-100"
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                    {/* Contrast Gradient bottom overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                  </div>
                  
                  {/* Bottom VIP Badge indicator */}
                  <div className={`absolute -bottom-[9px] left-1/2 -translate-x-1/2 z-20 text-[8px] font-black px-2 py-0.5 border border-[#050505] rounded-full whitespace-nowrap shadow-lg flex items-center justify-center leading-tight
                     ${(story.isVip || isFirst) 
                       ? 'bg-gradient-to-r from-[#D4AF37] to-[#997300] text-black ring-1 ring-white/10' 
                       : 'bg-gradient-to-r from-gray-200 to-gray-400 text-black ring-1 ring-white/10'
                     }`
                  }>
                     {(story.isVip || isFirst) ? 'VIP' : 'قصتي'}
                  </div>
                </div>
              </div>
              
              {/* Story Ad Title underneath - spacious and break-words configuration to prevent truncation */}
              <span 
                className="text-[10px] sm:text-[11px] text-gray-200 w-full text-center px-1 font-bold leading-normal mt-2.5 drop-shadow-md line-clamp-2 break-words text-ellipsis overflow-hidden h-[32px]" 
                dir="auto" 
                title={story.title}
              >
                  {story.title}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(VipStoriesRow);
