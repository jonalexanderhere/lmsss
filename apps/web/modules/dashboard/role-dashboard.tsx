"use client";

import { Activity, Award, BrainCircuit, Clock3 } from "lucide-react";
import { ProgressChart } from "@/components/charts/progress-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { chartData, previewCourses, aiPreview } from "@/lib/data";
import { getRankFromXp } from "@/lib/utils";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren } from "@/components/animations/fade-in";
import { ActivityHighlights } from "@/components/features/activity-highlights";
import { Zap } from "lucide-react";

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
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Reputation</h3>
                  <p className="text-2xl font-black text-white">{getRankFromXp(xp)}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Award className="h-6 w-6" />
                </div>
              </div>
              
              <div className="relative py-4 text-center">
                <p className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800">
                  {xp}
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">
                    <span>Mastery Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full bg-slate-800" />
                </div>
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
