const express = require('express');
const router = express.Router(); 

const{ uploadSummary, getSummaries } = require('../controllers/summaryController');

router.post('/', uploadSummary); 
router.get('/', getSummaries);

module.exports = router;