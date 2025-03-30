const map = L.map('map').setView([49.2827, -123.1207], 13); // Example: Vancouver

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let mediaRecorder;
let audioChunks = [];
let userCallSign;

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
  const geoLocation = await getLocation();
  const curLocation = {"lat": geoLocation.coords.latitude, "lng": geoLocation.coords.longitude}
  const formData = new FormData();
  formData.append("audio", blob, "recorded_audio.wav"); // Assign a filename
  formData.append("callSign", userCallSign)
  formData.append("location", JSON.stringify(geoLocation == null ? defaultCoords : curLocation))

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Server response:", result);
    addMapMarker(curLocation);

  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

function addMapMarker(curLocation) {
  if (curLocation) {
    L.circleMarker([curLocation.lat, curLocation.lng], {radius: 3}).addTo(map);
    map.setView([curLocation.lat, curLocation.lng], 10);
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

document.addEventListener("DOMContentLoaded", async () => {
  loadCallSign();
  loadRecentTranscripts();
});

async function loadRecentTranscripts() {
  let transcripts;

  try {
    const resp = await fetch("/transcripts");
    const data = await resp.json();
    transcripts = data;
  } catch (err) {
    console.error(err);
    transcripts = [];
  }

  transcripts.reverse();

  transcripts.forEach((transcript) => {
    addTranscriptItem(transcript);
    addMapMarker(transcript.location);
  })
}

function loadCallSign() {
  const callSign = localStorage.getItem("loggedInCallSign");
  const userDisplay = document.getElementById("userCallSign");
  if (userDisplay && callSign) {
    userCallSign = callSign;
    userDisplay.textContent = callSign.toUpperCase();
  } else {
    window.location.href = "/lookup.html"
  }
}

//#region Geolocation API
let getLocation = () => new Promise((resolve, reject) => 
  navigator.geolocation.getCurrentPosition(resolve, reject));

//#endregion

//#region KEYWORD DETECTION

// Define the set of emergency-related keywords
const EMERGENCY_KEYWORDS = new Set(["ehs", "ambulance", "medical", "medic"]);

// Function to detect keywords in a transcription string
function detectKeywords(transcription) {
    const detectedKeywords = new Set();

    if (!transcription || transcription.trim() === "") return detectedKeywords;

    // Normalize input to lowercase for case-insensitive matching
    const normalizedText = transcription.toLowerCase();
    console.log(normalizedText);

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
        const keywords = detectKeywords(transcription.transcript);
        if (keywords.length > 0) {
            console.log(`Transcript ${index + 1}: Detected keywords ->`, keywords);
            const conf = confirm(`${transcription.callSign} has requested EHS. Trigger an alert?`); // Trigger alert if any keyword is found
            if (conf) {
              alert("EHS has been alerted");
            }
        } else {
            console.log(`Transcript ${index + 1}: No emergency keywords found.`);
        }
    });
}

