const SummaryTranscript = require('../models/summaryTranscript');

// handles incoming HTTP requests to upload a transcript
const uploadSummary = async (req, res) => {
    try {
        const newActivity = new SummaryTranscript(req.body);
        await newActivity.save();
        res.json({"message": "Summary has been added."});
    } catch (err) {
        res.status(500).json({"error": err});
    }
};

const getSummaries = async (req, res) => {
    const unit = req.query.unit;
    const query = {}
    
    if (unit) {
        query["unit"] = unit;
    }

    try {
        const items = await SummaryTranscript.find(query, '-__v -_id')
        res.json(items);
    } catch (err) {
        res.status(500).json({"error": err})
    }
}

module.exports = { uploadSummary, getSummaries }