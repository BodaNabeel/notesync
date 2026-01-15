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

interface DocumentDetail {
  documentPublic: boolean;
  documentEditMode: "viewer" | "editor";
}

export default function ShareDocument({
  documentDetail,
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
  documentDetail: DocumentDetail;
}) {
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

        <div className="space-y-2.5">
          <h1 className="font-semibold text-lg">
            What will be the access mode?
          </h1>
          <Select defaultValue="viewer">
            <SelectTrigger className="w-full border border-primary text-md py-6">
              <SelectValue placeholder="Select access" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="viewer" className="text-md">
                Anyone with the link can only view
              </SelectItem>
              <SelectItem value="editor" className="text-md">
                Anyone with the link can edit
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {!documentDetail.documentPublic && (
            <Button className="w-full" size={"lg"}>
              <Link2 />
              Generate Link
            </Button>
          )}

          <Button
            disabled={!documentDetail.documentPublic}
            className="w-full disabled:bg-gray-600/50"
            size={"lg"}
          >
            <Copy />
            Copy Link
          </Button>
          {documentDetail.documentPublic && (
            <Button
              variant={"outline"}
              className="w-full border-red-400 text-red-400 font-semibold hover:bg-red-400 hover:text-white!"
              size={"lg"}
            >
              <Link2Icon strokeWidth="3" />
              Revoke Access
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
