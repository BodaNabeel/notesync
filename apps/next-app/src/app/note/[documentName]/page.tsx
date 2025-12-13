import { Editor } from "@/components/editor/DynamicEditor";

export default async function Page({
  params,
}: {
  params: Promise<{ documentName: string }>;
}) {
  const { documentName } = await params;
  console.log(documentName);
  return (
    <main className="flex h-screen">
      {/* aside navbar */}
      <aside className="w-[15%] bg-[#ece7e2]/10 h-full"></aside>

      <section className="w-full">
        {/* topbar */}
        <div className="h-20 p-4 ">workspace / product / vision</div>

        {/* editor */}
        <Editor documentName={documentName} />
      </section>
    </main>
  );
}
