import rateLimit from "express-rate-limit";

// Limit: max 5 email-related requests per 15 minutes per email
export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  keyGenerator: (req, _res) => req.body.email?.toLowerCase(), // rate limit by email only
  message: {
    success: false,
    error: "Too many email requests, please try again later."
  },

  standardHeaders: true,  // gives RateLimit-* headers
  legacyHeaders: false,   // remove old X-RateLimit-* headers
});
