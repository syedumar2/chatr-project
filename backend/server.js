require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("./db-config"); //to connect to db
const { MessageSocket } = require("./sockets");

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

//IMPLEMENT LAST
io.use((socket, next) => {
  console.log("Auth middleware hit");
  const authHeader = socket.handshake.auth?.token;
  console.log("Auth token from handshake.auth.token:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Authorization header missing or invalid"));
  }

  const token = authHeader.split(" ")[1]; // extract token after 'Bearer'

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("✅ Decoded token:", decoded);
    socket.user = decoded.userId;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  console.log("welcome msg hit");
  MessageSocket.initMessageSocket(socket, io);
  socket.emit("welcome", { message: `a new user ${socket.user} connected` });
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

const {
  MasterRouter,
  AuthRouter,
  ChannelRoutes,
  MessageRoutes,
} = require("./router");

// const logger = require("./middleware/logger");

app.use(
  cors({
    origin: ["http://localhost:5173"], // Your frontend URL on LAN
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//todo build router

//middleware to track requests
// app.use(logger);
//method path query params and body
//query, params and body must be stringified since they are objects

app.use("/api/user", MasterRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/channel", ChannelRoutes);
app.use("/api/message", MessageRoutes);

//test request
app.get("/", (req, res, next) => {
  res.json({ sucess: true, message: "Server is up and running" });
});

process.on("SIGINT", () => {
  console.log("\n🛑 SIGINT received. Shutting down gracefully...");

  httpServer.close(() => {
    console.log("✅ HTTP server closed.");
    process.exit(0); // exits cleanly
  });

  // Optional: Force close if not done in 5 seconds
  setTimeout(() => {
    console.warn("⏳ Forcefully shutting down...");
    process.exit(1);
  }, 5000);
});

//RETIRE THIS IN THE FUTURE

const PORT = process.env.PORT || 3500;
httpServer.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
