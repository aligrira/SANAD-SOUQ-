import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Smartphone, CreditCard, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentModal({ packageId = 'bronze', onClose, onConfirm }: { packageId?: string; onClose: () => void, onConfirm: () => void }) {
    const [confirmed, setConfirmed] = useState(false);

    if (confirmed) {
        return (
            <div
                className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-4"
                dir="rtl"
            >
                <div
                    className="bg-gradient-to-br from-[#09291b] via-[#091511] to-[#040404] border border-[#00ff66]/30 p-8 rounded-[2rem] w-full max-w-sm shadow-[0_20px_50px_rgba(0,255,102,0.15)] relative text-center"
                >
                    <button 
                      onClick={onClose} 
                      className="absolute top-4 left-4 p-2 bg-black border border-[#FFD700]/40 rounded-full text-[#FFD700] hover:bg-[#FFD700]/15 hover:border-[#FFD700] hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.25)] transition-all cursor-pointer"
                      title="إغلاق"
                    >
                        <X className="w-[18px] h-[18px] text-[#FFD700]" strokeWidth={3} />
                    </button>
                    <CheckCircle className="w-14 h-14 text-[#00ff66] mx-auto mb-4 drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]" />
                    <h2 className="text-xl font-black font-display bg-gradient-to-r from-white via-[#00ff66] to-white bg-clip-text text-transparent mb-2 text-center">تم ترقية حسابكم بنجاح</h2>
                    <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed px-2">سيتم تفعيل اشتراكك فور تأكيد التحويل من طرف إدارة سوق سند.</p>
                    <button 
                      onClick={onClose} 
                      className="w-full bg-gradient-to-b from-[#00ff66] to-[#00aa44] text-black font-black rounded-xl py-3 text-sm shadow-lg shadow-[#00ff66]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    >
                        حسناً
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
          className="fixed inset-0 z-[999999] bg-black/90 flex items-start justify-center pt-8 sm:pt-16 p-4 overflow-y-auto"
          onClick={onClose}
          dir="rtl"
        >
          <div
            className="bg-[#080808] rounded-[2rem] p-[2px] bg-gradient-to-b from-[#FFD700]/50 via-zinc-800/30 to-black w-full max-w-md shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(255,215,0,0.2)] relative flex flex-col overflow-hidden shrink-0 mb-12 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
            style={{ marginTop: "max(5vh, 20px)" }}
          >
            {/* Glossy overlay effect for 3D depth */}
            <div className="absolute inset-0 rounded-[2rem] border-[2px] border-white/[0.05] mix-blend-overlay pointer-events-none z-10"></div>
            
            {/* Header (Sticky) */}
            <div className="flex items-center justify-between py-3.5 px-4.5 border-b border-white/[0.06] shrink-0 relative bg-black/40 z-20">
              <span className="w-8"></span> {/* Balancer */}
              <h2 className="text-base sm:text-lg font-black font-display bg-gradient-to-r from-[#FFF] via-[#FFD700] to-[#FFF] bg-clip-text text-transparent text-center tracking-tight">
                طرق الدفع لتفعيل الباقة
              </h2>
              <button 
                onClick={onClose} 
                className="p-1.5 bg-black border border-[#FFD700]/40 rounded-full text-[#FFD700] hover:bg-[#FFD700]/15 hover:border-[#FFD700] hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(255,215,0,0.2)] transition-all cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4 text-[#FFD700]" strokeWidth={3} />
              </button>
            </div>
            
            {/* Content Area (Fully Visible & Compactly Scrollable) */}
            <div className="overflow-y-auto p-3 sm:p-4 pb-8 space-y-3 flex-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent z-20">
                {/* 3D Method 1 Card */}
                <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-[#00ff66]/30 via-white/10 to-transparent shadow-[0_4px_15px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="bg-gradient-to-br from-[#062419] via-[#090e0c] to-[#040505] border border-[#00ff66]/10 p-2.5 rounded-xl text-center relative">
                        {/* Top glass reflection line */}
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ff66]/10 to-transparent"></div>
                        
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00ff66]/15 to-[#00ff66]/5 border border-[#00ff66]/20 flex items-center justify-center shadow-md">
                                <Smartphone className="w-4 h-4 text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.3)]" />
                            </div>
                            <h3 className="text-sm font-black text-white font-display mb-0">تطبيق D17 (البريد التونسي)</h3>
                        </div>
                        <p className="text-zinc-100 mb-1.5 text-[12px] font-bold font-sans">أرسل المبلغ المطلوب إلى رقم التحويل للتطبيق:</p>
                        <div className="text-base font-black text-[#00ff66] tracking-widest bg-black border border-[#00ff66]/20 py-1 px-4 text-center rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] dir-ltr inline-block mx-auto min-w-[130px] font-mono select-all cursor-pointer hover:bg-black/80 transition-colors">
                            92942482
                        </div>
                    </div>
                </div>

                {/* 3D Method 2 Card */}
                <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-[#FFD700]/30 via-white/10 to-transparent shadow-[0_4px_15px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="bg-gradient-to-br from-[#251e05] via-[#0a0a07] to-[#040404] border border-[#FFD700]/10 p-2.5 rounded-xl text-center relative">
                        {/* Top glass reflection line */}
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent"></div>
                        
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFD700]/15 to-[#FFD700]/5 border border-[#FFD700]/20 flex items-center justify-center shadow-md">
                                <CreditCard className="w-4 h-4 text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.3)]" />
                            </div>
                            <h3 className="text-sm font-black text-white font-display mb-0">التحويل البريـدي (e-Dinar)</h3>
                        </div>
                        <p className="text-zinc-100 mb-1.5 text-[12px] font-bold font-sans">أو قم بإيداع الأموال في بطاقة eDinar رقم:</p>
                        <div className="text-xs sm:text-sm font-black text-[#FFD700] tracking-widest bg-black border border-[#FFD700]/20 py-1.5 px-3.5 text-center rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] dir-ltr inline-block mx-auto max-w-full font-mono select-all cursor-pointer hover:bg-black/80 transition-colors">
                            5359402040714234
                        </div>
                    </div>
                </div>

                {/* 3D Method 3 Action Card (Important step && Actions) */}
                <div className="relative rounded-[1.5rem] p-[1px] bg-gradient-to-b from-[#FFD700]/40 via-white/10 to-transparent shadow-[0_6px_20px_rgba(0,0,0,0.6)] overflow-hidden">
                    <div className="bg-gradient-to-br from-[#1c1806] via-[#0a0a07] to-black border border-[#FFD700]/15 p-3 rounded-[1.5rem] text-center relative">
                        <div className="flex items-center justify-center gap-1 text-[#FFD700] font-black text-xs mb-1">
                            <ShieldCheck className="w-4 h-4 animate-pulse" />
                            <span>خطوة هامة لتأكيد طلبك</span>
                        </div>
                        <p className="text-white text-[12px] font-bold leading-relaxed mb-1">
                            الرجاء إرسال وصل الدفع أو لقطة شاشة للتحويل لمشرف القسم على واتساب رقم:
                        </p>
                        <div className="text-base font-black text-[#FFD700] tracking-wide mt-0.5 mb-2.5 dir-ltr bg-[#FFD700]/10 border border-[#FFD700]/20 py-0.5 px-3 rounded-md inline-block font-mono select-all cursor-pointer">
                            92942482
                        </div>

                        {/* Beautifully customized green WhatsApp action button with thin black border */}
                        <a
                          href={`https://wa.me/21692942482?text=${encodeURIComponent(`مرحباً إدارة سوق سند، تم دفع المبلغ لتفعيل العضوية: ${packageId === 'vip' ? 'الذهبية الملكية VIP' : 'البرونزية الفضية 🥈'}. رجاء التفعيل للحساب.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#25d366] text-black text-[12px] font-black rounded-lg py-2.5 mb-2 border-2 border-black shadow-[0_4px_10px_rgba(37,211,102,0.3)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                          </svg>
                          <span>إرسال الوصل للمشرف عبر الواتساب</span>
                        </a>
                        
                        {/* Elite Black and Glowing Gold Action Button with thin black border */}
                        <button 
                           onClick={() => {
                              try {
                                 confetti({
                                    particleCount: 150,
                                    spread: 80,
                                    origin: { y: 0.6 }
                                 });
                              } catch (e) {
                                 console.error('Confetti error:', e);
                              }
                              setConfirmed(true);
                              onConfirm();
                           }} 
                           className="w-full flex items-center justify-center gap-1.5 bg-[#FFD700] text-black hover:brightness-105 text-[12px] font-black rounded-lg py-2.5 border-2 border-black shadow-[0_0_15px_rgba(255,215,0,0.3)] active:scale-98 transition-all cursor-pointer transform hover:-translate-y-0.5"
                        >
                            <Send className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                            تأكيد الدفع وإرسال الإشعار للإدارة
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      );
}
