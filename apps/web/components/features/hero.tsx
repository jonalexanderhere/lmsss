"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Router, ShieldCheck, TerminalSquare, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren } from "@/components/animations/fade-in";

const highlights = [
  { icon: Router, label: "Networking-first curriculum", color: "text-teal-400" },
  { icon: ShieldCheck, label: "Cybersecurity workflow drills", color: "text-blue-400" },
  { icon: TerminalSquare, label: "CLI-like practice lab", color: "text-purple-400" },
  { icon: BrainCircuit, label: "AI score analysis & tutoring", color: "text-amber-400" }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[48px] border border-white/10 bg-black/40 px-6 py-24 shadow-2xl lg:px-12">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid-fade bg-[size:120px_120px] opacity-20" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" 
      />

      <div className="relative grid gap-16 lg:grid-cols-[1.4fr_0.9fr]">
        <StaggerChildren className="space-y-8">
          <FadeIn direction="down">
            <Badge className="bg-teal-400/10 text-teal-300 border-teal-400/20 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              LMS for SMK TJKT 1 Liwa • Generasi Digital v2.0
            </Badge>
          </FadeIn>
          
          <div className="space-y-6">
            <FadeIn direction="up" delay={0.1}>
              <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white lg:text-7xl leading-[1.1]">
                Train Like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Network Engineer.</span>
              </h1>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.2}>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-400 lg:text-xl">
                NetClassix bukan sekadar LMS. Ini adalah "Control Center" pribadi Anda untuk menguasai networking, 
                cybersecurity, dan server admin dengan pengalaman belajar sekelas industri.
              </p>
            </FadeIn>
          </div>

          <FadeIn direction="up" delay={0.3} className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/25 transition-all hover:scale-105 active:scale-95">
              <Link href="/login">
                Launch My Deck
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-14 px-8 text-lg border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all">
              <Link href="/courses">Explore Curriculum</Link>
            </Button>
          </FadeIn>
        </StaggerChildren>

        <StaggerChildren staggerDelay={0.15} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {highlights.map(({ icon: Icon, label, color }) => (
            <FadeIn 
              key={label} 
              direction="left" 
              className="group relative rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-teal-400/30 hover:bg-white/[0.08]"
            >
              <div className={`p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-medium text-slate-200 group-hover:text-white transition-colors">{label}</p>
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </FadeIn>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
