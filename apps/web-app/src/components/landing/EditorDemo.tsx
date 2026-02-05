import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import * as Y from "yjs";

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

function EditorDemo() {
  const [editorState, setEditorState] = useState<"loading" | "connected">(
    "loading",
  );
  const [userColor] = useState(
    () =>
      collaboratorColors[Math.floor(Math.random() * collaboratorColors.length)],
  );
  const doc = useMemo(() => new Y.Doc(), []);
  const provider = new HocuspocusProvider({
    url: `${import.meta.env.VITE_HONO_SERVER_URL}?public=true`,
    name: "public-document",
    document: doc,
    onConnect() {
      setEditorState("connected");
    },
  });
  const editor = useCreateBlockNote(
    {
      collaboration: {
        provider,
        fragment: doc.getXmlFragment("default"),
        user: {
          name: "anonymous",
          color: userColor,
        },
        showCursorLabels: "activity",
      },
    },
    [provider],
  );

  if (editorState === "loading")
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  return <BlockNoteView className="bg-white!" theme="light" editor={editor} />;
}

export default EditorDemo;
