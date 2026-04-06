import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { verifyDatabaseConnection } from "./config/db.js";
import { env } from "./config/env.js";
import { setSocketServer } from "./socket.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.frontendUrl,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("poll:subscribe", (pollId) => {
    socket.join(`poll:${pollId}`);
  });

  socket.on("poll:unsubscribe", (pollId) => {
    socket.leave(`poll:${pollId}`);
  });
});

setSocketServer(io);

const start = async () => {
  try {
    await verifyDatabaseConnection();
    server.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    process.exit(1);
  }
};

start();
