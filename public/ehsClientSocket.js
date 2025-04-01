const socket = io();

socket.on("newEHSEntry", (data) => {
  console.log("📩 New data received:", data);
  addTranscriptItem(data);
  updateMap(data.location, data.callSign);

  const role = localStorage.getItem("loggedInRole")
  if (role && role == "dispatcher") {
    processTranscripts([data]);
  }
});

socket.on("newEHSAlert", (data) => {
    createIncomingAlert(data);
})

socket.on("newEHSResponder", (callSign) => {
    populateConnected(callSign)
  });