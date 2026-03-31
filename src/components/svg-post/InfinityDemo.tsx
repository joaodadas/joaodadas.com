"use client";

import { useState } from "react";

export default function InfinityDemo() {
  const [breathing, setBreathing] = useState(true);

  return (
    <div className="my-8 rounded-lg border border-border overflow-hidden">
      <div className="flex gap-1 p-3 bg-muted/50">
        <button
          onClick={() => setBreathing(false)}
          className={`px-3 py-1.5 rounded text-xs transition-colors ${
            !breathing
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Move only
        </button>
        <button
          onClick={() => setBreathing(true)}
          className={`px-3 py-1.5 rounded text-xs transition-colors ${
            breathing
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Move + breathe
        </button>
      </div>

      <div className="p-6 flex flex-col items-center gap-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-20 h-20 text-foreground"
        >
          <path
            d="M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeLinecap="round"
            fill="none"
            opacity={0.15}
          />
          <path
            d="M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z"
            stroke="currentColor"
            strokeWidth="1.125"
            strokeLinecap="round"
            pathLength={100}
            fill="none"
            style={{
              strokeDasharray: "15 85",
              animation: breathing
                ? "infinity-move 2s linear infinite, infinity-dash 4s ease-in-out infinite"
                : "infinity-move 2s linear infinite",
            }}
          />
        </svg>

        <p className="text-sm text-muted-foreground text-center max-w-md">
          {breathing
            ? "Two animations combined: the dash moves along the path AND breathes in size. The different durations (2s vs 4s) create an organic rhythm."
            : "Only the move animation: the dash slides along the path at constant speed and size. Functional, but mechanical."}
        </p>
      </div>
    </div>
  );
}
