import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import theatreRoutes from "./routes/theatreRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Disable automatic ETag-based caching. Express adds ETags to every JSON
// response by default; on GET routes with query params (like movie search)
// this can cause the browser to receive a bare 304 "Not Modified" with no
// body, which silently breaks endpoints that are expected to return fresh
// data on every request.
app.set('etag', false);

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 2000 : 100, // relaxed limit for local dev/testing
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

app.use(limiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Default express.json() body limit is only 100kb, which is too small for
// base64-encoded profile photos (a 2MB image becomes ~2.7MB as base64 text).
// Raised to 5mb to comfortably fit avatar uploads with headroom.
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShowX CinemaHub API is running",
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;