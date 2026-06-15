import React from 'react';
import { motion } from 'motion/react';
import { X, Grid, Shirt, User, Baby, Star, Droplets, Home, Car, Smartphone, Package, Coffee, PawPrint, Boxes } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onClose: () => void;
}


export default function Sidebar({ selectedCategory, setSelectedCategory, onClose }: SidebarProps) {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const menuItems = [
    { name: 'الكل', icon: <Grid className="w-5 h-5 text-emerald-400" /> },
    { name: 'ملابس رجال', icon: <Shirt className="w-5 h-5 text-emerald-400" /> },
    { name: 'ملابس نساء', icon: <User className="w-5 h-5 text-emerald-400" /> },
    { name: 'ملابس اطفال', icon: <Baby className="w-5 h-5 text-emerald-400" /> },
    { name: 'ماكياج و اكسسوارات', icon: <Star className="w-5 h-5 text-emerald-400" /> },
    { name: 'عطورات', icon: <Droplets className="w-5 h-5 text-emerald-400" /> },
    { name: 'عقارات', icon: <Home className="w-5 h-5 text-emerald-400" /> },
    { name: 'سيارات و دراجات', icon: <Car className="w-5 h-5 text-emerald-400" /> },
    { name: 'إلكترونيات', icon: <Smartphone className="w-5 h-5 text-emerald-400" /> },
    { name: 'أثاث', icon: <Package className="w-5 h-5 text-emerald-400" /> },
    { name: 'أدوات منزلية', icon: <Coffee className="w-5 h-5 text-emerald-400" /> },
    { name: 'حيوانات', icon: <PawPrint className="w-5 h-5 text-emerald-400" /> },
    { name: 'تحف و هدايا', icon: <Package className="w-5 h-5 text-emerald-400" /> },
    { name: 'أخرى', icon: <Boxes className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-base-black/80 flex items-stretch justify-end"
      onClick={onClose}
      dir="rtl"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-slate-950 w-[85%] max-w-sm h-full border-r border-white/10 flex flex-col overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950 shrink-0 sticky top-0 z-20">
           <div className="flex flex-col">
             <h2 className="text-xl font-black font-display text-white">الأقسام</h2>
             <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">تصفح سوق سند الملكي</p>
           </div>
           <button 
             onClick={onClose} 
             className="p-2.5 bg-slate-900 border border-emerald-500/30 rounded-2xl text-emerald-400 hover:text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-lg active:scale-90"
             title="إغلاق"
           >
              <X className="w-5 h-5" strokeWidth={2.5} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar space-y-3 bg-gradient-to-b from-slate-950 to-base-black">
            <div className="grid grid-cols-1 gap-3 focus:outline-none pb-10">
                {menuItems.map((item) => {
                    const isSelected = selectedCategory === item.name;
                    
                    return (
                        <button
                            key={item.name}
                            onClick={() => { setSelectedCategory(item.name); onClose(); }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border outline-none group relative overflow-hidden ${
                                isSelected
                                ? 'bg-emerald-500 border-emerald-400 shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
                                : 'bg-slate-900/50 border-white/5 hover:border-emerald-500/40 hover:bg-slate-800 transition-all'
                            }`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`p-2 rounded-xl border transition-all ${isSelected ? 'bg-white/20 border-white/40' : 'bg-slate-800 border-white/5 group-hover:border-emerald-500/30'}`}>
                                   <div className={isSelected ? 'text-white' : 'text-emerald-400 transition-transform group-hover:scale-110'}>
                                     {item.icon}
                                   </div>
                                </div>
                                <span className={`font-black text-[15px] transition-all ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                    {item.name}
                                </span>
                            </div>

                            {isSelected ? (
                                <Star className="w-5 h-5 text-white fill-white animate-pulse" />
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-slate-950">
            <button 
                onClick={() => window.open(`https://wa.me/21692942482?text=${encodeURIComponent('مرحباً إدارة سوق سند، لدي استفسار وأود التواصل معكم.')}`, '_blank')}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-2xl font-black text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98]"
            >
                <span className="text-xl">💬</span>
                تواصل مع الإدارة
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
