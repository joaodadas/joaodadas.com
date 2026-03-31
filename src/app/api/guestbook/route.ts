import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

const PAGE_SIZE = 30;

export async function GET(req: NextRequest) {
  const cursor = parseInt(req.nextUrl.searchParams.get("cursor") ?? "0", 10);

  if (isNaN(cursor) || cursor < 0) {
    return NextResponse.json(
      { error: "INVALID_CURSOR" },
      { status: 400 }
    );
  }

  const posts = await prisma.guestbookPost.findMany({
    skip: cursor,
    take: PAGE_SIZE + 1,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, username: true, image: true } },
    },
  });

  const hasMore = posts.length > PAGE_SIZE;
  const sliced = hasMore ? posts.slice(0, PAGE_SIZE) : posts;

  const result = {
    posts: sliced.map((p) => ({
      id: p.id,
      message: p.message,
      signature: p.signature,
      createdAt: p.createdAt.toISOString(),
      username: p.user.username ?? "",
      name: p.user.name,
      image: p.user.image,
    })),
    nextCursor: hasMore ? cursor + PAGE_SIZE : null,
    hasMore,
  };

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
