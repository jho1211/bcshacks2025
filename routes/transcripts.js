const express = require('express');
const router = express.Router(); 

const{ uploadTranscript, getRecentTranscripts } = require('../controllers/transcriptController');

router.post('/:id/upload', uploadTranscript); 
router.get('/', getRecentTranscripts);

module.exports = router;