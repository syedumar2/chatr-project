require("dotenv").config();
const cors = require("cors");

require("./db-config"); //to connect to db
const express = require("express");
const app = express();

const { RouterV1 } = require("./router");


app.use(cors("*"));
app.use(express.json());

//todo build router

//middleware to track requests
app.use((req, res, next) => {
  console.log(
    `${new Date()} :: ${req.method} :: ${req.path} :: ${JSON.stringify(
      req.query
    )} :: ${JSON.stringify(req.params)} :: ${JSON.stringify(req.body)} `
  );
  next();
});
//method path query params and body
//query, params and body must be stringified since they are objects

app.use("/user",RouterV1);

//test request
app.get("/", (req, res, next) => {
  res.json({ sucess: true, message: "Server is up and running" });
  
});



app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
