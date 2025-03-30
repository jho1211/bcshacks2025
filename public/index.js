const map = L.map("map").setView([49.2827, -123.1207], 13); // Example: Vancouver

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let mediaRecorder;
let audioChunks = [];
let userCallSign;
let transcripts = [];

const recordBtn = document.getElementById("recordBtn");
const audioPlayback = document.getElementById("audioPlayback");
const defaultCoords = { lat: 0, lon: 0 };

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
  const curLocation = {
    lat: geoLocation.coords.latitude,
    lng: geoLocation.coords.longitude,
  };
  const formData = new FormData();
  formData.append("audio", blob, "recorded_audio.wav"); // Assign a filename
  formData.append("callSign", userCallSign);
  formData.append(
    "location",
    JSON.stringify(geoLocation == null ? defaultCoords : curLocation)
  );
  formData.append("unit", "Police");

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Server response:", result);
    updateMap(curLocation, userCallSign);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

let points = {};
let polylines = {};
let dispatchColors = {};
const colors = ["red", "blue", "green", "orange", "purple"];

function updateMap(curLocation, callSign) {
  if (curLocation && curLocation.lat && curLocation.lng) {
    if (!points[callSign]) {
      dispatchColors[callSign] = colors[Object.keys(points).length % 5];
      points[callSign] = [[curLocation.lat, curLocation.lng]];
      polylines[callSign] = L.polyline(points[callSign], {
        color: dispatchColors[callSign],
      }).addTo(map);
    } else {
      points[callSign].push([curLocation.lat, curLocation.lng]);
      polylines[callSign].setLatLngs(points[callSign]);
    }
    L.circleMarker([curLocation.lat, curLocation.lng], {
      color: dispatchColors[callSign],
      radius: 3,
    }).addTo(map);
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

let isTalking = false;
document.addEventListener("keydown", (event) => {
  if (event.key === "\\" && !isTalking) {
    recordBtn.textContent = "🔴 Transmission in progress";
    isTalking = true;
    startRecording();
  }
});
document.addEventListener("keyup", (event) => {
  if (event.key === "\\" && isTalking) {
    isTalking = false;
    recordBtn.textContent = "Press backslash to talk";
    stopRecording();
  }
});

function updateRoleBar() {
  const role = localStorage.getItem("loggedInRole");
  const unit = localStorage.getItem("loggedInUnit");
  const roleDisplay = document.getElementById("userRole");

  if (role && unit && roleDisplay) {
    const roleLabel = role.toUpperCase();     // DISPATCHER or RESPONDER
    const unitLabel = unit.toUpperCase();     // POLICE or EHS
    roleDisplay.textContent = `${unitLabel} ${roleLabel} DASHBOARD`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  determineDashboard();
  loadCallSign();
  broadcastConnected();
  loadRecentTranscripts();
  loadSummaries();
  updateRoleBar();
});

function broadcastConnected() {
  const role = localStorage.getItem("loggedInRole");
  const callSign = localStorage.getItem("loggedInCallSign");
  if (callSign && role == "responder") {
    socket.emit("policeConnected", callSign);
  }
}

function determineDashboard() {
  const unit = localStorage.getItem("loggedInUnit");
  if (unit == null) {
    window.location.href = "/lookup.html";
  } else if (unit == "EHS") {
    window.location.href = "/ehs.html";
  }
}

async function loadSummaries() {
  let summaries = [];
  try {
    const resp = await fetch("/summary?unit=Police");
    const data = await resp.json();
    summaries = data;
  } catch (err) {
    console.error(err);
  }

  console.log(summaries);
}

async function loadRecentTranscripts() {
  let recentTranscripts;
  try {
    const resp = await fetch("/transcripts?unit=Police");
    const data = await resp.json();
    recentTranscripts = data;
  } catch (err) {
    console.error(err);
    recentTranscripts = [];
  }

  recentTranscripts.reverse();

  recentTranscripts.forEach((transcript) => {
    addTranscriptItem(transcript);
    updateMap(transcript.location, transcript.callSign);
  });
}

function loadCallSign() {
  const callSign = localStorage.getItem("loggedInCallSign");
  const userDisplay = document.getElementById("userCallSign");
  if (userDisplay && callSign) {
    userCallSign = callSign;
    userDisplay.textContent = `CALL SIGN: ${callSign.toUpperCase()}`;
  } else {
    window.location.href = "/lookup.html";
  }
}

//#region Geolocation API
let getLocation = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

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

  EMERGENCY_KEYWORDS.forEach((keyword) => {
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
      const conf = confirm(
        `${transcription.callSign} has requested EHS. Trigger an alert?`
      ); // Trigger alert if any keyword is found
      if (conf) {
        createOutgoingAlert(transcription);
        socket.emit("sendEHSAlert", transcription);
      }
    } else {
      console.log(`Transcript ${index + 1}: No emergency keywords found.`);
    }
  });
}

function zoomToLocation(loc) {
  map.setView([loc.lat, loc.lng], 15);
}

const transcriptionUL = document.getElementById("transcription-list");

function addTranscriptItem(transcript) {
  transcripts.push(transcript);
  const li = document.createElement("li");
  li.innerText = `[${parseTimestamp(parseInt(transcript.timeStamp))}] ${
    transcript.callSign
  }: ${transcript.transcript}`;
  li.addEventListener("click", () => {
    zoomToLocation(transcript.location);
  });
  transcriptionUL.appendChild(li);
}

function parseTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

function createIncomingAlert(transcript) {
  const incDiv = document.getElementById("incoming-alerts");
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `[${parseTimestamp(
    parseInt(transcript.timeStamp)
  )}] EHS has requested police.`;
  incDiv.appendChild(newDiv);
  newDiv.addEventListener("click", () => {
    zoomToLocation(transcript.location);
  });
}
