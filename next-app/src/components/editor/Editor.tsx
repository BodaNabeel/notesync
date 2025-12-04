"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import * as DropdownMenu from "@/components/ui/dropdown-menu";

export default function Editor() {
  const editor = useCreateBlockNote();
  return (
    <div
      onClick={() => {
        editor.focus();
      }}
      className="max-w-6xl mx-auto border h-[calc(100vh-100px)]
 "
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
