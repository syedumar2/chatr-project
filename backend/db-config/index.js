const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.info("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection failed:");
    console.error(error);
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Cause:", error.cause);
    console.error("Stack:", error.stack);
  });

module.export = mongoose; 
