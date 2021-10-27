const mailgun = require('mailgun-js');

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});
const sendEmail = async (data) => {
  await mg.messages().send(data);
};

module.exports = sendEmail;
