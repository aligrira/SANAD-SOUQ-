import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Phone, Lock, User } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onAuth: (isLogin: boolean, phone: string, name: string) => boolean;
}

export default function AuthModal({ onClose, onAuth }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#050505] rounded-3xl p-6 border border-gray-800 shadow-2xl w-full max-w-sm relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-gray-800">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 mt-2">
            <h2 className="text-2xl font-bold font-display text-white mb-2">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </h2>
            <p className="text-sm text-gray-400">
                {isLogin ? 'مرحباً بعودتك إلى سوق سند' : 'انضم إلى منصة النخبة'}
            </p>
        </div>

        {errorMsg && (
            <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg text-center mb-4 border border-red-500/20">
                {errorMsg}
            </div>
        )}

        <form className="space-y-4 text-right" dir="rtl" onSubmit={(e) => { 
          e.preventDefault(); 
          setErrorMsg('');
          const success = onAuth(isLogin, phone, name);
          if (!success) {
              setErrorMsg(isLogin ? 'رقم الهاتف غير مسجل' : 'رقم الهاتف مسجل مسبقاً');
          }
        }}>
          {!isLogin && (
            <div className="relative">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="w-full bg-[#020806] border border-gray-800 rounded-xl py-3 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none" required={!isLogin} />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          )}
          <div className="relative">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" className="w-full bg-[#020806] border border-gray-800 rounded-xl py-3 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none text-right" dir="auto" required />
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
          <div className="relative">
            <input type="password" placeholder="كلمة المرور" className="w-full bg-[#020806] border border-gray-800 rounded-xl py-3 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none" required />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
          {!isLogin && (
            <div className="relative">
              <input type="password" placeholder="تأكيد كلمة المرور" className="w-full bg-[#020806] border border-gray-800 rounded-xl py-3 pr-12 pl-4 text-white focus:border-[#D4AF37] outline-none" required />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold rounded-xl py-3 shadow-lg shadow-[#D4AF37]/20 hover:opacity-90 transition-opacity mt-2">
             {isLogin ? 'دخول' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
           {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
           <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} className="text-[#D4AF37] font-bold hover:underline">
              {isLogin ? 'سجل الآن' : 'تسجيل الدخول'}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
