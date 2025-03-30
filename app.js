const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");
const mongoose = require("mongoose");

const uploadRoutes = require("./routes/upload");
const transcriptRoutes = require("./routes/transcripts"); // post route at path

require("dotenv").config();

const app = express();
const port = 3000;
app.use(express.json());

mongoose
  .connect(process.env.mongodb_url, { dbName: "triax" })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});

app.use("/upload", uploadRoutes);

app.use("/", express.static("public"));

// watch for changes to db
const Transcript = require("./models/transcript");
async function startChangeStream() {
  const changeStream = Transcript.watch().on("change", (change) => {
    if (change.operationType === "insert") {
      console.log("New Entry:", change.fullDocument);
    }
  });
  console.log("📡 Listening for new database entries...");
}

startChangeStream();
