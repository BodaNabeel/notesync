"use client";

import { useState, useTransition } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCopy = () => {
    startTransition(async () => {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  return (
    <Button
      onClick={handleCopy}
      disabled={isPending}
      className="w-full disabled:bg-gray-600/50 disabled:text-black text-lg"
      size="lg"
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : "Copy Link"}
    </Button>
  );
}
