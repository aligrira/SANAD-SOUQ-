import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Globe, Search } from 'lucide-react';

interface StateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  regions: string[];
}

export default function StateModal({ isOpen, onClose, selectedRegion, setSelectedRegion, regions }: StateModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when Bottom Sheet is open to prevent background movement
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset search query when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter regions with fuzzy and smooth matching
  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return regions;
    const query = searchQuery.trim().toLowerCase();
    return regions.filter((region) => {
      const displayRegion = region === 'الكل' ? 'كل الولايات' : region;
      return displayRegion.toLowerCase().includes(query) || region.toLowerCase().includes(query);
    });
  }, [regions, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Elegant Blurred Dynamic Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[500] bg-black/75 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Premium Bottom Sheet */}
          <div className="fixed inset-0 z-[501] pointer-events-none flex items-end justify-center" dir="rtl">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320, mass: 0.8 }}
              className="bg-[#050505] w-full max-w-lg rounded-t-[32px] border-t border-x border-[#D4AF37]/35 shadow-[0_-15px_40px_rgba(0,0,0,0.85)] flex flex-col pointer-events-auto h-[80vh] sm:h-[70vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle Bar */}
              <div className="w-16 h-1.5 bg-zinc-800 rounded-full mx-auto my-3 shrink-0 opacity-70 cursor-pointer hover:bg-zinc-700 transition" onClick={onClose} />

              {/* Header Context */}
              <div className="px-6 pb-4 border-b border-[#D4AF37]/15 flex justify-between items-center bg-[#050505] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/25 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black font-display text-white tracking-tight">اختر الولاية</h2>
                    <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest opacity-80">فلترة جغرافية ذكية</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 bg-zinc-950 border border-zinc-800 rounded-full text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all cursor-pointer shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Advanced Search Input Bar */}
              <div className="px-6 py-3.5 bg-black/30 border-b border-zinc-900/40 shrink-0 relative">
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center pr-1 pointer-events-none">
                    <Search className="h-4 w-4 text-zinc-500" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن ولاية أو منطقة..."
                    className="w-full pl-4 pr-10 py-2.5 bg-zinc-950/90 text-white text-xs rounded-2xl border border-zinc-800/80 focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder-zinc-500 font-bold"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 left-3 flex items-center pl-1 text-zinc-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content / Scrollable List Section */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar bg-black/40">
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((region) => {
                    const isSelected = selectedRegion === region;
                    return (
                      <button
                        key={region}
                        onClick={() => {
                          setSelectedRegion(region);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between p-1 rounded-2xl transition-all duration-300 relative group overflow-hidden border ${
                          isSelected
                            ? 'bg-gradient-to-l from-zinc-900 to-black border-[#D4AF37]/90 shadow-[0_8px_25px_-5px_rgba(212,175,55,0.25)]'
                            : 'bg-zinc-950/70 border-zinc-950 hover:border-[#D4AF37]/30 hover:bg-zinc-900/40'
                        }`}
                      >
                        {/* Selected bar indicator */}
                        {isSelected && (
                          <motion.div 
                            layoutId="sheet-nav-bar-active"
                            className="absolute left-3.5 top-3.5 bottom-3.5 w-1 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"
                          />
                        )}

                        <div className="flex w-full items-center justify-between px-4 py-2 relative z-10">
                          {/* Text Info */}
                          <div className="flex flex-col text-right">
                            <span className={`text-[15px] font-black tracking-wide transition-colors ${
                              isSelected ? 'text-[#D4AF37]' : 'text-zinc-200 group-hover:text-[#D4AF37]'
                            }`}>
                              {region === 'الكل' ? 'كل الولايات' : region}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] text-[#D4AF37]/80 font-black uppercase tracking-wider mt-0.5">محدد حالياً</span>
                            )}
                          </div>

                          {/* Icon Container */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                            isSelected 
                              ? 'bg-[#D4AF37] border-[#fff2ba] shadow-[0_4px_12px_rgba(212,175,55,0.4)]' 
                              : 'bg-zinc-900/60 border-zinc-800/80 group-hover:border-[#D4AF37]/40'
                          }`}>
                            {region === 'الكل' ? (
                              <Globe className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-[#D4AF37]'}`} />
                            ) : (
                              <MapPin className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-[#D4AF37]'}`} />
                            )}
                          </div>
                        </div>

                        {/* Subtle glossy sheen */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                    <MapPin className="w-10 h-10 text-zinc-600 mb-2 stroke-[1.5]" />
                    <p className="text-xs font-bold">لم نجد أي ولاية تطابق هذا البحث</p>
                  </div>
                )}
              </div>

              {/* Safe area shadow bottom overlay */}
              <div className="h-6 bg-gradient-to-t from-[#050505] to-transparent shrink-0 pointer-events-none absolute bottom-0 left-0 right-0 z-10" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
