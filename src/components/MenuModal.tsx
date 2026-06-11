import React from 'react';
import { X, MessageCircle, ShoppingBag, Shirt, Baby, Car, Smartphone, Home, Coffee, PawPrint, Package, Grid, User, Star, Droplets, ChevronLeft } from 'lucide-react';

interface MenuModalProps {
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export default function MenuModal({ onClose, onSelectCategory }: MenuModalProps) {
  const sections = [
    { name: 'الكل', icon: <Grid className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-indigo-400 to-indigo-600", shadow: "shadow-[0_0_15px_rgba(99,102,241,0.5)]" },
    { name: 'ملابس رجال', icon: <Shirt className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-blue-400 to-blue-600", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]" },
    { name: 'ملابس نساء', icon: <User className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-pink-400 to-pink-600", shadow: "shadow-[0_0_15px_rgba(236,72,153,0.5)]" },
    { name: 'ملابس اطفال', icon: <Baby className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-green-400 to-green-600", shadow: "shadow-[0_0_15px_rgba(34,197,94,0.5)]" },
    { name: 'ماكياج و اكسسوارات', icon: <Star className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-rose-400 to-rose-600", shadow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]" },
    { name: 'عطورات', icon: <Droplets className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600", shadow: "shadow-[0_0_15px_rgba(217,70,239,0.5)]" },
    { name: 'عقارات', icon: <Home className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-amber-400 to-amber-600", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]" },
    { name: 'سيارات و دراجات', icon: <Car className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-red-400 to-red-600", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.5)]" },
    { name: 'إلكترونيات', icon: <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-cyan-400 to-cyan-600", shadow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]" },
    { name: 'أثاث', icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-orange-400 to-orange-600", shadow: "shadow-[0_0_15px_rgba(249,115,22,0.5)]" },
    { name: 'أدوات منزلية', icon: <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600", shadow: "shadow-[0_0_15px_rgba(234,179,8,0.5)]" },
    { name: 'حيوانات', icon: <PawPrint className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-teal-400 to-teal-600", shadow: "shadow-[0_0_15px_rgba(20,184,166,0.5)]" },
    { name: 'تحف و هدايا', icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-purple-400 to-purple-600", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]" },
    { name: 'اخرى', icon: <Grid className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-gradient-to-br from-slate-400 to-slate-600", shadow: "shadow-[0_0_15px_rgba(100,116,139,0.5)]" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-5 sm:p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#D4AF37]/30 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF3C5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
          الأقسام الرئيسية
        </h2>
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
        <button 
          onClick={onClose} 
          className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-black rounded-full transition-all border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-20 pr-1 sm:pr-2 z-10">
        {sections.map((section) => (
          <button 
            key={section.name} 
            onClick={() => {
               if (onSelectCategory) {
                 onSelectCategory(section.name);
               }
               onClose();
            }}
            className="w-full flex items-center justify-between bg-gradient-to-b from-[#111] to-[#000] border border-[#D4AF37]/50 border-b-[4px] border-b-[#947A26] hover:border-b-[#D4AF37] shadow-[0_6px_15px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 hover:-translate-y-1 active:border-b-[1px] active:translate-y-[3px] transition-all group overflow-hidden relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0 pointer-events-none" />
            
            <div className="flex items-center gap-3 sm:gap-4 z-10 relative">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${section.bgColor} shadow-inner border border-white/20 transition-all duration-300 relative group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                <div className="scale-75 sm:scale-90">
                  {section.icon}
                </div>
              </div>
              <span className="text-base sm:text-lg font-bold font-display text-[#D4AF37] drop-shadow-[0_1px_2px_rgba(0,0,0,1)] tracking-wide group-hover:text-white transition-colors">
                {section.name}
              </span>
            </div>
            
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black border border-[#D4AF37]/40 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] z-10 relative group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/80 transition-all">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] drop-shadow-md group-hover:scale-110 transition-transform" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
        <a
          href="https://wa.me/21692942482"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full relative flex items-center justify-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3C5] to-[#D4AF37] text-black rounded-2xl font-black text-lg sm:text-xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(212,175,55,0.5),inset_0_2px_5px_rgba(255,255,255,0.8)] overflow-hidden border border-[#D4AF37]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm" />
          <span className="drop-shadow-sm font-display tracking-widest">تواصل معنا</span>
        </a>
      </div>
    </div>
  );
}
