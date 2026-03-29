"use client";

interface AlbumCardProps {
  rank: number;
  title: string;
  artist: string;
  cover: string;
  children: React.ReactNode;
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"] as const;
  const v = n % 100;
  const suffix = s[(v - 20) % 10] ?? s[v] ?? s[0];
  return `${n}${suffix}`;
}

export default function AlbumCard({
  rank,
  title,
  artist,
  cover,
  children,
}: AlbumCardProps) {
  return (
    <div className="py-6">
      <span className="hidden sm:block text-sm font-medium text-muted-foreground mb-2">
        {getOrdinal(rank)}
      </span>

      <div className="flex flex-row gap-4 sm:gap-5">
        <img
          src={cover}
          alt={title}
          className="w-32 h-32 sm:w-[180px] sm:h-[180px] object-cover rounded shrink-0"
        />

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h3 className="text-lg font-bold text-foreground m-0">{title}</h3>
          <p className="text-sm italic text-muted-foreground m-0">{artist}</p>
          <span className="sm:hidden text-sm font-medium text-muted-foreground">
            {getOrdinal(rank)}
          </span>
          <p className="hidden sm:block text-sm text-muted-foreground m-0 mt-1 leading-relaxed">
            {children}
          </p>
        </div>
      </div>

      <p className="sm:hidden text-sm text-muted-foreground mt-3 leading-relaxed">
        {children}
      </p>
    </div>
  );
}
