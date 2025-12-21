import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';

export default async function Page() {
    //TODO: Replace the randomUUID logic with redirecting to first note in the document
    const uniqueDocumentName = randomUUID()
    redirect(`note/${uniqueDocumentName}`)
}

