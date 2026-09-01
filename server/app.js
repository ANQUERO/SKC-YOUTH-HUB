import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./src/routes/auth.route.js";
import youthRouter from "./src/routes/youth.route.js";
import adminRouter from "./src/routes/admin.route.js";
import purokRouter from "./src/routes/purok.route.js";
import verificationRouter from "./src/routes/verification.route.js";
import dashboardRouter from "./src/routes/dashboard.routes.js";
import postRouter from "./src/routes/post.route.js";
import commentRouter from "./src/routes/comment.route.js";
import reaction from "./src/routes/reactions.route.js";
import profile from "./src/routes/profile.route.js";
import notification from "./src/routes/notification.route.js";
import feedback from "./src/routes/feedback.route.js";
import inbox from "./src/routes/inbox.route.js";
import { isLocalDevelopmentOrigin } from "./src/utils/cors.js";
import { getUploadErrorResponse } from "./src/utils/uploadLimits.js";

dotenv.config();

const app = express();

app.use(helmet());

const normalizeOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const allowedOrigins = normalizeOrigins(process.env.CLIENT_URL);
const isDevelopment = process.env.NODE_ENV === "development";

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, "");

      if (
        !origin ||
        allowedOrigins.includes(normalizedOrigin) ||
        (isDevelopment && isLocalDevelopmentOrigin(normalizedOrigin))
      ) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", {
        origin,
        normalizedOrigin,
        allowedOrigins,
        nodeEnv: process.env.NODE_ENV,
      });

      return callback(new Error("Origin is not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "X-Project-ID",
    ],
  }),
);

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

//Api Routes
app.use("/api/auth", authRouter);
app.use("/api", youthRouter);
app.use("/api", adminRouter);
app.use("/api", purokRouter);
app.use("/api", verificationRouter);
app.use("/api", dashboardRouter);
app.use("/api", postRouter);
app.use("/api/post", commentRouter);
app.use("/api", reaction);
app.use("/api", profile);
app.use("/api/notifications", notification);
app.use("/api/feedback", feedback);
app.use("/api/inbox", inbox);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  void req;
  void next;

  const uploadError = getUploadErrorResponse(err);
  if (uploadError) {
    return res.status(uploadError.status).json(uploadError.body);
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: "Request body is too large",
      message: "The request body exceeds the allowed size.",
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON request" });
  }

  if (err.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ error: err.message });
  }

  console.error(err.stack || err.message);
  return res.status(500).json({ error: "Internal Server Error" });
});

export default app;
