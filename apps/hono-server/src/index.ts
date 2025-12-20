import { Database } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { documentTable, eq, and } from "@note/db";
import { Hono } from "hono";
import { db } from "./db.ts";
import { verifyJWT } from "./auth.ts";
import * as Y from "yjs"

const hocuspocus = new Hocuspocus({
  extensions: [
    new Database({
      fetch: async ({ context }) => {
        const { document, userId } = context
        if (document) {
          return document.document
        } else return null
      }
    })
  ],

  onStoreDocument: async ({ documentName, document, context }) => {
    const update = Y.encodeStateAsUpdate(document);

    await db
      .insert(documentTable)
      .values({
        id: documentName,
        ownerId: context.userId,
        document: update,
      })
      .onConflictDoUpdate({
        target: documentTable.id,
        set: {
          document: update,
          lastModified: new Date(),
        },
      });
  },
  async onAuthenticate({ documentName, token }) {
    if (!token) {
      throw new Error("Token is required to proceed further.");
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      throw new Error("Access denied. You do not have permission to access this resource.");
    }

    const userId = payload.id as string;
    console.log(documentName, userId);

    const [document] = await db
      .select()
      .from(documentTable)
      .where(
        and(
          eq(documentTable.id, documentName),
          eq(documentTable.ownerId, userId)
        )
      )
      .limit(1);

    if (!document) {
      throw new Error("Access denied. You do not have permission to access this resource.");
    }

    return {
      userId,
      document
    };
  }
});

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

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