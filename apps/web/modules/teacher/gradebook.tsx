"use client";

import { LevelBadge } from "@/components/features/level-badge";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Award, Brain, BarChart3 } from "lucide-react";

type StudentRecord = {
  id: string;
  full_name: string;
  xp: number;
  class_name: string;
  grade: string;
  avgScore: number;
  quizzesTaken: number;
};

export function Gradebook({ students }: { students: StudentRecord[] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-card p-6 border-teal-500/20 bg-teal-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Total Personnel</h3>
          </div>
          <p className="text-3xl font-black text-white">{students.length} Students</p>
        </div>

        <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Avg. Mastery</h3>
          </div>
          <p className="text-3xl font-black text-white">
            {Math.round(students.reduce((acc, s) => acc + s.avgScore, 0) / (students.length || 1))}%
          </p>
        </div>

        <div className="glass-card p-6 border-violet-500/20 bg-violet-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Total Missions</h3>
          </div>
          <p className="text-3xl font-black text-white">{students.reduce((acc, s) => acc + s.quizzesTaken, 0)} Cleared</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-white/5 bg-slate-900/40">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Main Scoreboard</h2>
          <BarChart3 className="h-5 w-5 text-slate-500" />
        </div>
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent uppercase tracking-widest text-[10px] font-black text-slate-500">
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Total XP</TableHead>
              <TableHead className="text-right">Avg Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="border-white/5 hover:bg-white/[0.02]">
                <TableCell>
                  <LevelBadge xp={student.xp} size="sm" />
                </TableCell>
                <TableCell className="font-bold text-white capitalize">{student.full_name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-white/10 text-slate-400">{student.grade} - {student.class_name}</Badge>
                </TableCell>
                <TableCell className="font-mono text-teal-400 font-bold">{student.xp.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                   <span className={cn(
                     "font-black text-lg",
                     student.avgScore >= 80 ? "text-emerald-400" : student.avgScore >= 60 ? "text-amber-400" : "text-rose-400"
                   )}>
                     {student.avgScore}%
                   </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
