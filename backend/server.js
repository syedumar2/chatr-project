//  Load Environment Variables
require("dotenv").config();

// 🧱 Core Modules and Middleware
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");

//  Custom Modules
require("./db-config"); // MongoDB Connection
const logger = require("./middleware/logger");
const { MessageSocket } = require("./sockets");
const {
  MasterRouter,
  AuthRouter,
  ChannelRoutes,
  MessageRoutes,
} = require("./router");

//  Express & HTTP Setup
const app = express();
const { createServer } = require("http");
const httpServer = createServer(app);

// ⚡ Socket.IO Setup
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

//  Authenticate Socket Connections using JWT
io.use((socket, next) => {
  const authHeader = socket.handshake.auth?.token;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Authorization header missing or invalid"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = decoded.userId;
    next();
  } catch (err) {
    console.error("❌ Socket auth failed:", err.message);
    next(new Error("Authentication failed"));
  }
});

// 🎧 Socket.IO Event Handling
io.on("connection", (socket) => {
  console.log(`⚡ New socket connected: ${socket.id} (user: ${socket.user})`);

  MessageSocket.initMessageSocket(socket, io);

  socket.emit("welcome", {
    message: `User ${socket.user} connected`, // Consider removing in production
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// 🧩 Express Middleware
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(logger); // Enable when needed

// 🛣 API Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", MasterRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/channel", ChannelRoutes);
app.use("/api/message", MessageRoutes);

// 🩺 Health Check Route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is up and running ✅" });
});

// 🚀 Start the Server
const PORT = process.env.PORT || 3500;
httpServer.listen(PORT, () => {
  console.log(`🌐 Server listening on http://localhost:${PORT}`);
});
