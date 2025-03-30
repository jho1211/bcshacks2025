const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");
const mongoose = require("mongoose");

const uploadRoutes = require("./routes/upload");
const transcriptRoutes = require("./routes/transcripts"); // post route at path
const User = require("./models/userSchema");

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

app.post("/check-callsign", async (req, res) => {
  const { callSign } = req.body;
  if (!callSign) return res.status(400).json({ error: "Missing call sign" });

  try {
    const user = await User.findOne({ callSign });
    if (user) {
      res.json({ exists: true, user });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.toString() });
  }
});

app.post("/register-callsign", async (req, res) => {
  const { callSign, role } = req.body;
  if (!callSign || !role)
    return res.status(400).json({ error: "Missing call sign or role" });

  try {
    const existingUser = await User.findOne({ callSign });
    if (existingUser)
      return res.status(409).json({ error: "Call sign already exists" });

    const newUser = new User({
      callSign,
      role,
    });

    await newUser.save();
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.toString() });
  }
});

// Plugging route into main server
// app.use('/transcripts', transcriptRoutes); // exports router so it can be used elsewhere

// watching for changes to mongo
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
