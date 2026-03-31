export async function uploadSignature(
  dataUrl: string
): Promise<{ url: string }> {
  const res = await fetch("/api/signature/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signature: dataUrl }),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to upload signature");
  }
  return res.json() as Promise<{ url: string }>;
}
