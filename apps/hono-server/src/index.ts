import { Hocuspocus } from "@hocuspocus/server";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { usersTable } from "@note/db";
import { db } from "./db.ts";

// Configure Hocuspocus
const hocuspocus = new Hocuspocus({
  debounce: 5000,
  async onConnect({ request, documentName }) {
  },
  async onStoreDocument({ documentName }) {
    console.log("change recorded now update db")
    try {

      await db.insert(usersTable).values({ id: 256, name: "nabeel", age: 5, email: "nabeel@gmail.com" })
    } catch (e) {
      console.log(e)
    }
  }

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