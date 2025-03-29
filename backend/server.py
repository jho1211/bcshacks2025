from flask import Flask, request, jsonify
import whisper
import os

app = Flask(__name__)
model = whisper.load_model("base")  # Load model only once when Flask starts

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    file = request.files['audio']
    audio_path = "temp_audio.wav"
    file.save(audio_path)

    # Transcribe using Whisper
    result = model.transcribe(audio_path, language='en', fp16=False)
    transcript = result['text']

    # Clean up temporary file
    os.remove(audio_path)

    return jsonify({'transcript': transcript})

app.run(debug=True, host='0.0.0.0', port=3001)