const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 75, // limit each IP to 75 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

module.exports = limiter;
