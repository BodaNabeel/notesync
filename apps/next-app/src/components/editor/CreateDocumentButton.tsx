"use client";

import createDocument from "@/action/create-doc";
import { Session } from "better-auth";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

export default function CreateDocumentButton() {
  const { data: session } = authClient.useSession();
  console.log("hi", session);
  const router = useRouter();
  const handleCreateDocument = async () => {
    console.log("triggering");
    const id = crypto.randomUUID();
    router.push(`/note/${id}?new=true`);
    // const result = await createDocument(id, session?.user?.id as string);
    // if (result.success) {
    // } else {
    //   console.error("Document creation failed:", result.error);
    // }
  };
  return (
    <Button disabled={!session} onClick={handleCreateDocument}>
      Create Document....
    </Button>
  );
}
