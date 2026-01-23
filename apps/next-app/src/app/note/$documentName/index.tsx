import { authMiddleware } from "@/app/middleware/auth";
import Editor from "@/components/editor/Editor";
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
      if (!documentDetail) {
        throw notFound();
      }

      return {
        documentDetail,
        session: session!,
      };
    } catch {
      throw notFound();
    }
  },
  // Add this to show a pending state during navigation
  pendingComponent: () => (
    <div className="max-w-5xl mx-auto min-h-[calc(100vh-200px)] pb-80 mt-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  ),
});

function RouteComponent() {
  const { documentName } = Route.useParams();
  const { new: isNew } = Route.useSearch();
  const { documentDetail, session } = Route.useLoaderData();

  return (
    <>
      <div className="flex items-center justify-between mx-8">
        <div>workspace / product / vision</div>
        {!isNew && documentDetail.ownerId === session.user.id ? (
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

      <ClientOnly fallback={<p>Running</p>}>
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
