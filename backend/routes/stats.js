const express = require('express');
const router  = express.Router();
const { getBorrowerLoanStats } = require('../controllers/statsController');

router.get('/borrower-loan', getBorrowerLoanStats);

module.exports = router;