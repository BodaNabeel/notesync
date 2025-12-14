"use client";
import * as Y from "yjs";
import { useEffect, useState, useMemo } from "react";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Session } from "better-auth";
import { Loader2, Lock } from "lucide-react"; // Optional icons

export default function Editor({
  documentName,
  session,
}: {
  documentName: string;
  session: Session;
}) {
  const [isAuthFailed, setIsAuthFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const provider = useMemo(() => {
    const doc = new Y.Doc();
    return new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_HONO_SERVER_URL!,
      name: documentName,
      document: doc,
      token: session.userId,

      onAuthenticationFailed: () => {
        // TODO: route to ui to show user not allowed to access
        // alert("user is not allowed to view");
      },
      onAuthenticated: () => {
        setIsAuthFailed(false);
        setIsLoading(false);
      },
      onClose: () => {},
    });
  }, [documentName, session.userId]);

  useEffect(() => {
    return () => {
      provider.destroy();
    };
  }, [provider]);

  const userInfo = useMemo(() => {
    const NAMES = ["John", "Mike", "Sarah", "Emma", "David", "Alex"];
    const COLORS = [
      "#ff2240",
      "#3498db",
      "#2ecc71",
      "#f39c12",
      "#e74c3c",
      "#9b59b6",
    ];
    // eslint-disable-next-line react-hooks/purity
    const randomIndex = Math.floor(Math.random() * NAMES.length);

    return {
      name: NAMES[randomIndex],
      color: COLORS[randomIndex],
    };
  }, []);

  const editor = useCreateBlockNote({
    collaboration: {
      fragment: provider.document.getXmlFragment(documentName),
      user: userInfo,
      showCursorLabels: "activity",
      provider,
    },
  });

  // 4. Render Loading or Error states
  if (isAuthFailed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="p-4 bg-red-100 rounded-full">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 max-w-md">
          You do not have permission to view or edit this document.
        </p>
      </div>
    );
  }

  // Optional: Show loading spinner until connected
  if (isLoading || !editor) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        editor.focus();
      }}
      className="max-w-5xl mx-auto min-h-[calc(100vh-100px)] pb-80"
    >
      <BlockNoteView
        data-theming-css-variables-demo
        editor={editor}
        shadCNComponents={{
          DropdownMenu,
        }}
      />
    </div>
  );
}
