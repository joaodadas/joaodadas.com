"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Dialog } from "@headlessui/react";
import SignaturePad from "~/components/signature-pad/signature-pad";
import { useSignGuestbook } from "~/hooks/use-guestbook";

interface SignDialogProps {
  username: string;
  name: string | null;
  onSigned?: () => void;
}

export default function SignDialog({ username, name, onSigned }: SignDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const mutation = useSignGuestbook();

  function resetForm() {
    setMessage("");
    setSignature(null);
  }

  function closeDialog() {
    setIsOpen(false);
    resetForm();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    // Close dialog and show optimistic card immediately
    // Upload + API call happen in the background via mutationFn
    onSigned?.();
    setIsOpen(false);

    mutation.mutate({
      message: trimmedMessage,
      signature: signature,
      author: { username, name },
    });

    resetForm();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
      >
        Sign guestbook
      </button>

      <Dialog open={isOpen} onClose={closeDialog} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg border border-border bg-white dark:bg-card p-6 shadow-lg">
            <form onSubmit={handleSubmit}>
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Sign my guestbook
              </Dialog.Title>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Leave a message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-border bg-white dark:bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Sign Here
                  </label>
                  <SignaturePad
                    className="aspect-video h-40 mt-2 w-full rounded-lg border border-border bg-white dark:bg-background shadow-sm"
                    onChange={setSignature}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="rounded-md border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
                >
                  Sign
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
