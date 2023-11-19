const express = require('express');
const mongoose = require('mongoose');
const domainRoutes = require('./routes/domainRoutes');
const cron = require('node-cron');
const domainService = require('./services/certificateService')
const cors = require('cors');

// Initialize an express app
const app = express();

// Parses JSON payloads
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Serve the static files from the 'client' directory
// app.use(express.static('client_old'));

// Use domainRoutes for API routes
app.use(domainRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://sangeetha2000vd:<password>@cluster0.8fjl8mr.mongodb.net/CertificateMonitorDB')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

// Schedule the checkDatabaseAndSendEmails function to run daily at midnight
cron.schedule('0 0 * * *', domainService.checkDatabaseAndSendEmails);

// Listen to the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
