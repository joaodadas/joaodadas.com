import type { Metadata } from "next";
import { auth } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import GuestbookContent from "./guestbook-content";

export const metadata: Metadata = {
  title: "Guestbook - João Vitor Dadas",
  description: "Sign my guestbook",
};

const PAGE_SIZE = 30;

export default async function GuestbookPage() {
  const session = await auth();

  const posts = await prisma.guestbookPost.findMany({
    take: PAGE_SIZE + 1,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, username: true, image: true } },
    },
  });

  const hasMore = posts.length > PAGE_SIZE;
  const sliced = hasMore ? posts.slice(0, PAGE_SIZE) : posts;

  const initialData = {
    posts: sliced.map((p) => ({
      id: p.id,
      message: p.message,
      signature: p.signature,
      createdAt: p.createdAt.toISOString(),
      username: p.user.username ?? "",
      name: p.user.name,
      image: p.user.image,
    })),
    nextCursor: hasMore ? PAGE_SIZE : null,
    hasMore,
  };

  let hasAlreadySigned = false;
  if (session?.user?.id) {
    const existing = await prisma.guestbookPost.findUnique({
      where: { userId: session.user.id },
    });
    hasAlreadySigned = !!existing;
  }

  return (
    <GuestbookContent
      session={session}
      initialData={initialData}
      hasAlreadySigned={hasAlreadySigned}
    />
  );
}
