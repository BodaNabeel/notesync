import CreateDocumentButton from "@/components/editor/CreateDocumentButton";
import { Editor } from "@/components/editor/DynamicEditor";
import { notFound } from "next/navigation";

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

  return (
    <main className="flex h-screen">
      <aside className="w-[15%] bg-[#ece7e2]/10 h-full">
        <CreateDocumentButton />
      </aside>
      <section className="w-full">
        <div className="h-20 p-4 ">workspace / product / vision</div>
        <Editor documentName={documentName} />
      </section>
    </main>
  );
}
