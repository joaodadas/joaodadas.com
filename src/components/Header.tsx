"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { ThemeSelector } from "~/components/ThemeSelector";

const links = [
  { href: "/", label: "home" },
  { href: "/blog", label: "articles" },
  { href: "/gallery", label: "gallery" },
  { href: "/guestbook", label: "guestbook" },
];

export default function Header() {
  const pathname = usePathname();
  const isGallery = pathname.startsWith("/gallery");

  return (
    <LayoutGroup>
      <aside
        className={
          isGallery
            ? "fixed top-6 left-1/2 z-[60]"
            : "-ml-2 mb-12 mt-10"
        }
        style={
          isGallery
            ? {
                transform: "translateX(-50%)",
                transitionProperty: "opacity",
                transitionDuration: "300ms",
              }
            : undefined
        }
      >
        <nav
          className={
            isGallery
              ? "flex flex-row items-center gap-0.5 px-1 py-1 sm:px-1.5 sm:py-1.5 rounded-full max-w-[calc(100vw-2rem)] mx-auto"
              : "flex flex-row items-center justify-between"
          }
          style={
            isGallery
              ? {
                  background: "hsl(var(--background) / 0.6)",
                  backdropFilter: "blur(16px) saturate(1.8)",
                  WebkitBackdropFilter: "blur(16px) saturate(1.8)",
                }
              : undefined
          }
        >
          <div className={`flex flex-row ${isGallery ? "gap-0.5" : "gap-1"}`}>
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative ${
                    isGallery
                      ? "px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full flex items-center"
                      : "px-1.5 sm:px-2 py-1 text-sm sm:text-base"
                  }`}
                  style={isGallery ? { minHeight: "36px" } : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={`absolute inset-0 ${isGallery ? "rounded-full" : "rounded-md"}`}
                      style={{ background: "hsl(var(--foreground) / 0.08)" }}
                      transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                    />
                  )}
                  <span
                    className="relative z-10"
                    style={{
                      color: isActive
                        ? "hsl(var(--foreground))"
                        : "hsl(var(--muted-foreground))",
                      transitionProperty: "color",
                      transitionDuration: "200ms",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className={isGallery ? "ml-0.5" : ""}>
            <ThemeSelector />
          </div>
        </nav>
      </aside>
    </LayoutGroup>
  );
}
