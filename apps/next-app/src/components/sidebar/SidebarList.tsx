"use client";
import { getDocuments } from "@/action/docment-list";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SidebarListSkeleton from "./SidebarListSkeleton";

const LIMIT_PER_PAGE = 30;
function SidebarList() {
  const pathname = usePathname();
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["document-list"],
      queryFn: ({ pageParam }) => getDocuments(pageParam, LIMIT_PER_PAGE),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
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
    console.log(hasNextPage);
    return (
      <>
        {data.pages.map((groups, index) => (
          <Fragment key={index}>
            {groups.documents.map((data, i) => (
              <div
                className={cn(
                  "text-nowrap px-1.5 py-1 rounded-md truncate w-full  transition-all hover:bg-accent/40",
                  pathname.includes(data.documentId) && "bg-accent/40"
                )}
                key={data.documentId}
              >
                <Link className="block" href={`/note/${data.documentId}`}>
                  {data.title} {i}
                </Link>
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
