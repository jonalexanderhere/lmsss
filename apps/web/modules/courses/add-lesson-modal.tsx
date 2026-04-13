"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Video, FileText, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { createLesson } from "@/lib/actions/teacher-actions";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Lesson"}
    </Button>
  );
}

export function AddLessonModal({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'text' | 'video'>('text');
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    try {
      formData.append("courseId", courseId);
      formData.append("type", type);
      await createLesson(formData);
      toast({ title: "Success", description: "Lesson added successfully." });
      setOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
          <DialogDescription>Tambahkan video pembelajaran atau materi teks untuk modul ini.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="flex gap-2">
            <Button 
               type="button" 
               variant={type === 'text' ? 'default' : 'secondary'} 
               className="flex-1" 
               onClick={() => setType('text')}
            >
              <FileText className="mr-2 h-4 w-4" /> Text
            </Button>
            <Button 
               type="button" 
               variant={type === 'video' ? 'default' : 'secondary'} 
               className="flex-1" 
               onClick={() => setType('video')}
            >
              <Video className="mr-2 h-4 w-4" /> Video
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input id="title" name="title" placeholder="e.g., Konfigurasi Vlan Dasar" required />
          </div>

          {type === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL (YouTube/Embed)</Label>
              <Input id="videoUrl" name="videoUrl" placeholder="https://youtube.com/..." required />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Content Brief / Instructions</Label>
            <Textarea id="content" name="content" placeholder="Deskripsi singkat atau materi teks..." rows={5} required />
          </div>
          
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
