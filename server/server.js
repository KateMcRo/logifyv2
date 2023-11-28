// Imports
const express = require("express");
const database = require("./config/connection");
const API = require("./API");
const cors = require("cors");

// App
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", API);

// DB & Server
database.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🚀 Listening on Port ${PORT}`);
  });
});
