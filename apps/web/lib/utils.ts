import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}

export function getRankFromXp(xp: number) {
  if (xp >= 1600) return "Professional";
  if (xp >= 900) return "Engineer";
  if (xp >= 400) return "Technician";
  return "Trainee";
}
