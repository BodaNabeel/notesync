import { randomUUID } from 'crypto'
import { redirect } from 'next/navigation'

export default function Page() {
    const uniqueDocumentName = randomUUID()
    redirect(`note/${uniqueDocumentName}`)
}