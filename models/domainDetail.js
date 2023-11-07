const mongoose = require('mongoose');

const DoaminExpiryDetailsSchema = new mongoose.Schema({
  email: String,
  domain: String,
  expiryDate : String
});

module.exports = mongoose.model('DomainDetails', DoaminExpiryDetailsSchema, 'CertificateMonitorCollection');