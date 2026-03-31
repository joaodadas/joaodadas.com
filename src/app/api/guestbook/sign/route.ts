import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = (await req.json()) as {
    message?: string;
    signature?: string | null;
  };
  const message = body.message?.trim();
  const signature = body.signature;

  if (!message || message.length === 0 || message.length > 500) {
    return NextResponse.json(
      { error: "INVALID_INPUT", details: "Message must be 1-500 characters" },
      { status: 400 }
    );
  }

  const existing = await prisma.guestbookPost.findUnique({
    where: { userId: session.user.id },
  });

  if (existing) {
    return NextResponse.json(
      { error: "ALREADY_SIGNED" },
      { status: 409 }
    );
  }

  const post = await prisma.guestbookPost.create({
    data: {
      message,
      signature: signature || null,
      userId: session.user.id,
    },
    include: {
      user: { select: { name: true, username: true, image: true } },
    },
  });

  return NextResponse.json(
    {
      post: {
        id: post.id,
        message: post.message,
        signature: post.signature,
        createdAt: post.createdAt.toISOString(),
        username: post.user.username ?? "",
        name: post.user.name,
        image: post.user.image,
      },
    },
    { status: 201 }
  );
}
