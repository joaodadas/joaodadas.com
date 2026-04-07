"use client";

import { useState } from "react";
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
  hasAlreadySigned: initialHasSigned,
}: GuestbookContentProps) {
  const [hasSigned, setHasSigned] = useState(initialHasSigned);

  return (
    <div>
      {session?.user ? (
        <div className="space-y-4">
          <div className="animate-5">
            <h1 className="text-2xl font-normal">
              Hello, {session.user.name ?? "friend"}!
            </h1>
          </div>
          <div className="animate-7 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {!hasSigned ? (
              <SignDialog
                username={(session.user as { username?: string }).username ?? ""}
                name={session.user.name ?? null}
                onSigned={() => setHasSigned(true)}
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
          <div className="animate-5">
            <h1 className="text-2xl font-normal">
              Sign my guestbook
            </h1>
          </div>
          <div className="animate-7">
            <SignInButton />
          </div>
        </div>
      )}

      <div className="animate-10">
        <PostsList initialData={initialData} />
      </div>
    </div>
  );
}
