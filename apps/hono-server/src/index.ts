import { Database } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { and, documentTable, eq, or } from "@note/db";
import { Hono } from "hono";
import * as Y from "yjs";
import { db } from "./db.ts";
import validateToken from "./libs/ValidateToken.ts";
import { error } from "console";


const hocuspocus = new Hocuspocus({
  extensions: [
    new Database({
      fetch: async ({ context }) => {
        const { document } = context
        if (document) {
          return document
        } else return null
      }
    })
  ],

  onStoreDocument: async ({ documentName, document }) => {

    const update = Y.encodeStateAsUpdate(document);
    const meta = document.getMap("meta");
    const title = meta.get("title") ?? null

    try {
      await db
        .update(documentTable).set({
          document: update, lastModified: new Date(), title: title as string
        }).where(eq(documentTable.id, documentName))
    } catch (err) {
      console.error(`[ERROR]: Error storing document ${error}`)
    }

  },
  async onAuthenticate({ documentName, token, requestParameters, connectionConfig, context }) {
    if (!token) {
      throw new Error("Token is required to proceed further.");
    }

    const payload = await validateToken(token);
    const userId = payload.id as string
    const createDocument = requestParameters.get("new")

    if (!payload) {
      throw new Error("Access denied. You do not have permission to access this resource.");
    }

    const [existingDoc] = await db
      .select({ ownerId: documentTable.ownerId, documentAccessType: documentTable.documentAccessType, documentEditMode: documentTable.documentEditMode, document: documentTable.document })
      .from(documentTable)
      .where(eq(documentTable.id, documentName))
      .limit(1);

    if (createDocument === "true") {
      console.log(existingDoc)
      if (existingDoc) {
        throw new Error("Access denied. Document already exists.");
      } else {
        await db.insert(documentTable).values({ id: documentName, ownerId: userId }).onConflictDoNothing();
        return {
          document: null
        }
      }
    } else {

      if (!existingDoc) {
        throw new Error("Access denied. You do not have permission to access this resource.");
      }

      if (existingDoc.ownerId === userId || existingDoc.documentAccessType === "public") {
        if (existingDoc.documentEditMode === "viewer") {
          connectionConfig.readOnly = true

          context.awareness = {
            user: {
              readOnly: false,
            },
          }
        }
        if (existingDoc.documentEditMode === "editor") {
          context.awareness = {
            user: {
              readOnly: true,
            },
          }
        }
        return {
          document: existingDoc.document
        };
      } else {
        throw new Error("Access denied. Document already exists.");
      }
    }
  },
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