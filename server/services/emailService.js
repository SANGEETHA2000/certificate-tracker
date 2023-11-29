const nodemailer = require('nodemailer');
const DomainDetail = require('../models/domainDetail');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.expiry.reminder@gmail.com',
    pass: 'mmva eabh qjni ahgi'
  },
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'noreply.expiry.reminder@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
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
  sendEmail,
  checkDatabaseAndSendEmails,
};