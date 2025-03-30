const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch"); // Import node-fetch
const FormData = require("form-data");
const Transcript = require("../models/transcript"); // Adjust path as needed

const router = express.Router();

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

router.post("/", upload.single("audio"), async (req, res) => {
  console.log("called upload with new route");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const audioPath = req.file.path;
    const location = JSON.parse(req.body.location);
    const callSign = req.body.callSign;

    // Send the file to the Flask server for transcription
    const formData = new FormData();
    const fileStream = fs.createReadStream(audioPath);
    formData.append("audio", fileStream);

    console.log("calling flask server");
    const response = await fetch("http://127.0.0.1:3001/transcribe", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const transcript = await response.json();
    console.log(transcript.transcript);

    // quick test upload to db
    const newTranscript = new Transcript({
      callSign: callSign,
      fileNumber: "12345",
      dispatcherId: "Disp001",
      transcript: transcript.transcript,
      location: { lat: location.lat, lng: location.lng }, // Example coordinates
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
    res.json(transcript); // Send the transcript as a response
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

module.exports = router;
