import CreateDocumentButton from "@/components/editor/CreateDocumentButton";
import { Editor } from "@/components/editor/DynamicEditor";
import { randomUUID } from "crypto";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ documentName: string }>;
}) {
  const { documentName } = await params;

  // if (!session) {
  //   redirect(`/auth?documentName=${documentName}`, RedirectType.replace);
  // }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(documentName)) {
    notFound();
  }

  // const [hasDocumentAccess] = await db
  //   .select({
  //     id: documentTable.id,
  //   })
  //   .from(documentTable)
  //   .where(
  //     and(
  //       eq(documentTable.id, documentName),
  //       eq(documentTable.ownerId, session.user.id)
  //     )
  //   )
  //   .limit(1);

  // if (!hasDocumentAccess) {
  //   notFound();
  // }

  return (
    <main className="flex h-screen">
      <aside className="w-[15%] bg-[#ece7e2]/10 h-full">
        {/* <CreateDocumentButton /> */}
        <Link href={`/note/${randomUUID()}?new=true`}>Create Document</Link>
      </aside>
      <section className="w-full">
        <div className="h-20 p-4 ">workspace / product / vision</div>
        <Editor documentName={documentName} />
      </section>
    </main>
  );
}
