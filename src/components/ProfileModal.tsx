import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  LogOut,
  Package,
  Check,
  Smartphone,
  ShieldCheck,
  Crown,
  Edit2,
  Save,
  Camera
} from "lucide-react";

export default function ProfileModal({
  onClose,
  onOpenAdmin,
  phone,
  onLogout,
  currentUserPlan,
  pendingPlan,
  currentUser,
  stats,
  favoriteCategories,
  onToggleFavoriteCategory,
  onViewPackages,
  onSaveProfile,
}: {
  onClose: () => void;
  onOpenAdmin?: () => void;
  phone?: string;
  onLogout?: () => void;
  currentUserPlan?: string | null;
  pendingPlan?: string | null;
  currentUser?: any;
  stats?: { active: number; views: number; sold: number };
  favoriteCategories?: string[];
  onToggleFavoriteCategory?: (category: string) => void;
  onViewPackages?: () => void;
  onSaveProfile?: (name: string, avatar: string | null) => void;
}) {
  const displayStats = stats || { active: 2, views: 1, sold: 0 };
  const userPhone = phone || "92942482";
  const userName = currentUser?.name || "A D M I N";

  const isVip = currentUserPlan === 'vip' || currentUserPlan === 'gold';
  const isBronze = currentUserPlan === 'bronze' || currentUserPlan === 'silver';
  
  let badgeName = "مجانية";
  let badgeNameFull = "الباقة المجانية";
  let badgeColorClass = "text-gray-400";
  
  if (isVip) {
    badgeName = "ذهبية (VIP)";
    badgeNameFull = "VIP الذهبي الملكي";
    badgeColorClass = "text-[#D4AF37]";
  } else if (isBronze) {
    badgeName = "برونزية مميزة";
    badgeNameFull = "البرونزية المتميزة";
    badgeColorClass = "text-amber-500";
  }

  const crownColor = isVip ? "text-[#D4AF37]" : "text-[#D4AF37]"; // Golden by default based on image
  const crownBorder = isVip ? "border-[#D4AF37]/50" : "border-[#D4AF37]/50";

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (onSaveProfile) {
      onSaveProfile(editName, selectedImage);
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsEditing(false);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 py-8"
      dir="rtl"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-[420px] mx-auto bg-[#050505] rounded-[2.5rem] p-5 sm:p-6 border border-[#D4AF37]/40 shadow-[0_10px_50px_rgba(212,175,55,0.15)] relative max-h-[85vh] overflow-y-auto no-scrollbar pb-8 mb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 mt-1 px-1 relative">
          <h2 className="text-[20px] sm:text-2xl font-black text-white flex-1 text-center pr-8 tracking-tight drop-shadow-md">
            الملف الشخصي
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all shrink-0 bg-[#000] shadow-[inset_0_1px_2px_rgba(212,175,55,0.2)]"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Actions & Avatar Row */}
        <div className="flex justify-between items-center px-1 mb-4 mt-1 relative">
          {/* Admin Button */}
          {onOpenAdmin ? (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="flex items-center justify-center flex-col gap-1 w-[64px] h-[72px] rounded-[1rem] bg-gradient-to-b from-[#111] to-[#000] border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all font-bold z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.5)]"
            >
              <div className="w-7 h-7 rounded-full border-t border-t-[#fff2ba] border-x-[#D4AF37]/40 border-b-0 bg-gradient-to-b from-[#f3db8b] to-[#7a5f11] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.8)]">
                <ShieldCheck className="w-3.5 h-3.5 text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" strokeWidth={2.5} />
              </div>
              <span className="text-[10px]">إدارة</span>
            </button>
          ) : (
            <div className="w-[64px] z-10"></div>
          )}

          {/* Avatar Center */}
          <div className="flex flex-col items-center relative z-20 mx-2">
            <div className="w-20 h-20 rounded-full border-[1.5px] border-[#D4AF37] p-1 bg-gradient-to-b from-[#1a1505] to-black flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full bg-black rounded-full overflow-hidden border border-[#D4AF37]/30 flex items-center justify-center relative shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]">
                {(selectedImage || currentUser?.avatar) ? (
                  <img
                    src={selectedImage || currentUser.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[#D4AF37] flex flex-col items-center mt-1.5 drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]">
                    <Crown className="w-7 h-7 mb-0.5" strokeWidth={2.5}/>
                    <span className="text-[12px] font-black tracking-widest leading-tight">
                      سند
                    </span>
                    <span className="text-[5px] tracking-[0.2em] opacity-80 uppercase leading-none">
                      SOUQ SANAD
                    </span>
                  </div>
                )}
              </div>

              {/* Badge */}
              <div className="absolute -bottom-2 bg-gradient-to-b from-[#1a1505] to-[#0A0A0A] border border-[#D4AF37] text-[#D4AF37] px-4 py-[3px] rounded-full text-[9px] font-black shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-30 tracking-widest leading-none drop-shadow-md">
                ذهبية
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
              onClose();
            }}
            className="flex items-center justify-center flex-col gap-1 w-[64px] h-[72px] rounded-[1rem] bg-gradient-to-b from-[#1a0505] to-[#050000] border border-red-900/30 text-red-500 hover:bg-red-900/20 transition-all font-bold z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.5)]"
          >
            <div className="w-7 h-7 rounded-full border-t border-t-red-400 border-x-red-900/40 border-b-0 flex items-center justify-center bg-gradient-to-b from-red-600 to-red-950 transform rotate-180 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.8)]">
              <LogOut className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" strokeWidth={3} />
            </div>
            <span className="text-[10px]">خروج</span>
          </button>
        </div>

        {/* Username Details */}
        <div className="flex flex-col items-center mb-4 mt-2">
          <h3 className="text-[20px] font-black text-white tracking-[0.1em] mb-1 uppercase leading-none drop-shadow-md">
            {userName}
          </h3>
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded-full border border-emerald-400/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <span className="text-[9px] font-black">حساب موثق ونشط</span>
            <Check className="w-2.5 h-2.5 drop-shadow-[0_1px_2px_rgba(16,185,129,0.8)]" strokeWidth={3} />
          </div>
        </div>

        {/* Box 1: Stats */}
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#050505] rounded-[1.2rem] p-3 border border-t-white/10 border-x-white/5 border-b-black mb-2 relative overflow-hidden group shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
          <div className="absolute top-2.5 left-2.5 opacity-40 drop-shadow-[0_2px_4px_rgba(212,175,55,0.5)]">
            <Package className="w-4 h-4 text-[#D4AF37]" strokeWidth={2.5} />
          </div>
          <p className="text-[9px] font-black text-gray-500 text-right mb-2 pr-1 uppercase tracking-[0.1em] drop-shadow-sm">
            إحصائيات إعلاناتك
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gradient-to-b from-[#111] to-[#000] rounded-xl py-2 flex flex-col items-center justify-center border border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
               <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">نشطة</span>
               <span className="text-lg font-black text-white leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                 {displayStats.active}
               </span>
            </div>
            <div className="bg-gradient-to-b from-[#111] to-[#000] rounded-xl py-2 flex flex-col items-center justify-center border border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
               <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">مشاهدات</span>
               <span className="text-lg font-black text-emerald-400 leading-none drop-shadow-[0_2px_4px_rgba(16,185,129,0.4)]">
                 {displayStats.views}
               </span>
            </div>
            <div className="bg-gradient-to-b from-[#111] to-[#000] rounded-xl py-2 flex flex-col items-center justify-center border border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
               <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">مباعة</span>
               <span className="text-lg font-black text-blue-400 leading-none drop-shadow-[0_2px_4px_rgba(96,165,250,0.4)]">
                 {displayStats.sold}
               </span>
            </div>
          </div>
        </div>

        {/* Box 2 & 3: Phone & Membership */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-gradient-to-br from-[#0A0A0A] to-[#000] rounded-[1.2rem] py-2.5 px-2 border border-t-white/10 border-x-white/5 border-b-black flex items-center justify-end gap-2 flex-row-reverse text-right shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            <div className="w-7 h-7 rounded-full border-t border-t-gray-400 border-x-gray-700 border-b-0 bg-gradient-to-b from-gray-500 to-black flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.8)]">
              <Smartphone className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-gray-500 mb-0 uppercase tracking-wide">
                الهاتف
              </span>
              <span className="text-[10px] font-black text-white tracking-widest">{userPhone}</span>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-[#0A0A0A] to-[#000] rounded-[1.2rem] py-2.5 px-2 border ${isVip ? 'border-[#D4AF37]/20 border-t-[#D4AF37]/40' : isBronze ? 'border-amber-600/20 border-t-amber-500/40' : 'border-white/10'} flex items-center justify-end gap-2 flex-row-reverse text-right shadow-[0_4px_8px_rgba(0,0,0,0.6)]`}>
            <div className={`w-7 h-7 rounded-full border-t ${isVip ? 'border-t-[#fff2ba] border-x-[#D4AF37]/40 bg-gradient-to-b from-[#f3db8b] to-[#7a5f11]' : isBronze ? 'border-t-amber-300 border-x-amber-600/40 bg-gradient-to-b from-amber-400 to-amber-700' : 'border-t-gray-450 border-x-gray-800 bg-gradient-to-b from-gray-500 to-black'} flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.8)]`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${isVip || isBronze ? 'text-black' : 'text-gray-400'} drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-gray-500 mb-0 uppercase tracking-wide">
                العضوية
              </span>
              <span className={`text-[10px] font-black ${badgeColorClass} tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]`}>{badgeName}</span>
            </div>
          </div>
        </div>

        {/* Box 4: Subscription */}
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#050505] rounded-[1.2rem] p-3 border border-t-white/10 border-x-white/5 border-b-black relative mb-4 shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
          <div className="absolute top-2.5 left-2.5 opacity-40 drop-shadow-[0_2px_4px_rgba(212,175,55,0.5)]">
            <Crown className={`w-4 h-4 ${isVip ? 'text-[#D4AF37]' : isBronze ? 'text-amber-500' : 'text-gray-500'}`} strokeWidth={2.5} />
          </div>
          <div className="flex items-center justify-end mb-2">
            <p className="text-[9px] font-black text-gray-500 px-1 uppercase tracking-[0.1em]">
              اشتراكي الحالي
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs flex-row-reverse border-b border-white/5 pb-1">
               <span className="text-gray-500 text-[9px] font-bold">الباقة: </span>
               <span className={`font-black tracking-[0.05em] text-[10px] ${badgeColorClass} drop-shadow-md`}>{badgeNameFull}</span>
            </div>
            <div className="flex justify-between items-center text-xs flex-row-reverse">
               <span className="text-gray-500 text-[9px] font-bold">تاريخ التفعيل: </span>
               <span className="font-mono text-[8px] text-gray-300 font-bold bg-[#000] border border-white/5 px-1.5 py-0.5 rounded shadow-inner">
                 {currentUser?.subscriptionStartDate || "10T15:30:12Z-06-2026"}
               </span>
            </div>
            <div className="flex justify-between items-center text-xs flex-row-reverse">
               <span className="text-gray-500 text-[9px] font-bold">تاريخ الانتهاء: </span>
               <span className="font-mono text-[8px] text-gray-300 font-bold bg-[#000] border border-white/5 px-1.5 py-0.5 rounded shadow-inner">
                 {currentUser?.subscriptionEndDate || "10T15:30:12Z-07-2026"}
               </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Action */}
        <div className="border-t border-white/5 pt-4">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="w-full bg-emerald-500 py-3 rounded-xl flex items-center justify-center gap-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_10px_rgba(16,185,129,0.3)]"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center text-emerald-500 shadow-inner">
                  <Check className="w-3.5 h-3.5 drop-shadow-md" strokeWidth={4} />
                </div>
                <span className="font-black text-black text-[12px]">تم حفظ التغييرات</span>
              </motion.div>
            ) : !isEditing ? (
              <motion.button
                key="edit-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-b from-[#111] to-[#050505] hover:from-[#1a1a1a] hover:to-[#0a0a0a] p-3 rounded-xl border border-t-white/10 border-x-white/5 border-b-black transition-all flex items-center justify-between group active:scale-[0.98] shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-800 to-black border-t border-t-gray-600 border-x-gray-700 border-b-0 flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-all shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.8)]">
                  <Edit2 className="w-4 h-4 text-[#D4AF37] drop-shadow-md" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-black text-[12px] text-white tracking-tight drop-shadow-md">تعديل الملف الشخصي</span>
                  <span className="text-[9px] font-bold uppercase text-gray-500 tracking-wide">تغيير البيانات</span>
                </div>
              </motion.button>
            ) : (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-1 pb-2 border-b border-white/5">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:text-white transition-all active:scale-90"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[13px] font-black text-white px-2">تعديل البيانات</span>
                </div>

                {/* Edit Photo */}
                <div className="flex justify-center py-1">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div 
                    className="relative group cursor-pointer" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-20 h-20 rounded-full border-[1.5px] border-dashed border-[#D4AF37]/50 flex items-center justify-center bg-[#080808] overflow-hidden group-hover:border-[#D4AF37] transition-all relative shadow-inner">
                       {(selectedImage || currentUser?.avatar) ? (
                         <img src={selectedImage || currentUser.avatar} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-40 transition-all"/>
                       ) : (
                         <div className="flex flex-col items-center gap-1">
                            <Camera className="w-6 h-6 text-gray-700 group-hover:text-[#D4AF37]" strokeWidth={1.5} />
                            <span className="text-[7px] text-gray-700 font-black uppercase tracking-widest leading-none">تغيير الصورة</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Edit2 className="w-5 h-5 text-white" />
                       </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-gradient-to-br from-[#f3db8b] to-[#b38e20] p-1.5 rounded-full text-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.8)] border-[1.5px] border-[#050505]">
                      <Camera className="w-3 h-3 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 text-right">
                   <label className="text-[10px] text-gray-500 font-black px-1 uppercase tracking-wide">الاسم الكامل</label>
                   <input 
                     type="text" 
                     value={editName}
                     onChange={e => setEditName(e.target.value)}
                     className="w-full bg-[#000] border border-white/10 rounded-xl p-3 text-white text-right focus:border-[#D4AF37]/40 focus:outline-none transition-all font-bold text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] placeholder:text-gray-800"
                     dir="rtl"
                     placeholder="اسم المستخدم"
                   />
                </div>

                <div className="flex flex-col items-end gap-1.5 text-right">
                   <label className="text-[10px] text-gray-500 font-black px-1 uppercase tracking-wide">رقم الهاتف</label>
                   <input 
                     type="tel" 
                     value={editPhone}
                     onChange={e => setEditPhone(e.target.value)}
                     className="w-full bg-[#000] border border-white/10 rounded-xl p-3 text-white text-right focus:border-[#D4AF37]/40 focus:outline-none transition-all font-bold text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                     dir="rtl"
                     disabled
                   />
                </div>
                
                <button
                  onClick={handleSave}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#f3db8b] border-t border-[#fff2ba] text-black font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_10px_rgba(212,175,55,0.2)] mt-3 group"
                >
                  <Save className="w-4 h-4 group-hover:scale-110 transition-transform drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" strokeWidth={3} />
                  <span className="drop-shadow-sm">حفظ التغييرات</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  );
}
