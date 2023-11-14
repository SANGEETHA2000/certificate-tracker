const nodemailer = require('nodemailer');

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

module.exports = {
  sendEmail
};