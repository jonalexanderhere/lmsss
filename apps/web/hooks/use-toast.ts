import { useState, useCallback } from "react";

export function useToast() {
  const toast = useCallback(({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    // Simplified toast using window alert since we don't have a full provider set up yet
    const message = `${title}\n${description}`;
    if (variant === 'destructive') {
      console.error(message);
    }
    alert(message);
  }, []);

  return { toast };
}
