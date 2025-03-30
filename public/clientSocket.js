const socket = io();

socket.on("newPoliceEntry", (data) => {
  console.log("📩 New data received:", data);
  addTranscriptItem(data);
  
  const role = localStorage.getItem("loggedInRole")
  if (role && role == "dispatcher") {
    processTranscripts([data]);
  }
});

socket.on("newPoliceAlert", (data) => {
  createIncomingAlert(data);
})