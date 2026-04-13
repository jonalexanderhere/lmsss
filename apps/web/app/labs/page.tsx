import { Shell } from "@/components/layout/shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TerminalSquare, Cpu, Box, Cloud } from "lucide-react";

export default function LabsPage() {
  return (
    <Shell role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Practice Lab</h1>
          <p className="mt-2 text-slate-400">Lingkungan simulasi praktis untuk Cisco, Linux, dan Virtualisasi.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              title: "Cisco Networking Lab", 
              desc: "Simulasi routing, switching, dan VLAN configuration secara real-time.", 
              icon: Cpu,
              level: "Intermediate"
            },
            { 
              title: "Linux Server Hardening", 
              desc: "Konfigurasi keamanan pada Ubuntu Server dan CentOS.", 
              icon: TerminalSquare,
              level: "Advanced"
            },
            { 
              title: "Virtualization Sandbox", 
              desc: "Deploy Proxmox dan VMware dalam lingkungan terkontrol.", 
              icon: Box,
              level: "Expert"
            }
          ].map((lab) => (
            <div key={lab.title} className="group glass-card p-6 h-full border-teal-500/10 hover:border-teal-500/30 transition-all cursor-not-allowed">
              <div className="flex h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 font-bold">
                <lab.icon className="h-6 w-6" />
              </div>
              <Badge className="bg-white/5 text-slate-400 mb-4">{lab.level}</Badge>
              <h3 className="text-xl font-bold text-white mb-2">{lab.title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {lab.desc}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white/5 px-3 py-2 rounded-xl w-fit">
                <Cloud className="h-4 w-4" />
                <span>SERVER PROVISIONING SOON</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
