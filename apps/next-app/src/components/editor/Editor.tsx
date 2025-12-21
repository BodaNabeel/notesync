"use client";

import * as Y from "yjs";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Session } from "better-auth";
import { useMemo, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const NAMES = [
  "John",
  "Mike",
  "Sarah",
  "Emma",
  "David",
  "Alex",
  "Lisa",
  "James",
  "Rachel",
  "Chris",
  "Anna",
  "Michael",
  "Nicole",
  "Daniel",
  "Jessica",
  "Robert",
  "Lauren",
  "Kevin",
  "Sophia",
  "Thomas",
];

const COLORS = [
  "#ff2240",
  "#3498db",
  "#2ecc71",
  "#f39c12",
  "#e74c3c",
  "#9b59b6",
  "#1abc9c",
  "#34495e",
  "#e67e22",
  "#c0392b",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#d35400",
  "#c0392b",
  "#7f8c8d",
  "#2c3e50",
  "#f1c40f",
  "#bdc3c7",
];

type EditorState = "loading" | "connected" | "error";

export default function Editor({
  documentName,
  session,
}: {
  documentName: string;
  session: Session;
}) {
  const { token, loading: authLoading, error: authError } = useAuth();
  const [editorState, setEditorState] = useState<EditorState>("loading");
  const router = useRouter();
  const doc = useMemo(() => new Y.Doc(), []);

  const provider = useMemo(() => {
    if (!token) return null;
    return new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_HONO_SERVER_URL!,
      name: documentName,
      document: doc,
      token: token,
      onConnect() {
        setEditorState("connected");
      },

      onClose: ({}) => {
        // Handle unexpected disconnections
      },
    });
  }, [token, documentName, doc, router]);

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
