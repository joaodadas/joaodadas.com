"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ThemeSelector } from "~/components/ThemeSelector";
import { useInfiniteCanvas } from "~/components/InfiniteCanvas";

const links = [
  { href: "/", label: "home" },
  { href: "/blog", label: "articles" },
  { href: "/gallery", label: "gallery" },
  { href: "/guestbook", label: "guestbook" },
];

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

// Positions scattered across 2000x1300 canvas — balanced spacing
const positions = [
  { x: 80, y: 60 },      // Louvre (large, top-left anchor)
  { x: 500, y: 520 },    // Soupe (small, center-left)
  { x: 820, y: 80 },     // Galerie (medium, top-center)
  { x: 1200, y: 400 },   // Bruschetta (medium, center-right)
  { x: 160, y: 580 },    // Sashimi (small, left)
  { x: 1550, y: 60 },    // Wine bar (large, top-right)
  { x: 600, y: 900 },    // Museum (medium, bottom-center)
  { x: 1100, y: 800 },   // Nós (large, bottom-right)
  { x: 950, y: 420 },    // Porsche (medium, center)
  { x: 1500, y: 700 },   // Madeleine (medium, right)
];

function GalleryHeader() {
  const pathname = usePathname();
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[712px] px-4 pt-10 z-20 pointer-events-none">
      <nav className="flex flex-row items-center justify-between -ml-2 pointer-events-auto">
        <div className="flex flex-row gap-1">
          {links.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-1.5 sm:px-2 py-1 text-sm sm:text-base transition-colors duration-200 ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="pointer-events-auto">
          <ThemeSelector />
        </div>
      </nav>
    </div>
  );
}

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
      <GalleryHeader />

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-mono">
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
                  <div className="overflow-hidden rounded-sm">
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
                  <div className="mt-2 px-0.5">
                    <p className="text-[10px] font-mono font-medium leading-tight" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {item.title}
                    </p>
                    <p className="text-[9px] font-mono leading-tight mt-0.5" style={{ color: "hsl(var(--muted-foreground) / 0.6)" }}>
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
