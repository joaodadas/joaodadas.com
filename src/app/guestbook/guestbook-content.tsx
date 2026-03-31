"use client";

import type { Session } from "next-auth";
import type { GuestbookPostsResponse } from "~/lib/api/guestbook";
import SignInButton from "~/components/guestbook/sign-in-button";
import SignOutButton from "~/components/guestbook/sign-out-button";
import SignDialog from "~/components/guestbook/sign-dialog";
import PostsList from "~/components/guestbook/posts-list";

interface GuestbookContentProps {
  session: Session | null;
  initialData: GuestbookPostsResponse;
  hasAlreadySigned: boolean;
}

export default function GuestbookContent({
  session,
  initialData,
  hasAlreadySigned,
}: GuestbookContentProps) {
  return (
    <div>
      {session?.user ? (
        <div className="space-y-4">
          <h1 className="font-medium text-2xl tracking-tighter">
            Hello, {session.user.name ?? "friend"}!
          </h1>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {!hasAlreadySigned ? (
              <SignDialog
                username={(session.user as { username?: string }).username ?? ""}
                name={session.user.name ?? null}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                You&apos;ve already signed. Thanks!
              </p>
            )}
            <SignOutButton />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="font-medium text-2xl tracking-tighter">
            Sign my guestbook
          </h1>
          <SignInButton />
        </div>
      )}

      <PostsList initialData={initialData} />
    </div>
  );
}
