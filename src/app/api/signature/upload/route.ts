import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "~/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = (await req.json()) as { signature?: string };
  const dataUrl = body.signature;

  if (!dataUrl || !dataUrl.startsWith("data:image/png;base64,")) {
    return NextResponse.json(
      { error: "INVALID_INPUT", details: "Must be a PNG data URL" },
      { status: 400 }
    );
  }

  const base64 = dataUrl.split(",")[1];
  if (!base64) {
    return NextResponse.json(
      { error: "INVALID_INPUT", details: "Invalid base64 data" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(base64, "base64");
  const filename = `signatures/${session.user.id}-${Date.now()}.png`;

  const blob = await put(filename, buffer, {
    access: "public",
    contentType: "image/png",
  });

  return NextResponse.json({ url: blob.url });
}
