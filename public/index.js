const map = L.map('map').setView([49.2827, -123.1207], 13); // Example: Vancouver

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let mediaRecorder;
let audioChunks = [];
let curLocation;

const recordBtn = document.getElementById("recordBtn");
const audioPlayback = document.getElementById("audioPlayback");
const defaultCoords = {"lat": 0, "lon": 0}

// Function to start recording
async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioPlayback.src = audioUrl;
    audioChunks = []; // Reset chunks for next recording
    sendAudioBlob(audioBlob);
  };

  mediaRecorder.start();
}

// Function to send audio blob to server
async function sendAudioBlob(blob) {
  const formData = new FormData();
  formData.append("audio", blob, "recorded_audio.wav"); // Assign a filename
  formData.append("callSign", "Jeff")
  formData.append("location", JSON.stringify(curLocation ?? defaultCoords))

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Server response:", result);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// Function to stop recording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

// Event listeners for button press and release
recordBtn.addEventListener("mousedown", startRecording);
recordBtn.addEventListener("mouseup", stopRecording);
recordBtn.addEventListener("mouseleave", stopRecording);

// Touch event support for mobile
recordBtn.addEventListener("touchstart", startRecording);
recordBtn.addEventListener("touchend", stopRecording);

//#region Geolocation API
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function success(position) {
  curLocation = {
    "lat": position.coords.latitude, "lon": position.coords.longitude
  }
}

function error() {
  alert("Sorry, no position available.");
}
//#endregion

//#region KEYWORD DETECTION

// Define the set of emergency-related keywords
const EMERGENCY_KEYWORDS = new Set(["ehs", "ambulance", "medical", "medic"]);

// PLACEHOLDER alert function
function alert() {
    console.log("EHS has been alerted");
}

// Function to detect keywords in a transcription string
function detectKeywords(transcription) {
    const detectedKeywords = new Set();

    if (!transcription || transcription.trim() === "") return detectedKeywords;

    // Normalize input to lowercase for case-insensitive matching
    const normalizedText = transcription.toLowerCase();

    EMERGENCY_KEYWORDS.forEach(keyword => {
        // Use word boundaries to avoid partial matches (like "MEDICINE")
        const regex = new RegExp(`\\b${keyword}\\b`);
        if (regex.test(normalizedText)) {
            detectedKeywords.add(keyword);
        }
    });

    return Array.from(detectedKeywords);
}

// Processes an array of transcriptions and calls alert if any keyword is detected
function processTranscripts(transcripts) {
    transcripts.forEach((transcription, index) => {
        const keywords = detectKeywords(transcription);
        if (keywords.length > 0) {
            console.log(`Transcript ${index + 1}: Detected keywords ->`, keywords);
            alert(); // Trigger alert if any keyword is found
        } else {
            console.log(`Transcript ${index + 1}: No emergency keywords found.`);
        }
    });
}

// 🧪 Example usage
const incomingTranscripts = [
    "All units be advised, road is blocked.",
    "Requesting ambulance at 5th and Main.",
    "EHS should be notified of the situation.",
    "Nothing medical, just a routine check.",
    "Suspect is on foot heading east."
];
//#endregion

processTranscripts(incomingTranscripts);
getLocation();