"use client";

import { Button } from "@/components/ui/button";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [content, setContent] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    socketRef.current?.emit("msg_update", e.target.value);
    console.log(e.target.value);
  };
  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
    });
    socketRef.current.on("connect", () => {
      console.log("Connected", socketRef?.current?.id);
    });
    socketRef.current.on("new_msg", (msg) => {
      console.log("received new msg", msg);
      setContent(msg);
    });
    return () => {
      socketRef?.current?.disconnect();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-20">
      <Button>Hello</Button>
      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full h-80 p-2 border"
      />{" "}
    </div>
  );
}
