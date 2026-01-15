"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function QueryClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const queryCLient = new QueryClient();
  return (
    <QueryClientProvider client={queryCLient}>{children}</QueryClientProvider>
  );
}
