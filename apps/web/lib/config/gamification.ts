export const RANKS = [
  {
    name: "Trainee",
    minXp: 0,
    icon: "/home/ghifariazhar/.gemini/antigravity/brain/3328d21f-9da8-482b-9e91-671f6b4bf965/trainee_rank_badge_1776051066243.png",
    color: "from-amber-700 to-amber-900"
  },
  {
    name: "Technician",
    minXp: 400,
    icon: "/home/ghifariazhar/.gemini/antigravity/brain/3328d21f-9da8-482b-9e91-671f6b4bf965/technician_rank_badge_1776051090756.png",
    color: "from-slate-400 to-slate-600"
  },
  {
    name: "Engineer",
    minXp: 900,
    icon: "/home/ghifariazhar/.gemini/antigravity/brain/3328d21f-9da8-482b-9e91-671f6b4bf965/engineer_rank_badge_1776051113489.png",
    color: "from-amber-400 to-amber-600"
  },
  {
    name: "Professional",
    minXp: 1600,
    icon: "/home/ghifariazhar/.gemini/antigravity/brain/3328d21f-9da8-482b-9e91-671f6b4bf965/professional_rank_badge_v2_1776051212737.png",
    color: "from-emerald-400 to-emerald-600"
  },
  {
    name: "Legend",
    minXp: 2500,
    icon: "/home/ghifariazhar/.gemini/antigravity/brain/3328d21f-9da8-482b-9e91-671f6b4bf965/legend_rank_badge_1776051236512.png",
    color: "from-violet-500 to-fuchsia-600"
  }
];

export const AI_MASCOT = "/home/ghifariazhar/.gemini/antigravity/brain/3328d21f-9da8-482b-9e91-671f6b4bf965/ai_t_robot_mascot_1776051262128.png";
export const HERO_BANNER = "/home/ghifariazhar/.gemini/antigravity/brain/3328d21f-9da8-482b-9e91-671f6b4bf965/gamified_lms_hero_banner_1776051294109.png";

export function getRank(xp: number) {
  return [...RANKS].reverse().find(r => xp >= r.minXp) || RANKS[0];
}

export function getNextRank(xp: number) {
  return RANKS.find(r => r.minXp > xp);
}
