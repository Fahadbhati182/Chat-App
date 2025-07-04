import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.routes.js";
import messageRouter from "./src/routes/message.route.js";
import { Server } from "socket.io";

await connectDB();

const app = express();
const server = http.createServer(app);

//* Socket.io server....
export const io = new Server(server, {
  cors: { origin: "*" },
});

//* Store online users..
export const userSocketMap = {}; //? {userId:sockerId}

//* socket connections
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const allowedOrigin = "*";

//* Middlewares....
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://chat-app-final-frontend-tawny.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());

//* routes...
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

app.use("/server/active", (req, res) => {
  res.send("Hello User");
});

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server is running on port${port}`);
  });
}

export default server;
