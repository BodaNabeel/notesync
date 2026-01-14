"use client";
import { cn } from "@/lib/utils";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SidebarListSkeleton from "./SidebarListSkeleton";
import { deleteDocument, getDocuments } from "@/action/document-action";

const LIMIT_PER_PAGE = 30;
function SidebarList() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { documentName } = useParams<{ documentName: string }>();
  const router = useRouter();
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

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleDelete = (documentId: string) => {
    deleteThreadMutation.mutate(documentId);

    if (documentName === documentId) {
      console.log(window.history);
      console.log(window.history.length);
      if (window.history.length > 2) {
        router.back();
      } else {
        const isFirstItem =
          data?.pages[0].documents[0].documentId === documentId;
        if (isFirstItem) {
          router.push(`/note/${data?.pages[0].documents[1].documentId}`);
        } else {
          router.push(`/note/${data?.pages[0].documents[0].documentId}`);
        }
        console.log(data);
        // TODO: Add a fallback id guard so when user deletes all note, user doesn't get a 404
      }
    }
    // console.log(documentName);
  };
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
                  {data.title && data.title.length > 0
                    ? data.title
                    : "Untitled Page"}
                </Link>
                {hoveredId === data.documentId && (
                  <button
                    onClick={() => handleDelete(data.documentId)}
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
