"use client";

import { motion } from "framer-motion";

type ProgressCircleProps = {
  progress: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
};

export function ProgressCircle({ 
  progress, 
  color = "#2dd4bf", 
  size = 100, 
  strokeWidth = 8 
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Track */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Layer */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          className="drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
        />
      </svg>
      {/* Percentage Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white">{Math.round(progress)}%</span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Status</span>
      </div>
    </div>
  );
}
