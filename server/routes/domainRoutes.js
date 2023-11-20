const express = require('express');
const { getCertificateDetails, addDomain, getDomainList, deleteDomains } = require('../services/certificateService');
const router = express.Router();

router.get('/api/domain-certificate', getCertificateDetails);
router.post('/api/add-domain', addDomain);
router.get('/api/getDomainList', getDomainList)
router.delete('/api/delete-domains', deleteDomains)

module.exports = router;