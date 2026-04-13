"use client";

import { Download, ExternalLink, Network, FileCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ptMissions = [
  { id: 1, title: "Basic Switching", file: "basic_switch_smk.pkt", difficulty: "Easy" },
  { id: 2, title: "Router on a Stick (VLAN)", file: "router_stick_smk.pkt", difficulty: "Medium" },
  { id: 3, title: "Standard ACL Security", file: "acl_security_smk.pkt", difficulty: "Hard" },
];

export function CiscoPacketTracer() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-blue-600/10 p-8 rounded-[40px] border border-blue-600/20">
        <div className="h-16 w-16 rounded-[24px] bg-blue-600/20 flex items-center justify-center text-blue-400">
          <Network className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Cisco Packet Tracer Arena</h2>
          <p className="text-blue-400 font-medium">Download skenario, selesaikan, dan laporkan hasil praktikum Anda.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ptMissions.map((mission) => (
          <div key={mission.id} className="group glass-card p-6 flex flex-col hover:bg-white/[0.08] transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-blue-400 transition-colors">
                <FileCode className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
                ID: {mission.id.toString().padStart(3, '0')}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{mission.title}</h3>
            <p className="text-sm text-slate-400 mb-8">Pelajari konfigurasi {mission.title.toLowerCase()} menggunakan topologi standar SMK Negeri 1 Liwa.</p>
            
            <div className="mt-auto space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Download className="mr-2 h-4 w-4" />
                Download .pkt
              </Button>
              <Button variant="secondary" className="w-full border-blue-600/30 text-blue-400 hover:bg-blue-600/10 rounded-xl">
                <ExternalLink className="mr-2 h-4 w-4" />
                Lihat Panduan
              </Button>
            </div>
          </div>
        ))}

        <div className="glass-card p-6 border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center opacity-60">
          <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-slate-600" />
          </div>
          <p className="text-sm font-bold text-slate-500">More Scenarios Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
