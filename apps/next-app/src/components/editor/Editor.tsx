"use client";

import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import EditorSkeleton from "./EditorSkeleton";

type EditorState = "loading" | "connected" | "error";

export default function Editor({ documentName }: { documentName: string }) {
  const { token, loading: authLoading, error: authError } = useAuth();
  const [editorState, setEditorState] = useState<EditorState>("loading");
  const doc = useMemo(() => new Y.Doc(), []);
  const searchParams = useSearchParams();
  const createDocument = searchParams.get("new");

  const provider = useMemo(() => {
    if (!token) return null;
    return new HocuspocusProvider({
      url: `${process.env.NEXT_PUBLIC_HONO_SERVER_URL!}${
        createDocument === "true" ? "?new=true" : ""
      }`,
      name: documentName,
      document: doc,
      token,

      onConnect() {
        setEditorState("connected");
        if (createDocument === "true") {
          const newUrl = `/note/${documentName}`;
          window.history.pushState(
            { ...window.history.state, as: newUrl, url: newUrl },
            "",
            newUrl
          );
        }
      },
      onAuthenticationFailed: () => {
        redirect("/not-found");
      },
      onClose: ({}) => {},
    });
  }, [token, documentName, doc, createDocument]);

  useEffect(() => {
    return () => {
      provider?.destroy();
    };
  }, [provider]);

  const editor = useCreateBlockNote(
    {
      collaboration: provider
        ? {
            provider,
            fragment: doc.getXmlFragment("default"),
            user: {
              name: "FOo",
              color: "#989552",
            },
            showCursorLabels: "activity",
          }
        : undefined,
    },
    [provider, doc]
  );

  const isLoading = authLoading || editorState === "loading";

  if (isLoading) {
    return <EditorSkeleton />;
  }

  return (
    <div
      onClick={() => editor.focus()}
      className="max-w-5xl mx-auto min-h-[calc(100vh-200px)] pb-80 mt-16"
    >
      <BlockNoteView editor={editor} shadCNComponents={{ DropdownMenu }} />
    </div>
  );
}
