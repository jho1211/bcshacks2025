const socket = io();

socket.on("newEntry", (data) => {
  console.log("📩 New data received:", data);
  addTranscriptItem(data);
});

const ul = document.getElementById("transcription-list");

function addTranscriptItem(transcript) {
  const li = document.createElement("li");
  li.innerText = `[${parseTimestamp(parseInt(transcript.timeStamp))}] ${transcript.callSign}: ${transcript.transcript}`
  ul.appendChild(li);
}

function parseTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}