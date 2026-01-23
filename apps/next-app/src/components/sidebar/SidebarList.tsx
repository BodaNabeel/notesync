import { cn } from "@/lib/utils";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Link, useMatch, useNavigate, useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SidebarListSkeleton from "./SidebarListSkeleton";
import {
  deleteDocument,
  getDocuments,
} from "@/utils/documents/document.server";

const LIMIT_PER_PAGE = 30;
function SidebarList() {
  const queryClient = useQueryClient();

  const documentMatch = useMatch({
    from: "/note/$documentName/",
    shouldThrow: false,
  });
  const documentName = documentMatch?.params.documentName;

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const navigate = useNavigate();
  const router = useRouter();
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
          }>,
        ) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              documents: page.documents.filter(
                (document) => document.documentId !== documentId,
              ),
            })),
          };
        },
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
      if (window.history.length > 2) {
        router.history.back();
      } else {
        const isFirstItem =
          data?.pages[0].documents[0].documentId === documentId;
        if (isFirstItem) {
          navigate({
            to: "/note/$documentName",
            params: {
              documentName: data?.pages[0].documents[1].documentId,
            },
          });
        } else {
          navigate({
            to: "/note/$documentName",
            params: {
              documentName: data?.pages[0]?.documents[0]?.documentId ?? "",
            },
          });
        }
        // TODO: Add a fallback id guard so when user deletes all note, user doesn't get a 404
      }
    }
  };
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
                  // preload="intent"
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
