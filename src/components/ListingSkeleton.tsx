import React from "react";

const ListingSkeleton: React.FC<{ viewMode?: "grid" | "list" }> = ({
  viewMode = "grid",
}) => {
  if (viewMode === "list") {
    return (
      <div className="bg-[#141414] border border-zinc-800/80 rounded-[18px] flex gap-0 overflow-hidden relative w-full h-[120px] sm:h-[135px]">
        {/* Advanced Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] z-10 pointer-events-none" />

        {/* Image Box */}
        <div className="w-32 sm:w-40 h-full bg-zinc-900/80 shrink-0 relative overflow-hidden border-l border-zinc-800/50">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0F0F0F] to-zinc-900 animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1 py-3 px-3.5 flex flex-col justify-between">
          <div className="space-y-2.5 rtl text-right flex flex-col items-end w-full">
            <div className="h-4 bg-zinc-800/80 rounded-md w-full max-w-[90%] animate-pulse" />
            <div className="h-4 bg-zinc-800/80 rounded-md w-full max-w-[60%] animate-pulse" />
          </div>

          <div className="flex justify-between items-end border-t border-zinc-800/80 pt-2 w-full rtl">
            <div className="h-3 bg-zinc-800/60 rounded w-16 animate-pulse" />
            <div className="h-4 bg-zinc-700/80 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-zinc-800/80 rounded-[18px] overflow-hidden relative h-full flex flex-col min-h-0 min-w-0">
      {/* Advanced Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] z-10 pointer-events-none" />

      {/* Image Area */}
      <div className="relative w-full aspect-square bg-[#0A0A0A] overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] to-[#121212] animate-pulse" />

        {/* Heart Skeleton */}
        <div className="absolute top-3 left-3 z-20">
          <div className="w-8 h-8 rounded-full bg-zinc-800/50 animate-pulse border border-white/5" />
        </div>
      </div>

      {/* Details Area */}
      <div className="p-3.5 flex flex-col rtl text-right h-full justify-between gap-3">
        {/* Title Area */}
        <div className="flex flex-col gap-2 w-full items-end mt-1">
          <div className="h-3.5 bg-zinc-800 rounded w-full animate-pulse" />
          <div className="h-3.5 bg-zinc-800 rounded w-3/4 animate-pulse" />
        </div>

        {/* Price Tag Area */}
        <div className="flex flex-col items-end w-full mt-1">
          <div className="h-4.5 bg-zinc-700/60 rounded w-16 animate-pulse" />
        </div>

        {/* Bottom Details */}
        <div className="flex justify-between items-center border-t border-zinc-800/80 pt-2.5 mt-auto">
          <div className="h-2.5 bg-zinc-800/80 rounded w-12 animate-pulse" />
          <div className="h-2.5 bg-zinc-800/80 rounded w-12 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ListingSkeleton;
