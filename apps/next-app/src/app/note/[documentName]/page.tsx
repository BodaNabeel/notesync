import { Editor } from "@/components/editor/DynamicEditor";
import { auth } from "@/lib/auth";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ documentName: string }>;
}) {
  const { documentName } = await params;

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

  return (
    <main className="flex h-screen">
      <aside className="w-[15%] bg-[#ece7e2]/10 h-full">
        <Link prefetch href={`/note/${randomUUID()}?new=true`}>
          Create document
        </Link>
      </aside>
      <section className="w-full">
        <div className="h-20 p-4 ">workspace / product / vision</div>
        <Editor documentName={documentName} session={session} />
      </section>
    </main>
  );
}
