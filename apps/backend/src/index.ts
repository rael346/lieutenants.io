import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { env } from "./env";

const app = fastify();

app.register(fastifyWebsocket);

app.get("/ping", async (_request, _reply) => {
  console.log("ping");
  return {
    message: "pong pow",
  };
});

app.register(async fastify => {
  fastify.get("/chat", { websocket: true }, (connection, req) => {
    broadcast({
      sender: "server",
      message: `${req.query.username} joined`,
    });

    connection.socket.on("close", () => {
      broadcast({
        sender: "server",
        message: `${req.query.username} left`,
      });
    });

    connection.socket.on("message", message => {
      message = JSON.parse(message.toString());
      broadcast({
        sender: req.query.username,
        ...message,
      });
    });
  });
});

const broadcast = (message: any) => {
  console.log(message);
  app.websocketServer.clients.forEach(client =>
    client.send(JSON.stringify(message)),
  );
};

app.listen({ port: env.PORT, host: env.HOST }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server is running at: ${address}`);
});
