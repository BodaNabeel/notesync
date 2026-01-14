"use client";

import { fetchDocumentTitle } from "@/action/document-action";
import { useEffect, useState } from "react";
import * as Y from "yjs";

type Props = {
  doc: Y.Doc;
  documentName: string;
  token: string;
};

export default function EditorTitle({ doc, documentName, token }: Props) {
  const [title, setTitle] = useState<string>("");

  const meta = doc.getMap("meta");

  useEffect(() => {
    if (meta.get("title")) return;
    const handleTitleChange = async () => {
      const title = await fetchDocumentTitle(documentName);
      console.log(title);
      if (!meta.get("title") && title) {
        meta.set("title", title);
      }
    };
    handleTitleChange();
  }, [documentName, token, meta]);

  useEffect(() => {
    const update = () => {
      setTitle((meta.get("title") as string | null) ?? "");
    };

    meta.observe(update);
    update();

    return () => meta.unobserve(update);
  }, [meta]);

  const handleChange = (value: string) => {
    meta.set("title", value);
  };

  return (
    <input
      value={title}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Untitled page"
      className="
        text-3xl font-bold
        outline-none
        border
        placeholder:text-gray-400
      "
    />
  );
}
