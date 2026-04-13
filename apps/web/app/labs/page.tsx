import { Shell } from "@/components/layout/shell";
import { TerminalLab } from "@/components/features/terminal-lab";
import { CiscoPacketTracer } from "@/components/features/cisco-pt-hub";
import { requireRole } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Network } from "lucide-react";

export default async function LabsPage() {
  const auth = await requireRole(["student", "teacher", "admin"]);

  return (
    <Shell role={auth.user.role as any}>
      <div className="space-y-10">
        <Tabs defaultValue="terminal" className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white">Practice Arena</h1>
              <p className="mt-2 text-slate-400">Pilih mode simulasi untuk mengasah keahlian teknis Anda.</p>
            </div>
            
            <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl">
              <TabsTrigger value="terminal" className="rounded-xl h-12 px-6 data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950">
                <Terminal className="mr-2 h-4 w-4" />
                Interaktif Terminal
              </TabsTrigger>
              <TabsTrigger value="cisco" className="rounded-xl h-12 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Network className="mr-2 h-4 w-4" />
                Cisco Packet Tracer
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="terminal" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TerminalLab userId={auth.user.id} />
          </TabsContent>

          <TabsContent value="cisco" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CiscoPacketTracer />
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
