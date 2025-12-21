"use client";

import createDocument from "@/action/create-doc";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function CreateDocumentButton() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const handleCreateDocument = async () => {
    const id = crypto.randomUUID();
    const result = await createDocument(id, session?.user?.id as string);
    if (result.success) {
      router.push(`/note/${id}`);
    } else {
      console.error("Document creation failed:", result.error);
    }
  };
  return (
    <Button disabled={!session} onClick={handleCreateDocument}>
      Create Document....
    </Button>
  );
}
