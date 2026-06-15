import React from 'react';
import { motion } from 'motion/react';
import { Story } from '../types';
import { Sparkles, ChevronLeft, ChevronRight, Crown } from 'lucide-react';

interface VipStoriesRowProps {
  stories: Story[];
  currentUserObj?: any;
  onStoryClick?: (id: string) => void;
  onProfileClick?: () => void;
}

const VipStoriesRow: React.FC<VipStoriesRowProps> = ({ stories, onStoryClick }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const dragDistance = React.useRef(0);

  React.useEffect(() => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      setTimeout(() => {
         scrollRef.current?.children[0]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }, 300);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    dragDistance.current = 0;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    dragDistance.current = Math.abs(x - startX);
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleStoryCardClick = (storyId: string, e: React.MouseEvent) => {
    if (dragDistance.current > 8) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onStoryClick) {
      onStoryClick(storyId);
    }
  };

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 260;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!stories.length) return null;

  return (
    <div className="w-full relative bg-black/10 border border-white/5 rounded-3xl py-2 mb-0.5 select-none group">
      {/* Small elegant title header */}
      <div className="px-4.5 sm:px-6 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span className="text-xs font-black text-gray-100 font-display">بطاقات النخبة VIP</span>
        </div>
        <span className="text-[9px] text-[#D4AF37] font-bold tracking-widest uppercase">Elite Status ✦</span>
      </div>

      {/* Floating navigation controls for desktop */}
      <button
        type="button"
        onClick={() => scrollByAmount('left')}
        className="absolute left-3 top-[50%] -translate-y-1/2 z-30 hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/10 shadow-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
        title="السابق"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => scrollByAmount('right')}
        className="absolute right-3 top-[50%] -translate-y-1/2 z-30 hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/10 shadow-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
        title="التالي"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Stories Horizontal Viewport */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 scroll-smooth overscroll-x-contain items-start pb-4 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`} 
        style={{ touchAction: 'pan-x pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        {stories.map((story, index) => {
          const isVip = story.isVip || index === 0;
          return (
            <motion.div
              key={`${story.id}-${index}`}
              onClick={(e) => handleStoryCardClick(story.id, e)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col shrink-0 snap-start w-[125px] h-[175px] sm:w-[140px] sm:h-[190px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-[3px] shadow-[0_6px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.8)] bg-gradient-to-b from-[#181818] to-[#0a0a0a] group/card ${isVip ? 'border-[#D4AF37]' : 'border-zinc-400'}`}
            >
              {/* Top Image Section (65%) */}
              <div className="relative w-full h-[60%] bg-black/50 overflow-hidden">
                <img 
                  src={story.imageUrls?.[0] || story.imageUrl || 'https://via.placeholder.com/400'} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Subtle Inner Shadow on Image */}
                <div className="absolute inset-0 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] pointer-events-none" />
                
                {/* Elegant VIP Badge - Top Right */}
                <div className={`absolute top-2 right-2 z-10 flex items-center justify-center px-1.5 py-0.5 rounded-md bg-black/60 border shadow-sm ${isVip ? 'border-[#D4AF37]/70' : 'border-zinc-400/70'}`}>
                   <Crown className={`w-2.5 h-2.5 mr-1 opacity-90 ${isVip ? 'text-[#F5D76E]' : 'text-zinc-300'}`} strokeWidth={2.5} />
                   <span className={`text-[8px] font-black tracking-wider ${isVip ? 'text-[#D4AF37]' : 'text-zinc-300'}`}>{isVip ? 'VIP' : 'SILVER'}</span>
                </div>
              </div>

              {/* Card Footer Content (40%) */}
              <div className="relative h-[40%] w-full p-2.5 flex flex-col justify-between z-20 bg-[#0a0a0a]">
                <h3 className="text-[11px] sm:text-[13px] font-bold text-gray-100 leading-snug line-clamp-2">
                  {story.title}
                </h3>
                {story.price && (
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className={`font-black tracking-tight ${isVip ? 'text-[#F5D76E]' : 'text-zinc-200'} text-xs sm:text-sm drop-shadow-sm`}>
                      {Number(story.price).toLocaleString("en-US")}
                    </span>
                    <span className={`text-[9px] font-bold uppercase ${isVip ? 'text-[#D4AF37]' : 'text-zinc-400'}`}>د.ت</span>
                  </div>
                )}
              </div>

              {/* Golden/Silver Shine Effect */}
              {isVip && (
                <motion.div 
                  animate={{ left: ["-100%", "200%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: index * 0.4 }}
                  className="absolute top-0 w-16 h-full bg-gradient-to-r from-transparent via-[#F5D76E]/10 to-transparent skew-x-12 pointer-events-none z-30"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(VipStoriesRow);
