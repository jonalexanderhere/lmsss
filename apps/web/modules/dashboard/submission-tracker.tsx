"use client";

import { CheckCircle2, Circle, Clock, Rocket, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Submission = {
  id: string;
  title: string;
  type: "quiz" | "exam" | "lab";
  status: "completed" | "in-progress" | "pending";
  score?: number;
  dueDate?: string;
};

export function SubmissionTracker({ submissions }: { submissions: Submission[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
          <Rocket className="h-5 w-5 text-teal-400" />
          Mission Status Tracker
        </h2>
      </div>

      <div className="grid gap-4">
        {submissions.map((sub) => (
          <div 
            key={sub.id} 
            className="glass-card p-5 flex items-center justify-between border-white/5 bg-slate-900/40 hover:bg-white/[0.03] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${
                sub.status === 'completed' ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' :
                sub.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                'bg-slate-500/10 border-white/5 text-slate-500'
              }`}>
                {sub.status === 'completed' ? <CheckCircle2 className="h-6 w-6" /> :
                 sub.status === 'in-progress' ? <Clock className="h-6 w-6" /> :
                 <Circle className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-teal-400 transition-colors">{sub.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-white/10 text-slate-500">{sub.type}</Badge>
                  {sub.dueDate && (
                     <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Deadline: {sub.dueDate}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
               {sub.status === 'completed' ? (
                 <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-teal-400 italic">{sub.score}%</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mastered</span>
                 </div>
               ) : (
                 <Badge className={
                   sub.status === 'in-progress' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                   "bg-slate-900 text-slate-500 border-white/5"
                 }>
                   {sub.status === 'in-progress' ? "ACTIVE MISSION" : "STANDBY"}
                 </Badge>
               )}
            </div>
          </div>
        ))}

        {submissions.length === 0 && (
          <div className="glass-card p-12 text-center opacity-40 border-dashed border-2">
             <ShieldAlert className="h-10 w-10 mx-auto mb-2 text-slate-600" />
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">No Mission Data Available</p>
          </div>
        )}
      </div>
    </div>
  );
}
