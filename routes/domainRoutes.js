const express = require('express');
const { getCertificateDetails, addDomain, checkDatabaseAndSendEmails } = require('../services/certificateService');
const router = express.Router();

router.get('/api/domain-certificate', getCertificateDetails);
router.post('/api/add-domain', addDomain);

module.exports = router;