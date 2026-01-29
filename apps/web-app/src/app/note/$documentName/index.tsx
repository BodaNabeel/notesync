import { authMiddleware } from "@/app/middleware/-auth";
import Editor from "@/components/editor/Editor";
import EditorSkeleton from "@/components/editor/EditorSkeleton";
import ShareDocument from "@/components/editor/ShareDocument";
import { db } from "@/database/drizzle";
import { getSession } from "@/utils/session.server";
import { documentTable, eq } from "@note/db";
import { ClientOnly, createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const searchSchema = z.object({
  new: z.boolean().optional(),
});

const getCurrentDocument = createServerFn()
  .inputValidator((data: { documentName: string }) => data)
  .handler(async ({ data }) => {
    const [document] = await db
      .select({
        documentAccessType: documentTable.documentAccessType,
        documentEditMode: documentTable.documentEditMode,
        ownerId: documentTable.ownerId,
        title: documentTable.title,
      })
      .from(documentTable)
      .where(eq(documentTable.id, data.documentName))
      .limit(1);
    return document;
  });

export const Route = createFileRoute("/note/$documentName/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  server: {
    middleware: [authMiddleware],
  },
  loader: async ({ params }) => {
    const session = await getSession();

    try {
      const documentDetail = await getCurrentDocument({
        data: { documentName: params.documentName },
      });
      return {
        documentDetail,
        session: session!,
      };
    } catch (err) {
      console.log(err, "error occurred");
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.documentDetail.title ?? "NoteSync - Untitled" },
    ],
  }),
  pendingComponent: () => (
    <div className="mt-20">
      <EditorSkeleton />,
    </div>
  ),
});

function RouteComponent() {
  const { documentName } = Route.useParams();
  const { new: isNew } = Route.useSearch();
  const { documentDetail, session } = Route.useLoaderData();

  return (
    <>
      <div className="flex items-center justify-end mr-4">
        {!isNew && documentDetail?.ownerId === session.user.id ? (
          <ShareDocument
            documentDetail={documentDetail}
            userName={session.user.name}
            userEmail={session.user.email}
            documentName={documentName}
          />
        ) : (
          <div className="h-8 w-8 border-2 opacity-0"> </div>
        )}
      </div>

      <ClientOnly fallback={<EditorSkeleton />}>
        <Editor
          key={documentName}
          editable={
            documentDetail
              ? documentDetail.ownerId === session.user.id ||
                documentDetail.documentEditMode === "editor"
              : true
          }
          documentName={documentName}
          session={session}
        />
      </ClientOnly>
    </>
  );
}
