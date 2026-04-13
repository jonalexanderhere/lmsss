"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { promoteClass } from "@/lib/actions/teacher-actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRightCircle } from "lucide-react";

export function PromotionTool({ className, grade }: { className: string; grade: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePromotion = async () => {
    const confirmMsg = `Apakah Anda yakin ingin menaikkan SELURUH siswa di kelas ${grade} ${className}?`;
    if (!confirm(confirmMsg)) return;

    setLoading(true);
    try {
      await promoteClass(className, grade);
      toast({
        title: "Promotion Success",
        description: `Seluruh siswa ${grade} ${className} telah dipromosikan.`,
      });
    } catch (error: any) {
      toast({
        title: "Promotion Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className="justify-between group hover:border-primary/50"
      disabled={loading}
      onClick={handlePromotion}
    >
      <span className="font-medium">{className}</span>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : (
        <ArrowRightCircle className="h-4 w-4 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
      )}
    </Button>
  );
}
