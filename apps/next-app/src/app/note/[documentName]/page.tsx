import { Editor } from "@/components/editor/DynamicEditor";
import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { and, documentTable, eq } from "@note/db";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ documentName: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { documentName } = await params;
  const [hasDocumentAccess] = await db
    .select()
    .from(documentTable)
    .where(
      and(
        eq(documentTable.id, documentName),
        eq(documentTable.ownerId, session?.user.id as string)
      )
    )
    .limit(1);

  // checking for user authentication
  if (!session) {
    // notFound();
    redirect(`/auth?documentName=${documentName}`, RedirectType.replace);
  }
  if (!hasDocumentAccess) {
    // TODO: Redirect to a path that will show proper error and the option to go to home
    redirect("/not-found");
  }

  return (
    <main className="flex h-screen">
      <Link href={`/note/${randomUUID()}`}>New</Link>
      {/* aside navbar */}
      <aside className="w-[15%] bg-[#ece7e2]/10 h-full"></aside>

      <section className="w-full">
        {/* tool-bar */}
        <div className="h-20 p-4 ">workspace / product / vision</div>

        {/* editor */}
        <Editor session={session.session} documentName={documentName} />
      </section>
    </main>
  );
}
