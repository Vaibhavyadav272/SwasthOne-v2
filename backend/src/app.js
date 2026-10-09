const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const screeningRoutes = require("./routes/screeningRoutes");
const rppgRoutes = require("./routes/rppgRoutes");
const triageRoutes = require("./routes/triageRoutes");
const referralRoutes = require("./routes/referralRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const followUpRoutes = require("./routes/followUpRoutes");
const recordRoutes = require("./routes/recordRoutes");

const app = express();

// Configuration (all optional; see backend/.env.example)
//   CORS_ORIGINS  comma-separated browser origins allowed to call the API
//   RPPG_URL      public URL of the rPPG service (added to CSP connect-src)
//   FRONTEND_URL  if set, non-API requests are reverse-proxied to this URL
const splitList = (v) => (v || "").split(",").map((x) => x.trim()).filter(Boolean);
const corsOrigins = splitList(process.env.CORS_ORIGINS);
const rppgUrl = (process.env.RPPG_URL || "").trim();
const frontendUrl = (process.env.FRONTEND_URL || "").trim();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", ...(rppgUrl ? [rppgUrl] : [])],
        imgSrc: ["'self'", "data:", "blob:"],
        mediaSrc: ["'self'", "blob:"],
        workerSrc: ["'self'", "blob:"],
      },
    },
  })
);

app.use(
  cors(
    corsOrigins.length
      ? { origin: corsOrigins }
      : { origin: process.env.NODE_ENV === "production" ? false : true }
  )
);
app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SwasthOne backend is running",
  });
});

// Authentication and API routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/screenings", screeningRoutes);
app.use("/api/rppg", rppgRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/followups", followUpRoutes);
app.use("/api/records", recordRoutes);

// Optional frontend reverse proxy (only when FRONTEND_URL is configured)
if (frontendUrl) {
  app.use(
    "/",
    createProxyMiddleware({
      target: frontendUrl,
      changeOrigin: true,
      secure: true,
    }),
  );
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;
