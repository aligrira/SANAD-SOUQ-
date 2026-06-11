import React from 'react';

const ListingSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-3xl p-3 flex gap-3 overflow-hidden relative premium-card w-full">
        {/* Advanced Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] z-10 pointer-events-none" />
        
        {/* Image Box */}
        <div className="w-28 sm:w-32 h-28 sm:h-32 bg-zinc-900/80 rounded-2xl shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 animate-pulse" />
        </div>
        
        {/* Content */}
        <div className="flex-1 py-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="h-3.5 bg-zinc-800/80 rounded-md w-4/5 animate-pulse" />
            <div className="h-3.5 bg-zinc-800/80 rounded-md w-2/5 animate-pulse" />
          </div>
          
          <div className="flex justify-between items-end">
            <div className="h-3 bg-zinc-800/60 rounded w-1/3 animate-pulse" />
            <div className="flex flex-col items-end gap-1.5 ">
              <div className="h-2.5 bg-zinc-800/60 rounded w-6 animate-pulse" />
              <div className="h-4 bg-zinc-700 rounded w-16 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-3xl overflow-hidden relative h-full flex flex-col min-h-0 min-w-0 premium-card">
      {/* Advanced Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] z-10 pointer-events-none" />
      
      {/* Image Area */}
      <div className="relative w-full aspect-square bg-zinc-900 overflow-hidden shrink-0">
         <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-zinc-900 animate-pulse" />
         
         {/* Badge Skeleton */}
         <div className="absolute top-2.5 right-2.5 z-20">
           <div className="h-4 w-20 bg-zinc-800/80 rounded-full animate-pulse border border-white/5" />
         </div>
      </div>
      
      {/* Details Area */}
      <div className="bg-[#050505] p-2 flex flex-col justify-between flex-1 gap-1 border-t border-white/[0.05]">
        <div className="flex flex-col gap-1.5 mt-1">
          {/* Title Lines */}
          <div className="h-3 bg-zinc-800 rounded w-11/12 ml-auto animate-pulse" />
          <div className="h-3 bg-zinc-800 rounded w-2/3 ml-auto animate-pulse" />
        </div>
        
        {/* Price Tag */}
        <div className="flex flex-col items-end gap-1 mt-2">
          <div className="h-4 bg-zinc-700 rounded w-1/2 animate-pulse" />
        </div>
        
        {/* Bottom Details */}
        <div className="flex flex-col gap-1.5 border-t border-zinc-800/50 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <div className="h-2.5 bg-zinc-800/80 rounded w-1/4 animate-pulse" />
            <div className="h-2.5 bg-zinc-800/80 rounded w-1/4 animate-pulse" />
          </div>
          
          <div className="flex items-center justify-between mt-1">
             <div className="h-4 bg-zinc-800 rounded-md w-16 animate-pulse" />
             <div className="h-6 bg-zinc-800 rounded-full w-10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingSkeleton;
