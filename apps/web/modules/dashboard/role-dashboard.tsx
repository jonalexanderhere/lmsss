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
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <FadeIn direction="up">
          <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-teal-400/5 via-slate-900/50 to-sky-400/5 backdrop-blur-md">
            <div className="absolute inset-0 bg-grid-fade opacity-10" />
            <CardHeader className="relative">
              <Badge className="w-fit bg-teal-400/10 text-teal-300 border-teal-400/20">Operational Deck</Badge>
              <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{title}</CardTitle>
              <CardDescription className="max-w-2xl text-base text-slate-400 mt-2">{subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <StaggerChildren className="grid gap-4 sm:grid-cols-2">
                {metrics.map((metric, index) => {
                  const Icon = metricIcons[index] ?? Activity;
                  return (
                    <FadeIn delay={index * 0.1} direction="right" key={metric.label}>
                      <div className="group rounded-3xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-teal-400/30 hover:bg-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-teal-400 group-hover:scale-125 transition-transform" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{metric.label}</span>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-white tracking-tight">{metric.value}</p>
                      </div>
                    </FadeIn>
                  );
                })}
              </StaggerChildren>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <Card className="h-full border-white/10 bg-slate-900/50 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400 fill-amber-400/20" />
                <CardTitle>XP & Rank Meta</CardTitle>
              </div>
              <CardDescription>Progress gamification untuk mendorong skill nyata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <motion.p 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600"
                >
                  {xp}
                </motion.p>
                <Badge variant="secondary" className="mt-2 text-md px-4">{getRankFromXp(xp)}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Current Level</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-xs text-center text-slate-500 italic">
                  Capai {Math.max(0, 100 - progress)}% lagi untuk naik ke rank berikutnya.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <FadeIn direction="up" delay={0.3}>
          <Card className="border-white/10 bg-slate-900/50">
            <CardHeader>
              <CardTitle>Learning Momentum</CardTitle>
              <CardDescription>Performa lintas domain pembelajaran TJKT.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart data={chartData} />
            </CardContent>
          </Card>
        </FadeIn>
        
        <FadeIn direction="up" delay={0.4}>
          <Card className="border-white/10 bg-slate-900/50 overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5">
              <CardTitle className="text-lg">Live Pulse</CardTitle>
              <CardDescription>Real-time events from the SMK 1 Liwa community.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ActivityHighlights />
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      <StaggerChildren staggerDelay={0.1} className="grid gap-6 lg:grid-cols-3">
        {previewCourses.map((course) => (
          <FadeIn direction="up" key={course.id}>
            <Card className="group border-white/10 bg-slate-900/50 transition-all hover:border-teal-500/50 hover:bg-slate-900/80">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-white/5">{course.category}</Badge>
                  <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                </div>
                <CardTitle className="mt-3 group-hover:text-teal-400 transition-colors">{course.title}</CardTitle>
                <CardDescription>
                  {course.lessons} lessons • {course.labs} labs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </StaggerChildren>
    </div>
  );
}
