const mongoose = require('mongoose');

const DoaminExpiryDetailsSchema = new mongoose.Schema({
  email: String,
  domain: String,
  expiryDate : String,
  issuer: String,
  isNotified: Boolean,
  daysBeforeNotified: Number,
  inNotificationPeriod: Boolean,
  lastEmailSent: String
});

module.exports = mongoose.model('DomainDetails', DoaminExpiryDetailsSchema, 'CertificateMonitorCollection');