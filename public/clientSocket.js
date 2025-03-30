const socket = io();

socket.on("newEntry", (data) => {
  console.log("📩 New data received:", data);
  addTranscriptItem(data);
  processTranscripts([data]);
});

console.log("Emitting");
socket.emit("sendEHSAlert", "hello world");