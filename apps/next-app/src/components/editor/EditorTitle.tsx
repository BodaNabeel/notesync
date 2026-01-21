"use client";

import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";

type Props = {
  doc: Y.Doc;
  documentTitle: string | undefined | null;
  documentName: string;
  editable: boolean;
};

export default function EditorTitle({
  doc,
  documentTitle,
  documentName,
  editable,
}: Props) {
  const [title, setTitle] = useState<string>("");
  const meta = doc.getMap("meta");
  const queryClient = useQueryClient();
  useEffect(() => {
    if (meta.get("title")) return;
    const handleTitleChange = () => {
      if (!meta.get("title") && documentTitle) {
        meta.set("title", documentTitle);
      }
    };
    handleTitleChange();
  }, [meta, documentTitle]);

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

    queryClient.setQueryData(
      ["document-list"],
      (
        old:
          | InfiniteData<{
              documents: {
                title: string;
                documentId: string;
              }[];
              total: number;
              nextCursor: number | null;
            }>
          | undefined,
      ) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            documents: page.documents.map((document) =>
              document.documentId === documentName
                ? { ...document, title: value }
                : document,
            ),
          })),
        };
      },
    );
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [title]);

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <textarea
        disabled={!editable}
        ref={textareaRef}
        value={title}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Untitled page"
        rows={1}
        className="text-5xl ml-12 lg:-ml-3 font-bold outline-none placeholder:text-gray-400 w-full resize-none overflow-hidden"
      />
    </div>
  );
}
