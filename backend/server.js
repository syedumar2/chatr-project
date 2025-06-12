require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("./db-config"); // Connect to DB

const { MessageSocket } = require("./sockets");

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

// Setup socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

// Middleware to authenticate socket with JWT
io.use((socket, next) => {
  const authHeader = socket.handshake.auth?.token;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Authorization header missing or invalid"));
  }

  const token = authHeader.split(" ")[1];

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

// Socket connection handler
io.on("connection", (socket) => {
  console.log(`⚡ New socket connected: ${socket.id} (user: ${socket.user})`);

  MessageSocket.initMessageSocket(socket, io);

  socket.emit("welcome", { message: `A new user ${socket.user} connected` });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Import and mount routers
const {
  MasterRouter,
  AuthRouter,
  ChannelRoutes,
  MessageRoutes,
} = require("./router");
const logger = require("./middleware/logger");

// Express middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// API routes
app.use("/api/user", MasterRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/channel", ChannelRoutes);
app.use("/api/message", MessageRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is up and running" });
});

// Start server
const PORT = process.env.PORT || 3500;
httpServer.listen(PORT, () => {
  console.log(`🚀 Example app listening on port ${PORT}`);
});
