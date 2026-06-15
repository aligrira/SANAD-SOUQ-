import React, { useState } from 'react';
import { Check, Zap, Star, Crown, Sparkles } from 'lucide-react';

export default function PricingPackages({ 
  onSubscriptionRequest, 
  hasPendingRequest = false,
  showToast,
  currentUserPhone,
  idPrefix = ""
}: { 
  onSubscriptionRequest: (plan: string) => void;
  hasPendingRequest?: boolean;
  showToast?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  currentUserPhone?: string | null;
  idPrefix?: string;
}) {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [showPendingOverlay, setShowPendingOverlay] = useState(false);

  const handlePkgClick = (pkgId: string) => {
    if (!currentUserPhone) {
      if (showToast) showToast('يرجى تسجيل الدخول أولاً للاشتراك في الباقة', 'info');
      // In App.tsx, handleSubscriptionRequest handles setShowAuth(true), 
      // but let's make it explicit or ensure onSubscriptionRequest is called with auth intent
      onSubscriptionRequest(pkgId); 
      return;
    }

    if (hasPendingRequest) {
      setShowPendingOverlay(true);
      return;
    }

    onSubscriptionRequest(pkgId);
  };
  
  const packages = [
    {
      id: 'free',
      name: 'الباقة المجانية',
      price: 'مجاناً',
      icon: Zap,
      color: 'text-emerald-400',
      iconBg: 'bg-black border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      badge: '',
      badgeStyle: '',
      features: [
        'نشر إعلانات محدود',
        'ظهور الإعلانات في القسم الثلاث',
        'عدم ظهور الإعلان في الستوري',
      ],
      outerRingColor: 'from-emerald-400/40 via-emerald-400/10 to-transparent',
      borderColor: 'border-emerald-400/30',
      innerBg: 'bg-gradient-to-b from-emerald-500/10 via-[#020617] to-[#020617]',
      priceStyle: 'text-emerald-400 font-bold',
      buttonStyle: 'bg-gradient-to-b from-emerald-950 to-slate-950 text-white border border-emerald-400/40 ring-1 ring-inset ring-emerald-400/20',
      buttonText: 'اشتراكك الحالي ✔',
      checkmarkCircle: 'border border-emerald-400 bg-black',
      checkmarkColor: 'text-emerald-400'
    },
    {
      id: 'bronze',
      name: 'الباقة البرونزية',
      price: '49 د.ت / شهر',
      icon: Crown, // Silver Crown
      color: 'text-gray-300',
      iconBg: 'bg-transparent',
      badge: 'الأكثر استخداماً',
      badgeStyle: 'bg-gradient-to-b from-gray-300 to-gray-500 text-black border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)]',
      features: [
        'نشر إعلانات غير محدود',
        'ظهور الإعلانات في القسم الثاني',
        'ظهور الإعلانات في الستوري (درجة ثانية)',
        'الحصول على 5 بوسترات لمنتج من اختيارك',
        'تسويق إعلان مدفوع لمدة يومين',
        'شارة التاج البرونزي',
      ],
      outerRingColor: 'from-gray-300/40 via-gray-400/10 to-transparent',
      borderColor: 'border-gray-300/40',
      innerBg: 'bg-gradient-to-b from-gray-500/10 via-[#0a0a0a] to-[#000000]',
      priceStyle: 'text-white font-bold',
      buttonStyle: 'bg-gradient-to-b from-gray-200 to-gray-400 text-black border border-white/40 ring-1 ring-inset ring-white',
      buttonText: 'اشترك الآن',
      checkmarkCircle: 'border border-gray-400 bg-black',
      checkmarkColor: 'text-gray-300'
    },
    {
      id: 'vip',
      name: 'الباقة الملكية VIP',
      price: '99 د.ت / شهر',
      icon: Crown,
      color: 'text-[#D4AF37]',
      iconBg: 'bg-transparent',
      badge: '★ الأكثر طلباً ★',
      badgeStyle: 'bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-slate-950 border border-[#F5D76E]/50 shadow-[0_0_20px_rgba(212,175,55,0.5)]',
      features: [
        'نشر إعلانات غير محدود',
        'ظهور الإعلانات في القسم الأول',
        'ظهور الإعلانات في الستوري (درجة أولى)',
        'الحصول على 10 بوسترات لمنتج من اختيارك',
        'تسويق إعلان مدفوع لمدة 4 أيام',
        'شارة التاج الملكي المذهّب',
      ],
      outerRingColor: 'from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent',
      borderColor: 'border-[#D4AF37]/40',
      innerBg: 'bg-gradient-to-b from-[#D4AF37]/10 via-[#0b0b0b] to-[#040404]',
      priceStyle: 'text-[#D4AF37] font-bold',
      buttonStyle: 'bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-black border border-[#F5D76E] shadow-xl',
      buttonText: 'اشترك الآن',
      checkmarkCircle: 'border border-[#D4AF37] bg-black',
      checkmarkColor: 'text-[#D4AF37]'
    }
  ];

  return (
    <>
    <div id="pricing-packages" className="py-2 pb-6 scroll-mt-24" dir="rtl">
      <div className="text-center mb-6 px-4 space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] px-5 py-2 rounded-full text-xs font-bold border border-[#D4AF37]/20 shadow-sm">
           <Sparkles className="w-4 h-4 animate-pulse" />
           باقات الارتقاء والتميز
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">باقات التميز من سوق سند</h2>
        <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed opacity-80">اختر المستوى الملكي الذي يضمن انتشار عروضك التجارية والعقارية بلمسة مخملية تميز خدماتك وتجعل حضورك في طليعة السوق.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 px-4 max-w-6xl mx-auto items-end">
        {packages.map((pkg, index) => {
          const isFree = pkg.id === 'free';
          const isVip = pkg.id === 'vip';
          const heightClass = isFree ? "min-h-[420px]" : "min-h-[480px]";
          return (
            <div 
              key={pkg.id}
              id={`${idPrefix}pkg-card-${pkg.id}`}
              className={`relative rounded-[2rem] p-[3px] bg-gradient-to-b ${pkg.outerRingColor} flex flex-col max-w-sm mx-auto w-full transition-transform duration-300 hover:-translate-y-2 group shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)]`} 
            >
              {/* Glass Reflection Ring */}
              <div className={`absolute inset-0 rounded-[2rem] border-[3px] ${pkg.borderColor} mix-blend-overlay pointer-events-none`}></div>

              {/* Package Top Decor Icon (Crown or Bolt) */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                {pkg.id === 'free' ? (
                  <div className={`w-[90px] h-[90px] rounded-full flex items-center justify-center border-[4px] border-emerald-900/50 bg-gradient-to-b from-stone-900 to-black shadow-[0_0_20px_rgba(16,185,129,0.5)]`}>
                    <Zap className={`w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]`} strokeWidth={1.5} />
                  </div>
                ) : (
                  <div className="relative">
                    <Crown className={`w-24 h-24 ${pkg.color} ${isVip ? "drop-shadow-[0_10px_15px_rgba(255,215,0,0.5)]" : "drop-shadow-[0_10px_15px_rgba(255,255,255,0.3)]"}`} strokeWidth={isVip ? 1.5 : 1} fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Package Badge (If any) */}
              {pkg.badge && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                  <div className={`px-5 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${pkg.badgeStyle}`}>
                    {pkg.badge}
                  </div>
                </div>
              )}

              {/* Inner Card (Glassmorphism Content Area) */}
              <div className={`relative rounded-[1.8rem] flex flex-col flex-1 ${heightClass} ${pkg.innerBg} shadow-[inset_0_2px_30px_rgba(255,255,255,0.05)] overflow-hidden px-6 pt-[4.5rem] pb-6`}>
                 {/* Shiny upper reflection */}
                 <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none rounded-t-[1.8rem]"></div>

                 <div className="text-center relative z-10 flex flex-col items-center mb-8">
                    <h3 className={`text-2xl sm:text-[26px] font-black text-white mb-2 font-display tracking-tight leading-tight`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-xl sm:text-2xl ${pkg.priceStyle}`}>
                      {pkg.price}
                    </p>
                 </div>

                 <div className="w-full flex-1 relative z-10 mb-8 border-t border-white/[0.05] pt-6">
                    <ul className="space-y-4 text-right">
                      {pkg.features.map((feature, idx) => (
                        <li key={`${pkg.id}-${idx}`} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${pkg.checkmarkCircle}`}>
                            <Check className={`w-3 h-3 ${pkg.checkmarkColor}`} strokeWidth={3} />
                          </div>
                          <span className="text-[13px] sm:text-[14px] text-gray-200 font-medium font-sans leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                 </div>

                 <button 
                    onClick={() => handlePkgClick(pkg.id)} 
                    className={`relative z-10 w-full py-4 rounded-2xl text-[14px] sm:text-[16px] font-black tracking-wide transition-all transform active:scale-95 shadow-xl ${pkg.buttonStyle}`}
                  >
                    {pkg.buttonText}
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    
    {selectedPkg && (
      <div className="hidden">
         {/* Unused local modal to avoid conflicts, unified in App.tsx */}
      </div>
    )}
    
    {showPendingOverlay && (
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80"
        onClick={() => setShowPendingOverlay(false)}
      >
        <div className="bg-black border border-red-900/50 p-8 rounded-3xl text-center shadow-2xl shadow-red-950/20 max-w-sm w-full" dir="rtl">
            <span className="text-5xl block mb-4">⚠️</span>
            <h3 className="text-red-500 font-bold text-2xl mb-2 font-display">طلبكم قيد المراجعة</h3>
            <p className="text-gray-400 text-sm leading-relaxed">سيتم تفعيل عضويتكم قريباً، شكراً لصبركم.</p>
            <button 
                onClick={() => setShowPendingOverlay(false)}
                className="mt-6 w-full py-3 bg-red-950/20 hover:bg-red-900/30 text-red-500 rounded-xl font-bold transition-all border border-red-900/30"
            >
                إغلاق
            </button>
        </div>
      </div>
    )}
    </>
  );
}

