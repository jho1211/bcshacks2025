function createOutgoingAlert(transcript) {
    const alertDiv = document.getElementById("outgoing-alerts");
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `[${parseTimestamp(
      parseInt(transcript.timeStamp)
    )}] Police requested.`;
    alertDiv.appendChild(newDiv);
    newDiv.addEventListener("click", () => {
      zoomToLocation(transcript.location);
    });
}

function populateConnected(callSign) {
    const div = document.getElementById("connectedDiv");
    const newDiv = document.createElement("div");
    newDiv.innerHTML = callSign;
    div.appendChild(newDiv);
  }