"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Send, TerminalSquare, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { updateLabProgress } from "@/lib/actions/lab-actions";

type Mission = {
  command: string;
  response: string | ((input: string) => string);
  goal: string;
};

const missions: Mission[] = [
  { 
    command: "help", 
    response: "Available commands: help, clear, ping, traceroute, ifconfig, ssh, mtr", 
    goal: "Dapatkan daftar perintah" 
  },
  { 
    command: "ifconfig", 
    response: "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.15  netmask 255.255.255.0  broadcast 192.168.1.255\n        ether 08:00:27:85:cf:3a  txqueuelen 1000  (Ethernet)", 
    goal: "Periksa konfigurasi IP lokal" 
  },
  { 
    command: "ping google.com", 
    response: "PING google.com (142.251.46.238): 56 data bytes\n64 bytes from 142.251.46.238: icmp_seq=0 ttl=118 time=14.2 ms\n64 bytes from 142.251.46.238: icmp_seq=1 ttl=118 time=15.1 ms\n--- google.com ping statistics ---\n2 packets transmitted, 2 packets received, 0.0% packet loss", 
    goal: "Verifikasi koneksi internet" 
  },
  {
    command: "traceroute smkn1liwa.sch.id",
    response: "traceroute to smkn1liwa.sch.id (103.123.45.67), 30 hops max\n 1  192.168.1.1 (192.168.1.1)  1.2 ms\n 2  10.10.10.1 (ISP-Gateway)  8.5 ms\n 3  103.123.45.67 (SMK1-Server)  12.4 ms",
    goal: "Analisis jalur paket ke server sekolah"
  },
  {
    command: "mtr 8.8.8.8",
    response: "My traceroute  [v0.95]\nHostname                      Loss%   Snt   Last   Avg  Best  Wrst StDev\n1. 192.168.1.1                0.0%    10    0.3   0.3   0.2   0.5   0.1\n2. 10.10.10.1                 0.0%    10    1.5   1.8   1.2   2.5   0.4\n3. 8.8.8.8                    0.0%    10   14.2  14.3  14.1  14.6   0.2",
    goal: "Analisis latensi ke DNS Google"
  }
];

export function TerminalLab({ userId }: { userId: string }) {
  const [history, setHistory] = useState<string[]>(["Welcome to NetClassix interactive CLI v2.0", "Type 'help' to start your mission."]);
  const [input, setInput] = useState("");
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `student@smk1liwa:~$ ${input}`];
    
    // Process command
    const mission = missions.find(m => m.command === cmd || (m.command.includes("<") && cmd.startsWith(m.command.split("<")[0])));
    
    let output = "Command not found. Type 'help' for available commands.";
    if (mission) {
      output = typeof mission.response === "function" ? mission.response(cmd) : mission.response;
      
      if (!completedMissions.includes(mission.goal)) {
        const updated = [...completedMissions, mission.goal];
        setCompletedMissions(updated);
        // Save to DB
        await updateLabProgress(userId, updated.length, `Mission Completed: ${mission.goal}`);
      }
    } else if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    setHistory([...newHistory, ...output.split("\n")]);
    setInput("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex flex-col h-[600px] rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-xl overflow-hidden font-mono">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/50" />
              <div className="h-3 w-3 rounded-full bg-amber-500/50" />
              <div className="h-3 w-3 rounded-full bg-teal-500/50" />
            </div>
            <span className="ml-4 text-xs font-bold text-slate-500 uppercase tracking-widest">TJKT Interactive Console</span>
          </div>
          <TerminalSquare className="h-4 w-4 text-slate-600" />
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto space-y-1 text-sm text-teal-400 leading-relaxed scrollbar-thin scrollbar-thumb-white/10"
        >
          {history.map((line, i) => (
            <div key={i} className={line.startsWith("student@") ? "text-white mt-4" : ""}>
              {line}
            </div>
          ))}
          <div className="h-4" />
        </div>

        <form onSubmit={handleCommand} className="p-4 bg-white/5 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 border border-white/5 focus-within:border-teal-500/50 transition-colors">
            <ChevronRight className="h-4 w-4 text-teal-500 shrink-0" />
            <input
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-700 text-sm"
              placeholder="Enter command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 border-teal-500/20 bg-teal-500/5">
          <h3 className="text-lg font-bold text-white mb-4">Mission Board</h3>
          <div className="space-y-3">
            {missions.map((m) => {
              const done = completedMissions.includes(m.goal);
              return (
                <div key={m.goal} className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${done ? "bg-teal-500/10 border-teal-500/30" : "bg-white/5 border-white/5"}`}>
                  {done ? <CheckCircle2 className="h-4 w-4 text-teal-400 mt-1 shrink-0" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-700 mt-1 shrink-0" />}
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${done ? "text-teal-400" : "text-slate-300"}`}>{m.goal}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">$ {m.command}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <AlertCircle className="h-5 w-5" />
            <h4 className="font-bold">Next Level</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Selesaikan seluruh misi terminal untuk membuka akses ke **MikroTik Advanced Routing Lab**.
          </p>
        </div>
      </div>
    </div>
  );
}
