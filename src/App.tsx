/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, User, Filter, Globe, PlusCircle, Crown, Star, ShoppingBag, ShieldCheck, MessageCircle, Bot, Sparkles, Grid, Shirt, Baby, Car, Smartphone, Home, Coffee, PawPrint, Package, BrainCircuit, X } from 'lucide-react';
import { Product, Story } from './types';
import { safeStorage } from './lib/safeStorage';
import SplashScreen from './components/SplashScreen';
import CursorGlow from './components/CursorGlow';
import VipStoriesRow from './components/VipStoriesRow';
import ListingCard from './components/ListingCard';
import AIAssistant from './components/AIAssistant';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import AddProductModal from './components/AddProductModal';
import ProductDetailsModal from './components/ProductDetailsModal';
import ProfileModal from './components/ProfileModal';
import Sidebar from './components/Sidebar';
import PricingPackages from './components/PricingPackages';
import Toast from './components/Toast';
import confetti from 'canvas-confetti';

import Footer from './components/Footer';

// Dummy Data mimicking Firestore
const DUMMY_STORIES: Story[] = [];

const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'هاتف آيفون 15 برو ماكس تيتانيوم مذهب',
    description: 'آيفون ١٥ برو ماكس ٢٥ كيقا بايت تيتانيوم بحالة جديدة تماماً ومحمي بالكامل ولا خدش واحد. بطارية 98٪ مستورد من أوروبا ومع كامل ملحقاته الأصلية وصندوقه الأصلي الموثق.',
    price: 3450,
    category: 'إلكترونيات',
    imageUrls: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=85&w=600'],
    sellerId: '98765432',
    sellerName: 'سامي بن علي',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    location: 'تونس',
    createdAt: 'منذ ساعتين',
    plan: 'vip',
    isVip: true,
    status: 'active',
    comments: [
      { id: 'c1', userId: 'u100', userName: 'أحمد بن صالح', text: 'سلام، هل السعر قابل للنقاش قليلاً؟', createdAt: 'منذ ساعة' },
      { id: 'c2', userId: 'me', userName: 'سامي بن علي', text: 'أهلاً بك أحمد، نعم يمكنك الاتصال بي لمناقشة التفاصيل عبر الرقم المرفق.', createdAt: 'منذ نصف ساعة' }
    ]
  },
  {
    id: 'p2',
    title: 'شقة بنتهاوس فاخرة مطلة على ضفاف البحيرة 2',
    description: 'شقة فاخرة ومفروشة بالكامل بنظام السكن الراقي في أفضل مكان في ضفاف البحيرة 2. صالون واسع مع إطلالة مفتوحة على المياه، مطبخ مجهز بأرقى المعدات، غرفتين نوم جناح رئيسي وحراسة ومواقف سيارات خاصة.',
    price: 480000,
    category: 'عقارات',
    imageUrls: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=85&w=600'],
    sellerId: '21698242',
    sellerName: 'مكتب المعز العقاري',
    sellerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    location: 'تونس',
    createdAt: 'منذ يوم',
    plan: 'vip',
    isVip: true,
    status: 'active',
    comments: []
  },
  {
    id: 'p3',
    title: 'ساعة رولكس صبمارينر النخبة الرياضية الأصلية',
    description: 'سبمارينير التاريخية الأيقونية بإطار أخضر بروتكتيف، علبة وصندوق وكارت الضمان ساري المفعول لغاية 2028. لم تستعمل سوى مرات قليلة للمناسبات الراقية جداً.',
    price: 36000,
    category: 'ماكياج و اكسسوارات',
    imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=85&w=600'],
    sellerId: '92942482',
    sellerName: 'أدمن سند للسلع النفيسة',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    location: 'سوسة',
    createdAt: 'منذ ٣ ساعات',
    plan: 'bronze',
    isVip: false,
    status: 'active',
    comments: [
      { id: 'cx1', userId: 'u200', userName: 'رانية', text: 'رائعة جداً، هل الضمان ساري المفعول في تونس؟', createdAt: 'منذ ساعة' }
    ]
  },
  {
    id: 'p4',
    title: 'سيارة مرسيدس Mercedes Benz C-Class C180 AMG Line',
    description: 'مرسيدس سي كلاس موديل 2023 عداد 23 ألف كم فقط. صيانة كاملة وكتالوجات في الدار الرسمية، سقف بانورامي عريض، حزمة ألوان داخلية تفاعلية، طي كهربائي للمرايا ومساعد قيادة ذكي وخالٍ تماماً من الصدمات.',
    price: 138000,
    category: 'سيارات و دراجات',
    imageUrls: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=85&w=600'],
    sellerId: '55648931',
    sellerName: 'كريم الحمامي',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    location: 'صفاقس',
    createdAt: 'منذ يومين',
    plan: 'free',
    isVip: false,
    status: 'active',
    comments: []
  }
];

const CATEGORIES = [
  'الكل',
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
const REGIONS = [
  'الكل', 'أريانة', 'باجة', 'بن عروس', 'بنزرت', 'تطاوين', 'توزر', 'تونس', 'جندوبة', 'زغوان', 'سليانة', 
  'سوسة', 'سيدي بوزيد', 'صفاقس', 'قابس', 'قبلي', 'القصرين', 'قفصة', 'القيروان', 'الكاف', 'مدنين', 
  'المنستير', 'منوبة', 'المهدية', 'نابل'
];

export default function App() {
  const triggerHaptic = (pattern: number | number[]) => {
    try {
      if (typeof window !== 'undefined' && navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch (err) {
      console.warn('Haptic feedback is not supported or blocked:', err);
    }
  };

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = safeStorage.getItem('sanad_products');
    return saved ? JSON.parse(saved) : DUMMY_PRODUCTS;
  });
  const [systemUsers, setSystemUsers] = useState<any[]>(() => {
    const saved = safeStorage.getItem('sanad_system_users');
    return saved ? JSON.parse(saved) : [
      { id: 'admin1', name: 'أدمن سند', phone: '92942482', plan: 'vip' }
    ];
  });
  const [systemRequests, setSystemRequests] = useState<any[]>(() => {
    const saved = safeStorage.getItem('sanad_system_requests');
    return saved ? JSON.parse(saved) : [];
  });
  const [notificationsCount, setNotificationsCount] = useState(() => {
    const saved = safeStorage.getItem('sanad_notifications_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [userNotifications, setUserNotifications] = useState<any[]>(() => {
    const saved = safeStorage.getItem('sanad_user_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [currentUserPlan, setCurrentUserPlan] = useState<'free' | 'bronze' | 'vip'>(() => {
    const saved = safeStorage.getItem('sanad_current_user_plan');
    return (saved as 'free' | 'bronze' | 'vip') || 'free';
  });
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(() => {
    return safeStorage.getItem('sanad_current_user_phone');
  });
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'warning' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 4000);
  };

  // Sync state to safeStorage
  useEffect(() => {
    safeStorage.setItem('sanad_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeStorage.setItem('sanad_system_users', JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    safeStorage.setItem('sanad_system_requests', JSON.stringify(systemRequests));
  }, [systemRequests]);

  useEffect(() => {
    safeStorage.setItem('sanad_notifications_count', notificationsCount.toString());
  }, [notificationsCount]);

  useEffect(() => {
    safeStorage.setItem('sanad_user_notifications', JSON.stringify(userNotifications));
  }, [userNotifications]);

  useEffect(() => {
    safeStorage.setItem('sanad_current_user_plan', currentUserPlan);
  }, [currentUserPlan]);

  // Synchronize currentUserPlan with system database changes dynamically so plan transitions are immediate
  useEffect(() => {
    const userObj = systemUsers.find(u => u.phone === currentUserPhone);
    if (userObj && userObj.plan !== currentUserPlan) {
      setCurrentUserPlan(userObj.plan);
    }
  }, [systemUsers, currentUserPhone, currentUserPlan]);

  // PWA & Browser App Installation Triggers
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const isDismissed = safeStorage.getItem('sanad_app_install_dismissed') === 'true';
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

    if (!isStandalone && !isDismissed) {
      // Show promotional installer banner after 5 seconds to invite user to pin on screen
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const [showAdmin, setShowAdmin] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    if (currentUserPhone) {
      safeStorage.setItem('sanad_current_user_phone', currentUserPhone);
    } else {
      safeStorage.removeItem('sanad_current_user_phone');
    }
  }, [currentUserPhone]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedRegion, setSelectedRegion] = useState('الكل');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  // Handle Haptic Pull to Refresh
  const handleTouchStart = (e: React.TouchEvent) => {
     if (window.scrollY === 0) {
        touchStartY.current = e.touches[0].clientY;
     }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
     if (window.scrollY === 0 && touchStartY.current !== 0) {
         const currentY = e.touches[0].clientY;
         if (currentY - touchStartY.current > 100 && !isRefreshing) {
             setIsRefreshing(true);
             triggerHaptic(50); // Haptic feedback
             setTimeout(() => {
                setIsRefreshing(false);
                triggerHaptic([30, 50, 30]); // Success chime pattern
             }, 1500);
         }
     }
  };

  const handleTouchEnd = () => {
      touchStartY.current = 0;
  };

  const pendingRequest = systemRequests.find(r => r.phone === currentUserPhone && r.status === 'pending');
  const currentUserObj = systemUsers.find(u => u.phone === currentUserPhone);

  // Auto clean-up stale or invalid user sessions to prevent crash
  useEffect(() => {
    if (currentUserPhone && !systemUsers.some(u => u.phone === currentUserPhone)) {
      setCurrentUserPhone(null);
      setCurrentUserPlan('free');
    }
  }, [currentUserPhone, systemUsers]);

  const handleAuth = (isLogin: boolean, phone: string, name: string) => {
      if (isLogin) {
          const user = systemUsers.find(u => u.phone === phone);
          if (user) {
              setCurrentUserPhone(phone);
              setCurrentUserPlan(user.plan);
              setShowAuth(false);
              return true;
          }
          return false;
      } else {
          const existing = systemUsers.find(u => u.phone === phone);
          if (existing) return false;
          
          const newUser = { id: phone, name, phone, plan: 'free' };
          setSystemUsers([...systemUsers, newUser]);
          setCurrentUserPhone(phone);
          setCurrentUserPlan('free');
          setShowAuth(false);
          return true;
      }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    setShowAddProduct(false);
    setNotificationsCount(prev => prev + 1); // Add notification when new ad is created
    
    // Celebrations
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10B981', '#ffffff']
    });
    
    showToast('تم نشر إعلانك بنجاح!', 'success');
  };

  const handleSubscriptionRequest = (plan: string) => {
    if (!currentUserPhone) {
        setShowAuth(true);
        return;
    }
    const newReq = {
        id: Date.now().toString(),
        user: `User ${currentUserPhone}`,
        phone: currentUserPhone,
        plan,
        status: 'pending'
    };
    setSystemRequests([newReq, ...systemRequests]);
    setNotificationsCount(prev => prev + 1);
    showToast('تم إرسال طلب الاشتراك، سيتم تفعيل باقتك بعد تأكيد الدفع', 'success');
  };

  const filteredProducts = products.filter(p => {
      const matchCat = selectedCategory === 'الكل' || p.category === selectedCategory;
      const matchReg = selectedRegion === 'الكل' || p.location.includes(selectedRegion);
      const matchSearch = !searchQuery.trim() || 
         p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchReg && matchSearch;
  });

  const enrichedProducts = filteredProducts.map(p => {
    const userObj = systemUsers.find(u => u.phone === p.sellerId);
    return {
      ...p,
      sellerName: userObj?.name || p.sellerName,
      sellerAvatar: userObj?.avatar || p.sellerAvatar,
      plan: userObj?.plan || p.plan // Update plan from userObj if exists
    };
  });

  const vipProducts = enrichedProducts.filter(p => p.plan === 'vip');
  const bronzeProducts = enrichedProducts.filter(p => p.plan === 'bronze');
  const generalProducts = enrichedProducts.filter(p => p.plan === 'free' || !p.plan);

  const stories: Story[] = enrichedProducts
    .filter(p => p.plan === 'vip' || p.plan === 'bronze')
    .sort((a, b) => {
       if (a.plan === 'vip' && b.plan !== 'vip') return -1;
       if (a.plan !== 'vip' && b.plan === 'vip') return 1;
       return 0;
    })
    .map(p => {
       return {
          id: p.id,
          sellerId: p.sellerId,
          sellerName: p.sellerName,
          title: p.title,
          sellerAvatar: p.sellerAvatar || 'https://via.placeholder.com/150',
          imageUrl: p.imageUrls?.[0] || 'https://via.placeholder.com/400',
          createdAt: p.createdAt,
          expiresAt: p.createdAt,
          isVip: p.plan === 'vip'
       };
    });

  const EmptyState = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="bg-gray-900/40 border border-[#1f2937]/50 rounded-2xl p-6 py-16 flex flex-col items-center justify-center text-center max-w-xs sm:max-w-sm mx-auto w-full">
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 border border-gray-800">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <p className="text-gray-400 max-w-[240px] text-sm leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020806] text-white" dir="rtl">
      <CursorGlow />
      <SplashScreen show={showSplash} onFinish={() => setShowSplash(false)} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#020806]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowSidebar(true)} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors" title="القائمة">
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-2xl font-bold font-display tracking-tight text-white">
                سوق <span className="text-gradient-gold">سند</span>
              </span>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن المنتجات الفاخرة..."
                  className="w-full bg-[#050505] border border-gray-800 rounded-full py-2.5 pr-12 pl-12 focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
                  dir="rtl"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    title="مسح البحث"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (currentUserPhone) { setShowAddProduct(true); } else { setShowAuth(true); } }}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black px-4 py-2 rounded-full font-bold shadow-lg shadow-[#D4AF37]/20 hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="w-5 h-5" />
                <span>إضافة إعلان</span>
              </button>

              {currentUserPhone && (
                <button 
                  type="button"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (currentUserPhone === '92942482') {
                      setShowAdmin(true); 
                    } else {
                      setShowNotificationsModal(true);
                    }
                  }} 
                  className="relative w-10 h-10 rounded-full border border-gray-700 bg-[#050505] flex items-center justify-center hover:border-[#D4AF37] transition-colors"
                  title="الإشعارات"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                  {currentUserPhone === '92942482' ? (
                    notificationsCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#020806]"></span>
                  ) : (
                    userNotifications.filter(n => n.userPhone === currentUserPhone && !n.read).length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-[#020806] animate-pulse"></span>
                  )}
                </button>
              )}
              
              <div className="flex items-center gap-2">
                {!currentUserPhone && <span className="hidden md:inline text-xs font-bold text-gray-300 cursor-pointer hover:text-[#D4AF37] transition-colors" onClick={() => setShowAuth(true)}>تسجيل الدخول</span>}
                <button 
                  type="button"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (currentUserPhone) { 
                      setShowProfile(true); 
                    } else { 
                      setShowAuth(true); 
                    } 
                  }} 
                  className="w-10 h-10 rounded-full border border-gray-700 bg-[#050505] flex items-center justify-center hover:border-[#D4AF37] transition-colors overflow-hidden"
                >
                  {currentUserObj?.avatar ? (
                    <img src={currentUserObj.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        ref={mainRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >
        {isRefreshing && (
           <div className="flex justify-center mb-6">
              <div className="w-6 h-6 rounded-full border-2 border-t-[#D4AF37] border-gray-800 animate-spin" />
           </div>
        )}

        <VipStoriesRow stories={stories} onStoryClick={(id) => {
            const prod = products.find(p => p.id === id);
            if (prod) setSelectedProduct(prod);
        }} />

        {/* Intro Section */}
        <div className="mb-10 text-center mx-auto space-y-4 max-w-lg mt-2 px-2">
           <div className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-[#10B981]/20">
              <ShieldCheck className="w-4 h-4" />
              المنصة الأولى للتميز
           </div>
           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display leading-tight text-white mb-2">
              سوق سند: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">فضاؤكم للبيع والتميز</span> في تونس
           </h1>
           <p className="text-gray-400 text-xs sm:text-sm px-2">
              نحن لسنا مجرد وسيط، نحن نمنح إعلاناتك الهوية الملكية التي تستحقها، لتصل لزبائنك بدقة واحترافية عالية.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full max-w-sm mx-auto px-2">
              <button 
                onClick={() => currentUserPhone ? setShowAddProduct(true) : setShowAuth(true)} 
                className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-extrabold rounded-xl shadow-md shadow-[#D4AF37]/15 hover:opacity-90 active:scale-98 transition-all text-sm sm:text-base"
              >
                 ابدأ البيع الآن
              </button>
              <button 
                onClick={() => {
                  const targetEl = document.getElementById('listings-head');
                  if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="w-full sm:w-auto flex-1 px-5 py-3 bg-black/50 text-white font-bold rounded-xl border border-gray-800 hover:border-gray-500 active:scale-98 transition-all text-sm sm:text-base"
              >
                 تصفح العروض
              </button>
           </div>
        </div>

        {/* Filters */}
        <div className="space-y-6 mb-12 relative z-10">
           {/* Mobile Search Bar inside Filters */}
           <div className="md:hidden flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 mr-2">البحث الذكي</span>
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن هاتف، سيارة، شقة..."
                  className="w-full bg-[#050505] border border-gray-800 rounded-2xl py-3.5 pr-12 pl-12 focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
                  dir="rtl"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
           </div>

           {/* Regions Selector */}
           <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 mr-2">تصفية حسب الولاية</span>
              <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide">
                 <div className="p-2.5 bg-gray-900 rounded-xl border border-gray-800 shrink-0">
                    <Globe className="w-4 h-4 text-[#10B981]" />
                 </div>
                 {REGIONS.map(reg => (
                    <button
                       type="button"
                       key={reg}
                       onClick={() => setSelectedRegion(reg)}
                       className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedRegion === reg 
                             ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20 font-bold scale-102 border border-[#10B981]' 
                             : 'bg-[#050505] text-gray-400 border border-gray-800 hover:border-gray-600'
                       }`}
                    >
                       {reg}
                    </button>
                 ))}
              </div>
           </div>

           {/* Hot Luxury Categories Divider & Slider */}
           <div className="flex flex-col gap-2 border-t border-gray-800/40 pt-4">
              <span className="text-xs font-bold text-gray-500 mr-2">تصفية حسب صنف المنتجات</span>
              <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide">
                 <button
                    type="button"
                    onClick={() => setSelectedCategory('الكل')}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                       selectedCategory === 'الكل'
                          ? 'bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)] font-bold scale-102'
                          : 'bg-[#050505] text-gray-400 border border-gray-800 hover:border-gray-600'
                    }`}
                 >
                    <Grid className="w-4 h-4" />
                    <span>الكل</span>
                 </button>

                 {CATEGORIES.filter(c => c !== 'الكل').map(cat => {
                    const catIcons: Record<string, any> = {
                      'ملابس رجال': Shirt,
                      'ملابس نساء': User,
                      'ملابس اطفال': Baby,
                      'ماكياج و اكسسوارات': Star,
                      'سيارات و دراجات': Car,
                      'عقارات': Home,
                      'إلكترونيات': Smartphone,
                      'أثاث': Package,
                      'أدوات منزلية': Coffee,
                      'حيوانات': PawPrint,
                    };
                    const IconComp = catIcons[cat] || Package;
                    const isSelected = selectedCategory === cat;

                    return (
                       <button
                          type="button"
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                             isSelected
                                ? 'bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)] font-bold scale-102'
                                : 'bg-[#050505] text-gray-400 border border-gray-800 hover:border-gray-600'
                          }`}
                       >
                          <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                          <span>{cat}</span>
                       </button>
                    );
                 })}
              </div>
           </div>
        </div>
        
        {/* Section VIP */}
        <div className="mb-12" id="listings-head">
            <div className="flex flex-col items-center text-center justify-center gap-2 mb-6 px-4">
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] shrink-0" />
              <div>
                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-white text-center">قسم النخبة VIP</h2>
                 <p className="text-xs sm:text-sm text-gray-400 text-center px-4 max-w-md mx-auto">أرقى العروض والسلع الحصرية في تونس</p>
              </div>
            </div>
            {vipProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {vipProducts.map(product => (
                     <ListingCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState icon={Crown} title="لا توجد عروض" desc="لا توجد عروض VIP حالياً في هذا القسم" />
            )}
        </div>

        {/* Section Bronze */}
        <div className="mb-12">
            <div className="flex flex-col items-center text-center justify-center gap-2 mb-6 px-4">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-[#d97706] shrink-0" />
              <div>
                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-[#d97706] text-center">عروض التميز البرونزية</h2>
                 <p className="text-xs sm:text-sm text-gray-400 text-center px-4 max-w-md mx-auto">اختياراتنا المميزة لبائعين موثوقين</p>
              </div>
            </div>
            {bronzeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {bronzeProducts.map(product => (
                     <ListingCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState icon={Star} title="لا توجد عروض" desc="لا توجد عروض برونزية حالياً في هذا القسم" />
            )}
        </div>

        {/* Section General */}
        <div className="mb-12">
            <div className="flex flex-col items-center text-center justify-center gap-2 mb-6 px-4">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-[#10B981] shrink-0" />
              <div>
                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-[#10B981] text-center">القائمة العامة</h2>
                 <p className="text-xs sm:text-sm text-gray-400 text-center px-4 max-w-md mx-auto">عروض سوقنا المتنوعة لكل الفئات</p>
              </div>
            </div>
            {generalProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {generalProducts.map(product => (
                     <ListingCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState icon={ShoppingBag} title="لا توجد عروض" desc="لا توجد عروض حالياً في هذا القسم" />
            )}
        </div>

        {/* Pricing Packages */}
        <PricingPackages 
           onSubscriptionRequest={handleSubscriptionRequest} 
           hasPendingRequest={!!pendingRequest}
           showToast={showToast}
           currentUserPhone={currentUserPhone}
        />
        
        <Footer />
      </main>

      {/* AI Assistant Chat Modal */}
      <AnimatePresence>
         {showAIChat && (
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-48px)] shadow-2xl"
               dir="rtl"
            >
               <AIAssistant onClose={() => setShowAIChat(false)} />
            </motion.div>
         )}
      </AnimatePresence>
      
      <AnimatePresence>
         {showSidebar && <Sidebar categories={CATEGORIES} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onClose={() => setShowSidebar(false)} />}
         {showAdmin && <AdminPanel 
            onClose={() => setShowAdmin(false)}
            systemUsers={systemUsers}
            setSystemUsers={setSystemUsers}
            systemRequests={systemRequests}
            setSystemRequests={setSystemRequests}
            onAddUserNotification={(phone: string, msg: string) => {
               const newNotif = {
                  id: String(Date.now()),
                  userPhone: phone,
                  message: msg,
                  read: false,
                  createdAt: new Date().toISOString()
               };
               setUserNotifications(prev => [newNotif, ...prev]);
            }}
            products={products}
            setProducts={setProducts}
            notificationsCount={notificationsCount}
            setNotificationsCount={setNotificationsCount}
         />}
         {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
         {showProfile && <ProfileModal 
            onClose={() => setShowProfile(false)} 
            phone={currentUserPhone ?? undefined} 
            currentUserPlan={currentUserPlan}
            pendingPlan={pendingRequest?.plan}
            currentUser={systemUsers.find(u => u.phone === currentUserPhone)}
            onSaveProfile={(name, avatar) => {
                setSystemUsers(users => users.map(u => u.phone === currentUserPhone ? { ...u, name, avatar } : u));
                showToast('تم حفظ الملف الشخصي بنجاح', 'success');
            }}
            onOpenAdmin={currentUserPhone === '92942482' ? () => { setShowAdmin(true); setShowProfile(false); } : undefined} 
            onLogout={() => { setCurrentUserPhone(null); setCurrentUserPlan('free'); }} 
         />}
         {showAddProduct && <AddProductModal onClose={() => { setShowAddProduct(false); setEditingProduct(null); }} onAdd={(p) => handleAddProduct({...p, plan: currentUserPlan })} onEdit={(p) => {
              setProducts(products.map(prod => prod.id === p.id ? p : prod));
              setShowAddProduct(false);
              setEditingProduct(null);
              showToast('تم تحديث الإعلان بنجاح', 'success');
          }} currentUserPhone={currentUserPhone} currentUser={systemUsers.find(u => u.phone === currentUserPhone)} initialProduct={editingProduct} />}
         {selectedProduct && <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} currentUserPhone={currentUserPhone} isAdmin={currentUserPhone === '92942482'} onDelete={() => {
             setProducts(products.filter(p => p.id !== selectedProduct.id));
             setSelectedProduct(null);
             showToast('تم حذف الإعلان بنجاح', 'success');
         }} onEdit={(product) => {
             setEditingProduct(product);
             setShowAddProduct(true);
         }} />}
         {/* Notifications Modal for Regular Users */}
         {showNotificationsModal && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
               onClick={() => {
                  // Mark all notifications for this user as read when closing
                  setUserNotifications(prev => prev.map(n => n.userPhone === currentUserPhone ? { ...n, read: true } : n));
                  setShowNotificationsModal(false);
               }}
            >
               <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-gradient-to-b from-[#0a0a0a] to-[#020202] border border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden text-right"
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Background gold aura decoration */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex justify-between items-center pb-4 border-b border-gray-900 mb-6 font-display">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                           <span className="text-sm">🔔</span>
                        </div>
                        <h3 className="text-lg font-black font-display text-white">إشعارات الحساب</h3>
                     </div>
                     <button 
                        onClick={() => {
                           setUserNotifications(prev => prev.map(n => n.userPhone === currentUserPhone ? { ...n, read: true } : n));
                           setShowNotificationsModal(false);
                        }}
                        className="p-2 bg-gray-900 hover:bg-gray-800 rounded-full border border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                     {userNotifications.filter(n => n.userPhone === currentUserPhone).length > 0 ? (
                        userNotifications
                          .filter(n => n.userPhone === currentUserPhone)
                          .map((n) => (
                             <div 
                                key={n.id} 
                                className={`p-4 rounded-2xl border ${!n.read ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'border-gray-950 bg-black/40'} transition-all`}
                             >
                                <div className="flex items-start gap-3">
                                   <div className="w-8 h-8 rounded-full bg-red-600/10 border border-[#D4AF37]/10 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                   </div>
                                   <div className="space-y-1 flex-1 text-right">
                                      <p className="text-white text-sm font-bold leading-relaxed">{n.message}</p>
                                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                         {new Date(n.createdAt).toLocaleDateString('ar-TN', { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                   </div>
                                </div>
                             </div>
                          ))
                     ) : (
                        <div className="text-center py-12 text-gray-500 space-y-3">
                           <span className="text-3xl inline-block animate-bounce">🔔</span>
                           <p className="text-xs">المستقبل هادئ، لا توجد إشعارات جديدة حالياً.</p>
                        </div>
                     )}
                  </div>

                  <button 
                     onClick={() => {
                        setUserNotifications(prev => prev.map(n => n.userPhone === currentUserPhone ? { ...n, read: true } : n));
                        setShowNotificationsModal(false);
                     }}
                     className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-extrabold text-sm rounded-xl hover:opacity-95 mt-6 transition-opacity cursor-pointer text-center font-display"
                  >
                     فهمت وتأكيد القراءة
                  </button>
               </motion.div>
            </motion.div>
         )}

         <Toast toast={toast} onClose={() => setToast(null)} />
      </AnimatePresence>

      {/* AI Assistant Chat Trigger with Ambient Halo - Positoned bottom-right with attractive cyber gradients */}
      <div className="fixed bottom-6 right-6 z-40">
         <div className="absolute inset-0 bg-gradient-to-tr from-[#9333EA] via-[#EC4899] to-[#3B82F6] rounded-full blur-xl opacity-50 animate-pulse pointer-events-none" />
         <button 
            type="button"
            onClick={() => setShowAIChat(!showAIChat)} 
            className="relative p-4 bg-gradient-to-tr from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] text-white rounded-full shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:scale-110 active:scale-95 hover:rotate-6 transition-all duration-300 group"
            title="مساعد سند الذكي"
         >
            <BrainCircuit className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
            </span>
         </button>
      </div>

      {/* WhatsApp Trigger - Swapped to bottom-left */}
      <a href="https://wa.me/21692942482" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 z-40 p-4 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform">
         <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
         </svg>
      </a>
    </div>
  );
}
