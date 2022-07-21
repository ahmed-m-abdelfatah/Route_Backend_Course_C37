var nodeoutlook = require('nodejs-nodemailer-outlook');

function sendEmail(destination, subject, message, attachment = null) {
  console.log('~ sendEmail');
  try {
    nodeoutlook.sendEmail({
      auth: {
        user: process.env.OUTLOOK_SENDER_EMAIL,
        pass: process.env.OUTLOOK_SENDER_PASSWORD,
      },
      from: process.env.OUTLOOK_SENDER_EMAIL,
      to: destination,
      subject: subject,
      html: message,
      attachments: attachment,
      onError: e => console.log('~ Sending email failed:', e),
      onSuccess: i => console.log('~ Email sent:', i),
    });
  } catch (error) {
    console.log('~ Sending email error', error);
  }
}

module.exports = sendEmail;
