"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartbeatIconProps {
  bpm: number;
  className?: string;
}

export function HeartbeatIcon({ bpm, className }: HeartbeatIconProps) {
  const critical = bpm > 110 || bpm < 55;
  return (
    <Heart
      className={cn(
        "h-4 w-4 fill-current",
        critical ? "text-red-500 animate-heartbeat" : "text-red-400 animate-heartbeat",
        className
      )}
    />
  );
}
