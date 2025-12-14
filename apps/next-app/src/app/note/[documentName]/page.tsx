import { Editor } from "@/components/editor/DynamicEditor";
import { auth } from "@/lib/auth";
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

  // checking for user authentication
  if (!session) {
    // notFound();
    redirect(`/auth?documentName=${documentName}`, RedirectType.replace);
  }

  // if (session) {
  //   const result = await db
  //     .select()
  //     .from(documentTable)
  //     .where(
  //       and(
  //         eq(documentTable.ownerId, session.session.userId),
  //         eq(documentTable.id, documentName)
  //       )
  //     )
  //     .limit(1);
  //   if (result.length === 0) {
  //     return <h1>You don&apos;t have access</h1>;
  //   } else {
  //     return (
  //       <main className="flex h-screen">
  //         {/* aside navbar */}
  //         <aside className="w-[15%] bg-[#ece7e2]/10 h-full"></aside>

  //         <section className="w-full">
  //           {/* topl-bar */}
  //           <div className="h-20 p-4 ">workspace / product / vision</div>

  //           {/* editor */}
  //           <Editor documentName={documentName} />
  //         </section>
  //       </main>
  //     );
  //   }
  // }

  return (
    <main className="flex h-screen">
      <Link href={`/note/${randomUUID()}`}>New</Link>
      {/* aside navbar */}
      <aside className="w-[15%] bg-[#ece7e2]/10 h-full"></aside>

      <section className="w-full">
        {/* topl-bar */}
        <div className="h-20 p-4 ">workspace / product / vision</div>

        {/* editor */}
        <Editor session={session.session} documentName={documentName} />
      </section>
    </main>
  );
}
