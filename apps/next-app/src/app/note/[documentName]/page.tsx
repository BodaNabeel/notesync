import { Editor } from "@/components/editor/DynamicEditor";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
  if (!session) {
    redirect(`/auth?documentName=${documentName}`, RedirectType.replace);
  }
  return (
    <main className="flex h-screen">
      {/* aside navbar */}
      <aside className="w-[15%] bg-[#ece7e2]/10 h-full"></aside>

      <section className="w-full">
        {/* topl-bar */}
        <div className="h-20 p-4 ">workspace / product / vision</div>

        {/* editor */}
        <Editor documentName={documentName} />
      </section>
    </main>
  );
}
