import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

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
    { name: 'الكل', emoji: '🗂️' },
    { name: 'ملابس رجال', emoji: '👔' },
    { name: 'ملابس نساء', emoji: '👗' },
    { name: 'ملابس اطفال', emoji: '👶' },
    { name: 'ماكياج و اكسسوارات', emoji: '💄' },
    { name: 'عطورات', emoji: '🌸' },
    { name: 'عقارات', emoji: '🏠' },
    { name: 'سيارات و دراجات', emoji: '🚗' },
    { name: 'إلكترونيات', emoji: '📱' },
    { name: 'أثاث', emoji: '🛋️' },
    { name: 'أدوات منزلية', emoji: '🏺' },
    { name: 'حيوانات', emoji: '🐾' },
    { name: 'تحف و هدايا', emoji: '🎁' },
    { name: 'أخرى', emoji: '📦' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-stretch justify-end"
      onClick={onClose}
      dir="rtl"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-[#000000] w-[85%] max-w-sm h-full border-r border-[#C9A84C]/30 flex flex-col overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#C9A84C]/30 flex justify-between items-center bg-[#000000] shrink-0 sticky top-0">
           <h2 className="text-xl font-bold font-display text-[#C9A84C]">القائمة الرئيسية</h2>
           <button onClick={onClose} className="p-2 bg-[#1a1a1a] rounded-full text-[#C9A84C] hover:text-white transition-colors">
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="grid grid-cols-1 gap-1.5 focus:outline-none">
                {menuItems.map((item) => {
                    const isSelected = selectedCategory === item.name;
                    
                    return (
                        <button
                            key={item.name}
                            onClick={() => { setSelectedCategory(item.name); onClose(); }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all focus:outline-none border ${
                                isSelected
                                ? 'bg-[#C9A84C]/10 border-[#C9A84C] text-[#C9A84C]'
                                : 'border-transparent text-[#C9A84C] hover:bg-[#1a1a1a] hover:border-[#C9A84C]/50'
                            }`}
                        >
                            <span className="font-medium text-[15px]">{item.name}</span>
                            <span className="text-lg">{item.emoji}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        <div className="p-6 border-t border-[#C9A84C]/30">
            <button className="w-full text-center p-4 bg-[#C9A84C] text-[#000000] rounded-xl font-bold text-lg hover:bg-[#C9A84C]/90 transition shadow-lg shadow-[#C9A84C]/20">
                تواصل معنا
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
