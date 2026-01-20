"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Link2, Link2Icon, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  documentLinkGeneration,
  documentLinkRevocation,
} from "@/action/document-action";
import { useState, useTransition } from "react";
import { CopyLinkButton } from "./CopyLinkButton";

interface DocumentDetail {
  documentAccessType: "public" | "private";
  documentEditMode: "editor" | "viewer" | null;
}

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
  const handleLinkGeneration = (documentEditMode: "editor" | "viewer") => {
    return documentLinkGeneration({
      documentName: documentName,
      documentEditMode: documentEditMode,
    });
  };
  const handleLinkRevocation = () => {
    return documentLinkRevocation(documentName);
  };
  const [documentDetails, setDocumentDetails] =
    useState<DocumentDetail>(documentDetail);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Share2 /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-primary-foreground space-y-4">
        <DialogHeader>
          <DialogTitle className="text-2xl">Link Share Settings</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center border bg-accent/30 rounded-lg p-4 gap-4">
          <div className="flex gap-4 items-center">
            <span className="bg-accent/60 p-4 rounded-full">
              <ShieldCheck size={26} />
            </span>
            <div>
              <p className="font-semibold text-lg">{userName} (You)</p>
              <p className="text-sm">{userEmail}</p>
            </div>
          </div>
          <Badge variant={"default"}>Owner</Badge>
        </div>

        <div className=" flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-lg">Anyone with the link</h1>
            <p className="text-sm text-gray-600">
              Anyone with the link can{" "}
              {documentEditMode === "viewer" ? "view" : "edit"} the document
            </p>
          </div>
          <Select
            disabled={isPending}
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
            value={documentDetails.documentEditMode ?? "editor"}
          >
            <SelectTrigger className=" border border-primary text-md py-4">
              <SelectValue placeholder="Select access" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="editor" className="text-md">
                Edit Doc
              </SelectItem>
              <SelectItem value="viewer" className="text-md">
                View Doc
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {documentDetails.documentAccessType === "private" && (
            <Button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const result = await handleLinkGeneration(
                    documentDetails.documentEditMode ?? "editor",
                  );
                  if (!result.success) {
                    return alert("Document Link Generation Failed");
                  } else {
                    setDocumentDetails((prev) => ({
                      ...prev,
                      documentAccessType: "public",
                    }));
                  }
                })
              }
              className="w-full text-lg"
              size={"lg"}
            >
              <Link2 />
              {isPending ? "Generating..." : "Generate Link"}
            </Button>
          )}
          {documentDetails.documentAccessType === "public" && (
            <CopyLinkButton />
          )}

          {documentDetails.documentAccessType === "public" && (
            <Button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const result = await handleLinkRevocation();
                  if (!result.success) {
                    alert("Document Link Revocation Failed");
                  } else {
                    setDocumentDetails({
                      documentAccessType: "private",
                      documentEditMode: null,
                    });
                    setDocumentEditMode("editor");
                  }
                })
              }
              variant={"outline"}
              className="w-full border-red-400 text-red-400 font-semibold hover:bg-red-400 hover:text-white! text-lg"
              size={"lg"}
            >
              <Link2Icon strokeWidth="3" />
              {isPending ? "Revoking Access..." : "Revoke Access"}
            </Button>
          )}
        </div>

        <Separator />

        <DialogDescription className="bg-accent/20 text-sm p-4 rounded-lg border">
          Generating a link will allow people with the URL to access this
          document based on the selected role. You can revoke this link or
          change permissions at any time.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
