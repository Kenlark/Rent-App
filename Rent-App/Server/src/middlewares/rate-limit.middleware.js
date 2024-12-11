import rateLimit from "express-rate-limit";

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  message: "Trop de requêtes de cette IP, veuillez réessayer plus tard",
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiRateLimiter;
