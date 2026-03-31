"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";
import SignaturePad from "~/components/signature-pad/signature-pad";
import { useSignGuestbook } from "~/hooks/use-guestbook";

type SubmitState = "idle" | "signing";

interface SignDialogProps {
  username: string;
  name: string | null;
}

export default function SignDialog({ username, name }: SignDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const mutation = useSignGuestbook();
  const isSubmitting = submitState !== "idle";
  const submitLabel = submitState === "signing" ? "Signing..." : "Sign";

  function resetForm() {
    setMessage("");
    setSignature(null);
  }

  function closeDialog() {
    if (isSubmitting) return;
    setIsOpen(false);
    resetForm();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setSubmitState("signing");

      await mutation.mutateAsync({
        message: trimmedMessage,
        signature: signature,
        author: { username, name },
      });

      closeDialog();
    } catch {
      // Error handled by mutation onError (toast)
    } finally {
      setSubmitState("idle");
    }
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
            <form onSubmit={(e) => void handleSubmit(e)}>
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
                  disabled={isSubmitting}
                  onClick={closeDialog}
                  className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="rounded-md border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
                >
                  {submitLabel}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
