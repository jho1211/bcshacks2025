const express = require('express');
const router = express.Router(); 

const{ uploadTranscript } = require('../controllers/transcriptController');

router.post('/:id/upload', uploadTranscript); 

module.exports = router; 