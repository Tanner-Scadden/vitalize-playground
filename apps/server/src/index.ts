import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import {
  addToSchedule,
  deleteFromSchedule,
} from "@repo/drizzle/src/repositories/schedule.repository";
import { ServerWebSocket } from "bun";

const { upgradeWebSocket, websocket } = createBunWebSocket();

const app = new Hono();

const topic = "schedule-update";
app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get(
    "/ws",
    upgradeWebSocket(() => {
      return {
        onOpen(_event, ws) {
          const rawWs = ws.raw as ServerWebSocket;
          rawWs.subscribe(topic);
        },
        onMessage(event, ws) {
          if (typeof event.data !== "string") {
            return;
          }

          const payload = JSON.parse(event.data);
          console.log("~~~~", payload);

          let promise: Promise<unknown> | undefined = undefined;
          switch (payload.type) {
            case "create": {
              promise = addToSchedule(payload.data);
              break;
            }
            case "delete": {
              promise = deleteFromSchedule(Number(payload.data));
              break;
            }
            default: {
              console.error("Invalid payload type");
            }
          }
          console.log("~~~~", promise);

          if (promise) {
            promise
              .then((w) => {
                server.publish(topic, JSON.stringify({ data: "Updated " }));
              })
              .catch((e) => {
                console.error(e);
              });
          }
        },
        onClose: (_event, ws) => {
          const rawWs = ws.raw as ServerWebSocket;
          rawWs.unsubscribe(topic);
          console.log("Connection closed");
        },
      };
    }),
  );

const server = Bun.serve({
  fetch: app.fetch,
  websocket,
  port: 5_000,
});
