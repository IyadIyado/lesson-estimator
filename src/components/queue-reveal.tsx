"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QueueEntry {
  id: string;
  name: string;
  eta: number;
}

export function QueueReveal({ entries }: { entries: QueueEntry[] }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={`relative select-none ${revealed ? "cursor-default" : "cursor-pointer"}`}
      onClick={() => setRevealed(true)}
    >
      <Card className="border-2 border-warm-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Waiting List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-2xl border-2 border-warm-border bg-peach-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-peach-300 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="font-semibold text-foreground">
                  {entry.name}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ~{entry.eta} {entry.eta === 1 ? "week" : "weeks"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Blur overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl transition-all duration-500 ${
          revealed
            ? "pointer-events-none opacity-0"
            : "opacity-100 backdrop-blur-md"
        }`}
        style={{
          background: revealed
            ? "transparent"
            : "rgba(253, 232, 216, 0.45)",
        }}
      >
        <span className="text-2xl">👆</span>
        <span className="mt-2 text-sm font-semibold text-warm-brown">
          Tap to reveal
        </span>
      </div>
    </div>
  );
}
