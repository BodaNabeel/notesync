import { Hono } from "hono";
import { Hocuspocus } from "@hocuspocus/server";

// Node.js specific
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";

// Configure Hocuspocus
const hocuspocus = new Hocuspocus({
  // …
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