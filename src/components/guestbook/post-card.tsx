"use client";

import type { GuestbookPost } from "~/lib/api/guestbook";

export default function PostCard({ post }: { post: GuestbookPost }) {
  const authorName = post.name ?? `@${post.username}`;
  const signedAt = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="relative w-full rounded-md border border-border bg-white dark:bg-card p-5 text-left shadow-sm flex flex-col justify-between space-y-3 h-full">
      <p className="leading-6 text-foreground">{post.message}</p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col text-sm">
          <p className="font-bold text-foreground">{authorName}</p>
          <p className="text-muted-foreground">{signedAt}</p>
        </div>

        {post.signature && (
          <div className="dark:invert -mb-4 -mr-4">
            <img
              alt={`${authorName}'s signature`}
              src={post.signature}
              width={150}
              height={150}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
