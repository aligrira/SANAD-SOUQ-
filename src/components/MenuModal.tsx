import React from 'react';
import { X, MessageCircle, ShoppingBag, Shirt, Baby, Car, Smartphone, Home, Coffee, PawPrint, Package, Grid, User, Star, Droplets, ChevronLeft } from 'lucide-react';

interface MenuModalProps {
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export default function MenuModal({ onClose, onSelectCategory }: MenuModalProps) {
  const sections = [
    { name: 'الكل', icon: <Grid className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'ملابس رجال', icon: <Shirt className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'ملابس نساء', icon: <User className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'ملابس اطفال', icon: <Baby className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'ماكياج و اكسسوارات', icon: <Star className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'عطورات', icon: <Droplets className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'عقارات', icon: <Home className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'سيارات و دراجات', icon: <Car className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'إلكترونيات', icon: <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15_rgba(16,185,129,0.2)]" },
    { name: 'أثاث', icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'أدوات منزلية', icon: <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'حيوانات', icon: <PawPrint className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'تحف و هدايا', icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
    { name: 'اخرى', icon: <Grid className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, bgColor: "bg-slate-900", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col p-5 sm:p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            الأقسام الرئيسية
          </h2>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">سوق سند الملكي</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-2.5 bg-slate-900 border border-emerald-500/30 rounded-2xl text-emerald-400 hover:text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-lg active:scale-90"
          title="إغلاق"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-28 pr-1 z-10 no-scrollbar">
        {sections.map((section) => (
          <button 
            key={section.name} 
            onClick={() => {
               if (onSelectCategory) {
                 onSelectCategory(section.name);
               }
               onClose();
            }}
            className="w-full flex items-center justify-between bg-slate-900/50 border border-white/5 hover:border-emerald-500/50 hover:bg-slate-800 shadow-xl rounded-2xl p-4 sm:p-5 transition-all group overflow-hidden"
          >
            <div className="flex items-center gap-5 z-10 relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-slate-800 border border-white/5 group-hover:border-emerald-500/30 transition-all duration-300">
                {section.icon}
              </div>
              <span className="text-lg sm:text-xl font-black text-gray-200 group-hover:text-white transition-all">
                {section.name}
              </span>
            </div>
            
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500 transition-all">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 group-hover:text-white transition-all" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-base-black via-base-black/90 to-transparent z-20">
        <button
          onClick={() => window.open(`https://wa.me/21692942482?text=${encodeURIComponent('مرحباً إدارة سوق سند، لدي استفسار وأود التواصل معكم.')}`, '_blank')}
          className="w-full flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98]"
        >
          <span className="text-2xl">💬</span>
          <span>تواصل مع الإدارة</span>
        </button>
      </div>
    </div>
  );
}
