import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, MapPin, Tag, DollarSign, Loader2 } from 'lucide-react';

const REGIONS = [
  'أريانة', 'باجة', 'بن عروس', 'بنزرت', 'تطاوين', 'توزر', 'تونس', 'جندوبة', 'زغوان', 'سليانة', 
  'سوسة', 'سيدي بوزيد', 'صفاقس', 'قابس', 'قبلي', 'القصرين', 'قفصة', 'القيروان', 'الكاف', 'مدنين', 
  'المنستير', 'منوبة', 'المهدية', 'نابل'
];

export default function AddProductModal({ onClose, onAdd, onEdit, currentUserPhone, currentUser, initialProduct }: { onClose: () => void, onAdd: (p: any) => void, onEdit?: (p: any) => void, currentUserPhone?: string | null, currentUser?: any, initialProduct?: any }) {
  const CATEGORIES = [
    'ملابس رجال',
    'ملابس نساء',
    'ملابس اطفال',
    'ماكياج و اكسسوارات',
    'عطورات',
    'عقارات',
    'سيارات و دراجات',
    'إلكترونيات',
    'أثاث',
    'أدوات منزلية',
    'حيوانات',
    'اخرى'
  ];

  const [imagePreview, setImagePreview] = useState<string | null>(initialProduct?.imageUrls[0] || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [price, setPrice] = useState(initialProduct?.price || '');
  const [phone, setPhone] = useState(initialProduct?.sellerId || currentUserPhone || '');
  const [category, setCategory] = useState(initialProduct?.category || CATEGORIES[0]);
  const [location, setLocation] = useState(initialProduct?.location || REGIONS[0]);
  const [description, setDescription] = useState(initialProduct?.description || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 360;
          const MAX_HEIGHT = 640; // keeps 9:16 aspect ratio beautifully for stories and listing images
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.55); // Highly compressed, extremely light data size
            setImagePreview(compressedBase64);
          } else {
            setImagePreview(reader.result as string);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
      if (!title || !price) return;
      setIsSubmitting(true);
      setTimeout(() => {
          setIsSubmitting(false);
          const productData = {
              ...initialProduct,
              id: initialProduct?.id || Date.now().toString(),
              title,
              price: Number(price),
              category,
              location,
              description,
              imageUrls: [imagePreview || 'https://via.placeholder.com/400'],
              sellerId: initialProduct?.sellerId || currentUserPhone || 'guest',
              sellerName: initialProduct?.sellerName || currentUser?.name || (currentUserPhone ? `User ${currentUserPhone}` : 'مستخدم'),
              sellerAvatar: initialProduct?.sellerAvatar || currentUser?.avatar || undefined,
              createdAt: initialProduct?.createdAt || 'الآن',
              status: 'active'
          };
          if (initialProduct && onEdit) {
              onEdit(productData);
          } else {
              onAdd(productData);
          }
      }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto flex items-start justify-center p-4 py-8"
    >
      <motion.div
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="bg-[#050505] w-full max-w-2xl rounded-3xl border border-gray-800 shadow-2xl p-6 sm:p-8 pb-48 space-y-6 overflow-y-auto max-h-[92vh] no-scrollbar relative"
        dir="rtl"
      >
         {/* Close button in top corner inside the scroll container */}
         <div className="absolute top-4 left-4 z-10">
            <button onClick={onClose} className="p-2 hover:bg-gray-800/80 rounded-full text-gray-500 hover:text-white transition-colors cursor-pointer">
               <X className="w-5 h-5" />
            </button>
         </div>

         {/* Top Branding Header & Image Upload Group grouped tightly together and lifted up */}
         <div className="space-y-2 mt-[-22px] text-right">
            {/* Modern Header directly in scroll-flow */}
            <div className="pb-0">
               <h2 className="text-2xl font-black font-display text-white">{initialProduct ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h2>
               <p className="text-gray-400 text-xs mt-0.5">{initialProduct ? 'قم بتعديل بيانات إعلانك.' : 'يرجى رفع صورة وإدخال تفاصيل إعلانك العقاري أو التجاري بدقة عالية.'}</p>
            </div>

            {/* 9:16 Image upload area with slight margin and beautiful branding */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-850 hover:border-[#D4AF37] rounded-3xl p-3 flex flex-col items-center justify-center bg-gray-950/40 hover:bg-gray-900/30 transition-all cursor-pointer group relative overflow-hidden aspect-[9/16] w-full max-w-[155px] mx-auto shadow-inner"
            >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleImageChange} 
                 className="hidden" 
                 accept="image/*"
               />
               
               <AnimatePresence>
                   {imagePreview ? (
                       <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={imagePreview} 
                          alt="Preview" 
                          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                       />
                   ) : (
                       <motion.div exit={{ opacity: 0 }} className="flex flex-col items-center justify-center z-10 w-full text-center">
                           <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mb-3 group-hover:bg-[#10B981]/15 border border-gray-800 group-hover:border-[#10B981]/30 transition-all">
                              <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-[#10B981] transition-colors" />
                           </div>
                           <p className="text-white text-xs font-bold font-display">أضف صورة الإعلان</p>
                           <p className="text-[10px] text-gray-500 mt-0.5">مقاس 16:9 عمودي (قصة)</p>
                       </motion.div>
                   )}
               </AnimatePresence>
            </div>
         </div>

         {/* Inputs Container */}
         <div className="space-y-4 pt-1">
            <div className="relative">
               <label className="block text-xs font-extrabold text-gray-400 mb-1.5">عنوان الإعلان</label>
               <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#020806] border border-gray-900 focus:border-[#D4AF37] text-sm text-white rounded-2xl py-3 px-4 outline-none transition-colors" placeholder="مثال: شقة سكنية بقرطاج..." />
            </div>
            
            <div className="relative">
               <label className="block text-xs font-extrabold text-gray-400 mb-1.5">رقم البائع</label>
               <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#020806] border border-gray-900 focus:border-[#D4AF37] text-sm text-white rounded-2xl py-3 px-4 outline-none transition-colors" placeholder="رقم الهاتف..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                   <label className="block text-xs font-extrabold text-gray-400 mb-1.5">السعر (د.ت)</label>
                   <div className="relative">
                      <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#020806] border border-gray-900 focus:border-[#D4AF37] text-sm text-white rounded-2xl py-3 pr-10 pl-4 outline-none transition-colors" placeholder="0" />
                      <DollarSign className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   </div>
                </div>
                <div className="relative">
                   <label className="block text-xs font-extrabold text-gray-400 mb-1.5">القسم</label>
                   <div className="relative">
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#020806] border border-gray-900 focus:border-[#D4AF37] text-sm text-white rounded-2xl py-3 pr-10 pl-4 outline-none appearance-none transition-colors">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   </div>
                </div>
            </div>

            <div className="relative">
               <label className="block text-xs font-extrabold text-gray-400 mb-1.5">الموقع (الولاية)</label>
               <div className="relative">
                   <select value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-[#020806] border border-gray-900 focus:border-[#D4AF37] text-sm text-white rounded-2xl py-3 pr-10 pl-4 outline-none appearance-none transition-colors">
                       {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                   </select>
                   <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               </div>
            </div>

            <div className="relative">
               <label className="block text-xs font-extrabold text-gray-400 mb-1.5">الوصف الإعلاني</label>
               <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#020806] border border-gray-900 focus:border-[#D4AF37] text-sm text-white rounded-2xl py-3 px-4 outline-none resize-none transition-colors" placeholder="اكتب وصفاً مفصلاً يبرز مزايا العرض والسلعة بدقة..."></textarea>
            </div>
         </div>

         {/* Action buttons embedded directly in scroll flow */}
         <div className="pt-4 flex gap-3">
            <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-sm font-bold rounded-2xl py-3.5 shadow-lg shadow-[#10B981]/15 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer">
               {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
               {isSubmitting ? 'جاري النشر وتدقيق البيانات...' : 'نشر الإعلان كعرض ملكي'}
            </button>
            <button onClick={onClose} disabled={isSubmitting} className="px-6 bg-[#0c0c0c] hover:bg-gray-900 text-gray-400 hover:text-white text-sm font-medium rounded-2xl py-3.5 transition-colors border border-gray-900 hover:border-gray-800 cursor-pointer">
               إلغاء
            </button>
         </div>
      </motion.div>
    </motion.div>
  );
}
