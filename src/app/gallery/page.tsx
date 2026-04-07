"use client";

import { useRef } from "react";
import { useInfiniteCanvas } from "~/components/InfiniteCanvas";

const galleryItems = [
  { src: "/galleryIMGs/space/01.jpg", title: "Louvre", description: "Galerie d'Apollon", width: 320, height: 427 },
  { src: "/galleryIMGs/space/02.jpg", title: "Soupe à l'oignon", description: "Bistrô parisiense", width: 220, height: 293 },
  { src: "/galleryIMGs/space/03.jpg", title: "Galerie Nicolas Lenté", description: "Vitrine noturna", width: 260, height: 347 },
  { src: "/galleryIMGs/space/04.jpg", title: "Bruschetta & café", description: "Manhã em Paris", width: 240, height: 320 },
  { src: "/galleryIMGs/space/05.jpg", title: "Sashimi", description: "Jantar japonês", width: 200, height: 267 },
  { src: "/galleryIMGs/space/06.jpg", title: "Wine bar", description: "Drinks & design", width: 280, height: 373 },
  { src: "/galleryIMGs/space/07.jpg", title: "British Museum", description: "Múmias egípcias", width: 230, height: 307 },
  { src: "/galleryIMGs/space/08.jpg", title: "Nós", description: "Paris, outono", width: 300, height: 400 },
  { src: "/galleryIMGs/space/09.jpg", title: "Porsche 911", description: "Boulevard Saint-Germain", width: 250, height: 333 },
  { src: "/galleryIMGs/space/10.jpg", title: "La Madeleine", description: "Interior da igreja", width: 270, height: 360 },
];

// Positions scattered across 2000x1300 canvas
// Grid-ish layout: ~4 columns × 3 rows, with organic offsets
const positions = [
  { x: 60, y: 50 },       // 01 Louvre (large) — top-left
  { x: 540, y: 440 },     // 02 Soupe (small) — mid-left
  { x: 1050, y: 60 },     // 03 Galerie — top-center-right
  { x: 1600, y: 480 },    // 04 Bruschetta — mid-right
  { x: 100, y: 900 },     // 05 Sashimi (small) — bottom-left
  { x: 520, y: 80 },      // 06 Wine bar (large) — top-center-left
  { x: 1400, y: 50 },     // 07 Museum — top-right
  { x: 900, y: 500 },     // 08 Nós (large) — dead center
  { x: 1580, y: 880 },    // 09 Porsche — bottom-right
  { x: 500, y: 850 },     // 10 Madeleine — bottom-center-left
];

export default function GalleryPage() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useInfiniteCanvas({
    containerRef: canvasRef,
    scrollSpeed: 0.4,
    dragSpeed: 0.5,
    ease: 0.3,
    parallax: { enabled: true, general: 1, child: 1 },
    enableDrag: true,
  });

  return (
    <div
      className="fixed inset-0 z-50 cursor-grab active:cursor-grabbing select-none"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p
          className="text-[10px] uppercase tracking-widest font-mono px-3 py-1.5 rounded-full"
          style={{
            color: "hsl(var(--muted-foreground) / 0.5)",
            background: "hsl(var(--background) / 0.4)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          scroll / drag to move
        </p>
      </div>

      {/* Overflow viewport */}
      <div className="absolute inset-0 overflow-hidden">
        {/* World container — the hook operates on this ref */}
        <div
          ref={canvasRef}
          className="relative"
          style={{ width: "2000px", height: "1300px" }}
        >
          {galleryItems.map((item, i) => {
            const pos = positions[i]!;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${item.width}px`,
                }}
              >
                {/* Single inner wrapper — parallax moves THIS entire block */}
                <div>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={item.src}
                      alt={item.title}
                      draggable={false}
                      className="w-full h-auto block"
                      style={{
                        aspectRatio: `${item.width} / ${item.height}`,
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="mt-2.5 px-0.5">
                    <p
                      className="text-[11px] font-mono font-medium leading-tight"
                      style={{
                        color: "hsl(var(--foreground) / 0.7)",
                        textWrap: "balance",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-[10px] font-mono leading-tight mt-0.5"
                      style={{ color: "hsl(var(--muted-foreground) / 0.5)" }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
