"use client";

import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";

type EditorState = "loading" | "connected" | "error";

export default function Editor({ documentName }: { documentName: string }) {
  const { token, loading: authLoading, error: authError } = useAuth();
  const [editorState, setEditorState] = useState<EditorState>("loading");
  const doc = useMemo(() => new Y.Doc(), []);

  console.log("render");

  const provider = useMemo(() => {
    if (!token) return null;
    return new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_HONO_SERVER_URL!,
      name: documentName,
      document: doc,
      token,

      onConnect() {
        setEditorState("connected");
      },
      onAuthenticationFailed: () => {
        redirect("/not-found");
      },
      onClose: ({}) => {},
    });
  }, [token, documentName, doc]);

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
              color: "red",
            },
            showCursorLabels: "activity",
          }
        : undefined,
    },
    [provider, doc]
  );

  const isLoading = authLoading || editorState === "loading";
  if (isLoading) {
    return <p>Loading....</p>;
  }

  return (
    <div
      onClick={() => editor.focus()}
      className="max-w-5xl mx-auto min-h-[calc(100vh-100px)] pb-80"
    >
      <BlockNoteView editor={editor} shadCNComponents={{ DropdownMenu }} />
    </div>
  );
}
