import React, { useState } from 'react';
import { Check, Zap, Star, Crown, Sparkles } from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function PricingPackages({ 
  onSubscriptionRequest, 
  hasPendingRequest = false,
  showToast,
  currentUserPhone
}: { 
  onSubscriptionRequest: (plan: string) => void;
  hasPendingRequest?: boolean;
  showToast?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  currentUserPhone?: string | null;
}) {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [showPendingOverlay, setShowPendingOverlay] = useState(false);

  const handlePkgClick = (pkgId: string) => {
    if (!currentUserPhone) {
      // Directs to login modal
      onSubscriptionRequest(pkgId);
      return;
    }

    if (hasPendingRequest) {
      setShowPendingOverlay(true);
      return;
    }

    setSelectedPkg(pkgId);
  };
  
  const packages = [
    {
      id: 'free',
      name: 'الباقة المجانية 🟢',
      price: 'مجاناً',
      icon: Zap,
      color: 'text-emerald-300',
      iconBg: 'bg-gradient-to-tr from-emerald-950 to-emerald-900 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      badge: 'انطلاقة',
      badgeStyle: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      features: [
        'نشر إعلانات محدود',
        'ظهور الإعلانات في القسم الثالث',
        'عدم ظهور الإعلان في الستوري',
      ],
      cardStyle: 'border-2 border-emerald-500/40 bg-gradient-to-b from-[#0a2318] via-[#030d09] to-[#010302]',
      priceStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 font-extrabold',
      buttonStyle: 'bg-emerald-950/45 text-emerald-300'
    },
    {
      id: 'bronze',
      name: 'الباقة البرونزية الفضية 🥈',
      price: '49 د.ت / شهر',
      icon: Crown,
      color: 'text-slate-100',
      iconBg: 'bg-gradient-to-tr from-slate-700 to-slate-900 border-slate-400/50',
      badge: 'التاج الفضي 👑',
      badgeStyle: 'bg-slate-700/30 text-slate-100 border border-slate-400/40',
      features: [
        'نشر إعلانات غير محدود',
        'ظهور الإعلانات في القسم الثاني',
        'ظهور الإعلانات في الستوري (درجة ثانية)',
        'الحصول على 5 بوسترات لمنتج من اختيارك',
        'تسويق إعلان مدفوع لمدة يومين',
        'شارة التاج الفضي',
      ],
      cardStyle: 'border-2 border-slate-400/50 bg-gradient-to-b from-[#18202c] via-[#0b1016] to-[#030406]',
      priceStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-400 font-black',
      buttonStyle: 'bg-slate-900/60 text-slate-100 border border-slate-400/45'
    },
    {
      id: 'vip',
      name: 'الباقة الذهبية الملكية VIP',
      price: '99 د.ت / شهر',
      icon: Crown,
      color: 'text-[#D4AF37]',
      iconBg: 'bg-gradient-to-tr from-[#2d2208] to-[#120e03] border-[#D4AF37]/30',
      badge: 'التاج الذهبي الملكي',
      badgeStyle: 'bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/15 text-[#D4AF37] border border-[#D4AF37]/30 font-black',
      features: [
        'نشر إعلانات غير محدود',
        'أولوية ظهور الإعلانات',
        'ظهور الإعلانات في الستوري (درجة أولى)',
        'الحصول على 10 بوسترات لمنتج من اختيارك',
        'تسويق إعلان مدفوع لمدة 4 أيام',
        'شارة التاج الذهبي',
      ],
      cardStyle: '', 
      priceStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#AA7C11] font-black',
      buttonStyle: 'bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#AA7C11] text-black font-black'
    }
  ];

  return (
    <>
    <div id="pricing-packages" className="py-2 pb-6 scroll-mt-24" dir="rtl">
      <div className="text-center mb-10 px-4 space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] px-5 py-2 rounded-full text-xs font-bold border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
           <Sparkles className="w-4 h-4 animate-pulse-slow" />
           باقات الارتقاء والتميز
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">باقات التميز من سوق سند</h2>
        <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed opacity-80">اختر المستوى الملكي الذي يضمن انتشار عروضك التجارية والعقارية بلمسة مخملية تميز خدماتك وتجعل حضورك في طليعة السوق.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 px-4 max-w-5xl mx-auto items-stretch">
        {packages.map((pkg, index) => {
          if (pkg.id === 'vip') {
            // VIP Card Wrapper with a beautifully decorated gold shiny gradient border and layout
            return (
              <div 
                key={pkg.id}
                className="relative rounded-2xl bg-gradient-to-b from-[#FFF3B0] via-[#D4AF37] to-[#7A5B0B] p-[2px] pb-[8px] shadow-[0_15px_30px_rgba(0,0,0,0.9),0_5px_15px_rgba(212,175,55,0.15)] flex flex-col max-w-sm mx-auto w-full group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_rgba(0,0,0,0.95),0_8px_20px_rgba(212,175,55,0.25)] active:translate-y-[2px] active:pb-[4px]"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                {/* Floating Crown Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD700] via-[#FCE38A] to-[#DAA520] text-black font-black text-[11px] sm:text-xs px-6 py-2 rounded-full shadow-[0_10px_20px_rgba(212,175,55,0.6)] border-2 border-white flex items-center gap-1.5 z-20">
                  <Crown className="w-5 h-5 fill-black" />
                  شعبية وموصى بها
                </div>

                {/* Inner Card Section */}
                <div className="relative bg-[#050505] rounded-xl p-5 flex flex-col flex-1 h-full shadow-[inset_0_2px_15px_rgba(212,175,55,0.25)] overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#D4AF37]/10 to-transparent pointer-events-none rounded-t-xl"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-gradient-to-br from-[#2d2208] to-[#120e03] border-[#D4AF37]/40`}>
                      <pkg.icon className={`w-6 h-6 ${pkg.color} animate-pulse-slow drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]`} />
                    </div>
                    {pkg.badge && (
                      <span className={`text-[10px] py-1 px-3 rounded-full font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.3)] ${pkg.badgeStyle}`}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 font-display drop-shadow-[0_0_25px_rgba(212,175,55,0.9)] text-shadow-gold relative z-10">
                    {pkg.name}
                  </h3>
                  <p className={`text-2xl font-black mb-4 ${pkg.priceStyle} relative z-10`}>
                    {pkg.price}
                  </p>

                  <ul className="mb-5 space-y-3 flex-1 text-right relative z-10">
                    {pkg.features.map((feature, idx) => (
                      <li key={`${pkg.id}-${idx}`} className="flex items-start gap-3 text-xs sm:text-sm text-gray-100 font-medium font-sans">
                        <Check className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5 drop-shadow-md" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handlePkgClick(pkg.id)} 
                    className={`relative z-10 w-full py-3.5 rounded-xl font-extrabold text-sm transition-all transform active:scale-95 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] ${pkg.buttonStyle}`}
                  >
                    امتلاك العضوية الذهبية
                  </button>
                </div>
              </div>
            );
          }

          // Non-VIP Package Cards with elegant, 3D premium border and design
          const isFree = pkg.id === 'free';
          const outerRingColor = isFree 
            ? 'from-emerald-300 via-emerald-500 to-emerald-800' 
            : 'from-slate-200 via-slate-400 to-slate-700';
          const glowShadowClass = isFree
            ? 'shadow-[0_15px_30px_rgba(0,0,0,0.9),0_5px_15px_rgba(16,185,129,0.1)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.95),0_8px_20px_rgba(16,185,129,0.25)]'
            : 'shadow-[0_15px_30px_rgba(0,0,0,0.9),0_5px_15px_rgba(148,163,184,0.1)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.95),0_8px_20px_rgba(148,163,184,0.25)]';
          
          return (
            <div 
              key={pkg.id}
              id={pkg.id === 'bronze' ? 'paid-packages' : (pkg.id === 'free' ? 'free-package' : undefined)}
              className={`relative rounded-2xl p-[2px] pb-[8px] bg-gradient-to-b ${outerRingColor} flex flex-col max-w-sm mx-auto w-full transition-all duration-300 hover:-translate-y-2 active:translate-y-[2px] active:pb-[4px] scroll-mt-28 ${glowShadowClass}`}
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Silver Crown Floating Tag for Bronze package */}
              {pkg.id === 'bronze' && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-300 via-white to-slate-400 text-slate-950 font-black text-[10px] sm:text-[11px] px-5 sm:px-6 py-2 rounded-full shadow-[0_8px_15px_rgba(148,163,184,0.4)] border-2 border-white flex items-center gap-1.5 z-20">
                  <Crown className="w-4 h-4 text-slate-900 fill-slate-700" />
                  التاج الفضي المميز ✦
                </div>
              )}

              {/* Free Branding Floating Tag */}
              {pkg.id === 'free' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 text-emerald-950 font-black text-[10px] sm:text-[11px] px-5 py-1.5 sm:py-2 rounded-full shadow-[0_5px_15px_rgba(16,185,129,0.4)] border border-emerald-200 flex items-center gap-1.5 z-20">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-emerald-900" />
                  الباقة المجانية ✧
                </div>
              )}

              {/* Inner container to capture the 3D block model feel */}
              <div className={`relative rounded-xl p-4 sm:p-5 flex flex-col flex-1 h-full w-full bg-[#050505] shadow-[inset_0_2px_15px_rgba${isFree ? '(16,185,129,0.15)' : '(148,163,184,0.15)'}] overflow-hidden`}>
                <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${isFree ? 'from-emerald-900/10' : 'from-slate-400/10'} to-transparent pointer-events-none rounded-t-xl`}></div>

                <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border ${pkg.iconBg} shadow-lg`}>
                    <pkg.icon className={`w-5 h-5 ${pkg.color}`} />
                  </div>
                  {pkg.badge && (
                    <span className={`text-[9px] py-1 px-2.5 rounded-full font-bold ${pkg.badgeStyle} shadow-sm`}>
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2 font-display relative z-10 ${pkg.id === 'free' ? 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'drop-shadow-[0_0_15px_rgba(148,163,184,0.5)]'}`}>
                  {pkg.name}
                </h3>
                <p className={`text-lg sm:text-xl font-black mb-4 ${pkg.priceStyle} relative z-10`}>
                  {pkg.price}
                </p>

                <ul className="mb-5 space-y-2.5 sm:space-y-3 flex-1 text-right relative z-10">
                  {pkg.features.map((feature, idx) => (
                    <li key={`${pkg.id}-${idx}`} className="flex items-start gap-2.5 text-[11px] sm:text-[13px] text-gray-300">
                      <Check className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 ${isFree ? 'text-emerald-400' : 'text-slate-300'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.id === 'free' ? (
                  <div className="relative z-10 w-full py-3 text-center text-emerald-400 text-[11px] sm:text-xs font-extrabold border border-emerald-500/20 bg-emerald-950/20 rounded-xl shadow-inner font-display">
                     مفعلة تلقائياً للحساب ✧
                  </div>
                ) : (
                  <button 
                    onClick={() => handlePkgClick(pkg.id)} 
                    className={`relative z-10 w-full py-3 sm:py-3.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all duration-200 transform active:scale-95 shadow-lg ${pkg.buttonStyle}`}
                  >
                    اشتراك وترقية
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    
    {selectedPkg && <PaymentModal packageId={selectedPkg} onClose={() => setSelectedPkg(null)} onConfirm={() => onSubscriptionRequest(selectedPkg)} />}
    
    {showPendingOverlay && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
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

