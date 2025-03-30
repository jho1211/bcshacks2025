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

function addSummaryItem(summary) {
  const summaryUL = document.getElementById("summariesUL");
  const li = document.createElement('li');
  const minTimestring = (new Date(summary.minTimestamp)).toLocaleString()
  const maxTimestring = (new Date(summary.maxTimestamp)).toLocaleString()
  li.innerText = `Members Involved: ${summary.callSigns.join(", ")}
  Date Range: ${minTimestring} to ${maxTimestring}\n
  Summary:\n ${summary.summary}\n
  Original Transcript:\n ${summary.original}\n\n
  `
  summaryUL.appendChild(li);
}