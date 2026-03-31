"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGuestbookPosts } from "~/hooks/use-guestbook";
import type { GuestbookPostsResponse } from "~/lib/api/guestbook";
import PostCard from "./post-card";

export default function PostsList({
  initialData,
}: {
  initialData?: GuestbookPostsResponse;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGuestbookPosts(initialData);

  const { ref, inView } = useInView({ rootMargin: "1000px", threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "error") {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Failed to load posts. Please try again later.
      </p>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No posts yet. Be the first to sign!
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-12 gap-4 mt-10">
        {posts.map((post) => (
          <li key={post.id} className="flex col-span-12 sm:col-span-6">
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={ref} className="flex justify-center mt-4 py-4">
          {isFetchingNextPage && (
            <span className="text-sm text-muted-foreground">Loading...</span>
          )}
        </div>
      )}
    </>
  );
}
