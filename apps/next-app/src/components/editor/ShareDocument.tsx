"use client";

import {
  documentLinkGeneration,
  documentLinkRevocation,
} from "@/action/document-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Link2, Link2Icon, Share2, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";
import { CopyLinkButton } from "./CopyLinkButton";
// import * as motion from "motion/react-client"
import { AnimatePresence, easeIn, easeOut, motion } from "motion/react";

interface DocumentDetail {
  documentAccessType: "public" | "private";
  documentEditMode: "editor" | "viewer" | null;
}

const actionVariants = {
  initial: { opacity: 0, y: 0, easeIn },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -80, easeOut },
};

export default function ShareDocument({
  documentDetail,
  userName,
  userEmail,
  documentName,
}: {
  userName: string;
  userEmail: string;
  documentDetail: DocumentDetail;
  documentName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const [documentEditMode, setDocumentEditMode] = useState<"editor" | "viewer">(
    documentDetail.documentEditMode ?? "editor",
  );

  const [documentDetails, setDocumentDetails] =
    useState<DocumentDetail>(documentDetail);

  const handleLinkGeneration = (mode: "editor" | "viewer") =>
    documentLinkGeneration({
      documentName,
      documentEditMode: mode,
    });

  const handleLinkRevocation = () => documentLinkRevocation(documentName);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Share2 />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-primary-foreground space-y-5">
        <DialogHeader>
          <DialogTitle className="text-2xl">Link share settings</DialogTitle>
        </DialogHeader>

        {/* Owner Card */}
        <div className="flex justify-between items-center border bg-accent/30 rounded-lg p-4 gap-4">
          <div className="flex gap-4 items-center">
            <span className="bg-accent/60 p-4 rounded-full">
              <ShieldCheck size={26} />
            </span>
            <div>
              <p className="font-semibold text-lg">{userName} (You)</p>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <Badge>Owner</Badge>
        </div>

        {/* Access Selector */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold text-lg">Anyone with the link</h2>
            <p className="text-sm text-muted-foreground">
              Anyone with the link can{" "}
              {documentEditMode === "viewer" ? "view" : "edit"} the document
            </p>
          </div>

          <Select
            disabled={isPending}
            value={documentEditMode}
            onValueChange={(newValue: "editor" | "viewer") => {
              setDocumentEditMode(newValue);
              startTransition(async () => {
                const result = await handleLinkGeneration(newValue);
                if (!result.success) {
                  return alert("Document Link Generation Failed");
                } else {
                  setDocumentDetails({
                    documentAccessType: "public",
                    documentEditMode: newValue,
                  });
                }
              });
            }}
          >
            <SelectTrigger className="border border-primary  py-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">Edit document</SelectItem>
              <SelectItem value="viewer">View only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Area */}
        <div className="relative space-y-3">
          <AnimatePresence mode="popLayout">
            {documentDetails.documentAccessType === "private" && (
              <motion.div
                key="generate"
                variants={actionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <Button
                  size="lg"
                  className="w-full text-lg"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const result =
                        await handleLinkGeneration(documentEditMode);
                      if (!result.success) {
                        alert("Document link generation failed");
                        return;
                      }
                      setDocumentDetails({
                        documentAccessType: "public",
                        documentEditMode,
                      });
                    })
                  }
                >
                  <Link2 />
                  {isPending ? "Generating link…" : "Generate link"}
                </Button>
              </motion.div>
            )}

            {documentDetails.documentAccessType === "public" && (
              <motion.div
                key="public-actions"
                variants={actionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <CopyLinkButton isPending={isPending} />

                <Button
                  size="lg"
                  variant="outline"
                  disabled={isPending}
                  className="w-full text-lg border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                  onClick={() =>
                    startTransition(async () => {
                      const result = await handleLinkRevocation();
                      if (!result.success) {
                        alert("Document link revocation failed");
                        return;
                      }
                      setDocumentDetails({
                        documentAccessType: "private",
                        documentEditMode: null,
                      });
                      setDocumentEditMode("editor");
                    })
                  }
                >
                  <Link2Icon strokeWidth={3} />
                  {isPending ? "Revoking access…" : "Revoke access"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        <DialogDescription className="bg-accent/20 text-sm p-4 rounded-lg border">
          Generating a link allows anyone with the URL to access this document
          based on the selected permission. You can change or revoke access at
          any time.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
