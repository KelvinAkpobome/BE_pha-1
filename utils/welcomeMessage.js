const dotenv = require('dotenv');

// load config
dotenv.config();
const message = (url) => {
  const html = `
          <body style="margin: 0; padding: 0;">
          <h1>You are welcome to Port Harcourt Agents API</h1>
            <p>Home Hunting Made Easy in Port Harcourt, see the docs <a href ="${url}">here</a></p>
          </body>`;
  return html;
};

const fullMessage = message(`${process.env.LIVE_DOCS}`);

module.exports = fullMessage;
