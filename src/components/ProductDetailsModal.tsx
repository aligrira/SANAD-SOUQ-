import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Tag, Phone, MessageCircle, Send, Trash2, Sparkles, ChevronDown, Eye, Heart, Share2, AlertTriangle, Star } from 'lucide-react';
import { Product } from '../types';
import { triggerPushNotification, requestPushPermission } from '../lib/pushNotifications';

export default function ProductDetailsModal({ 
  onClose, 
  product, 
  currentUserPhone, 
  isAdmin, 
  onDelete, 
  onEdit,
  onUpdateComments,
  onAddNotification,
  isFavorite,
  onToggleFavorite
}: { 
  key?: React.Key, 
  onClose: () => void, 
  product: Product, 
  currentUserPhone?: string | null, 
  isAdmin?: boolean, 
  onDelete?: () => void, 
  onEdit?: (product: Product) => void,
  onUpdateComments?: (productId: string, comments: any[]) => void,
  onAddNotification?: (phone: string, message: string) => void,
  isFavorite?: boolean,
  onToggleFavorite?: (e: React.MouseEvent) => void
}) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(product.comments || []);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const clickBuffer = React.useRef<number>(0);
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    if (!onToggleFavorite) return;
    
    const now = Date.now();
    if (now - clickBuffer.current < 400) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 900);
      if (!isFavorite) {
        onToggleFavorite(e);
      }
      clickBuffer.current = 0;
    } else {
      clickBuffer.current = now;
    }
  };

  const handleRequestPermission = async () => {
    const res = await requestPushPermission();
    setPermissionStatus(res);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `سوق سند - ${product.title}`,
          text: `شاهد هذا الإعلان في سوق سند: ${product.title}\nبسعر: ${product.price} د.ت`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(`شاهد هذا الإعلان في سوق سند: ${product.title}\nالسعر: ${product.price} د.ت`);
      alert('تم نسخ رابط التفاصيل بنجاح!');
    }
  };

  const handleReport = () => {
    setIsReported(true);
    alert('تم إرسال بلاغك وسيقوم فريق سوق سند بمراجعته. شكراً لاهتمامك.');
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = { 
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), 
      userId: currentUserPhone || 'me', 
      userName: currentUserPhone ? currentUserPhone : 'أنا', 
      text: commentText, 
      createdAt: 'الآن' 
    };
    const newComments = [...comments, newComment];
    setComments(newComments);
    setCommentText('');
    if (onUpdateComments) {
      onUpdateComments(product.id, newComments);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    const newComments = comments.filter(c => c.id !== commentId);
    setComments(newComments);
    if (onUpdateComments) {
      onUpdateComments(product.id, newComments);
    }
  };

  const isOwner = currentUserPhone && (currentUserPhone === '92942482' || currentUserPhone === product.sellerId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg overflow-y-auto no-scrollbar scroll-smooth"
      dir="rtl"
    >
      <div className="w-full max-w-lg mx-auto bg-[#050505] min-h-screen relative flex flex-col border-x border-gray-900 shadow-2xl">
        {/* Full Viewport Story Block */}
        <div className="relative h-[100dvh] w-full flex flex-col justify-end p-6 overflow-hidden shrink-0">
          {/* Main Image */}
          <div 
            onClick={handleImageDoubleClick}
            className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden"
          >
            <img 
              src={product.imageUrls[0] || 'https://via.placeholder.com/400'} 
              alt={product.title} 
              className="w-full h-full object-cover object-center select-none pointer-events-none block brightness-110 contrast-105 saturate-110" 
              referrerPolicy="no-referrer" 
            />
            
            {/* Heart Animation Overlay */}
            <AnimatePresence>
              {showHeart && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.8, times: [0, 0.4, 1] }}
                  className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                >
                  <Heart className="w-28 h-28 text-red-500 fill-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,1)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          {/* Floating Actions inside image top */}
          <div className="absolute top-6 left-6 z-20">
             <button onClick={onClose} className="p-3 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-all scale-100 hover:scale-105 active:scale-95 shadow-lg border border-white/10">
                <X className="w-6 h-6" />
             </button>
          </div>

          {isOwner && (
             <div className="absolute top-6 right-6 z-20 flex gap-2">
                {onEdit && (
                    <button onClick={() => { onClose(); onEdit(product); }} className="p-3 bg-blue-500/80 hover:bg-blue-600 backdrop-blur-md rounded-full text-white transition-all scale-100 hover:scale-105 active:scale-95 shadow-lg border border-blue-500/20">
                       <Tag className="w-5 h-5" />
                    </button>
                )}
                {onDelete && (
                    showConfirmDelete ? (
                        <div className="flex items-center gap-2 bg-red-500/95 backdrop-blur-md rounded-full px-4 py-2 border border-red-650 text-white shadow-lg">
                           <span className="text-xs font-bold">هل أنت متأكد؟</span>
                           <button onClick={onDelete} className="p-1 hover:bg-white/25 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                           <button onClick={() => setShowConfirmDelete(false)} className="p-1 hover:bg-white/25 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <button onClick={() => setShowConfirmDelete(true)} className="p-3 bg-red-500/80 hover:bg-red-600 backdrop-blur-md rounded-full text-white transition-all scale-100 hover:scale-105 active:scale-95 shadow-lg border border-red-500/20">
                           <Trash2 className="w-5 h-5" />
                        </button>
                    )
                )}
             </div>
          )}

          {/* VIP Premium Badge */}
          {product.isVip && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] via-[#FFFdd0] to-[#D4AF37] text-black text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-[#D4AF37]/50 flex items-center gap-1 animate-pulse">
               <Sparkles className="w-3.5 h-3.5 fill-black" />
               <span>نخبة VIP</span>
             </div>
          )}

          {/* Content overlay inside story */}
          <div className="relative z-10 w-full space-y-4">
             <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md leading-tight mb-3 font-display">{product.title}</h1>
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#10B981]/25 border border-[#10B981]/30 backdrop-blur-md text-[#10B981] font-black text-xl shadow-md">
                   {product.price} <span className="text-sm font-bold">د.ت</span>
                </div>
             </div>

             {/* Animated Guide indicator */}
             <div className="flex flex-col items-center justify-center pt-8 pb-2 opacity-85">
                <p className="text-xs text-gray-300 font-medium tracking-wide animate-pulse mb-1">اسحب للأعلى لقراءة التفاصيل والتعليقات</p>
                <ChevronDown className="w-5 h-5 text-gray-400 animate-bounce rotate-180" />
             </div>
          </div>
        </div>

        {/* Screen Block 2: Complete Details, Description & Comments */}
        <div className="p-6 pb-48 space-y-8 bg-[#050505]" dir="rtl">
           {/* Tags / Metadata */}
           <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-900 border border-gray-800 px-3.5 py-2 rounded-full font-medium">
                 <MapPin className="w-3.5 h-3.5 text-red-400" /> 
                 <span>ولاية {product.location}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-900 border border-gray-800 px-3.5 py-2 rounded-full font-medium">
                 <Tag className="w-3.5 h-3.5 text-teal-400" /> 
                 <span>قسم {product.category}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-900 border border-gray-800 px-3.5 py-2 rounded-full font-medium">
                 <Eye className="w-3.5 h-3.5 text-blue-400" /> 
                 <span>{product.views || 0} مشاهدة</span>
              </span>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 text-xs text-gray-300 bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:text-white px-3.5 py-2 rounded-full font-medium transition-colors cursor-pointer"
                title="مشاركة العرض"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>مشاركة</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite && onToggleFavorite(e);
                }}
                className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-full font-bold transition-all active:scale-90 border shadow-sm ${
                  isFavorite 
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]' 
                    : 'bg-gray-900/80 text-gray-300 border-gray-800 hover:border-red-500/40 hover:bg-gray-800'
                }`}
              >
                 <motion.div animate={isFavorite ? { scale: [1, 1.4, 1] } : {}}>
                   <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-red-400 fill-transparent'}`} /> 
                 </motion.div>
                 <span>{product.likes || 0} إعجاب</span>
                 {isFavorite && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full mr-1">تم!</span>}
              </button>
           </div>

           {/* Description with high readability card */}
           <div className="p-5 rounded-2xl bg-[#090909] border border-gray-900 shadow-sm relative">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                 <span className="w-1 h-4 bg-[#D4AF37] rounded-full inline-block"></span>
                 تفاصيل الإعلان
              </h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-wrap text-sm">
                 {product.description || 'لا يوجد وصف متاح لهذا الإعلان.'}
              </p>
           </div>

           {/* Seller information card with rich touch handles */}
           <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#040404] border border-gray-800 flex flex-col gap-4 shadow-md">
              <div className="flex items-center gap-3.5">
                 <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-700 shadow-sm shrink-0">
                    <img src={product.sellerAvatar || 'https://via.placeholder.com/150'} alt={product.sellerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-[#0A0A0A] shadow animate-pulse"></div>
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{product.sellerName}</p>
                    <p className="text-[11px] text-[#10B981] font-bold mt-0.5 tracking-wider">بائع نشط في سوق سند</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <Star className="w-3 h-3 text-gray-600 fill-gray-600" />
                      <span className="text-[10px] text-gray-400 ml-1 mr-1.5">(4.0)</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-1">{product.sellerId}</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-1">
                 <a 
                   href={`tel:${product.sellerId}`} 
                   className="flex items-center justify-center gap-2 bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white border border-[#10B981]/20 px-4 py-3 rounded-2xl font-bold transition-all text-xs shadow-sm hover:scale-102 active:scale-98"
                 >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>اتصال ({product.sellerId})</span>
                 </a>
                 <a 
                   href={`https://wa.me/216${product.sellerId?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً، أستفسر عن إعلانك بـ "سوق سند": "${product.title}" بسعر ${product.price} د.ت`)}`}
                   target="_blank" 
                   rel="noreferrer noopener"
                   className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/20 px-4 py-3 rounded-2xl font-bold transition-all text-xs shadow-sm hover:scale-102 active:scale-98"
                 >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>واتساب</span>
                 </a>
              </div>
              <button
                onClick={handleReport}
                disabled={isReported}
                className={`mt-1.5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${isReported ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50' : 'bg-red-500/5 hover:bg-red-500/15 text-red-400 border border-red-500/20 cursor-pointer'}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isReported ? 'تم رفع البلاغ للمراجعة من قبل الإدارة' : 'الإبلاغ عن الإعلان (مخالف / احتيال)'}</span>
              </button>
           </div>

            {/* Interactive Comments system */}
           <div className="pt-2 border-t border-gray-900 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  أسئلة واستفسارات ({comments.length})
              </h3>
              
              <div className="space-y-3 font-sans text-xs">
                 {comments.length > 0 ? (
                    comments.map((c, index) => {
                        const canDelete = isAdmin || currentUserPhone === '92942482' || currentUserPhone === c.userId || currentUserPhone === product.sellerId;
                        return (
                        <div key={c.id} className="bg-gray-950 border border-gray-900 rounded-2xl p-4 space-y-2 text-right">
                            <div className="flex justify-between items-center text-[11px]">
                               <span className="font-bold text-gray-300">{c.userName}</span>
                               <div className='flex items-center gap-2'>
                                   <span className="text-gray-500 font-mono">{c.createdAt}</span>
                                   {canDelete && (
                                       <button onClick={() => handleDeleteComment(c.id)} className="text-red-500 hover:text-red-400 p-1">
                                           <Trash2 className="w-3.5 h-3.5" />
                                       </button>
                                   )}
                               </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{c.text}</p>
                        </div>
                    )})
                 ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-950 rounded-2xl border border-gray-900">
                       لا توجد تعليقات بعد. كن أول من يسأل البائع!
                    </div>
                 )}
              </div>

              {/* Add Comment input frame */}
              <div className="relative pt-2 pb-6">
                  <input 
                     type="text" 
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                     className="w-full bg-[#020806] border border-gray-900 rounded-2xl py-3.5 pr-4 pl-12 text-white focus:border-[#D4AF37] outline-none text-xs transition-colors text-right" 
                     placeholder="اسأل البائع أو اترك تعليقاً..." 
                  />
                  <button 
                     onClick={handleAddComment}
                     className="absolute left-1.5 bottom-[14px] p-2 bg-[#10B981] rounded-xl text-white hover:bg-[#059669] hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#10B981]/15"
                  >
                      <Send className="w-3.5 h-3.5" />
                  </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
