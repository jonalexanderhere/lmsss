"use client";

import { RadioTower } from "lucide-react";
import { useLiveResults } from "@/hooks/use-live-results";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LiveResultsFeed({ userId }: { userId?: string | null }) {
  const feed = useLiveResults(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RadioTower className="h-5 w-5 text-teal-300" />
          Realtime Results
        </CardTitle>
        <CardDescription>
          Update langsung dari Supabase Realtime saat hasil baru masuk.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {feed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada event realtime. Submit hasil quiz untuk melihat feed langsung.
          </p>
        ) : null}
        {feed.map((item) => (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm" key={item.id}>
            <p className="font-medium">Quiz score: {item.score}</p>
            <p className="mt-1 text-muted-foreground">
              {new Date(item.created_at).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
