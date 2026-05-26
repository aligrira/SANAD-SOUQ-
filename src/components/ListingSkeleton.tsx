import React from 'react';

const ListingSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-[#050505] border border-gray-800 rounded-3xl p-4 flex gap-4 animate-pulse">
        <div className="w-32 h-32 bg-gray-800 rounded-2xl shrink-0" />
        <div className="flex-1 py-2 space-y-4">
          <div className="h-4 bg-gray-800 rounded w-3/4" />
          <div className="h-3 bg-gray-800 rounded w-1/2" />
          <div className="h-6 bg-gray-800 rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] border border-gray-800 rounded-3xl overflow-hidden animate-pulse">
      <div className="relative aspect-[4/5] bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
           <div className="h-6 bg-gray-800 rounded w-1/3" />
           <div className="h-8 w-8 bg-gray-800 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ListingSkeleton;
