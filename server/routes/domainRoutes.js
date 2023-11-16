const express = require('express');
const { getCertificateDetails, addDomain, getDomainList } = require('../services/certificateService');
const router = express.Router();

router.get('/api/domain-certificate', getCertificateDetails);
router.post('/api/add-domain', addDomain);
router.get('/api/getDomainList', getDomainList)

module.exports = router;