"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { AI_MASCOT } from "@/lib/config/gamification";
import Image from "next/image";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AITutorPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo Engineer! Saya Eddy, AI Tutor Anda. Ada yang bisa saya bantu terkait konfigurasi Mikrotik atau Cisco hari ini?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px] border-teal-500/20 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-teal-500/5">
      <CardHeader className="border-b border-white/5 bg-teal-500/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-pulse" />
              <Image 
                src={AI_MASCOT}
                alt="Eddy AI"
                fill
                className="rounded-full object-cover border border-teal-500/30"
              />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                EDDY AI TUTOR
                <Badge className="bg-teal-500 text-slate-950 text-[8px] h-4 leading-none">ONLINE</Badge>
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-teal-500/60 truncate">Reasoning Core 3.1</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-teal-500 text-slate-950 font-bold' 
                : 'bg-white/5 text-slate-300 border border-white/10'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
              <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </CardContent>

      <div className="p-4 bg-white/5 border-t border-white/5">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            placeholder="Tanyakan sesuatu..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black/20 border-white/10 rounded-xl text-sm focus:ring-teal-500"
          />
          <Button type="submit" size="icon" className="bg-teal-500 hover:bg-teal-600 rounded-xl shrink-0">
            <Send className="h-4 w-4 text-slate-950" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
