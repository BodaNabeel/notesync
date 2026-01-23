import z from "zod";

const DocumentEditModeSchema = z.enum(["editor", "viewer"]);
export const DocumentLinkGenerationSchema = z.object({
    documentName: z.uuid(),
    documentEditMode: DocumentEditModeSchema,
});

export const DocumentLinkRevocationSchema = z.object({
    documentName: z.string()
})
export const DocumentTitleSchema = z.object({
    documentName: z.string()
})