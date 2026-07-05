"use client";

import { useState } from "react";
import { formatClientAccessMessage } from "@/lib/gallery/access-message";

type Props = {
  title: string;
  clientName?: string;
  publicUrl: string;
  accessCode: string;
  username?: string | null;
  pin?: string | null;
};

export function CopyAlbumAccess({
  title,
  clientName,
  publicUrl,
  accessCode,
  username,
  pin,
}: Props) {
  const [copied, setCopied] = useState(false);

  const message = formatClientAccessMessage({
    title,
    clientName,
    publicUrl,
    accessCode,
    username,
    pin,
  });

  async function copy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="btn-premium w-full rounded-xl px-5 py-3 text-sm font-semibold sm:w-auto"
    >
      {copied ? "✓ Kopirano — pošalji klijentu!" : "Kopiraj poruku za klijenta"}
    </button>
  );
}
