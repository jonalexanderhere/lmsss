"use client";

import { Calendar, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type AttendanceRecord = {
  id: string;
  status: "present" | "late" | "absent" | "excused";
  confidence_score: number;
  created_at: string;
};

export function AttendanceHistory({ records }: { records: AttendanceRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="glass-card p-12 text-center border-dashed border-2 border-white/5 opacity-50">
        <Calendar className="h-10 w-10 mx-auto mb-4 text-slate-500" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Attendance Protocol Logs</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden border-white/5 bg-slate-900/40">
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h2 className="text-xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-teal-400" />
          BIOMETRIC LOGS
        </h2>
        <Badge variant="outline" className="border-teal-500/20 text-teal-400 bg-teal-500/5">AI Secured</Badge>
      </div>
      
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent uppercase tracking-widest text-[10px] font-black text-slate-500">
            <TableHead>Date & Time</TableHead>
            <TableHead>Protocol Status</TableHead>
            <TableHead className="text-right">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="border-white/5 hover:bg-white/[0.02]">
              <TableCell className="text-white font-medium">
                <div className="flex flex-col">
                  <span>{new Date(record.created_at).toLocaleDateString()}</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${record.status === 'present' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                  <span className="capitalize text-sm font-bold text-slate-300">{record.status}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono text-teal-400/80 font-bold">
                  {Math.round(record.confidence_score * 100)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
