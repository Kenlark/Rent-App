import "express-async-errors";
import "dotenv/config";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import apiRateLimiter from "./middlewares/rate-limit.middleware.js";

const app = express();

import connectDB from "./config/db.config.js";

import notFound from "../src/middlewares/not-found.middleware.js";
import errorHandler from "../src/middlewares/error-handler.middleware.js";
import rentRouter from "./routes/rent.route.js";
import userRouter from "./routes/user.route.js";
import carRouter from "./routes/car.route.js";
import emailsRouter from "./routes/email.route.js";
import resetPassword from "./routes/reset.password.route.js";
import rentStatusRoute from "./routes/rent.status.route.js";

app.use(apiRateLimiter);

app.use(
  mongoSanitize({
    replaceWith: "_", //caractères malveillant remplacés par "_"
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Permet d'envoyer des cookies entre front-end et back-end
  })
);

app.use(cookieParser());

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

connectDB();

app.use("/api/v1/cars", carRouter);
app.use("/api/v1/rent", rentRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/emails", emailsRouter);
app.use("/api/v1/reset-password", resetPassword);
app.use("/api/v1/rent-status", rentStatusRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
