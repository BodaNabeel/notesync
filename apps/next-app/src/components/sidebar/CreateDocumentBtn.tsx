"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function CreateDocumentBtn() {
  const router = useRouter();
  const documentCreation = () => {
    router.push(`/note/${crypto.randomUUID()}?new=true`);
  };
  return <Button onClick={documentCreation}>Create Document</Button>;
}
