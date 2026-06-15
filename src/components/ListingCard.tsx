import { motion } from "motion/react";
import { Product } from "../types";
import { MapPin, Heart, Clock, Bookmark } from "lucide-react";
import React from "react";
import { HighlightText } from "./HighlightText";
import { useInView } from "react-intersection-observer";
import ListingSkeleton from "./ListingSkeleton";

interface ListingCardProps {
  product: Product;
  onClick: (id: string, product: Product) => void;
  searchQuery?: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isLiked: boolean;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  viewMode?: "grid" | "list";
}

const getRelativeTime = (isoString?: string) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "الآن";
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `منذ ${diffMins} د`;
    if (diffHours < 24) return `منذ ${diffHours} س`;
    if (diffDays === 1) return "أمس";
    if (diffDays < 30) return `منذ ${diffDays} ي`;
    return date.toLocaleDateString("ar-TN", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const ListingCard: React.FC<ListingCardProps> = ({
  product,
  onClick,
  searchQuery = "",
  isFavorite,
  onToggleFavorite,
  isLiked,
  onToggleLike,
  viewMode = "grid",
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "250px 0px",
  });

  const isVip = product.plan === "vip" || product.isVip;
  const isBronze = product.plan === "bronze";
  const isList = viewMode === "list";

  // Aesthetic adjustments matching each subscription level
  const borderClass = isVip
    ? "border-[3px] border-[#D4AF37] shadow-[0_8px_20px_rgba(212,175,55,0.15)]"
    : isBronze
      ? "border-[3px] border-zinc-400 shadow-[0_4px_15px_rgba(212,212,216,0.15)]"
      : "border border-zinc-800 shadow-[0_4px_15px_rgba(0,0,0,0.3)]";

  const badgeText = isVip ? "إعلان ملكي VIP" : isBronze ? "إعلان مميز" : "";

  const badgeBg = isVip
    ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md border border-[#F5D76E]/50"
    : isBronze
      ? "bg-gradient-to-r from-zinc-300 to-zinc-500 text-black shadow-[0_0_10px_rgba(212,212,216,0.4)]"
      : "";

  const titleColor = isVip ? "text-[#D4AF37]" : "text-gray-100";

  if (!inView) {
    return (
      <div ref={ref} className={isList ? "w-full" : "w-full h-full"}>
        <ListingSkeleton viewMode={viewMode} />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => onClick(product.id, product)}
      className={`group w-full bg-[#181818] rounded-[24px] relative flex flex-col overflow-hidden cursor-pointer ${borderClass} ${
        isList ? "flex-row max-w-full" : "h-full min-h-0 min-w-0"
      }`}
    >
      {/* Dynamic Membership Badge Overlay */}
      {badgeText && (
        <div className="absolute top-3 right-3 z-20 select-none">
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap font-bold ${badgeBg}`}
          >
            {badgeText}
          </span>
        </div>
      )}

      {/* Favorites and Likes Buttons */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(product.id, e);
          }}
          className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center border border-white/10 hover:bg-black/90 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white"}`}
          />
        </button>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id, e);
          }}
          className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-white/5 hover:border-[#D4AF37]/50 transition-all active:scale-95 shadow-lg"
        >
          <Bookmark
            className={`w-4 h-4 transition-all duration-300 ${isFavorite ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/80"}`}
          />
        </button>
      </div>

      {/* Image Container */}
      <div
        className={`relative overflow-hidden shrink-0 bg-[#0A0A0A] ${
          isList ? "w-32 sm:w-40 h-full" : "w-full aspect-square"
        }`}
      >
        <img
          src={product.imageUrls?.[0] || "https://via.placeholder.com/400"}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Card Details Content */}
      <div
        className={`flex flex-col justify-between flex-1 p-3.5 rtl text-right ${isList ? "w-full" : ""}`}
      >
        {/* Title & Price Top Row */}
        <div className="flex flex-col gap-2 mb-2 w-full">
          <h3
            className={`font-black text-[15px] sm:text-[16px] leading-snug line-clamp-2 ${titleColor}`}
          >
            <HighlightText text={product.title} query={searchQuery} />
          </h3>

          <span className="font-black text-[18px] xl:text-[20px] text-white font-sans text-right group-hover:text-[#F5D76E] transition-colors">
            {Number(product.price).toLocaleString("en-US")}{" "}
            <span className="text-[14px] text-[#D4AF37] font-bold">د.ت</span>
          </span>
        </div>

        {/* Ad Location and Category Bottom Row */}
        <div className="flex flex-col gap-1.5 mt-auto border-t border-slate-700/50 pt-2.5">
          <div className="flex items-center justify-between text-zinc-100 font-bold">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[12px] font-black">
                {product.location}
              </span>
            </div>

            {product.createdAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[11px] font-bold">
                  {getRelativeTime(product.createdAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ListingCard);
