require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./db-config"); //to connect to db
const express = require("express");
const app = express();

const {
  MasterRouter,
  AuthRouter,
  ChannelRoutes,
  MessageRoutes,
} = require("./router");

const logger = require("./middleware/logger");

app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

//todo build router

//middleware to track requests
app.use(logger);
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

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
