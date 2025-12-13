import { Database } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { documentTable, eq } from "@note/db";
import { Hono } from "hono";
import { db } from "./db.ts";

// Configure Hocuspocus
const hocuspocus = new Hocuspocus({
  debounce: 5000,
  extensions: [
    new Database({
      async fetch({ documentName }) {
        try {
          const result = await db
            .select()
            .from(documentTable)
            .where(eq(documentTable.id, documentName))
            .limit(1);

          if (result.length === 0) {
            return null
          }
          return result[0].document

        } catch (error) {
          console.log(`error occurred while fetching document: ${documentName}`, documentName)
          return null
        }

      },

      async store({ documentName, state }) {
        try {
          await db
            .insert(documentTable)
            .values({
              id: documentName,
              document: state,
            }).onConflictDoUpdate({
              target: documentTable.id,
              set: {
                document: state,
                lastModified: new Date(),
              }
            })
        } catch (error) {
          console.log(`error occurred while inserting document with documentName: ${documentName}`, error)
        }

      }
    })
  ],
});

// Setup Hono server
const app = new Hono();

// Node.js specific
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

// We mount HocusPocus in the Hono server
app.get(
  "/hocuspocus",
  upgradeWebSocket((c) => ({
    onOpen(_evt, ws) {
      hocuspocus.handleConnection(ws.raw, c.req.raw as any);
    },
  }))
);

// Start server
const server = serve({
  fetch: app.fetch,
  port: 5000,
}, (info) => {
  hocuspocus.hooks('onListen', {
    instance: hocuspocus,
    configuration: hocuspocus.configuration,
    port: info.port
  })
});

// Setup WebSocket support (Node.js specific)
injectWebSocket(server);