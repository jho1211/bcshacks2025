const Transcript = require('.../models/Transcript');

// handles incoming HTTP requests to upload a transcript
const uploadTranscript = async (req, res) => {
    const { id } = req.params;  // uses object destructuring to extract id from URL
    const { transcript } = req.body; // pulls out transcript field from body of request

    try {
        const transmission = await Transcript.findById(id);
        if (!transmission) {
            return res.status(204).end(); // No content 
        }

        transmission.transcript = transcript; 
        transmission.transcriptionStatus = 'completed';
        await transmission.save(); 

        if (req.app.get('io')) {
            req.app.get('io').emit('transcriptUpdated', {
                id: transmission._id,
                callSign: transmission.unitId,
                transcript: transmission.transcript,
                timestamp: transmission.timestamp
            });
        }
        return res.status(204).end();
    } catch (error) {
        console.error('Transcript upload error:', error);
        return res.status(500).end(); 
    }
};

module.exports = { uploadTranscript }