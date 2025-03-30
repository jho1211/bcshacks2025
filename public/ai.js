const defaultPrompt = 
`You are an assistant for a police dispatch system.
Your job is to extract and summarize the following information from radio transcripts in the exact order and bullet-point format shown below. 
If any information is missing or unclear, respond with "Not specified".

Do NOT write complete sentences or extra commentary.

Here is the format to follow exactly:

- Time Delay: [when did the incident occur?]
- Weapons: [what kind of weapons?]
- Suspects: [how many?]
- Suspect Description: [vehicle, clothing, weapons, etc.]
- Injuries/Medical: [any injuries or if ambulance needed]
- Last Direction of Travel: [where the suspects were last seen going including northbound/eastbound/southbound/westbound and whether or not the suspect is on the north/east/south/west side of the street]

Now summarize this transcript:
`;

async function promptLlm(transcript) {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        stream: false,
        messages: [
          {
            role: 'user',
            content: defaultPrompt + transcript,
          },
        ],
      }),
    });

    const res = await response.json();
    const result = res.message.content;
    return result;
}

async function summarizeTranscripts() {
  let combinedText = "";
  transcripts.forEach((transcript) => combinedText += `[${parseTimestamp(parseInt(transcript.timeStamp))}] ${
    transcript.callSign
  }: ${transcript.transcript}\n`);

  summarizeBtn.innerText = "SUMMARIZING...";
  const resp = await promptLlm(combinedText);
  summarizeBtn.innerText = "SUMMARIZE TRANSCRIPT";
  const summaryModel = parseSummaryModel(transcripts, combinedText, resp);

  try {
    await fetch('summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summaryModel)
    })
  } catch (err) {
    console.error(err);
  }

  addSummaryItem(summaryModel);
}

function parseSummaryModel(transcripts, combinedText, summary) {
  let participants = {};
  let minTime = Infinity;
  let maxTime = 0;
  let unit = "Police";

  transcripts.forEach((transcript) => {
    participants[transcript.callSign] = true;
    minTime = Math.min(parseInt(transcript.timeStamp), minTime);
    maxTime = Math.max(parseInt(transcript.timeStamp), maxTime);
    unit = transcript.unit;
  })

  const newSummary = {
    "minTimestamp": minTime,
    "maxTimestamp": maxTime,
    "callSigns": Object.keys(participants),
    "original": combinedText,
    "summary": summary,
    "unit": unit
  }

  return newSummary;
}

const summarizeBtn = document.getElementById("summarizeBtn");

summarizeBtn.addEventListener("click", async () => summarizeTranscripts());

// promptLlm("5 minutes ago, suspect is white male running southbound down granville street wearing a black t shirt and red nike dunks. Suspect stabbed an officer and we need ambulance. Suspect is on the west side of the street.")