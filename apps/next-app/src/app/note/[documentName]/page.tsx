import { Editor } from "@/components/editor/DynamicEditor";
import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { and, documentTable, eq } from "@note/db";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect, RedirectType } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ documentName: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { documentName } = await params;

  if (!session) {
    redirect(`/auth?documentName=${documentName}`, RedirectType.replace);
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(documentName)) {
    notFound();
  }

  const [hasDocumentAccess] = await db
    .select({
      id: documentTable.id,
    })
    .from(documentTable)
    .where(
      and(
        eq(documentTable.id, documentName),
        eq(documentTable.ownerId, session.user.id)
      )
    )
    .limit(1);

  if (!hasDocumentAccess) {
    notFound();
  }

  return (
    <main className="flex h-screen">
      <Link href={`/note/${randomUUID()}`}>New</Link>
      <aside className="w-[15%] bg-[#ece7e2]/10 h-full"></aside>
      <section className="w-full">
        <div className="h-20 p-4 ">workspace / product / vision</div>
        <Editor session={session.session} documentName={documentName} />
      </section>
    </main>
  );
}
