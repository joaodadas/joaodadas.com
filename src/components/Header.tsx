"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/blog", label: "blog" },
  { href: "/gallery", label: "gallery" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <aside className="-ml-2 mb-12 mt-10">
      <nav className="flex flex-row items-start">
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
                className={`px-2 py-1 text-sm transition-colors duration-200 ${
                  isActive
                    ? "text-neutral-800"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
