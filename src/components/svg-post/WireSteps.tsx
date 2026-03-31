"use client";

import { useState } from "react";

const steps = [
  { label: "1. The wire", description: "A simple line — the shape of the wire." },
  { label: "2. Mask + rectangle", description: "Use the line as a mask on a colored rectangle." },
  { label: "3. Animate!", description: "Move the rectangle with CSS — light travels the wire." },
];

export default function WireSteps() {
  const [step, setStep] = useState(0);

  return (
    <div className="my-8">
      <style>{`
        @keyframes wire-down {
          0% { transform: translateY(-20px); }
          100% { transform: translateY(100px); }
        }
        @keyframes wire-down-fancy {
          0% { transform: translateY(-40px); }
          100% { transform: translateY(100px); }
        }
      `}</style>

      <div className="flex gap-1 mb-4">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              step === i
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="h-32 flex items-center justify-center">
          {step === 0 && (
            <svg viewBox="0 0 50 100" className="w-12 h-24">
              <line x1="25" y1="0" x2="25" y2="100" stroke="currentColor" strokeWidth="2" opacity={0.3} />
            </svg>
          )}

          {step === 1 && (
            <svg viewBox="0 0 50 100" className="w-12 h-24">
              <line x1="25" y1="0" x2="25" y2="100" stroke="currentColor" strokeWidth="2" opacity={0.15} />
              <mask id="ws-mask-static">
                <line x1="25" y1="0" x2="25" y2="100" stroke="white" strokeWidth="2" />
              </mask>
              <rect x="0" y="30" width="50" height="20" fill="#ef4444" mask="url(#ws-mask-static)" />
            </svg>
          )}

          {step === 2 && (
            <div className="flex items-center gap-10">
              <svg viewBox="0 0 50 100" className="w-12 h-24">
                <line x1="25" y1="0" x2="25" y2="100" stroke="currentColor" strokeWidth="2" opacity={0.15} />
                <mask id="ws-mask-anim">
                  <line x1="25" y1="0" x2="25" y2="100" stroke="white" strokeWidth="2" />
                </mask>
                <rect
                  x="0" y="0" width="50" height="20"
                  fill="#ef4444"
                  mask="url(#ws-mask-anim)"
                  style={{ animation: "wire-down linear infinite 2s" }}
                />
              </svg>

              <svg viewBox="0 0 50 100" className="w-10 h-24">
                <line x1="25" y1="0" x2="25" y2="100" stroke="currentColor" strokeWidth="2" opacity={0.15} />
                <defs>
                  <linearGradient id="ws-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(168,85,247,0.1)" />
                    <stop offset="100%" stopColor="rgb(168,85,247)" />
                  </linearGradient>
                </defs>
                <mask id="ws-mask-fancy">
                  <line x1="25" y1="0" x2="25" y2="100" stroke="white" strokeWidth="2" />
                </mask>
                <rect
                  x="0" y="0" width="50" height="40"
                  fill="url(#ws-grad)"
                  mask="url(#ws-mask-fancy)"
                  style={{ animation: "wire-down-fancy linear infinite 3s" }}
                />
              </svg>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground text-center max-w-md">
          {steps[step]?.description}
        </p>
      </div>
    </div>
  );
}
