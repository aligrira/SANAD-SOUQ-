import React from 'react';
import { X, MessageCircle, ShoppingBag, Shirt, Baby, Car, Smartphone, Home, Coffee, PawPrint, Package, Grid, User, Star, Droplets } from 'lucide-react';

interface MenuModalProps {
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export default function MenuModal({ onClose, onSelectCategory }: MenuModalProps) {
  const sections = [
    { name: 'الكل', icon: <Grid className="w-5 h-5" /> },
    { name: 'ملابس رجال', icon: <Shirt className="w-5 h-5" /> },
    { name: 'ملابس نساء', icon: <User className="w-5 h-5" /> },
    { name: 'ملابس اطفال', icon: <Baby className="w-5 h-5" /> },
    { name: 'ماكياج و اكسسوارات', icon: <Star className="w-5 h-5" /> },
    { name: 'عطورات', icon: <Droplets className="w-5 h-5" /> },
    { name: 'عقارات', icon: <Home className="w-5 h-5" /> },
    { name: 'سيارات و دراجات', icon: <Car className="w-5 h-5" /> },
    { name: 'إلكترونيات', icon: <Smartphone className="w-5 h-5" /> },
    { name: 'أثاث', icon: <Package className="w-5 h-5" /> },
    { name: 'أدوات منزلية', icon: <Coffee className="w-5 h-5" /> },
    { name: 'حيوانات', icon: <PawPrint className="w-5 h-5" /> },
    { name: 'تحف و هدايا', icon: <Package className="w-5 h-5" /> },
    { name: 'اخرى', icon: <Grid className="w-5 h-5" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4" dir="rtl">
      <div className="flex justify-between items-center mb-6 py-2">
        <h2 className="text-white text-xl font-bold">الأقسام</h2>
        <button onClick={onClose} className="p-2 text-white"><X className="w-6 h-6" /></button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <button 
            key={section.name} 
            onClick={() => {
               if (onSelectCategory) {
                 onSelectCategory(section.name);
               }
               onClose();
            }}
            className="w-full flex items-center gap-4 text-white p-4 border-b border-white/10 hover:bg-white/5 transition-colors text-right"
          >
            {section.icon}
            <span>{section.name}</span>
          </button>
        ))}
      </div>
      <a
        href="https://wa.me/21692942482"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 p-4 bg-emerald-600 text-white rounded-2xl font-bold mt-4"
      >
        <MessageCircle className="w-5 h-5" />
        <span>تواصل معنا</span>
      </a>
    </div>
  );
}
