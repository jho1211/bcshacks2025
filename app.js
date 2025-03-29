const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require('mongoose'); 

// const transcriptRoutes = require('./routes/transcripts'); // post route at path 

const app = express();
const port = 3000;
app.use(express.json());

app.get("/example", (req, res) => {
  res.send("Hello World!");
});

app.use("/", express.static("public"));

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

app.post("/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Plugging route into main server 
// app.use('/transcripts', transcriptRoutes); // exports router so it can be used elsewhere

app.listen(port, async () => {
  console.log(`Example app listening on port http://localhost:${port}`);
  // await mongoose.connect('mongodb+srv://popobunns:<BCSHACKS2025>@cluster0.ylj89ay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  console.log("Connected to MongoDB successfully");
});