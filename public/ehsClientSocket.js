const socket = io();

socket.on("newEHSEntry", (data) => {
  console.log("📩 New data received:", data);
  addTranscriptItem(data);
  processTranscripts([data]);
});

socket.on("newEHSAlert", (data) => {
    createIncomingAlert(data);
})