import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Settings, LogOut, Package, Camera, Check, Eye, EyeOff } from 'lucide-react';

export default function ProfileModal({ onClose, onOpenAdmin, phone, onLogout, currentUserPlan, pendingPlan, currentUser, onSaveProfile }: { onClose: () => void, onOpenAdmin?: () => void, phone?: string, onLogout?: () => void, currentUserPlan?: string, pendingPlan?: string | null, currentUser?: any, onSaveProfile?: (name: string, avatar: string | null) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || 'المستخدم الحالي');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(currentUser?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 150; // profile image is small
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85); // good quality and very small
            setAvatar(compressed);
            if (onSaveProfile) {
              onSaveProfile(profileName, compressed);
            }
          } else {
            const raw = reader.result as string;
            setAvatar(raw);
            if (onSaveProfile) {
              onSaveProfile(profileName, raw);
            }
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const planName = currentUserPlan === 'vip' ? 'عضوية ذهبية VIP' : currentUserPlan === 'bronze' ? 'عضوية برونزية' : 'عضوية مجانية';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-0"
    >
      <motion.div
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="bg-[#050505] w-full max-w-sm rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden"
        dir="rtl"
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
           <h2 className="text-xl font-bold font-display text-white">الملف الشخصي</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-6">
            <div className="flex items-center gap-4 mb-8 relative">
               <div className="relative">
                   <div 
                     className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#10B981] p-[2px] cursor-pointer relative group"
                     onClick={() => fileInputRef.current?.click()}
                     title="تحميل صورة البروفايل"
                   >
                       <div className="w-full h-full bg-[#020806] rounded-full flex items-center justify-center overflow-hidden relative">
                           {avatar ? (
                               <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                           ) : (
                               <User className="w-10 h-10 text-gray-500" />
                           )}
                           <div className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Camera className="w-5 h-5 text-white" />
                           </div>
                       </div>
                       
                       {/* Floating Green Camera Badge for quick visibility */}
                       <div className="absolute bottom-0 right-0 bg-[#10B981] text-black p-1.5 rounded-full border-2 border-[#050505] shadow-lg flex items-center justify-center scale-100 group-hover:scale-110 transition-transform">
                          <Camera className="w-3.5 h-3.5 text-white" />
                       </div>
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
               </div>
               
               <div className="flex-1">
                   {isEditing ? (
                       <div className="space-y-3">
                        <input 
                          type="text" 
                          value={profileName}
                          onChange={e => setProfileName(e.target.value)}
                          className="w-full bg-[#020806] border border-gray-800 rounded-lg py-2 px-3 text-white text-sm focus:border-[#D4AF37] outline-none"
                          placeholder="الاسم الكامل"
                        />
                        <div className="relative">
                           <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-[#020806] border border-gray-800 rounded-lg py-2 px-3 text-white text-sm focus:border-[#D4AF37] outline-none"
                            placeholder="كلمة مرور جديدة"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-2.5 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                       </div>
                   ) : (
                       <h3 className="text-lg font-bold text-white mb-1">{profileName}</h3>
                   )}
                   <p className="text-sm text-gray-400 dir-ltr text-right mb-2">{phone}</p>
                   
                   <div className="flex flex-col gap-2">
                       <span className={`text-xs w-max px-2 py-1 rounded-full border tracking-wider font-bold ${currentUserPlan === 'vip' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]' : currentUserPlan === 'bronze' ? 'bg-[#d97706]/10 text-[#d97706] border-[#d97706]' : 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                           {planName} - <span className="text-[#10B981]">نشط</span>
                       </span>
                       
                       {pendingPlan && (
                           <span className="text-xs w-max bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded-full font-bold">
                               طلب {pendingPlan === 'vip' ? 'باقة ذهبية' : 'باقة برونزية'} قيد المراجعة...
                           </span>
                       )}
                   </div>
               </div>
            </div>

            <div className="space-y-2">
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.button 
                           key="save"
                           initial={{ opacity: 0 }} 
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           onClick={() => { setIsEditing(false); if(onSaveProfile) onSaveProfile(profileName, avatar); }} 
                           className="w-full flex items-center justify-center gap-3 p-3 rounded-2xl bg-[#10B981] text-white font-bold transition-colors shadow-lg shadow-[#10B981]/20 mb-4"
                        >
                            <Check className="w-5 h-5" />
                            <span>حفظ التغييرات</span>
                        </motion.button>
                    ) : (
                        <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-800 transition-colors text-white">
                                <Package className="w-5 h-5 text-gray-400" />
                                <span className="font-medium">إعلاناتي</span>
                            </button>
                            <button onClick={() => setIsEditing(true)} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-800 transition-colors text-white">
                                <Settings className="w-5 h-5 text-gray-400" />
                                <span className="font-medium">تعديل الملف الشخصي</span>
                            </button>
                            {onOpenAdmin && (
                                <button onClick={() => { onClose(); onOpenAdmin(); }} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-800 transition-colors text-white border border-[#D4AF37]/30 mt-2">
                                    <Settings className="w-5 h-5 text-[#D4AF37]" />
                                    <span className="font-medium text-[#D4AF37]">لوحة الإدارة</span>
                                </button>
                            )}
                            <button onClick={() => { if(onLogout) onLogout(); onClose(); }} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/10 text-red-500 transition-colors mt-4">
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">تسجيل الخروج</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
