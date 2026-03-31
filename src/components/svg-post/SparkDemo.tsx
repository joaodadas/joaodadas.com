"use client";

import { useState } from "react";

export default function SparkDemo() {
  const [speed, setSpeed] = useState(3.5);
  const [glow, setGlow] = useState(true);

  const SPARK = 0.08;
  const DASH_ARR = `${SPARK} 2`;
  const DASH_FROM = 1 + SPARK;
  const DASH_TO = -(1 + SPARK);

  return (
    <div className="my-8">
      <style>{`
        @keyframes spark-demo {
          from { stroke-dashoffset: ${DASH_FROM}; }
          to   { stroke-dashoffset: ${DASH_TO}; }
        }
      `}</style>

      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 300 80" className="w-full max-w-md">
          <defs>
            {glow && (
              <filter id="spark-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          <path
            d="M 30 40 C 30 40, 150 10, 270 40"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity={0.15}
          />
          <path
            d="M 30 40 C 30 40, 150 10, 270 40"
            pathLength={1}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={DASH_ARR}
            fill="none"
            opacity={0.7}
            filter={glow ? "url(#spark-glow)" : undefined}
            style={{
              animation: `spark-demo ${speed}s linear infinite`,
            }}
          />

          <path
            d="M 30 40 C 30 70, 150 70, 270 40"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity={0.15}
          />
          <path
            d="M 30 40 C 30 70, 150 70, 270 40"
            pathLength={1}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={DASH_ARR}
            fill="none"
            opacity={0.7}
            filter={glow ? "url(#spark-glow)" : undefined}
            style={{
              animation: `spark-demo ${speed}s linear infinite`,
              animationDelay: `${speed / 2}s`,
            }}
          />
        </svg>

        <div className="flex flex-wrap gap-6 items-center justify-center">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Speed
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-foreground"
            />
            <span className="w-8 text-xs">{speed}s</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={glow}
              onChange={(e) => setGlow(e.target.checked)}
              className="accent-foreground"
            />
            Glow
          </label>
        </div>
      </div>
    </div>
  );
}
