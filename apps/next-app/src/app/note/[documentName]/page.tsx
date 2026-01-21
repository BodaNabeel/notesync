import { Editor } from "@/components/editor/DynamicEditor";
import ShareDocument from "@/components/editor/ShareDocument";
import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { documentTable, eq } from "@note/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ documentName: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { documentName } = await params;
  const { new: isNewParam } = await searchParams;

  const isNew = isNewParam === "true";

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(documentName)) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const [documentDetail] = await db
    .select({
      documentAccessType: documentTable.documentAccessType,
      documentEditMode: documentTable.documentEditMode,
      ownerId: documentTable.ownerId,
    })
    .from(documentTable)
    .where(eq(documentTable.id, documentName))
    .limit(1);
  console.log(
    documentDetail.ownerId === session.user.id ||
      documentDetail.documentAccessType === "public",
  );
  console.log(
    documentDetail.ownerId,
    session.user.id,
    documentDetail.documentAccessType,
  );
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

      <Editor
        editable={
          documentDetail
            ? documentDetail.ownerId === session.user.id ||
              documentDetail.documentEditMode === "editor"
            : true
        }
        documentName={documentName}
        session={session}
      />
    </>
  );
}
