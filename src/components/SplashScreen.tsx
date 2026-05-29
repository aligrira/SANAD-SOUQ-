import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Cinematic 3D space particles (light rare gold dust to enhance the depth of field)
  const cosmicParticles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8, // subtle varying sizing
      speedY: Math.random() * 8 + 6, // ultra slow, graceful floating speed
      opacity: Math.random() * 0.4 + 0.15,
      delay: Math.random() * -12,
    }));
  }, []);

  useEffect(() => {
    // Rigid script enforcement against any viewport or Webview scroll/margin leaks
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    const timer = setTimeout(() => {
      setIsVisible(false);
      const finishTimer = setTimeout(() => {
        // Safe restoration of scrolls
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        onComplete();
      }, 800);
      return () => clearTimeout(finishTimer);
    }, 2800); // 2.8 seconds cinematic hold to enjoy premium look

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(24px)",
            transition: { duration: 0.75, ease: [0.19, 1, 0.22, 1] }
          }}
          className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col items-center justify-center p-0 m-0 overflow-hidden select-none w-screen h-screen max-w-full max-h-screen"
          style={{ 
            direction: 'rtl', 
            touchAction: 'none',
            margin: '0 !important',
            padding: '0 !important'
          }}
        >
          {/* Layer 1: Premium Matte Dark Gold Mesh & Vignette */}
          <div className="absolute inset-0 z-0 pointer-events-none w-full h-full bg-[#030303]">
            {/* Top-down soft golden ambient light leak */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#1c160e]/35 to-transparent blur-3xl opacity-80" />
            
            {/* Center Royal Radial Warm Amber Glow for high-end cinematic display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,rgba(0,0,0,0)_70%)] rounded-full mix-blend-screen opacity-90 blur-xl" />
            
            {/* Multi-layered dark slate-brass background flow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#050505] to-[#010101]" />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.01)_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-70" />
          </div>

          {/* Layer 2: Floating Golden Dust with depth-of-field blur */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
            {cosmicParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: `${p.y}%`, opacity: 0 }}
                animate={{
                  y: ['105%', '-10%'],
                  opacity: [0, p.opacity, p.opacity, 0],
                  x: [`${p.x}%`, `${p.x + (Math.sin(p.id) * 2)}%`]
                }}
                transition={{
                  duration: p.speedY,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bg-gradient-to-tr from-[#9e7a2f] via-[#D4AF37] to-[#FFF5D1] rounded-full filter blur-[0.3px] shadow-[0_0_5px_rgba(212,175,55,0.4)]"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: `${p.x}%`
                }}
              />
            ))}
          </div>

          {/* Center Column: 3D Luxury Hero Object */}
          <div className="relative z-10 flex flex-col items-center justify-center p-4 w-full h-full max-w-lg">
            
            {/* Complete 3D Box Container with nested 3D Perspective */}
            <div 
              className="relative flex flex-col items-center justify-center"
              style={{ perspective: 1000 }}
            >
              
              {/* Outer Golden Bezel / Bezel Rings reminiscent of Swiss Craftsmanship with slow majestic 3D rotates */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -45, rotateY: -30 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: 0,
                  rotateY: [15, -15, 15], // Slow continuous premium 3D tilt
                  rotateX: [-10, 10, -10]
                }}
                transition={{
                  rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                  rotateX: { duration: 11, repeat: Infinity, ease: "easeInOut" },
                  default: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center"
              >
                
                {/* 3D Gold Concentric Bezel Layer 1 (Outer Ring) */}
                <div 
                  className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/15 animate-[spin_40s_linear_infinite]"
                  style={{ transform: "translateZ(-40px)" }}
                />

                {/* 3D Gold Chronos Ring Layer 2 with engraved luxury notches */}
                <svg 
                  className="absolute inset-2 text-[#D4AF37]/25 animate-[spin_60s_linear_infinite]" 
                  viewBox="0 0 200 200"
                  style={{ transform: "translateZ(-20px)" }}
                >
                  <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1" strokeDasharray="2 12" fill="none" />
                  <circle cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="0.8" strokeDasharray="12 4" fill="none" />
                </svg>

                {/* Main 3D Logo Monogram Vector Overlay with realistic bevel drop-shadows */}
                <svg 
                  width="220" 
                  height="220" 
                  viewBox="0 0 160 160" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-full h-full filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)]"
                  style={{ transform: "translateZ(35px)" }}
                >
                  <defs>
                    {/* Multi-layered gold gradients resembling pure physical gold alloy */}
                    <linearGradient id="solidGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4A340A" />
                      <stop offset="12%" stopColor="#A67F2C" />
                      <stop offset="30%" stopColor="#F5D77F" />
                      <stop offset="48%" stopColor="#FFF4D0" />
                      <stop offset="62%" stopColor="#E0BD54" />
                      <stop offset="80%" stopColor="#FFF3C5" />
                      <stop offset="92%" stopColor="#96721E" />
                      <stop offset="100%" stopColor="#302002" />
                    </linearGradient>

                    {/* Highly directional metallic contrast gradient for 3D bevels / ridges */}
                    <linearGradient id="goldBevelHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFF9E6" />
                      <stop offset="40%" stopColor="#D4AF37" />
                      <stop offset="70%" stopColor="#8A651D" />
                      <stop offset="100%" stopColor="#1C1302" />
                    </linearGradient>

                    {/* Behind Shadow for extreme 3D depth */}
                    <filter id="ultraDepthShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#000" floodOpacity="0.95" />
                    </filter>

                    {/* Mask to lock specular light reflection inside path */}
                    <clipPath id="logoLettersClip">
                      <path d="M50 42 C50 24, 110 24, 110 42 M35 55 C35 38, 125 38, 125 55 C125 90, 110 115, 80 115 C50 115, 35 90, 35 55 Z" />
                    </clipPath>
                  </defs>

                  {/* Layer 1: Simulated 3D deep metal backing */}
                  <g filter="url(#ultraDepthShadow)">
                    {/* Metallic 3D gold bag handle with physical height profile */}
                    <path 
                      d="M54 44 C54 18, 106 18, 106 44" 
                      stroke="url(#goldBevelHighlight)" 
                      strokeWidth="11" 
                      fill="none" 
                      strokeLinecap="round" 
                      opacity="0.9"
                    />
                    <path 
                      d="M54 44 C54 18, 106 18, 106 44" 
                      stroke="url(#solidGold3D)" 
                      strokeWidth="9" 
                      fill="none" 
                      strokeLinecap="round" 
                    />

                    {/* The signature "س" Shaped Shopping Bag Base vector outline (Thick 3D layers) */}
                    <path 
                      d="M28 55 C28 34, 132 34, 132 55 C132 88, 118 114, 80 114 C42 114, 28 88, 28 55 Z" 
                      stroke="url(#goldBevelHighlight)" 
                      strokeWidth="12.5" 
                      fill="none" 
                      strokeLinejoin="round" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M28 55 C28 34, 132 34, 132 55 C132 88, 118 114, 80 114 C42 114, 28 88, 28 55 Z" 
                      stroke="url(#solidGold3D)" 
                      strokeWidth="10.5" 
                      fill="none" 
                      strokeLinejoin="round" 
                      strokeLinecap="round"
                    />

                    {/* Core dual interior curve ribbons creating 3D ribbons of the Arabic script */}
                    <path 
                      d="M48 64 Q80 102 112 64" 
                      stroke="url(#goldBevelHighlight)" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M48 64 Q80 102 112 64" 
                      stroke="url(#solidGold3D)" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeLinecap="round" 
                    />
                    
                    <path 
                      d="M62 76 Q80 96 98 76" 
                      stroke="url(#goldBevelHighlight)" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M62 76 Q80 96 98 76" 
                      stroke="url(#solidGold3D)" 
                      strokeWidth="4.5" 
                      fill="none" 
                      strokeLinecap="round" 
                    />
                    
                    {/* Centered gold dot core */}
                    <circle cx="80" cy="54" r="9" fill="url(#goldBevelHighlight)" />
                    <circle cx="80" cy="54" r="7.5" fill="url(#solidGold3D)" />
                  </g>

                  {/* Clean Specular Light Reflection Sweep glides smoothly across the core logo */}
                  <g clipPath="url(#logoLettersClip)">
                    <motion.rect
                      initial={{ x: "-180%", y: "-180%", rotate: 45 }}
                      animate={{ x: "180%", y: "180%" }}
                      transition={{ duration: 2.3, repeat: Infinity, repeatDelay: 1.3, ease: "easeInOut" }}
                      className="w-16 h-48 bg-white/30 pointer-events-none mix-blend-overlay"
                    />
                  </g>
                </svg>

                {/* Sub-glowing lens flare backing animation */}
                <motion.div 
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-8 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-[#FFE57F]/10 rounded-full filter blur-xl animate-pulse pointer-events-none"
                />
              </motion.div>

              {/* BRANDING COMPOSITION: Word elements reveal laterally from opposing sides with perfect alignment */}
              <div className="flex flex-col items-center mt-7 w-full max-w-sm overflow-hidden whitespace-nowrap">
                
                <div className="flex items-center justify-center gap-3 w-full">
                  {/* Word "سوق" slides elegantly in from the RIGHT side */}
                  <motion.span
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[38px] sm:text-[42px] font-black tracking-wide bg-gradient-to-r from-[#8a651d] via-[#D4AF37] to-[#ffefa8] text-transparent bg-clip-text drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] font-sans leading-none"
                  >
                    سوق
                  </motion.span>

                  {/* Word "سند" slides elegantly in from the LEFT side */}
                  <motion.span
                    initial={{ x: -120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[38px] sm:text-[42px] font-black tracking-wide bg-gradient-to-r from-[#666] via-[#FFF] to-[#CCC] text-transparent bg-clip-text drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] font-sans leading-none"
                  >
                    سند
                  </motion.span>
                </div>

                {/* Subtitle / Signature banner sliding upwards into place */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.75, ease: "easeOut" }}
                  className="flex flex-col items-center gap-2 mt-4 w-full"
                >
                  <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.38em] uppercase leading-none">
                    SANAD PREMIUM SOUK
                  </span>
                  
                  {/* Sharp Luxury Gold core line separating screen columns */}
                  <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                </motion.div>

              </div>

            </div>
          </div>

          {/* Minimal Solid Gold Specs loading progress track bounded at bottom */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-44 pointer-events-none">
            <div className="relative w-full h-[2.5px] bg-[#111] border border-white/5 rounded-full overflow-hidden p-[0.3px]">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.3, ease: [0.25, 1, 0.5, 1] }}
                className="h-full bg-gradient-to-r from-[#8a651d] via-[#D4AF37] to-[#FFE57F] rounded-full relative overflow-hidden"
              >
                {/* Mirror glow loading sweep indicator */}
                <motion.div
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                />
              </motion.div>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
