const express = require('express');
const mongoose = require('mongoose');
const domainRoutes = require('./routes/domainRoutes');
const cron = require('node-cron');
const domainService = require('./services/certificateService')

// Initialize an express app
const app = express();

// Parses JSON payloads
app.use(express.json());

// Serve the static files from the client' directory
app.use(express.static('client'));

// Use domainRoutes for API routes
app.use(domainRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://sangeetha2000vd:San755t81@cluster0.8fjl8mr.mongodb.net/CertificateMonitorDB')
.then(() => {
  console.log('Connected to MongoDB');
  // domainService.checkDatabaseAndSendEmails();
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

// Schedule the checkDatabaseAndSendEmails function to run daily at midnight
cron.schedule('0 0 * * *', domainService.checkDatabaseAndSendEmails());

// Listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});