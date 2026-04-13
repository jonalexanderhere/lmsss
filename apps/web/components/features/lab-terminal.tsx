"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const commandResponses: Record<string, string> = {
  "show ip route":
    "C 192.168.10.0/24 is directly connected, G0/0\nS 192.168.20.0/24 [1/0] via 10.0.0.2",
  "calc /27":
    "Subnet /27 memiliki 32 alamat total, 30 host usable, block size 32, mask 255.255.255.224",
  "set gateway 192.168.10.1":
    "Gateway berhasil diset untuk VLAN10. Pastikan static route atau inter-VLAN routing tersedia.",
  help: "Gunakan perintah: show ip route, calc /27, set gateway 192.168.10.1"
};

export function LabTerminal() {
  const [command, setCommand] = useState("help");
  const [output, setOutput] = useState(commandResponses.help);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Lab Simulator</CardTitle>
        <CardDescription>CLI-like interface untuk IP addressing, subnetting, dan routing logic.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[28px] border border-white/10 bg-slate-950 p-4 font-mono text-sm text-emerald-300">
          <p className="text-emerald-400">$ {command}</p>
          <pre className="mt-3 whitespace-pre-wrap text-emerald-100">{output}</pre>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input value={command} onChange={(e) => setCommand(e.target.value)} />
          <Button
            onClick={() => setOutput(commandResponses[command.toLowerCase()] ?? "Command not recognized. Ketik help.")}
            type="button"
          >
            Run Command
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
