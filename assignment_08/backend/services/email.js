var nodeoutlook = require('nodejs-nodemailer-outlook');

function sendEmail(destination, subject, message) {
  nodeoutlook.sendEmail({
    auth: {
      user: process.env.OUTLOOK_SENDER_EMAIL,
      pass: process.env.OUTLOOK_SENDER_PASSWORD,
    },
    from: process.env.OUTLOOK_SENDER_EMAIL,
    to: destination,
    subject: subject,
    html: message,
    onError: e => console.log(e),
    onSuccess: i => console.log(i),
  });
}

module.exports = sendEmail;
