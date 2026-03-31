export interface GuestbookPost {
  id: string;
  message: string;
  signature: string | null;
  createdAt: string;
  username: string;
  name: string | null;
  image: string | null;
}

export interface GuestbookPostsResponse {
  posts: GuestbookPost[];
  nextCursor: number | null;
  hasMore: boolean;
}

export async function fetchPosts(
  cursor = 0
): Promise<GuestbookPostsResponse> {
  const res = await fetch(`/api/guestbook?cursor=${cursor}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json() as Promise<GuestbookPostsResponse>;
}

export async function signGuestbook(input: {
  message: string;
  signature: string | null;
}): Promise<{ post: GuestbookPost }> {
  const res = await fetch("/api/guestbook/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to sign");
  }
  return res.json() as Promise<{ post: GuestbookPost }>;
}
