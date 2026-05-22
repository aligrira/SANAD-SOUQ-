import React from 'react';
import { motion } from 'motion/react';
import { X, Grid, Shirt, User, Baby, Star, Car, Smartphone, Home, Coffee, PawPrint, Package, Droplets } from 'lucide-react';

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-0"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="bg-[#050505] w-full max-w-md h-[90vh] rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="p-6 border-b border-gray-900 flex justify-between items-center bg-black shrink-0 relative z-10 sticky top-0">
           <h2 className="text-2xl font-bold font-display text-white">سوق سند</h2>
           <button onClick={onClose} className="p-2 bg-gray-900 rounded-full text-gray-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <h3 className="text-gray-500 font-black mb-6 text-[11px] uppercase tracking-widest flex items-center gap-2">
               <Grid className="w-3.5 h-3.5 text-[#D4AF37]" />
               تصفح الأقسام الملكية
            </h3>
            
            <div className="grid grid-cols-1 gap-3 perspective-1000">
                {[
                   { name: 'الكل', icon: Grid, color: 'emerald' },
                   { name: 'ملابس رجال', icon: Shirt, color: 'blue' },
                   { name: 'ملابس نساء', icon: User, color: 'rose' },
                   { name: 'ملابس اطفال', icon: Baby, color: 'orange' },
                   { name: 'ماكياج و اكسسوارات', icon: Star, color: 'purple' },
                   { name: 'عطورات', icon: Droplets, color: 'rose' },
                   { name: 'سيارات و دراجات', icon: Car, color: 'amber' },
                   { name: 'عقارات', icon: Home, color: 'cyan' },
                   { name: 'إلكترونيات', icon: Smartphone, color: 'indigo' },
                   { name: 'أثاث', icon: Package, color: 'lime' },
                   { name: 'أدوات منزلية', icon: Coffee, color: 'teal' },
                   { name: 'حيوانات', icon: PawPrint, color: 'yellow' }
                ].map((catObj) => {
                    const IconComp = catObj.icon;
                    const isSelected = selectedCategory === catObj.name;
                    
                    const colorMap: Record<string, any> = {
                      emerald: { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', shadow: 'shadow-emerald-500/10', active: 'bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/40' },
                      blue: { text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5', shadow: 'shadow-blue-500/10', active: 'bg-blue-500 text-black border-blue-400 shadow-blue-500/40' },
                      rose: { text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/5', shadow: 'shadow-rose-500/10', active: 'bg-rose-500 text-black border-rose-400 shadow-rose-500/40' },
                      orange: { text: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5', shadow: 'shadow-orange-500/10', active: 'bg-orange-500 text-black border-orange-400 shadow-orange-500/40' },
                      purple: { text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5', shadow: 'shadow-purple-500/10', active: 'bg-purple-500 text-black border-purple-400 shadow-purple-500/40' },
                      amber: { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5', shadow: 'shadow-amber-500/10', active: 'bg-amber-500 text-black border-amber-400 shadow-amber-500/40' },
                      cyan: { text: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/5', shadow: 'shadow-cyan-500/10', active: 'bg-cyan-500 text-black border-cyan-400 shadow-cyan-500/40' },
                      indigo: { text: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/5', shadow: 'shadow-indigo-500/10', active: 'bg-indigo-500 text-black border-indigo-400 shadow-indigo-500/40' },
                      lime: { text: 'text-lime-400', border: 'border-lime-500/20', bg: 'bg-lime-500/5', shadow: 'shadow-lime-500/10', active: 'bg-lime-500 text-black border-lime-400 shadow-lime-500/40' },
                      teal: { text: 'text-teal-400', border: 'border-teal-500/20', bg: 'bg-teal-500/5', shadow: 'shadow-teal-500/10', active: 'bg-teal-500 text-black border-teal-400 shadow-teal-500/40' },
                      yellow: { text: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5', shadow: 'shadow-yellow-500/10', active: 'bg-yellow-500 text-black border-yellow-400 shadow-yellow-500/40' }
                    };
                    
                    const c = colorMap[catObj.color] || colorMap.emerald;

                    return (
                        <motion.button
                            key={catObj.name}
                            onClick={() => { setSelectedCategory(catObj.name); onClose(); }}
                            whileHover={{ x: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border-b-2 ${
                                isSelected
                                ? `${c.active} border-b-black/10`
                                : `bg-gray-950/40 border border-gray-800 ${c.border} ${c.shadow} border-b-gray-800/60 hover:border-[#D4AF37]/30`
                            }`}
                        >
                            <span className={`font-bold text-[13px] ${isSelected ? 'text-black' : 'text-gray-200'}`}>{catObj.name}</span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isSelected ? 'bg-black/10 border-black/10' : 'bg-gray-950 border-gray-800'}`}>
                                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : c.text}`} />
                            </div>
                        </motion.button>
                    );
                })}

            </div>
            <div className="mt-8 text-center text-xs text-gray-600">
               SANAD SOUK PLATINUM EDITION
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
