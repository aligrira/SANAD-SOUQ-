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
      name: 'العضوية التأسيسية (مجاناً)',
      price: 'مجاناً للأبد',
      icon: Zap,
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-950/30 border-emerald-500/20',
      badge: 'انطلاقة واثقة',
      badgeStyle: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      features: [
        'نشر إعلانات بدون حدود وبسرعة',
        'دعم فني عادي على مدار الساعة',
        'ظهور كعرض افتراضي أنيق',
        'حضور مميز في بوابات سوق سند',
      ],
      cardStyle: 'border-emerald-500/10 bg-gradient-to-b from-[#06100c] via-[#030705] to-[#010201] shadow-[0_12px_30px_rgba(16,185,129,0.03)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.06)]',
      priceStyle: 'text-emerald-400 font-extrabold text-[#10B981]',
      buttonStyle: 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-950/40 hover:text-emerald-300 cursor-pointer'
    },
    {
      id: 'bronze',
      name: 'الباقة البرونزية المميزة',
      price: '30 د.ت / شهر',
      icon: Star,
      color: 'text-amber-500',
      iconBg: 'bg-amber-950/30 border-amber-500/20',
      badge: 'الخيار المستقل الناجح',
      badgeStyle: 'bg-amber-600/10 text-amber-500 border border-amber-500/20',
      features: [
        'نشر إعلانات بدون حدود وسرعة تفعيل',
        '2 إعلانات ممولة شهرياً في الصدارة',
        'شارة برونزية ثلاثية الأبعاد بجوار الاسم',
        'إنشاء بوسترات فنية مميزة للعروض',
        'دعم عبر البريد الإلكتروني ذو أولوية',
      ],
      cardStyle: 'border-amber-600/20 bg-gradient-to-b from-[#140f06] via-[#070502] to-[#010101] shadow-[0_12px_30px_rgba(245,158,11,0.03)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.06)]',
      priceStyle: 'text-amber-500 font-extrabold',
      buttonStyle: 'bg-amber-950/40 text-[#f59e0b] border border-amber-500/20 hover:bg-amber-900/40 hover:text-amber-305 cursor-pointer'
    },
    {
      id: 'vip',
      name: 'الباقة الذهبية الملكية VIP',
      price: '50 د.ت / شهر',
      icon: Crown,
      color: 'text-[#D4AF37]',
      iconBg: 'bg-gradient-to-tr from-[#2d2208] to-[#120e03] border-[#D4AF37]/30',
      badge: 'العضوية الملكية الفاخرة',
      badgeStyle: 'bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/15 text-[#D4AF37] border border-[#D4AF37]/30 font-black',
      features: [
        'نشر إعلانات بدون حدود وتفعيل فوري بقوة',
        '5 إعلانات ممولة شهرياً في الواجهة',
        'شارة ذهبية ملكية VIP محققة ولامعة',
        'ظهور دائم في طليعة ستوريز سوق سند',
        'إنشاء بوسترات غير محدودة وبتصاميم فخمة للغاية',
        'دعم فني ملكي سريع وخاص عبر واتساب متاح دائماً',
      ],
      cardStyle: '', // Custom handled inside wrapper with shiny gradient border
      priceStyle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#AA7C11] font-black',
      buttonStyle: 'bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#AA7C11] text-black font-black shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-[0.98] cursor-pointer'
    }
  ];

  return (
    <>
    <div className="py-12" dir="rtl">
      <div className="text-center mb-12 px-4 space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold border border-[#D4AF37]/20">
           <Sparkles className="w-4 h-4 animate-pulse-slow" />
           باقات الارتقاء والتميز
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-white tracking-tight">باقات التميز من سوق سند</h2>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">اختر المستوى الملكي الذي يضمن انتشار عروضك التجارية والعقارية بلمسة مخملية تميز خدماتك.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-5xl mx-auto items-stretch">
        {packages.map((pkg) => {
          if (pkg.id === 'vip') {
            // VIP Card Wrapper with a beautifully decorated gold shiny gradient border and layout
            return (
              <div 
                key={pkg.id}
                className="relative rounded-[2rem] bg-gradient-to-tr from-[#AA7C11] via-[#FFF3B0] to-[#D4AF37] p-[2.5px] shadow-[0_15px_40px_rgba(212,175,55,0.12)] flex flex-col max-w-sm mx-auto w-full group transition-all duration-300 hover:scale-[1.03]"
              >
                {/* Floating Crown Badge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-black text-[10px] sm:text-xs px-4 py-1.5 rounded-full shadow-lg border border-[#FFF3B0] flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  شعبية وموصى بها
                </div>

                {/* Inner Card Section */}
                <div className="bg-gradient-to-b from-[#0f0c05] via-[#050505] to-[#010101] rounded-[1.85rem] p-7 flex flex-col flex-1 h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pkg.iconBg}`}>
                      <pkg.icon className={`w-6 h-6 ${pkg.color} animate-pulse-slow`} />
                    </div>
                    {pkg.badge && (
                      <span className={`text-[10px] py-1 px-3 rounded-full font-bold ${pkg.badgeStyle}`}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 font-display">{pkg.name}</h3>
                  <p className={`text-2xl font-black mb-6 ${pkg.priceStyle}`}>
                    {pkg.price}
                  </p>

                  <ul className="mb-8 space-y-3.5 flex-1 text-right">
                    {pkg.features.map((feature, idx) => (
                      <li key={`${pkg.id}-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
                        <Check className="w-4 h-4 text-[#D3AF37] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handlePkgClick(pkg.id)} 
                    className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all ${pkg.buttonStyle}`}
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
            ? 'from-emerald-950/40 via-emerald-800/20 to-emerald-950/25' 
            : 'from-amber-900/40 via-amber-700/20 to-amber-950/25';
          const glowShadowClass = isFree
            ? 'hover:shadow-[0_20px_45px_rgba(16,185,129,0.08)]'
            : 'hover:shadow-[0_20px_45px_rgba(245,158,11,0.08)]';
          
          return (
            <div 
              key={pkg.id}
              className={`relative rounded-[2rem] p-[2px] bg-gradient-to-tr ${outerRingColor} flex flex-col max-w-sm mx-auto w-full transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 ${glowShadowClass}`}
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Inner container to capture the 3D block model feel */}
              <div className={`rounded-[1.85rem] p-7 flex flex-col flex-1 h-full w-full ${pkg.cardStyle}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pkg.iconBg}`}>
                    <pkg.icon className={`w-5 h-5 ${pkg.color}`} />
                  </div>
                  {pkg.badge && (
                    <span className={`text-[10px] py-1 px-3 rounded-full font-bold ${pkg.badgeStyle} shadow-sm`}>
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-display">{pkg.name}</h3>
                <p className={`text-xl font-black mb-6 ${pkg.priceStyle}`}>
                  {pkg.price}
                </p>

                <ul className="mb-8 space-y-3.5 flex-1 text-right">
                  {pkg.features.map((feature, idx) => (
                    <li key={`${pkg.id}-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isFree ? 'text-emerald-400' : 'text-amber-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.id === 'free' ? (
                  <div className="w-full py-3.5 text-center text-emerald-400 text-sm font-extrabold border border-emerald-500/20 bg-emerald-950/10 rounded-2xl shadow-inner font-display">
                     مفعلة تلقائياً للحساب ✧
                  </div>
                ) : (
                  <button 
                    onClick={() => handlePkgClick(pkg.id)} 
                    className={`w-full py-3.5 rounded-2xl text-sm font-extrabold transition-all duration-200 transform active:scale-95 shadow-md ${pkg.buttonStyle}`}
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

