"use client";
import * as Y from "yjs";

import * as DropdownMenu from "@/components/ui/dropdown-menu";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { HocuspocusProvider } from "@hocuspocus/provider";

export default function Editor({ documentName }: { documentName: string }) {
  // editor setup:

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

  const doc = new Y.Doc();
  const provider = new HocuspocusProvider({
    url: process.env.NEXT_PUBLIC_HONO_SERVER_URL!,
    name: documentName,
    document: doc,
  });
  // eslint-disable-next-line react-hooks/purity
  const randomIndex = Math.floor(Math.random() * NAMES.length);
  const editor = useCreateBlockNote({
    collaboration: {
      fragment: doc.getXmlFragment(documentName),
      user: {
        name: NAMES[randomIndex],
        color: COLORS[randomIndex],
      },
      showCursorLabels: "activity",
      provider,
    },
  });

  return (
    <div
      onClick={() => {
        editor.focus();
      }}
      className="max-w-5xl mx-auto min-h-[calc(100vh-100px)] pb-80 "
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
