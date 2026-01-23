import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { UserDetails } from "@/lib/types";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import EditorSkeleton from "./EditorSkeleton";
import EditorTitle from "./EditorTitle";
import { getDocumentTitle } from "@/utils/documents/title.server";

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
  editable,
}: {
  documentName: string;
  session: UserDetails;
  editable: boolean;
}) {
  const [userColor] = useState(
    () =>
      collaboratorColors[Math.floor(Math.random() * collaboratorColors.length)],
  );

  const { token, loading: authLoading } = useAuth();
  const [editorState, setEditorState] = useState<EditorState>("loading");

  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const createDocument = search?.new;

  const queryClient = useQueryClient();
  const doc = useMemo(() => new Y.Doc(), []);
  const provider = useRef<HocuspocusProvider | null>(null);

  useEffect(() => {
    if (!token) {
      provider.current = null;
      return;
    }

    const hocuspocusProvider = new HocuspocusProvider({
      url: `${import.meta.env.VITE_HONO_SERVER_URL}${
        createDocument ? "?new=true" : ""
      }`,
      name: documentName,
      document: doc,
      token,
      onAuthenticated() {
        setEditorState("connected");

        if (createDocument) {
          queryClient.setQueryData(
            ["document-list"],
            (
              old:
                | InfiniteData<{
                    documents: { title: string; documentId: string }[];
                    total: number;
                    nextCursor: number | null;
                  }>
                | undefined,
            ) => {
              if (!old) return old;

              const newDocument = {
                title: "",
                documentId: documentName,
              };

              return {
                ...old,
                pages: old.pages.map((page, i) =>
                  i === 0
                    ? { ...page, documents: [newDocument, ...page.documents] }
                    : page,
                ),
              };
            },
          );

          navigate({
            to: "/note/$documentName",
            params: { documentName },
            replace: true,
          });
        }
      },
      onAuthenticationFailed() {
        setEditorState("error");

        if (createDocument) {
          navigate({
            to: "/note/$documentName",
            params: { documentName },
            replace: true,
          });
        }
      },
    });
    provider.current = hocuspocusProvider;

    return () => {
      hocuspocusProvider.destroy();
    };
  }, [token, documentName, doc, createDocument, queryClient, navigate]);

  const { data: documentTitle, isLoading: documentTitleLoading } = useQuery({
    queryKey: ["document-title", documentName],
    queryFn: async () => {
      const title = await getDocumentTitle({
        data: { documentName: documentName },
      });
      return title;
    },
    enabled: !createDocument,
  });

  const editor = useCreateBlockNote(
    {
      collaboration: provider
        ? {
            provider,
            fragment: doc.getXmlFragment("default"),
            user: {
              name: session.user.name,
              color: userColor,
            },
            showCursorLabels: "activity",
          }
        : undefined,
    },
    [provider, doc],
  );

  const isLoading =
    authLoading || editorState === "loading" || documentTitleLoading;

  if (isLoading) return <EditorSkeleton />;

  if (editorState === "error") {
    return (
      <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)] pb-80 mt-16 flex flex-col items-center justify-center">
        <div className="bg-red-300/40 rounded-full p-6">
          <TriangleAlert color="red" size={40} />
        </div>
        <div className="mt-6 text-center space-y-2">
          <h1 className="text-3xl font-extrabold">Document Not Found</h1>
          <p className="text-gray-600">
            This document doesn’t exist or you don’t have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <EditorTitle
        documentName={documentName}
        documentTitle={documentTitle}
        doc={doc}
        editable={editable}
      />
      <div
        onClick={() => editor.focus()}
        className="max-w-5xl mx-auto min-h-[calc(100vh-200px)] pb-80 mt-8"
      >
        <BlockNoteView
          editable={editable}
          editor={editor}
          shadCNComponents={{ DropdownMenu }}
        />
      </div>
    </Fragment>
  );
}
