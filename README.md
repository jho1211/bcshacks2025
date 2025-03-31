# TRIAX - AI Powered Dispatching
# [Link to Devpost](https://devpost.com/software/triax)

# Inspiration
TRIAX was born out of firsthand experience from one of our team members who worked as a 911 Police Dispatcher. One summer day, a critical incident came in—someone had attempted suicide and was in life-threatening condition, in need of immediate medical attention. But due to system fragmentation, there was no automatic, direct line to ambulance dispatch. We had to call Emergency Health Services manually with a landline, only to be placed on hold for 15 excruciating minutes as their own dispatch centre was overwhelmed from the voluminous amount of calls they were receiving that hot summer day.

While waiting, other emergencies were flooding in—robberies, assaults, foot pursuits—all while they were juggling all of it without any tools to help prioritize or manage the chaos. The stress was unbearable. This is not a unique experience to our group member. In fact, it's a sentiment shared by first responders all over the world; dispatchers across North America report similar levels of emotional exhaustion, stress, and burnout due to overwhelming workloads and outdated systems, as detailed in Harvard’s People Lab Policy Brief link

Our systems are outdated, siloed, and lack automation. Below are some examples of specific problems:

- ❌ No transcription of radio traffic
- ❌ No central communication across police, fire, and EMS
- ❌ No intelligent way to trace where a suspect has travelled
Burnout is rampant at call centres all across the world, which makes it clear: this system needs to change.

That’s what inspired us to build TRIAX—an AI-powered, unified dispatch assistant to reduce cognitive load, streamline response, and bring emergency services together under one smart, intuitive platform.

# What It Does
TRIAX is an AI-powered dispatch assistant that streamlines communication and coordination across police, fire, and ambulance services. By automating transcription, summarization, and geolocation, it reduces dispatcher workload and ensures faster, smarter emergency response.

# Key Features

## AI Speech-to-Text Transcription 
We implemented real-time transcription of radio traffic; each transcript is time-stamped and tagged with the call sign of the broadcasting officer. This allows dispatchers and responders to reference a clear, searchable audit trail for any incident.

## Automated Inter-Agency Notifications 
If a transcript contains a keyword like “ambulance” it will be flagged for the dispatcher. They can then notify another agency with one click to share details to the other dispatch client instead of queuing over the phone.

## Live Updates to Clients 
We used WebSockets to implement real-time data synchronization system between our MongoDB database and client applications, to ensure robust and responsive updates.

## AI-Powered Sentiment-Based Summarization 
The summary feature will extract and prioritize key information from active files based on real-world dispatch protocols. The system generates an automatic summary of the radio logs, organizing information in a clear, structured format. For example:
```
TRANSCRIPT:
"5 minutes ago, suspect is white male running southbound down granville street wearing a black t shirt and red nike dunks.
Suspect stabbed an officer with a knife and we need ambulance.
Suspect is on the west side of the street."

SUMMARY:
⏰ Time Delay: 5 minutes ago
🔫 Weapons: knife
🧍 Suspects: 1 white male
🧥 Suspect Description: running southbound down Granville Street, wearing a black t-shirt and red Nike dunks
🩹 Injuries/Medical: stabbed an officer with a knife, ambulance needed
➡️ Last Direction of Travel: west side of the street
```

## Timeline-Based Geolocation Mapping 
We implemented a real-time map of events powered by GPS data associated with each transcription. This makes a visual replay of pursuit direction, movement and can be used for tracing path reconstruction.

# How We Built It
- AI Speech-to-Text Transcription (Whisper-Open AI) We have a flask server using a Python package called Whisper-Open AI which runs the Whisper speech-to-text (STT) model locally to keep transcript information confidential. We send the audio recording from the frontend to the flask server to be transcribed by Whisper and then retrieve the transcribed message.
- Automated Inter-Agency Notifications (WebSockets) WebSocket clients emit an event when an emergency keyword is detected in the transcript, which the WebSocket receives and emits another event to trigger the adjacent agency to receive an alert.
- Live Updates to Clients (WebSockets) WebSocket server emits an event to all clients when it detects that a change has been made to the Transcripts database.
- AI-Powered Sentiment-Based Summarization (Ollama 2) We used the locally hosted Ollama 2 model to perform sentiment analysis on incoming radio transcriptions. This enabled real-time summarization of priority information, structured according to standard police dispatch protocols to support rapid situational awareness.
- Timeline-Based Geolocation Mapping (Leaflet) Geolocation points associated with timestamps were plotted on a map from leaflet.js with a polyline. The polyline is associated with each responder’s movement and transcripts can be clicked to view the location updates.
