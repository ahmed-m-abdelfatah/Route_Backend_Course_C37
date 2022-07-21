const rateLimit = require('express-rate-limit');

function runningRateLimit(app) {
  // rateLimit
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
    message: 'You have exceeded the 100 requests in 10 minutes limit!',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  const signupLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per `window` (here, per 10 minutes)
    message: 'You have exceeded creating 5 accounts in 10 minute limit!',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // Apply the rate limiting middleware to all requests on this channel process.env.CHANNEL
  app.use(process.env.CHANNEL, limiter); // max 100 requests per 10 minutes
  app.use(process.env.CHANNEL + '/auth/signup', signupLimiter); // max 5 requests per 10 minutes
}

module.exports = runningRateLimit;
