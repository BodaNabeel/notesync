import { Editor } from "@/components/editor/DynamicEditor";
import ShareDocument from "@/components/editor/ShareDocument";
import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { documentTable, eq } from "@note/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ documentName: string }>;
}) {
  const { documentName } = await params;

  interface DocumentDetail {
    documentPublic: boolean;
    documentEditMode: "viewer" | "editor";
  }

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
  // const [documentDetail] = await db.select({documentPublic: documentTable.document_public, documentEditMode: documentTable.edit_mode}).from(documentTable).where(eq(documentTable.id, documentName)).limit(1)
  const documentDetail: DocumentDetail = {
    documentPublic: true,
    documentEditMode: "viewer",
  };
  return (
    <>
      <div className="flex items-center justify-between  mx-8">
        <div className=" ">workspace / product / vision</div>
        <ShareDocument
          documentDetail={documentDetail}
          userName={session.user.name}
          userEmail={session.user.email}
        />
      </div>
      <Editor documentName={documentName} session={session} />
    </>
  );
}
