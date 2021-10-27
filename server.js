/* eslint-disable no-console */
const express = require('express');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4000;
configuredApp = require('./configure');

app = express();

connectDB().catch(console.dir);

Expressapp = configuredApp(app);

const boot = () => {
  Expressapp.listen(PORT, () => {
    console.info(`Express server listening on port ${PORT}`);
  });
};
const shutdown = () => {
  Expressapp.close();
};
if (require.main === module) {
  boot(); // "node app.js" command
} else {
  console.info('Running app as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
}
