"use client";

import Image from "next/image";
import { getRank } from "@/lib/config/gamification";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function LevelBadge({ xp, size = "md", className }: { xp: number, size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  const rank = getRank(xp);
  
  const sizes = {
    sm: "h-12 w-12",
    md: "h-24 w-24",
    lg: "h-40 w-40",
    xl: "h-56 w-56"
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("relative flex items-center justify-center", sizes[size], className)}
    >
      <div className={cn("absolute inset-0 rounded-full blur-2xl opacity-20 bg-gradient-to-br", rank.color)} />
      <div className="relative h-full w-full">
        <Image
          src={rank.icon}
          alt={rank.name}
          fill
          className="object-contain"
          priority
        />
      </div>
      {(size === "lg" || size === "xl") && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 border border-white/10 px-4 py-1 rounded-full backdrop-blur-md">
           <span className={cn("text-xs font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r", rank.color)}>
             {rank.name}
           </span>
        </div>
      )}
    </motion.div>
  );
}
