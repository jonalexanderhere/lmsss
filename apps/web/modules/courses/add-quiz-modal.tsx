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
          <div className="space-y-2">
            <Label htmlFor="title">Exam Title</Label>
            <Input id="title" name="title" defaultValue={existingQuiz?.title || "UKK Prep Quiz"} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timer">Timer (Minutes)</Label>
            <Input id="timer" name="timer" type="number" defaultValue={existingQuiz?.timer_in_minutes || 15} required />
          </div>
          <SubmitButton exists={!!existingQuiz} />
          {existingQuiz && (
             <p className="text-xs text-center text-muted-foreground italic">
               *Question management panel integration coming soon. Use database for direct edits.
             </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
