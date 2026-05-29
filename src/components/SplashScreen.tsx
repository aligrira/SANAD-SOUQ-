import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Package, ShieldCheck, Award, Truck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 3.5 seconds overall duration for a premium cinematic introduction
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.2;
      });
    }, 30);

    const timer = setTimeout(() => {
      setIsVisible(false);
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(finishTimer);
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
          }}
          className="fixed inset-0 z-[99999] bg-gradient-to-b from-[#0c0a06] via-[#020202] to-[#040404] flex flex-col items-center justify-between py-10 px-6 m-0 overflow-hidden select-none w-screen h-screen max-w-full max-h-screen"
          style={{ direction: 'rtl', touchAction: 'none' }}
        >
          {/* Background Grid Lines & Golden Ambient Light Reflection */}
          <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
            {/* Smooth Diagonal Metallic Rays mirroring the original's geometric backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(225deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:45px_45px]" />
            
            {/* Main Center Golden Horizon glow source behind the cityscape */}
            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-t from-[#B38F3C]/15 via-transparent to-transparent rounded-full filter blur-[100px] opacity-80" />
            <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-[350px] h-[3px] bg-gradient-to-r from-transparent via-[#ffdca3]/50 to-transparent filter blur-[1.5px]" />
            <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-[80px] h-[80px] bg-[#FFF5D1] rounded-full filter blur-[40px] opacity-40" />
          </div>

          {/* MAIN SPACE: The Branding Logo & Tagline */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-lg mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* BRAND IMAGE LOGO AND TEXT - MATCHED PRECISELY TO THE UPLOADED DESIGN */}
              <div className="relative w-full max-w-sm flex flex-col items-center justify-center">
                {/* 3D Gold Extruded Calligraphy Assembly */}
                <svg
                  width="180"
                  height="120"
                  viewBox="0 0 180 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
                >
                  <defs>
                    <linearGradient id="splitGoldReflect" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7F5F1D" />
                      <stop offset="20%" stopColor="#DFBA6B" />
                      <stop offset="40%" stopColor="#FDF3CD" />
                      <stop offset="60%" stopColor="#C99B3D" />
                      <stop offset="80%" stopColor="#FFECA8" />
                      <stop offset="100%" stopColor="#66460F" />
                    </linearGradient>

                    <linearGradient id="silverReflect" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7F8C8D" />
                      <stop offset="50%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#BDC3C7" />
                    </linearGradient>

                    <filter id="goldDepthGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#D4AF37" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Stylized Modern shopping bag letter "س" monogram merging at top handle */}
                  <g filter="url(#goldDepthGlow)">
                    {/* Golden Handle Ring at top of bag represent the monogram curve */}
                    <path
                      d="M102,38 C102,23 118,23 118,38"
                      stroke="url(#splitGoldReflect)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    
                    {/* Shopping Bag body representing letter "س" */}
                    <path
                      d="M93,42 L127,42 C134,42 138,47 138,54 L138,82 C138,92 128,102 110,102 C92,102 78,85 78,65 L92,65 C92,78 100,90 110,90 C120,90 125,84 125,78 L125,55 L96,55"
                      stroke="url(#splitGoldReflect)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />

                    {/* Outer stylized swing loop on left wrapping under */}
                    <path
                      d="M78,65 C78,45 102,45 102,65 M102,65 Q110,78 120,65"
                      stroke="url(#splitGoldReflect)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </g>

                  {/* Words "سوق" and "سند" in bold extruded calligraphic paths */}
                  {/* WORD: "سوق" in golden block */}
                  <text
                    x="56"
                    y="55"
                    fill="url(#splitGoldReflect)"
                    fontWeight="900"
                    fontSize="26"
                    fontFamily="sans-serif"
                    textAnchor="end"
                    letterSpacing="0"
                    className="select-none tracking-normal"
                    style={{ fontStyle: "normal" }}
                  >
                    سوق
                  </text>

                  {/* WORD: "سند" in silver/white with precise offset representing depth */}
                  <text
                    x="58"
                    y="88"
                    fill="url(#silverReflect)"
                    fontWeight="900"
                    fontSize="33"
                    fontFamily="sans-serif"
                    textAnchor="end"
                    letterSpacing="1"
                    className="select-none tracking-normal"
                    style={{ fontStyle: "normal" }}
                  >
                    سند
                  </text>
                </svg>

                {/* Tagline Match: "تجربة تسوق" (White) "بثقة واحترافية" (Gold) */}
                <div className="flex flex-col items-center mt-4">
                  <h1 className="text-lg font-bold tracking-wide text-white flex gap-1.5 items-center justify-center font-display">
                    تجربة تسوق
                  </h1>
                  <p className="text-[#D4AF37] font-semibold text-sm tracking-widest mt-0.5">
                    بثقة واحترافية
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* MIDDLE COLUMN: Futuristic City Skyline Rising from Glowing Globe */}
          <div className="relative w-full h-[180px] sm:h-[220px] flex items-end justify-center z-10">
            {/* The Globe wireframe mesh in glowing gold */}
            <div className="absolute top-24 w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/15 animate-[spin_50s_linear_infinite]" />
              <div className="absolute w-[95%] h-[95%] rounded-full border border-[#D4AF37]/10" />
              {/* Inner Latitude curves */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#D4AF37]/20" />
              <div className="absolute inset-x-0 top-1/4 h-[1px] bg-[#D4AF37]/10" />
              <div className="absolute inset-x-0 bottom-1/4 h-[1px] bg-[#D4AF37]/10" />
              {/* Longitudinal ellipses */}
              <div className="absolute inset-y-0 left-1/2 w-[160px] rounded-full border border-y-0 border-x-[#D4AF37]/15" />
              <div className="absolute inset-y-0 left-1/2 w-[80px] rounded-full border border-y-0 border-x-[#D4AF37]/20" />
            </div>

            {/* Glowing Golden Skyline vector illustration */}
            <div className="absolute bottom-0 inset-x-0 h-28 sm:h-36 z-10 overflow-hidden flex items-end justify-center pointer-events-none opacity-90">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 500 120"
                preserveAspectRatio="none"
                className="w-full max-w-[500px] text-[#2c200c]"
              >
                <defs>
                  <linearGradient id="skylineGrad" x1="0" y1="120" x2="0" y2="0">
                    <stop offset="0%" stopColor="#020202" />
                    <stop offset="30%" stopColor="#1e1507" />
                    <stop offset="70%" stopColor="#614a1f" opacity="0.8" />
                    <stop offset="100%" stopColor="#D4AF37" opacity="0.9" />
                  </linearGradient>
                </defs>
                {/* Master Skyline Silhouette paths matching skyscrapers, Burj-like needles and spires */}
                <path
                  d="M0,120 L0,110 L12,110 L12,112 L20,112 L20,95 L28,95 L28,120 
                     M32,120 L32,80 L35,80 L35,50 L42,50 L42,80 L45,80 L45,120 
                     M48,120 L48,88 L58,88 L58,70 L64,70 L64,88 L72,88 L72,120 
                     M75,120 L75,100 L85,100 L85,105 L95,105 L95,120 
                     M98,120 L98,60 L102,60 L102,40 L105,40 L105,15 L108,15 L108,40 L111,40 L111,60 L115,60 L115,120 
                     M120,120 L120,95 L132,95 L132,120 
                     M135,120 L135,75 L145,75 L145,120 
                     M150,120 L150,55 L158,55 L164,40 L170,55 L178,55 L178,120 
                     M182,120 L182,90 L195,90 L195,120 
                     M200,120 L200,70 L212,70 L212,50 L220,50 L220,20 L223,20 L223,50 L232,50 L232,70 L245,70 L245,120 
                     M250,120 L250,85 L262,85 L262,120 
                     M265,120 L265,45 L270,45 L272,30 L275,30 L277,10 L280,10 L280,120 
                     M285,120 L285,95 L298,95 L298,120 
                     M302,120 L302,65 L315,65 L315,120 
                     M320,120 L320,50 L328,50 L334,35 L340,50 L348,50 L348,120 
                     M352,120 L352,85 L365,85 L365,120 
                     M370,120 L370,70 L382,70 L382,50 L390,50 L390,15 L393,15 L393,50 L402,50 L402,70 L415,70 L415,120 
                     M420,120 L420,95 L432,95 L432,120 
                     M435,120 L435,60 L445,60 L445,40 L450,40 L450,60 L455,60 L455,120 
                     M460,120 L460,90 L475,90 L475,120 
                     M480,120 L480,105 L500,105 L500,120"
                  fill="url(#skylineGrad)"
                />
              </svg>
            </div>
          </div>

          {/* BOTTOM COLUMN: The 5 Golden Icons on Circular Luxury Black Podiums with Gold Borders */}
          <div className="relative z-10 w-full max-w-lg mt-4 mb-2">
            <div className="flex justify-between items-end px-3">
              {/* Podium 1: Shopping Bag */}
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="relative flex flex-col items-center"
                >
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37] mb-2 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  {/* Cylinder Podium */}
                  <div className="w-12 h-5 rounded-full bg-gradient-to-b from-[#1c160b] to-[#040404] border border-[#D4AF37]/50 shadow-[0_4px_10px_rgba(0,0,0,0.8),_inset_0_1px_4px_rgba(255,255,255,0.1)] flex items-center justify-center">
                    <div className="w-[90%] h-[75%] rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent" />
                  </div>
                </motion.div>
              </div>

              {/* Podium 2: Mailing Box */}
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="relative flex flex-col items-center"
                >
                  <Package className="w-5 h-5 text-[#efc061] mb-2 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  {/* Cylinder Podium */}
                  <div className="w-12 h-5 rounded-full bg-gradient-to-b from-[#1c160b] to-[#040404] border border-[#D4AF37]/50 shadow-[0_4px_10px_rgba(0,0,0,0.8),_inset_0_1px_4px_rgba(255,255,255,0.1)] flex items-center justify-center">
                    <div className="w-[90%] h-[75%] rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent" />
                  </div>
                </motion.div>
              </div>

              {/* Podium 3: Security Shield */}
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="relative flex flex-col items-center"
                >
                  <ShieldCheck className="w-6 h-6 text-[#ffd984] mb-1.5 filter drop-shadow-[0_0_12px_rgba(212,175,55,0.9)] scale-110" />
                  {/* Center Master Cylinder Podium (slightly larger and more glowing) */}
                  <div className="w-14 h-6 rounded-full bg-gradient-to-b from-[#2a1f0a] to-[#010101] border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.45),_0_6px_12px_rgba(0,0,0,0.9),_inset_0_1px_4px_rgba(255,255,255,0.25)] flex items-center justify-center">
                    <div className="w-[90%] h-[75%] rounded-full bg-gradient-to-r from-[#ffdca3]/20 to-transparent" />
                  </div>
                </motion.div>
              </div>

              {/* Podium 4: Ribbon Badge */}
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="relative flex flex-col items-center"
                >
                  <Award className="w-5 h-5 text-[#efc061] mb-2 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  {/* Cylinder Podium */}
                  <div className="w-12 h-5 rounded-full bg-gradient-to-b from-[#1c160b] to-[#040404] border border-[#D4AF37]/50 shadow-[0_4px_10px_rgba(0,0,0,0.8),_inset_0_1px_4px_rgba(255,255,255,0.1)] flex items-center justify-center">
                    <div className="w-[90%] h-[75%] rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent" />
                  </div>
                </motion.div>
              </div>

              {/* Podium 5: Delivery Truck */}
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="relative flex flex-col items-center"
                >
                  <Truck className="w-5 h-5 text-[#D4AF37] mb-2 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  {/* Cylinder Podium */}
                  <div className="w-12 h-5 rounded-full bg-gradient-to-b from-[#1c160b] to-[#040404] border border-[#D4AF37]/50 shadow-[0_4px_10px_rgba(0,0,0,0.8),_inset_0_1px_4px_rgba(255,255,255,0.1)] flex items-center justify-center">
                    <div className="w-[90%] h-[75%] rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE PROGRESS BAR & LOADER STATUS */}
          <div className="relative z-10 flex flex-col items-center w-full max-w-xs gap-3">
            {/* Elegant Loading Bar aligned exactly with the uploaded image */}
            <div className="w-[60%] h-[3.5px] bg-[#1e1503] rounded-full overflow-hidden p-[0.2px] border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#8a651d] via-[#D4AF37] to-[#FFF5C5] rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Arabic Loader Text below */}
            <span className="text-xs font-semibold text-gray-400 font-sans tracking-wide">
              جاري التحميل...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
