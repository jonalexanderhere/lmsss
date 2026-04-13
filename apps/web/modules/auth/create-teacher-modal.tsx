"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, Loader2 } from "lucide-react";
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
import { createTeacherAccount } from "@/lib/actions/admin-actions";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Account...
        </>
      ) : (
        "Create Teacher Account"
      )}
    </Button>
  );
}

export function CreateTeacherModal() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    try {
      await createTeacherAccount(formData);
      toast({
        title: "Success",
        description: "Teacher account created successfully.",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create teacher account.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Create a professional account for a teacher. They will have access to course management tools.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Budi Santoso, S.Kom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="budi@smk1liwa.sch.id" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Initial Password</Label>
            <Input id="password" name="password" type="password" required />
            <p className="text-[10px] text-muted-foreground italic">
              *Password should be secure. Teacher can reset it later.
            </p>
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
