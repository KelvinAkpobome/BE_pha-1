/* eslint-disable no-console */
const http = require('http');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4000;

// fully configured express app
configuredApp = require('./configure');

// connection to db
connectDB().catch(console.dir);

const server = http.createServer(configuredApp);

// boot the server
const boot = () => {
  server.listen(PORT, () => {
    console.info(`Express server listening on port ${PORT}`);
  });
};

// kill the server
const shutdown = () => {
  server.close(() => {
    console.info(`Express server shutting down on port ${PORT}`);
  });
};
if (require.main === module) {
  boot(); // "node app.js" command
} else {
  exports.boot = boot;
  exports.shutdown = shutdown;
}
