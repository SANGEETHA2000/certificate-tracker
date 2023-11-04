const express = require('express');
const tls = require('tls');
const nodemailer = require('nodemailer');

const app = express();

// Parses JSON payloads
app.use(express.json());

app.get('/api/domain-certificate', (req, res) => {

  // Get the domain parameter from the query string
  const domain = req.query.domain;

  // Validate the domain parameter
  if (!domain) {
    return res.status(400).json({ error: 'Missing domain parameter' });
  }

  // Set the options' values to connect with TLS
  const options = {
    host: domain,
    port: 443,
    method: 'GET',
    rejectUnauthorized: false,
    servername: domain,
  };

  const secureSocket = tls.connect(options, () => {

    // Parse the SSL certificate details
    const cert = secureSocket.getPeerCertificate();

    // Fetch the SSL certificate details
    const details = {
      issuer: cert.issuer,
      valid_from: cert.valid_from,
      valid_until: cert.valid_to,
      subject: cert.subject,
    };

    // Return the response
    res.json(details);

    // Close the secure socket
    secureSocket.end();
  });

  // Print error message if any error occurs with TLS connection
  secureSocket.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });

});

  
app.post('/api/send-email', (req, res) => {

  // Set configurations of sender email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreply.expiry.reminder@gmail.com',
      pass: 'mmva eabh qjni ahgi'
    },
  });

  // Get the mail specifications from the request string
  const to = req.body.to;
  const domain = req.body.domain;
  const end_date = req.body.valid_until;
  const mailOptions = {
    from: '	noreply.expiry.reminder@gmail.com',
    to: to,
    subject: 'Expiring Soon!!!',
    text: 'This is a reminder email to inform you that your ' + domain + ' certificate expires on ' + end_date + "."
  };

  // Send out the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ message: 'Error sending email - ' + error});
    } else {
      res.json({ message: 'Email sent - ' + info.response});
    }
  });  
});

// Listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});