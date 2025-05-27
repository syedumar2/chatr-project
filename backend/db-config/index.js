const mongoose = require("mongoose");




mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log("Database connection failed", error);
  });

  
module.export = mongoose;