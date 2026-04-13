"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ClipboardCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createQuiz } from "@/lib/actions/teacher-actions";
import { useToast } from "@/hooks/use-toast";

function SubmitButton({ exists }: { exists: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending || exists}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : exists ? "Quiz Already Created" : "Create Exam"}
    </Button>
  );
}

export function AddQuizModal({ lessonId, existingQuiz }: { lessonId: string; existingQuiz?: any }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    try {
      formData.append("lessonId", lessonId);
      await createQuiz(formData);
      toast({ title: "Success", description: "Quiz/Exam created successfully." });
      setOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={existingQuiz ? "ghost" : "secondary"} className="flex gap-2">
          <ClipboardCheck className={`h-4 w-4 ${existingQuiz ? 'text-orange-500' : 'text-muted-foreground'}`} />
          {existingQuiz ? "Edit Quiz" : "Add Quiz"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingQuiz ? "Manage Exam" : "Create New Exam"}</DialogTitle>
          <DialogDescription>
            {existingQuiz ? "Exam ini sudah aktif. Anda bisa mengubah judul atau timer." : "Buat ujian/kuis untuk materi pembelajaran ini."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam/Quiz Title</Label>
              <Input id="title" name="title" defaultValue={existingQuiz?.title || "Final Mastery Assessment"} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timer">Timer (Minutes)</Label>
              <Input id="timer" name="timer" type="number" defaultValue={existingQuiz?.timer_in_minutes || 15} required />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-orange-400">Official Exam Mode</Label>
                <p className="text-[10px] text-slate-500 font-medium italic">Jadikan sebagai ulangan/ujian resmi.</p>
              </div>
              <input 
                type="checkbox" 
                name="isExam" 
                value="true" 
                defaultChecked={existingQuiz?.is_exam}
                className="h-5 w-5 rounded border-white/10 bg-black/20 text-orange-500 focus:ring-orange-500" 
              />
            </div>
          </div>
          <SubmitButton exists={!!existingQuiz} />
          {existingQuiz && (
             <p className="text-xs text-center text-slate-500 italic mt-4">
               *Exam configuration is live. Questions are managed via Question Bank.
             </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
