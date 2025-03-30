const socket = io();

// socket.on("newEntry", (data) => {
//   console.log("📩 New data received:", data);
//   addTranscriptItem(data);
//   processTranscripts([data]);
// });

socket.on("newEHSAlert", (data) => {
    console.log("New EHS alert received");
    createOutgoingAlert(data);
})