"use client";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { HocuspocusProvider } from "@hocuspocus/provider";

export default function Editor() {
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
    url: "ws://localhost:5000",
    name: "example-document",
    document: doc,
  });
  const randomIndex = Math.floor(Math.random() * NAMES.length);
  const editor = useCreateBlockNote({
    collaboration: {
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: NAMES[randomIndex],
        color: COLORS[randomIndex],
      },
      showCursorLabels: "activity",
      provider,
    },
  });

  // socket.io setup
  const socketRef = useRef<Socket | null>(null);

  // useEffect(() => {
  //   console.log(process.env.NEXT_PUBLIC_SOCKET_IO_URL);
  //   socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
  //     transports: ["websocket"],
  //   });
  //   socketRef.current.on("connect", () => {
  //     console.log("Connected to socket.io");
  //   });
  //   socketRef.current.on("socket_update_document", (update) => {
  //     console.log("update received as:", update);
  //   });
  //   return () => {
  //     socketRef?.current?.disconnect();
  //   };
  // }, []);

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
