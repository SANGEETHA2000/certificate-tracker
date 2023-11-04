const express = require('express');
const tls = require('tls');

const app = express();

app.get('/api/domain-certificate', (req, res) => {
  // Get the domain parameter from the query string
  const domain = req.query.domain;

  // Validate the domain parameter
  if (!domain) {
    return res.status(400).json({ error: 'Missing domain parameter' });
  }

  // Fetch the SSL certificate details
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

  secureSocket.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
