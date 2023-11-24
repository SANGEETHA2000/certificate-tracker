const tls = require('tls');
const { sendEmail } = require('./emailService');
const DomainDetail = require('../models/domainDetail');

async function getCertificateDetails(req, res) {
  // Get the domain parameter from the query string
  const domain = req.query.domain;

  // Validate the domain parameter
  if (!domain) {
    return res.status(400).json({ error: 'Domain Name Missing!' });
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
      valid_from: cert.valid_from,
      valid_until: cert.valid_to,
      issuer: cert.issuer.O
    };

    // Return the response
    res.json(details);

    // Close the secure socket
    secureSocket.end();
  });

  // Print error message if any error occurs with TLS connection
  secureSocket.on('error', (err) => {
    res.status(500).json({ error: "Invalid Domain Name!" });
  });
}

async function putDomainCertificateDetails(id, details) {
  try {
    const updated = await DomainDetail.findOneAndUpdate(
                      { _id: id },
                      { $set: details },
                      { new: true }
                    );
    return updated;
  } catch (error) {
    // code to handle error
  }
}

async function updateDomainCertificateDetails(req, res) {
  const updateField = req.body.field;
  const domainsToUpdate = req.body.domains;
  let details = {};

  if (!domainsToUpdate || !Array.isArray(domainsToUpdate) || domainsToUpdate.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or empty domains list' });
  }

  try {
    await Promise.all(domainsToUpdate.map(async (domainItem) => {
      if (updateField === "expiry") {
        const options = {
          host: domainItem.domain,
          port: 443,
          method: 'GET',
          rejectUnauthorized: false,
          servername: domainItem.domain,
        };

        const cert = await new Promise((resolve, reject) => {
          const secureSocket = tls.connect(options, () => {
            resolve(secureSocket.getPeerCertificate());
            secureSocket.end();
          });
          secureSocket.on('error', reject);
        });

        details = {
          valid_from: cert.valid_from,
          valid_until: cert.valid_to,
          issuer: cert.issuer.O
        };
      } else if (updateField === "notifications") {
        details = {
          isNotified: domainItem.updatedData.isNotified,
          daysBeforeNotified: domainItem.updatedData.daysBeforeNotified
        };
        console.log(details);
      }
      await putDomainCertificateDetails(domainItem._id, details);
    }));
    const finalUpdatedResults = await DomainDetail.find({ _id: { $in: domainsToUpdate } });
    res.json({ updated: finalUpdatedResults });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error });
  }
}

async function getDomainList(req, res) {
  const userEmail = req.query.userEmail;
  if (!userEmail) {
    return res.status(400).json({ error: 'Missing user email' });
  }
  try {
    const result = await DomainDetail.find({ email: userEmail });
    res.json(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}

async function addDomain(req, res) {
  const newDomainDetail = new DomainDetail(req.body);

  newDomainDetail.save()
    .then(domain => {
      res.json(domain);
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
}

async function deleteDomains(req, res) {
  const domainsToDelete = req.body.domains;
  if (!domainsToDelete || !Array.isArray(domainsToDelete) || domainsToDelete.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or empty domains list' });
  }
  try {
    const deleteResult = await DomainDetail.deleteMany({ _id: { $in: domainsToDelete } });
    if (deleteResult.deletedCount > 0) {
      res.json({ success: true, deletedCount: deleteResult.deletedCount });
    } else {
      res.status(404).json({ success: false, message: 'No matching records found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' + error });
  }
}

async function checkDatabaseAndSendEmails() {
  try {
    // Get the current date
    const currentDate = new Date();

    // Get the date 30 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Query the database for records with a validity end date in the next 30 days
    const subscriptions = await DomainDetail.find({
      $expr: {
        $and: [
          { $gte: [{ $toDate: '$expiryDate' }, currentDate] },
          { $lte: [{ $toDate: '$expiryDate' }, endDate] }
        ]
      }
    });

    // Loop through the results and send an email for each record
    for (const subscription of subscriptions) {
      const to = subscription.email;
      const subject = 'Expiring soon!!';
      const text = `Your domain certificate of ${subscription.domain} is expiring on ${subscription.expiryDate}. Please renew it before it expires.`;

      await sendEmail(to, subject, text);
    }
  } catch (error) {
    console.error('Error checking database and sending emails:', error);
  }
}

module.exports = {
  getCertificateDetails,
  updateDomainCertificateDetails,
  addDomain,
  checkDatabaseAndSendEmails,
  getDomainList,
  deleteDomains
};