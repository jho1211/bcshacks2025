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


// Multer setup for storing audio files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      new Date(Date.now())
        .toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })
        .replace(/:/g, "-") + path.extname(file.originalname)
    ),
});

const upload = multer({ storage });

app.post("/upload", upload.single("audio"), async (req, res) => {
  console.log("called upload");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const audioPath = req.file.path;
    console.log(audioPath);

    // Send the file to the Flask server for transcription
    const formData = new FormData();
    const fileStream = fs.createReadStream(audioPath);
    // console.log(fileStream);
    formData.append("audio", fileStream);

    console.log("calling flask server");
    // console.log(formData.getHeaders());
    const response = await fetch("http://127.0.0.1:3001/transcribe", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const transcript = await response.json();
    console.log(transcript.transcript);

    // quick test upload todb
    const Transcript = require("./public/models/transcript.js");
    const newTranscript = new Transcript({
      callSign: "Alpha123",
      fileNumber: "12345",
      dispatcherId: "Disp001",
      transcript: transcript.transcript,
      location: { lat: 34.0522, lng: -118.2437 }, // Example coordinates
      callId: "Call001",
      isEmergency: true,
      transcriptionStatus: "processing",
    });
    newTranscript
      .save()
      .then((savedTranscript) => {
        console.log("Transcript saved:", savedTranscript);
      })
      .catch((error) => {
        console.error("Error saving transcript:", error);
      });

    // Cleanup
    fs.unlinkSync(audioPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const User = require("./models/userSchema");

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
  if (!callSign || !role) return res.status(400).json({ error: "Missing call sign or role" });

  try {
    const existingUser = await User.findOne({ callSign });
    if (existingUser) return res.status(409).json({ error: "Call sign already exists" });

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

