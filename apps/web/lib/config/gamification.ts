export interface Rank {
  name: string;
  minXp: number;
  icon: string;
  color: string;
}

export const RANKS: Rank[] = [

  {
    name: "Trainee",
    minXp: 0,
    icon: "/assets/ranks/trainee.png",
    color: "from-amber-700 to-amber-900"
  },
  {
    name: "Technician",
    minXp: 400,
    icon: "/assets/ranks/technician.png",
    color: "from-slate-400 to-slate-600"
  },
  {
    name: "Engineer",
    minXp: 900,
    icon: "/assets/ranks/engineer.png",
    color: "from-amber-400 to-amber-600"
  },
  {
    name: "Professional",
    minXp: 1600,
    icon: "/assets/ranks/professional.png",
    color: "from-emerald-400 to-emerald-600"
  },
  {
    name: "Legend",
    minXp: 2500,
    icon: "/assets/ranks/legend.png",
    color: "from-violet-500 to-fuchsia-600"
  }
];

export const AI_MASCOT = "/assets/mascot/ai-tutor.png";
export const HERO_BANNER = "/assets/mascot/hero-banner.png";


export function getRank(xp: number): Rank {
  return ([...RANKS].reverse().find(r => xp >= r.minXp) || RANKS[0]) as Rank;
}

export function getNextRank(xp: number): Rank | undefined {
  return RANKS.find(r => r.minXp > xp);
}

