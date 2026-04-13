"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { quizPreview } from "@/lib/data";

export function QuizSession() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const submit = () => {
    const score = quizPreview.reduce((total, item) => {
      return total + (answers[item.id] === item.answer ? 50 : 0);
    }, 0);

    setResult(`Score ${score}/100. Sistem backend menyimpan duration, mistakes, dan AI analysis.`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Quiz Engine</CardTitle>
            <CardDescription>Randomized question, auto grading, dan timer-ready workflow.</CardDescription>
          </div>
          <Badge className="bg-amber-400/10 text-amber-200">15 min</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {quizPreview.map((item, index) => (
          <div className="space-y-3" key={item.id}>
            <p className="font-medium">
              {index + 1}. {item.question}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {item.options.map((option: string) => (
                <button
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    answers[item.id] === option
                      ? "border-teal-400 bg-teal-400/10 text-teal-100"
                      : "border-white/10 bg-white/5 text-muted-foreground"
                  }`}
                  key={option}
                  onClick={() =>
                    setAnswers((current) => ({
                      ...current,
                      [item.id]: option
                    }))
                  }
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <Button onClick={submit} type="button">
          Submit Quiz
        </Button>
        {result ? <p className="text-sm text-teal-100">{result}</p> : null}
      </CardContent>
    </Card>
  );
}
