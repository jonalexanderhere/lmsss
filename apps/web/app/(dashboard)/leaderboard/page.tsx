import { getLeaderboardData } from "@/lib/actions/leaderboard-actions";
import { Shell } from "@/components/layout/shell";
import { LevelBadge } from "@/components/features/level-badge";
import { Trophy, Medal, Crown, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function LeaderboardPage() {
  const players = await getLeaderboardData();

  const topThree = players.slice(0, 3);
  const others = players.slice(3);

  return (
    <Shell role="student">
      <div className="space-y-12 pb-20">
        <section className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 ring-1 ring-amber-500/20 shadow-2xl shadow-amber-500/10">
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">Global Arena Standings</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Para elit NetClassix. Pantau peringkat Anda di antara ribuan NetRunners lainnya.
          </p>
        </section>

        {/* Podium Area */}
        <div className="grid gap-8 md:grid-cols-3 items-end max-w-5xl mx-auto px-4">
          {/* Rank 2 */}
          {topThree[1] && (
            <div className="relative glass-card p-8 text-center border-slate-300/10 bg-slate-400/5 order-2 md:order-1 h-[300px] flex flex-col justify-center">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Medal className="h-12 w-12 text-slate-400" />
              </div>
              <LevelBadge xp={topThree[1].xp} size="lg" className="mx-auto mb-4" />
              <h3 className="text-xl font-black text-white">{topThree[1].name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase mt-1">{topThree[1].class_name}</p>
              <div className="mt-6">
                <span className="text-2xl font-black text-slate-300">{topThree[1].xp.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 uppercase ml-1 font-bold">XP</span>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {topThree[0] && (
            <div className="relative glass-card p-10 text-center border-amber-500/20 bg-amber-500/5 order-1 md:order-2 h-[380px] flex flex-col justify-center shadow-2xl shadow-amber-500/5">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <Crown className="h-20 w-20 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              </div>
              <LevelBadge xp={topThree[0].xp} size="xl" className="mx-auto mb-6" />
              <h3 className="text-2xl font-black text-white">{topThree[0].name}</h3>
              <p className="text-amber-400/60 text-sm font-bold uppercase mt-1 tracking-widest">{topThree[0].class_name}</p>
              <div className="mt-8">
                <span className="text-4xl font-black text-amber-400 italic">{topThree[0].xp.toLocaleString()}</span>
                <span className="text-[10px] text-amber-500/50 uppercase ml-2 font-black">XP</span>
              </div>
              <Badge className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black">ARENA CHAMPION</Badge>
            </div>
          )}

          {/* Rank 3 */}
          {topThree[2] && (
            <div className="relative glass-card p-8 text-center border-orange-700/20 bg-orange-900/5 order-3 h-[280px] flex flex-col justify-center">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Medal className="h-10 w-10 text-orange-600" />
              </div>
              <LevelBadge xp={topThree[2].xp} size="lg" className="mx-auto mb-4" />
              <h3 className="text-xl font-black text-white">{topThree[2].name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase mt-1">{topThree[2].class_name}</p>
              <div className="mt-6">
                <span className="text-2xl font-black text-orange-400">{topThree[2].xp.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 uppercase ml-1 font-bold">XP</span>
              </div>
            </div>
          )}
        </div>

        {/* List View */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            <div className="flex gap-12">
               <span className="w-8">Pos</span>
               <span>Runner</span>
            </div>
            <div className="flex gap-20">
               <span className="hidden md:inline">Missions</span>
               <span className="w-24 text-right">Score</span>
            </div>
          </div>

          {others.map((player) => (
            <div key={player.user_id} className="group glass-card p-4 flex items-center justify-between border-white/5 hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-8">
                <span className="w-8 text-lg font-black text-slate-500 group-hover:text-teal-400 tracking-tighter">
                  #{player.rank}
                </span>
                <div className="flex items-center gap-4">
                  <LevelBadge xp={player.xp} size="sm" />
                  <div>
                    <h4 className="font-bold text-white group-hover:text-teal-400 transition-colors uppercase italic">{player.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{player.class_name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12 md:gap-24">
                <div className="hidden md:flex flex-col items-center">
                   <span className="text-lg font-black text-white">{player.sessions_completed || 0}</span>
                   <span className="text-[8px] text-slate-600 uppercase font-black">Cleared</span>
                </div>
                <div className="w-24 text-right">
                  <p className="text-xl font-black text-teal-400 italic leading-none">{player.xp.toLocaleString()}</p>
                  <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">Total XP</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl text-center">
              <Users className="h-5 w-5 mx-auto text-teal-400 mb-2" />
              <p className="text-2xl font-black text-white">{players.length}</p>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active Runners</p>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl text-center">
              <TrendingUp className="h-5 w-5 mx-auto text-blue-400 mb-2" />
              <p className="text-2xl font-black text-white">
                {players.reduce((acc, p) => acc + (p.sessions_completed || 0), 0)}
              </p>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Missions Run</p>
           </div>
        </div>
      </div>
    </Shell>
  );
}
