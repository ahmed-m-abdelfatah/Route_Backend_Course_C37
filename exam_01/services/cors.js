const cors = require('cors');

function runningCors(app) {
  app.use(cors());
}

module.exports = runningCors;
