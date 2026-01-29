import { cn } from "@/lib/utils";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Link,
  useCanGoBack,
  useMatch,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SidebarListSkeleton from "./SidebarListSkeleton";
import {
  deleteDocument,
  getDocuments,
} from "@/utils/documents/document.server";
import { useSidebar } from "../ui/sidebar";

const LIMIT_PER_PAGE = 30;
function SidebarList() {
  const queryClient = useQueryClient();

  const documentMatch = useMatch({
    from: "/note/$documentName/",
    shouldThrow: false,
  });
  const documentName = documentMatch?.params.documentName;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["document-list"],
      queryFn: ({ pageParam }) =>
        getDocuments({ data: { page: pageParam, limit: LIMIT_PER_PAGE } }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
    });

  const deleteThreadMutation = useMutation({
    mutationFn: (documentId: string) =>
      deleteDocument({ data: { documentId } }),

    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: ["document-list"] });
      const previousList = queryClient.getQueryData(["document-list"]);

      queryClient.setQueryData(
        ["document-list"],
        (
          old: InfiniteData<{
            documents: {
              title: string;
              documentId: string;
            }[];
            total: number;
            nextCursor: number | null;
          }>,
        ) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              documents: page.documents.filter(
                (document) => document.documentId !== documentId,
              ),
              total: page.total - 1,
            })),
          };
        },
      );

      const isCurrentDocument = documentId === documentName;

      // Only navigate if we're deleting the currently open document
      if (!isCurrentDocument) {
        return { previousList };
      }

      // Get updated list after deletion
      const updatedData = queryClient.getQueryData(["document-list"]) as
        | InfiniteData<{
            documents: { title: string; documentId: string }[];
            total: number;
            nextCursor: number | null;
          }>
        | undefined;

      const remainingDocuments = updatedData?.pages[0].documents;
      // Navigate based on what's left
      if (remainingDocuments && remainingDocuments.length > 0) {
        const nextDocument = remainingDocuments[0];
        navigate({
          to: "/note/$documentName",
          params: {
            documentName: nextDocument.documentId,
          },
          replace: true,
        });
      } else {
        navigate({
          to: "/note",
          replace: true,
        });
      }

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

  if (isLoading) return <SidebarListSkeleton count={12} />;
  if (data) {
    return (
      <>
        {data.pages.map((groups, index) => (
          <Fragment key={index}>
            {groups.documents.map((data) => (
              <div
                className={cn(
                  `text-nowrap relative px-1.5 py-1 rounded-md w-full transition-all hover:bg-accent/80`,
                  documentName === data.documentId && "bg-accent/40",
                )}
                key={data.documentId}
                onMouseEnter={() => setHoveredId(data.documentId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link
                  onClick={() => setOpenMobile(false)}
                  preload="intent"
                  className={cn(
                    "block truncate",
                    hoveredId === data.documentId ? "w-[80%]" : "w-full",
                  )}
                  to="/note/$documentName"
                  params={{
                    documentName: data.documentId,
                  }}
                >
                  {data.title && data.title.length > 0
                    ? data.title
                    : "Untitled Page"}
                </Link>
                {hoveredId === data.documentId && (
                  <button
                    onClick={() => deleteThreadMutation.mutate(data.documentId)}
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
