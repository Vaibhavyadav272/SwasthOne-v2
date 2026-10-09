const crypto = require("crypto");

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.JWT_SECRET && isProduction) {
  // Refuse to run with a throw-away secret in production: every restart would
  // log all users out and multiple instances could not validate each other's tokens.
  throw new Error("JWT_SECRET must be set when NODE_ENV=production");
}

// Local development only: temporary secret if JWT_SECRET is omitted.
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET not set; using a temporary local development secret. Tokens will reset when the server restarts.");
}

module.exports = { JWT_SECRET };
