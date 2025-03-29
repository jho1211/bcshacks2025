let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById("recordBtn");
const audioPlayback = document.getElementById("audioPlayback");

// Function to start recording
async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
        audioChunks = []; // Reset chunks for next recording
    };

    mediaRecorder.start();
}

// Function to stop recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
}

// Event listeners for button press and release
recordBtn.addEventListener("mousedown", startRecording);
recordBtn.addEventListener("mouseup", stopRecording);
recordBtn.addEventListener("mouseleave", stopRecording);

// Touch event support for mobile
recordBtn.addEventListener("touchstart", startRecording);
recordBtn.addEventListener("touchend", stopRecording);