import { Database } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { and, documentTable, eq } from "@note/db";
import { Hono } from "hono";
import * as Y from "yjs";
import { db } from "./db.ts";
import validateToken from "./libs/ValidateToken.ts";


const hocuspocus = new Hocuspocus({
  extensions: [
    new Database({
      fetch: async ({ context }) => {
        const { document } = context
        if (document) {
          return document.document
        } else return null
      }
    })
  ],

  onStoreDocument: async ({ documentName, document }) => {
    const update = Y.encodeStateAsUpdate(document);
    const meta = document.getMap("meta");
    const title = meta.get("title") ?? null
    await db
      .update(documentTable).set({
        document: update, lastModified: new Date(), title: title as string
      }).where(eq(documentTable.id, documentName))

  },
  async onAuthenticate({ documentName, token, requestParameters }) {
    if (!token) {
      throw new Error("Token is required to proceed further.");
    }

    const payload = await validateToken(token);
    const userId = payload.id as string
    const createDocument = requestParameters.get("new")

    if (!payload) {
      throw new Error("Access denied. You do not have permission to access this resource.");
    }

    if (createDocument === "true") {
      await db.insert(documentTable).values({
        id: documentName, ownerId: userId
      }).onConflictDoNothing()

      return {
        document: null
      }
    }

    const [document] = await db
      .select({ document: documentTable.document, title: documentTable.title })
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
      document: document.document,
      documentTitle: "hello",
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