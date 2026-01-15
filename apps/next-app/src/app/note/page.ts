import { db } from '@/database/drizzle';
import { auth } from '@/lib/auth';
import { desc, documentTable, eq } from '@note/db';
import { randomUUID } from 'crypto';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth")
    }

    const [document] = await db.select({ documentName: documentTable.id }).from(documentTable).where(eq(documentTable.ownerId, session.user.id)).limit(1).orderBy(
        desc(documentTable.createdAt),
        desc(documentTable.id)
    )

    if (document) {
        redirect(`note/${document.documentName}`)
    } else {
        const uniqueDocumentName = randomUUID()
        redirect(`note/${uniqueDocumentName}`)

    }
}

