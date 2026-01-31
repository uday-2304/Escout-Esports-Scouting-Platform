import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/authRoutes.js";
import arenaRoutes from "./routes/arenaRoutes.js";
import dashboardVideoRoutes from "./routes/dashboardRoutes.js";
import rankingsRoutes from "./routes/rankingsRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/public/temp", express.static("public/temp"));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "sessionsecret",
    resave: false,
    saveUninitialized: false,
  })
);

/* ================= ROUTES ================= */
// DEBUG: Log all requests
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/arena", arenaRoutes);
app.use("/api/dashboard/videos", dashboardVideoRoutes);
app.use("/api/rankings", rankingsRoutes);

// DEBUG: 404 Handler - Force JSON for missing routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR STACK:", err);

  res.setHeader("Content-Type", "application/json");

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export { app };
