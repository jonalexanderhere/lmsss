import { Navbar } from "@/components/layout/navbar";
import { HERO_BANNER } from "@/lib/config/gamification";
import Image from "next/image";
import { ArrowRight, Terminal, Shield, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-teal-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* Gamified Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={HERO_BANNER} 
            alt="Hero Banner" 
            fill 
            className="object-cover opacity-30 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-10">
            <FadeIn direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                <Zap className="h-4 w-4 fill-teal-400" />
                Sistem Jaringan v2.0 Online
              </div>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.1}>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                ENTER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                  ARENA
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
                Kuasai Command Line, taklukkan simulator Cisco, dan kumpulkan XP untuk menjadi **Legendary Engineer** di NetClassix SMKN 1 Liwa.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <div className="flex flex-wrap gap-6">
                <Link href="/login">
                  <Button size="lg" className="h-20 px-10 rounded-[28px] bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xl gap-4 shadow-[0_20px_40px_-10px_rgba(20,184,166,0.5)] active:scale-95 transition-all">
                    START QUEST
                    <ArrowRight className="h-7 w-7" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="secondary" className="h-20 px-10 rounded-[28px] border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xl backdrop-blur-3xl hover:border-white/20 transition-all">
                    VIEW MAP
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-3 gap-10 pt-12 border-t border-white/5">
              {[
                { label: "Online Players", val: "1,248", color: "text-teal-400" },
                { label: "Missions Cleared", val: "42,012", color: "text-blue-400" },
                { label: "System Ping", val: "14ms", color: "text-emerald-400" }
              ].map(stat => (
                <FadeIn key={stat.label} direction="up" delay={0.4}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
                  <p className={stat.color + " text-2xl font-black tracking-tight"}>{stat.val}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Select Specialization Section */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <header className="flex flex-col items-center text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">Choose Your Class</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
            <p className="text-slate-400 max-w-2xl text-xl font-medium">Spesialisasi kemampuan Anda untuk membuka skill-tree dan equipment eksklusif.</p>
          </header>
          
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { 
                title: "Network Runner", 
                desc: "Arsitek konektivitas. Ahli dalam merancang topologi kompleks dan routing berkecepatan tinggi.", 
                icon: Terminal, 
                color: "from-teal-400 to-cyan-500",
                glow: "shadow-teal-500/20"
              },
              { 
                title: "Cyber Warden", 
                desc: "Garda terdepan keamanan. Menjaga integritas data dan menetralisir ancaman siber.", 
                icon: Shield, 
                color: "from-blue-500 to-indigo-600",
                glow: "shadow-blue-500/20"
              },
              { 
                title: "Cloud Master", 
                desc: "Penguasa infrastruktur virtual. Mendistribusikan resources sekolah ke seluruh dunia.", 
                icon: Target, 
                color: "from-violet-500 to-purple-600",
                glow: "shadow-violet-500/20"
              }
            ].map((cls, i) => (
              <FadeIn key={cls.title} direction="up" delay={i * 0.1}>
                <div className={cn(
                  "group relative glass-card p-12 overflow-hidden border-white/5 hover:border-white/20 transition-all hover:-translate-y-4",
                  cls.glow
                )}>
                  <div className={cn(
                    "h-20 w-20 rounded-3xl flex items-center justify-center text-white mb-10 group-hover:scale-110 transition-transform bg-gradient-to-br shadow-xl",
                    cls.color
                  )}>
                    <cls.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{cls.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed mb-8">{cls.desc}</p>
                  
                  <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r transition-all duration-700 w-0 group-hover:w-full" style={{ backgroundImage: `linear-gradient(to right, ${cls.color})` }} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 bg-slate-950/80 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 mx-auto text-slate-500">
            <Shield className="h-6 w-6" />
          </div>
          <p className="text-slate-500 text-xs font-black tracking-[0.3em] uppercase">
            © 2026 NetClassix Arena • Tactical Education System
          </p>
        </div>
      </footer>
    </main>
  );
}
