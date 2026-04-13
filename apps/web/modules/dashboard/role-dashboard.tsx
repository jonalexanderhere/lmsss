"use client";

import { Activity, Award, BrainCircuit, Clock3, Zap, TerminalSquare } from "lucide-react";
import { ProgressChart } from "@/components/charts/progress-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { chartData, previewCourses, aiPreview } from "@/lib/data";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren } from "@/components/animations/fade-in";
import { ActivityHighlights } from "@/components/features/activity-highlights";
import { LevelBadge } from "@/components/features/level-badge";
import { getRank, getNextRank } from "@/lib/config/gamification";
import { cn } from "@/lib/utils";

const metricIcons = [Award, Activity, Clock3, BrainCircuit];

export function RoleDashboard({
  title,
  subtitle,
  xp,
  progress,
  metrics
}: {
  title: string;
  subtitle: string;
  xp: number;
  progress: number;
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <FadeIn direction="up">
          <div className="relative overflow-hidden glass-card p-8 lg:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />
            
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 mb-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Control Center
            </Badge>
            
            <h1 className="text-5xl font-black tracking-tighter text-white lg:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-400 font-medium leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => {
                const Icon = metricIcons[index] ?? Activity;
                return (
                  <div key={metric.label} className="group relative rounded-3xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-400 group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{metric.label}</p>
                    <p className="mt-1 text-2xl font-black text-white">{metric.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <div className="space-y-6">
          <FadeIn direction="up" delay={0.2}>
            <div className="glass-card p-8 bg-gradient-to-br from-teal-500/5 to-transparent border-teal-500/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Terminal Mission</h3>
                  <p className="text-2xl font-black text-teal-400">Level Configurator</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <TerminalSquare className="h-6 w-6" />
                </div>
              </div>
              
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <p className="text-4xl font-black text-white">{metrics.find(m => m.label === "Labs Completed")?.value || 0}/10</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Missions Cleared</p>
                </div>
                <div className="w-24 h-24">
                  <ProgressChart progress={progress} color="#2dd4bf" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                  <p className="text-xs font-medium text-slate-400">Status: <span className="text-white italic">"{metrics.find(m => m.label === "Mission Status")?.value || "Ready"}"</span></p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <div className="glass-card relative p-8 h-full flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 shadow-[0_0_20px_rgba(20,184,166,0.5)]" />
              
              <LevelBadge xp={xp} size="lg" className="mb-6" />
              
              <div className="w-full space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Player Rank</p>
                    <h3 className="text-2xl font-black text-white">{getRank(xp).name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">{xp} <span className="text-xs text-slate-500 uppercase">XP</span></p>
                  </div>
                </div>

                {getNextRank(xp) && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-slate-500">
                      <span>Next Rank: {getNextRank(xp)?.name}</span>
                      <span>{getNextRank(xp)!.minXp - xp} XP to go</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 border border-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (xp / getNextRank(xp)!.minXp) * 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn("h-full bg-gradient-to-r", getRank(xp).color)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <StaggerChildren className="grid gap-6 lg:grid-cols-3">
        {previewCourses.map((course) => (
          <FadeIn direction="up" key={course.id}>
            <div className="group glass-card overflow-hidden p-6 transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="outline" className="border-white/10 text-slate-400 group-hover:text-teal-400 transition-colors">
                  {course.category}
                </Badge>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                {course.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                {course.lessons} Modules • {course.labs} Practical Labs
              </p>
              
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                  <span>Current Status</span>
                  <span>{course.progress}% Complete</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-1000" 
                    style={{ width: `${course.progress}%` }} 
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </StaggerChildren>
    </div>
  );
}
