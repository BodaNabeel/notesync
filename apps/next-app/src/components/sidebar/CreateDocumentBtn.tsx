"use client";

import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";

export default function CreateDocumentBtn() {
  const navigate = useNavigate();
  const handleCreateDocument = () => {
    navigate({
      to: "/note/$documentName",
      params: {
        documentName: crypto.randomUUID(),
      },
      search: {
        new: true,
      },
    });
  };
  return <Button onClick={handleCreateDocument}>Create Document</Button>;
}
