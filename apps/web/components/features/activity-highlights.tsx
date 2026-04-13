"use client";

import { motion } from "framer-motion";
import { Activity, Bell, CheckCircle2, MessageSquare, Zap } from "lucide-react";

const activities = [
  { id: 1, type: "exam", user: "Rara", content: "Selesai Exam MikroTik-Basic", time: "2m ago", icon: CheckCircle2, color: "text-emerald-400" },
  { id: 2, type: "message", user: "AI Tutor", content: "Pesan baru untuk progres UKK", time: "15m ago", icon: MessageSquare, color: "text-sky-400" },
  { id: 3, type: "system", user: "Admin", content: "Materi Linux Admin diperbarui", time: "1h ago", icon: Zap, color: "text-amber-400" },
  { id: 4, type: "activity", user: "Budi", content: "Baru saja login", time: "2h ago", icon: Activity, color: "text-purple-400" },
];

export function ActivityHighlights() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center">
          <Bell className="mr-2 h-4 w-4 text-teal-400" />
          System Activity
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={activity.id}
            className="group relative flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:bg-white/[0.05]"
          >
            <div className={`mt-0.5 p-2 rounded-xl bg-white/5 ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">
                <span className="text-teal-400 font-bold">{activity.user}</span> {activity.content}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{activity.time}</p>
            </div>
            <div className="absolute top-1/2 -right-1 h-8 w-1 bg-teal-500/0 rounded-full group-hover:bg-teal-500/50 transition-all -translate-y-1/2" />
          </motion.div>
        ))}
      </div>
      
      <button className="w-full py-2 text-xs font-medium text-slate-500 hover:text-teal-400 transition-colors bg-white/5 rounded-xl border border-white/5">
        View Full Audit Log
      </button>
    </div>
  );
}
