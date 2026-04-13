"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type FeedItem = {
  id: string;
  score: number;
  created_at: string;
};

export function useLiveResults(userId?: string | null) {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const supabase = createClient();
    const channel = supabase
      .channel(`results-feed-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "results",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const next = payload.new as FeedItem;
          setFeed((current) => [next, ...current].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  return feed;
}
