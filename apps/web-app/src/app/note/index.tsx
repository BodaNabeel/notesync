import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { getSession } from "@/utils/session.server";
import { desc, documentTable, eq } from "@note/db";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { BookOpenText, PlusIcon } from "lucide-react";
import z from "zod";

const getLatestDocument = createServerFn()
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const [document] = await db
      .select({ documentName: documentTable.id })
      .from(documentTable)
      .where(eq(documentTable.ownerId, data.userId))
      .limit(1)
      .orderBy(desc(documentTable.createdAt), desc(documentTable.id));

    return document;
  });

const searchSchema = z.object({
  new: z.boolean().optional(),
});
export const Route = createFileRoute("/note/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({
        to: "/auth",
        replace: true,
      });
    }

    const document = await getLatestDocument({
      data: { userId: session.user.id },
    });

    if (document) {
      throw redirect({
        to: "/note/$documentName",
        params: {
          documentName: document.documentName,
        },
      });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const handleCreateDocument = () => {
    navigate({
      to: "/note/$documentName",
      params: {
        documentName: crypto.randomUUID(),
      },
      search: {
        new: true,
      },
    });
  };

  return (
    <section className=" max-w-xl mx-auto flex flex-col justify-center items-center h-[calc(100vh-120px)]">
      <div className="bg-accent border-8 shadow-md rounded-md -rounded-l-3xl w-full py-12 mb-8">
        <BookOpenText size={120} className="text-primary/60 mx-auto" />
      </div>
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl font-bold">Create your first masterpiece</h1>
        <p className="text-center mx-2 text-amber-900">
          Every great idea starts with a blank page, giving you room to explore,
          revise, and shape ideas at your own pace
        </p>
      </div>
      <Button
        onClick={handleCreateDocument}
        className="text-lg p-4"
        size={"lg"}
      >
        <div className="bg-white rounded-full p-1 ">
          <PlusIcon className="text-primary " />
        </div>
        Create first document
      </Button>
    </section>
  );
}
