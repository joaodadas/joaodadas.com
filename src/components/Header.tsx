"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSelector } from "~/components/ThemeSelector";

const links = [
  { href: "/", label: "home" },
  { href: "/blog", label: "articles" },
  { href: "/gallery", label: "gallery" },
  { href: "/guestbook", label: "guestbook" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <aside className="-ml-2 mb-12 mt-10">
      <nav className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 text-base transition-colors duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <ThemeSelector />
      </nav>
    </aside>
  );
}
