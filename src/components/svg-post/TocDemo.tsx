"use client";

import { useEffect, useState } from "react";

const tocItems = [
  { label: "Introduction", level: 0 },
  { label: "How it works", level: 0 },
  { label: "Installation", level: 1 },
  { label: "Configuration", level: 1 },
  { label: "Basic usage", level: 0 },
  { label: "Examples", level: 1 },
  { label: "API Reference", level: 0 },
  { label: "Parameters", level: 1 },
  { label: "Return value", level: 1 },
  { label: "Conclusion", level: 0 },
];

const ITEM_HEIGHT = 28;
const GAP = 8;
const INDENT_BASE = 2;
const INDENT_STEP = 12;
const SVG_WIDTH = 16;

function getOffset(level: number) {
  return INDENT_BASE + level * INDENT_STEP;
}

function buildSvgPath(items: typeof tocItems) {
  let d = "";
  const totalHeight = items.length * (ITEM_HEIGHT + GAP) - GAP;

  items.forEach((item, i) => {
    const offsetX = getOffset(item.level);
    const offsetY = i * (ITEM_HEIGHT + GAP);
    const endY = offsetY + ITEM_HEIGHT;

    if (i === 0) {
      d += `M ${offsetX} ${offsetY} L ${offsetX} ${endY}`;
    } else {
      const upperOffsetX = getOffset(items[i - 1]!.level);
      const upperEndY = (i - 1) * (ITEM_HEIGHT + GAP) + ITEM_HEIGHT;
      d += ` C ${upperOffsetX} ${upperEndY + GAP * 0.7} ${offsetX} ${offsetY - GAP * 0.7} ${offsetX} ${offsetY}`;
      d += ` L ${offsetX} ${endY}`;
    }
  });

  return { d, totalHeight };
}

export default function TocDemo() {
  const [activeIndices, setActiveIndices] = useState<Set<number>>(
    new Set([0, 1, 2])
  );

  const { d, totalHeight } = buildSvgPath(tocItems);

  const activeArray = Array.from(activeIndices).sort((a, b) => a - b);
  const thumbTop =
    activeArray.length > 0 ? activeArray[0]! * (ITEM_HEIGHT + GAP) : 0;
  const thumbBottom =
    activeArray.length > 0
      ? activeArray[activeArray.length - 1]! * (ITEM_HEIGHT + GAP) + ITEM_HEIGHT
      : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndices((prev) => {
        const arr = Array.from(prev);
        const maxIdx = tocItems.length - 1;
        const first = Math.min(...arr);
        const newFirst = first >= maxIdx - 2 ? 0 : first + 1;
        const newSet = new Set<number>();
        for (let i = newFirst; i <= Math.min(newFirst + 2, maxIdx); i++) {
          newSet.add(i);
        }
        return newSet;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 flex justify-center">
      <div className="flex gap-0">
        <div className="relative" style={{ width: SVG_WIDTH }}>
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${totalHeight}`}
            width={SVG_WIDTH}
            height={totalHeight}
            className="absolute top-0 left-0"
          >
            <path
              d={d}
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity={0.15}
            />
          </svg>

          <div
            className="absolute top-0 left-0"
            style={{
              width: SVG_WIDTH,
              height: totalHeight,
              clipPath: `inset(${thumbTop}px 0 ${totalHeight - thumbBottom}px 0)`,
              transition: "clip-path 500ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <svg
              viewBox={`0 0 ${SVG_WIDTH} ${totalHeight}`}
              width={SVG_WIDTH}
              height={totalHeight}
            >
              <path
                d={d}
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                opacity={0.7}
              />
            </svg>
          </div>

          <div
            className="absolute w-[5px] h-[5px] rounded-full bg-foreground/70"
            style={{
              left:
                getOffset(
                  tocItems[activeArray[activeArray.length - 1] ?? 0]?.level ?? 0
                ) - 2,
              top: thumbBottom - 2.5,
              transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        <div className="flex flex-col" style={{ gap: GAP }}>
          {tocItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                const newSet = new Set<number>();
                for (
                  let j = i;
                  j <= Math.min(i + 2, tocItems.length - 1);
                  j++
                ) {
                  newSet.add(j);
                }
                setActiveIndices(newSet);
              }}
              className="text-left transition-colors duration-300"
              style={{
                height: ITEM_HEIGHT,
                paddingLeft: item.level * 12 + 8,
                fontSize: 13,
              }}
            >
              <span
                className={`transition-colors duration-300 ${
                  activeIndices.has(i)
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
