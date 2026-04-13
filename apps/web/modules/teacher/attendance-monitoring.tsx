"use client";

import { Calendar, User, Clock, CheckCircle2, ShieldOff, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type AttendanceLog = {
  id: string;
  user_id: string;
  class_name: string;
  status: "present" | "late" | "absent" | "excused";
  confidence_score: number;
  created_at: string;
  users: { name: string };
};

export function AttendanceMonitoring({ logs }: { logs: AttendanceLog[] }) {
  const [filter, setFilter] = useState("");

  const filteredLogs = logs.filter(log => 
    log.users.name.toLowerCase().includes(filter.toLowerCase()) || 
    log.class_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
          <Calendar className="h-6 w-6 text-teal-400" />
          Attendance Control Center
        </h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input 
             placeholder="Cari siswa atau kelas..." 
             className="pl-10 bg-white/5 border-white/10 rounded-xl h-10"
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden border-white/5 bg-slate-900/40 shadow-xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent uppercase tracking-widest text-[10px] font-black text-slate-500">
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-xs uppercase">
                      {log.users.name.charAt(0)}
                    </div>
                    <span className="font-bold text-white capitalize">{log.users.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-white/10 text-slate-400 group-hover:bg-white/5">{log.class_name}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${log.status === 'present' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                    <span className="capitalize text-sm font-bold text-slate-300">{log.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center w-24">
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Score</span>
                       <span className="text-[10px] text-teal-400 font-bold italic">{Math.round(log.confidence_score * 100)}%</span>
                    </div>
                    <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-teal-500" style={{ width: `${log.confidence_score * 100}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{new Date(log.created_at).toLocaleDateString()}</span>
                      <span className="text-[10px] text-slate-500 font-medium flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredLogs.length === 0 && (
          <div className="p-20 text-center">
             <ShieldOff className="h-10 w-10 mx-auto mb-4 text-slate-700" />
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Signal Detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
