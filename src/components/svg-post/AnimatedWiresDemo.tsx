"use client";

const W = 520;
const H = 340;
const CX = W / 2;
const CY = H / 2;
const PAD = 74;

const providers = [
  {
    id: "openai",
    label: "OpenAI",
    x: PAD,
    y: PAD,
    logo: "/blog/openai.svg",
    invert: true,
    delay: "0s",
    path: `M ${PAD} ${PAD} C ${PAD} ${CY}, ${CX} ${PAD}, ${CX} ${CY}`,
  },
  {
    id: "anthropic",
    label: "Anthropic",
    x: W - PAD,
    y: PAD,
    logo: "/blog/anthropic.svg",
    invert: false,
    delay: "0.75s",
    path: `M ${W - PAD} ${PAD} C ${W - PAD} ${CY}, ${CX} ${PAD}, ${CX} ${CY}`,
  },
  {
    id: "gemini",
    label: "Gemini",
    x: PAD,
    y: H - PAD,
    logo: "/blog/gemini.svg",
    invert: false,
    delay: "1.5s",
    path: `M ${PAD} ${H - PAD} C ${PAD} ${CY}, ${CX} ${H - PAD}, ${CX} ${CY}`,
  },
  {
    id: "claude",
    label: "Claude",
    x: W - PAD,
    y: H - PAD,
    logo: "/blog/claude.svg",
    invert: false,
    delay: "2.25s",
    path: `M ${W - PAD} ${H - PAD} C ${W - PAD} ${CY}, ${CX} ${H - PAD}, ${CX} ${CY}`,
  },
];

const SPARK = 0.08;
const DASH_ARR = `${SPARK} 2`;
const DASH_FROM = 1 + SPARK;
const DASH_TO = -(1 + SPARK);
const DURATION = "3.5s";
const ICON_SIZE = 66;

export default function AnimatedWiresDemo() {
  return (
    <div className="my-8 rounded-lg border border-border overflow-hidden bg-[#080808]">
      <style>{`
        ${providers
          .map(
            (p) => `
          @keyframes spark-${p.id} {
            from { stroke-dashoffset: ${DASH_FROM}; }
            to   { stroke-dashoffset: ${DASH_TO};   }
          }
        `
          )
          .join("")}
      `}</style>

      <div className="p-4 sm:p-8 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {providers.map((p) => (
              <filter
                key={`f-${p.id}`}
                id={`fw-${p.id}`}
                x="-200%"
                y="-200%"
                width="500%"
                height="500%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}

            <filter id="invert-white-demo">
              <feColorMatrix
                type="matrix"
                values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
              />
            </filter>
          </defs>

          {providers.map((p) => (
            <g key={p.id}>
              <path d={p.path} stroke="rgb(38,38,38)" strokeWidth="1" fill="none" />
              <path
                d={p.path}
                pathLength={1}
                stroke="rgb(150,150,150)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray={DASH_ARR}
                fill="none"
                filter={`url(#fw-${p.id})`}
                style={{
                  animation: `spark-${p.id} ${DURATION} linear infinite`,
                  animationDelay: p.delay,
                  animationFillMode: "backwards",
                }}
              />
            </g>
          ))}

          {providers.map((p) => (
            <image
              key={`icon-${p.id}`}
              href={p.logo}
              x={p.x - 12}
              y={p.y - 12}
              width={24}
              height={24}
              filter={p.invert ? "url(#invert-white-demo)" : undefined}
            />
          ))}

          <image
            href="/clynea-icon.svg"
            x={CX - ICON_SIZE / 2}
            y={CY - ICON_SIZE / 2}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        </svg>
      </div>
    </div>
  );
}
