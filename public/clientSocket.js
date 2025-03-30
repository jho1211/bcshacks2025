const socket = io();

socket.on("newPoliceEntry", (data) => {
  console.log("📩 New data received:", data);
  addTranscriptItem(data);
  processTranscripts([data]);
});

socket.on("newPoliceAlert", (data) => {
  createIncomingAlert(data);
})