DROP TABLE IF EXISTS "document_table" CASCADE;
DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;

CREATE TABLE "document_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastModified" timestamp DEFAULT now() NOT NULL,
	"title" text DEFAULT 'Untitled Doc' NOT NULL,
	"document" "bytea" NOT NULL,
	"document_access_type" text DEFAULT 'private' NOT NULL
);
