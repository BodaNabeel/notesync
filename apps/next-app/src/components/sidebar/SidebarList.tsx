"use client";
import { deleteDocument, getDocuments } from "@/action/docment-list";
import { cn } from "@/lib/utils";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SidebarListSkeleton from "./SidebarListSkeleton";

const LIMIT_PER_PAGE = 30;
function SidebarList() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["document-list"],
      queryFn: ({ pageParam }) => getDocuments(pageParam, LIMIT_PER_PAGE),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
    });

  const deleteThreadMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),

    onMutate: async (documentId, context) => {
      await context.client.cancelQueries({ queryKey: ["document-list"] });

      const previousList = queryClient.getQueryData(["document-list"]);

      context.client.setQueryData(
        ["document-list"],
        (
          old: InfiniteData<{
            documents: {
              title: string;
              documentId: string;
            }[];
            total: number;
            nextCursor: number | null;
          }>
        ) => {
          console.log("trigger");
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              documents: page.documents.filter(
                (document) => document.documentId !== documentId
              ),
            })),
          };
        }
      );

      return { previousList };
    },

    onError: (err, variable, onMutateResult) => {
      alert("Error occurred while deleting document!");
      queryClient.setQueryData(["document-list"], onMutateResult?.previousList);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["document-list"] });
    },
  });

  const { variables, mutate, isError } = deleteThreadMutation;

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <SidebarListSkeleton count={12} />;
  if (data) {
    return (
      <>
        {data.pages.map((groups, index) => (
          <Fragment key={index}>
            {groups.documents.map((data, i) => (
              <div
                className={cn(
                  `text-nowrap relative px-1.5 py-1 rounded-md w-full transition-all hover:bg-accent/80`,
                  pathname.includes(data.documentId) && "bg-accent/40"
                )}
                key={data.documentId}
                onMouseEnter={() => setHoveredId(data.documentId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link
                  className={cn(
                    "block truncate",
                    hoveredId === data.documentId ? "w-[80%]" : "w-full"
                  )}
                  href={`/note/${data.documentId}`}
                >
                  {data.title}
                </Link>
                {hoveredId === data.documentId && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      mutate(data.documentId);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </Fragment>
        ))}
        {isFetchingNextPage && <SidebarListSkeleton count={6} />}
        <div ref={ref} className="-mt-20 " />
      </>
    );
  }
}

export default SidebarList;
