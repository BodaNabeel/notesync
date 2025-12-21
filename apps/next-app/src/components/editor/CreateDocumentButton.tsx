"use client";

import createDocument from "@/action/create-doc";
import { Session } from "better-auth";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function CreateDocumentButton({
  session,
}: {
  session: Session;
}) {
  const router = useRouter();
  const handleCreateDocument = async () => {
    console.log("triggering");
    const id = crypto.randomUUID();
    const result = await createDocument(id, session.userId);
    if (result.success) {
      router.push(`/note/${result.documentId}`);
    } else {
      console.error("Document creation failed:", result.error);
    }
  };
  return <Button onClick={handleCreateDocument}>Create Document</Button>;
}
