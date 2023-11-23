const express = require('express');
const { getCertificateDetails, addDomain, getDomainList, deleteDomains, updateDomainCertificateDetails } = require('../services/certificateService');
const router = express.Router();

router.get('api/get-domain-certificate-details', getCertificateDetails);
router.put('/api/update-domain-certificate-details', updateDomainCertificateDetails);
router.post('/api/add-domain', addDomain);
router.get('/api/get-domains-list', getDomainList)
router.delete('/api/delete-domains', deleteDomains)

module.exports = router;