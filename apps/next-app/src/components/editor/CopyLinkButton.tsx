"use client";

import { useState, useTransition } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";

export function CopyLinkButton({
  isPending: isPendingParent,
}: {
  isPending: boolean;
}) {
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
    <motion.div layoutId="copy-btn">
      <Button
        onClick={handleCopy}
        disabled={isPendingParent}
        className="w-full disabled:bg-gray-600/50 disabled:text-black text-lg"
        size="lg"
      >
        {copied ? <Check /> : <Copy />}
        {copied ? "Copied" : "Copy Link"}
      </Button>
    </motion.div>
  );
}
