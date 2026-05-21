import React from 'react';
import { motion } from 'motion/react';
import { X, Grid, Shirt, User, Baby, Star, Car, Smartphone, Home, Coffee, PawPrint, Package } from 'lucide-react';

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onClose: () => void;
}

export default function Sidebar({ categories, selectedCategory, setSelectedCategory, onClose }: SidebarProps) {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getIcon = (cat: string) => {
      switch (cat) {
          case 'ملابس رجال': return <Shirt className="w-5 h-5 text-[#D4AF37]" />;
          case 'ملابس نساء': return <User className="w-5 h-5 text-[#D4AF37]" />;
          case 'ملابس اطفال': return <Baby className="w-5 h-5 text-[#D4AF37]" />;
          case 'ماكياج و اكسسوارات': return <Star className="w-5 h-5 text-[#D4AF37]" />;
          case 'سيارات و دراجات': return <Car className="w-5 h-5 text-[#D4AF37]" />;
          case 'عقارات': return <Home className="w-5 h-5 text-[#D4AF37]" />;
          case 'إلكترونيات': return <Smartphone className="w-5 h-5 text-[#D4AF37]" />;
          case 'أثاث': return <Package className="w-5 h-5 text-[#D4AF37]" />;
          case 'أدوات منزلية': return <Coffee className="w-5 h-5 text-[#D4AF37]" />;
          case 'حيوانات': return <PawPrint className="w-5 h-5 text-[#D4AF37]" />;
          case 'الكل': return <Grid className="w-5 h-5 text-[#D4AF37]" />;
          default: return <Package className="w-5 h-5 text-[#D4AF37]" />;
      }
  };

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
            <h3 className="text-[#D4AF37] font-bold mb-6 text-sm">الأقسام الرئيسية</h3>
            
            <div className="space-y-4">
                <button
                    onClick={() => { setSelectedCategory('الكل'); onClose(); }}
                    className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all ${
                        selectedCategory === 'الكل'
                        ? 'bg-[#1a1a1a] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-[#0a0a0a] border border-gray-800 hover:border-gray-700'
                    }`}
                >
                    <span className="font-bold text-lg text-white">جميع الإعلانات</span>
                    <div className="w-12 h-12 rounded-2xl bg-[#111] flex items-center justify-center border border-gray-800">
                        {getIcon('الكل')}
                    </div>
                </button>

                {categories.filter(c => c !== 'الكل').map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); onClose(); }}
                        className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all ${
                            selectedCategory === cat
                            ? 'bg-[#1a1a1a] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                            : 'bg-[#0a0a0a] border border-gray-800 hover:border-gray-700'
                        }`}
                    >
                        <span className="font-bold text-lg text-white">{cat}</span>
                        <div className="w-12 h-12 rounded-2xl bg-[#111] flex items-center justify-center border border-gray-800">
                             {getIcon(cat)}
                        </div>
                    </button>
                ))}
            </div>
            <div className="mt-8 text-center text-xs text-gray-600">
               SANAD SOUK PLATINUM EDITION
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
