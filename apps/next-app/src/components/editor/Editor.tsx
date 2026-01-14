"use client";

import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import EditorSkeleton from "./EditorSkeleton";
import { Session, User } from "better-auth";
import { UserDetails } from "@/lib/types";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import EditorTitle from "./EditorTitle";

type EditorState = "loading" | "connected" | "error";

const collaboratorColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#F8B195",
  "#6C5CE7",
  "#A8E6CF",
];

export default function Editor({
  documentName,
  session,
}: {
  documentName: string;
  session: UserDetails;
}) {
  const [userColor] = useState(
    () =>
      collaboratorColors[Math.floor(Math.random() * collaboratorColors.length)]
  );
  const { token, loading: authLoading } = useAuth();
  const [editorState, setEditorState] = useState<EditorState>("loading");

  const searchParams = useSearchParams();
  const createDocument = searchParams.get("new");
  const queryClient = useQueryClient();

  const doc = useMemo(() => new Y.Doc(), []);
  const provider = useMemo(() => {
    if (!token) return null;
    const hocuspocusProvider = new HocuspocusProvider({
      url: `${process.env.NEXT_PUBLIC_HONO_SERVER_URL!}${
        createDocument === "true" ? "?new=true" : ""
      }`,
      name: documentName,
      document: doc,
      token,

      onConnect() {
        setEditorState("connected");
        console.log(hocuspocusProvider);
        if (createDocument === "true") {
          queryClient.invalidateQueries({ queryKey: ["document-list"] });
          const newUrl = `/note/${documentName}`;
          window.history.pushState(
            { ...window.history.state, as: newUrl, url: newUrl },
            "",
            newUrl
          );
        }
        console.log(doc);
      },
      onAuthenticationFailed: () => {
        setEditorState("error");
      },
      onClose: ({}) => {},
    });

    return hocuspocusProvider;
  }, [token, documentName, doc, createDocument, queryClient]);

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
              name: session?.user?.name,
              color: userColor,
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

  if (editorState === "error") {
    return (
      <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)] pb-80 mt-16 flex flex-col items-center justify-center">
        <div className="bg-red-300/40 w-fit  rounded-full p-6">
          <TriangleAlert color="red" size={40} />
        </div>
        <div className="mt-6 *:text-center space-y-2">
          <h1 className="text-3xl font-extrabold">Document Not Found</h1>
          <p className="text-gray-600">
            This document doesn&apos;t exist or you don&apos;t have permission
            to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <EditorTitle
        doc={doc}
        documentName={documentName}
        token={session.session.id}
      />
      <div
        onClick={() => editor.focus()}
        className="max-w-5xl mx-auto min-h-[calc(100vh-200px)] pb-80 mt-16"
      >
        <BlockNoteView editor={editor} shadCNComponents={{ DropdownMenu }} />
      </div>
    </Fragment>
  );
}
