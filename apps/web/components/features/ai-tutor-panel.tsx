"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function AITutorPanel() {
  const [question, setQuestion] = useState("Bagaimana cara menentukan gateway terbaik untuk dua VLAN?");
  const [answer, setAnswer] = useState(
    "AI Tutor siap membantu menjelaskan konsep routing, subnetting, keamanan jaringan, dan kesiapan PKL."
  );
  const [isPending, startTransition] = useTransition();

  const handleAsk = () => {
    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/ai/tutor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: question })
        });

        const data = (await response.json()) as { answer: string };
        setAnswer(data.answer);
      })();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-300" />
          AI Tutor Chat
        </CardTitle>
        <CardDescription>
          Assistant berbasis kurikulum TJKT untuk networking, cybersecurity, dan system administration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
        <Button className="w-full sm:w-auto" onClick={handleAsk} type="button">
          {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
          Ask AI Tutor
        </Button>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-foreground/90">
          {answer}
        </div>
      </CardContent>
    </Card>
  );
}
